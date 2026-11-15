"""AI Life OS — LLM 服务层。

- 提供方经环境变量配置；密钥只从环境注入，永不落盘/入仓（INV-08 溯源 + 仓库红线）。
- mock 提供方用于测试与无密钥冒烟：确定性规则产出，不发任何网络请求。
- INV-03：无证据基础的维度影响一律强制 direction=unknown，任何提供方不得例外。
"""
import json
import os
import re
import urllib.request

PROMPT_VERSION = "extract-v1"
SCHEMA_VERSION = "extracted_item@contract-v0.6"
REVIEW_PROMPT_VERSION = "review-v1"

ALLOWED_ITEM_TYPES = {"behavior", "thought", "emotion", "event", "plan", "constraint", "question", "summary"}
DIMS = ["time", "health", "wealth", "relationship", "purpose"]


def provider_name():
    return os.environ.get("AI_LIFE_OS_LLM_PROVIDER", "mock")


def model_name():
    return os.environ.get("AI_LIFE_OS_LLM_MODEL", "mock-model")


def _enforce_unknown_no_basis(impacts):
    """INV-03：没有 basis（证据/原文依据）→ unknown。"""
    for imp in impacts:
        basis = (imp.get("basis") or "").strip()
        if not basis or imp.get("direction") not in ("positive", "negative", "mixed", "neutral"):
            imp["direction"] = "unknown"
            imp["degree"] = None
            imp["degree_positive"] = None
            imp["degree_negative"] = None
    return impacts


def _normalize_item(raw):
    item_type = raw.get("item_type", "behavior")
    if item_type not in ALLOWED_ITEM_TYPES:
        item_type = "behavior"
    impacts = raw.get("impacts") or []
    seen = set()
    norm_impacts = []
    for imp in impacts:
        dim = imp.get("dimension_key")
        if dim not in DIMS or dim in seen:
            continue
        seen.add(dim)
        norm_impacts.append({
            "dimension_key": dim,
            "direction": imp.get("direction", "unknown"),
            "degree": imp.get("degree"),
            "degree_positive": imp.get("degree_positive"),
            "degree_negative": imp.get("degree_negative"),
            "confidence": imp.get("confidence"),
            "basis": imp.get("basis", ""),
        })
    for dim in DIMS:  # 五维全覆盖评估（方向可为 unknown）
        if dim not in seen:
            norm_impacts.append({"dimension_key": dim, "direction": "unknown", "degree": None,
                                 "degree_positive": None, "degree_negative": None,
                                 "confidence": None, "basis": ""})
    norm_impacts = _enforce_unknown_no_basis(norm_impacts)
    return {
        "item_type": item_type,
        "text_value": str(raw.get("text_value", ""))[:2000],
        "normalized_value": raw.get("normalized_value"),
        "quantity": raw.get("quantity"),
        "unit": raw.get("unit"),
        "item_date": raw.get("item_date"),
        "confidence": raw.get("confidence"),
        "ai_reason": raw.get("ai_reason", ""),
        "impacts": norm_impacts,
    }


EXTRACT_SYSTEM = (
    "你是 AI Life OS 的结构化助手。把用户 Capture 原文提取为行为/想法/情绪/事件/计划/限制/问题/总结条目。"
    "每条目评估全部五个维度（time/health/wealth/relationship/purpose）的影响：direction ∈ "
    "positive|negative|mixed|neutral|unknown；无证据基础必须 unknown；程度 1-5 与方向独立。"
    "不得编造原文没有的事实。输出 JSON：{items:[{item_type,text_value,normalized_value,quantity,unit,"
    "item_date,confidence,ai_reason,impacts:[{dimension_key,direction,degree,degree_positive,"
    "degree_negative,confidence,basis}]}]}"
)


def _call_openai_compatible(system, user, max_tokens=1200):
    base = os.environ.get("AI_LIFE_OS_LLM_BASE_URL", "").rstrip("/")
    key = os.environ.get("AI_LIFE_OS_LLM_API_KEY", "")
    body = json.dumps({
        "model": model_name(),
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": 0.2,
        "max_tokens": max_tokens,
    }).encode()
    req = urllib.request.Request(
        base + "/chat/completions", data=body,
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + key})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode())
    return data["choices"][0]["message"]["content"]


def _extract_json(text):
    m = re.search(r"\{.*\}", text, re.S)
    return json.loads(m.group(0)) if m else {}


def _mock_extract(raw_text):
    """确定性 mock：按关键词产出条目，便于测试/冒烟；同样走 INV-03 校验。"""
    items = []
    rules = [
        (r"跑步|运动|锻炼|健身", "behavior", "health", "positive", 3),
        (r"睡|失眠|熬夜", "behavior", "health", "positive", 2),
        (r"学习|看书|读书|课程|练习", "behavior", "time", "positive", 3),
        (r"妈妈|爸爸|家人|朋友|聊天|通话", "behavior", "relationship", "positive", 3),
        (r"加班|工作|会议|项目", "event", "time", "negative", 2),
        (r"花|买|消费|支出|存", "behavior", "wealth", "negative", 2),
    ]
    for pattern, itype, dim, direction, degree in rules:
        m = re.search(pattern, raw_text)
        if m:
            impacts = []
            for d in DIMS:
                if d == dim:
                    impacts.append({"dimension_key": d, "direction": direction,
                                    "degree": degree, "degree_positive": None,
                                    "degree_negative": None, "confidence": 0.7,
                                    "basis": "原文关键词: " + m.group(0)})
                else:
                    impacts.append({"dimension_key": d, "direction": "unknown", "degree": None,
                                    "degree_positive": None, "degree_negative": None,
                                    "confidence": None, "basis": ""})
            items.append({"item_type": itype, "text_value": raw_text.strip()[:120],
                          "normalized_value": None, "quantity": None, "unit": None,
                          "item_date": None, "confidence": 0.7,
                          "ai_reason": "mock 规则匹配: " + m.group(0), "impacts": impacts})
    if not items:
        items = _normalize_item({"item_type": "thought", "text_value": raw_text.strip()[:120],
                                 "ai_reason": "mock: 无关键词匹配", "impacts": []})
        return [items]
    return [_normalize_item(i) for i in items]


def extract(raw_text):
    """返回 items 列表（每个含 5 维 impacts，均带 basis 校验）。"""
    if provider_name() == "mock":
        return _mock_extract(raw_text)
    content = _call_openai_compatible(EXTRACT_SYSTEM, raw_text)
    data = _extract_json(content)
    return [_normalize_item(i) for i in (data.get("items") or [])]


CORRECT_SYSTEM = (
    "你是 AI Life OS 的修订助手。用户对一条 AI 整理结果不满意，用自然语言说明哪里不对。"
    "根据用户反馈修订条目与五维影响（direction ∈ positive|negative|mixed|neutral|unknown，"
    "程度 1-5 与方向独立；无证据必须 unknown）。只改用户提到的部分，其余不动。"
    "输出 JSON：{text_value: string|null, impacts: [{dimension_key, direction, degree,"
    " degree_positive, degree_negative, note}]}（只列有变化的影响）。"
)


def _mock_correct(impacts, feedback):
    """确定性 mock：按反馈关键词做修订；同样走 INV-03 校验。"""
    updates = []
    fb = feedback or ""
    weaker = re.search(r"没那么(强|高|大)|太高|过了|低一点|小一点|弱一点|没那么夸张", fb)
    stronger = re.search(r"没那么(低|弱|小)|高一点|大一点|强一点|再高|再多", fb)
    to_neg = re.search(r"其实.*(累|难受|不好|消耗|负向)|有点(累|难受)|不好|负向|反了", fb)
    to_pos = re.search(r"其实.*(好|不错|正向|有帮助)|挺好|不错|正向|有帮助", fb)
    no_change = re.search(r"差不多|没错|对的|就这样|不用改", fb)
    if no_change:
        return updates
    for imp in impacts:
        chg = {"dimension_key": imp["dimension_key"]}
        d, deg = imp["direction"], imp["degree"]
        changed = False
        if to_neg and d in ("positive", "mixed", "neutral"):
            chg["direction"], changed = "negative", True
        elif to_pos and d in ("negative", "mixed", "neutral"):
            chg["direction"], changed = "positive", True
        elif to_neg and d == "unknown":
            chg["direction"], changed = "negative", True
        elif to_pos and d == "unknown":
            chg["direction"], changed = "positive", True
        if deg is not None:
            if weaker and deg > 1:
                chg["degree"], changed = deg - 1, True
            elif stronger and deg < 5:
                chg["degree"], changed = deg + 1, True
        if changed:
            chg["note"] = "用户修订: " + fb[:80]
            updates.append(chg)
    return updates


def correct(item, impacts, feedback):
    """按用户自然语言反馈修订。返回 {text_value|None, impacts:[{dimension_key,...}]}。"""
    if provider_name() == "mock":
        return {"text_value": None, "impacts": _mock_correct(impacts, feedback)}
    user = json.dumps({"item": {k: item[k] for k in ("text_value", "item_type")},
                       "impacts": [dict(i) for i in impacts], "feedback": feedback},
                      ensure_ascii=False)
    content = _call_openai_compatible(CORRECT_SYSTEM, user, 800)
    data = _extract_json(content)
    updates = []
    for u in (data.get("impacts") or []):
        if u.get("dimension_key") in DIMS:
            updates.append({k: u.get(k) for k in
                            ("dimension_key", "direction", "degree", "degree_positive",
                             "degree_negative", "note")})
    return {"text_value": data.get("text_value"), "impacts": updates}


REVIEW_SYSTEM = (
    "你是 AI Life OS 的复盘助手。只基于给定的已确认事实生成复盘段落。"
    "statement_type ∈ fact|calculation|inference|theory|recommendation|limitation，必须分开标注；"
    "事实与推断不得混写；理论引用必须给 author/source_title/year 与适用边界，无法核验就不给 theory；"
    "主建议最多一条（零或一），可给 none；不得编造数据。输出 JSON："
    "{statements:[{statement_type,text,confidence,uncertain_points,theory:{author,source_title,year,"
    "citation,verifiability,assumption_boundary}}], recommendation: {text, action_type,"
    "target_dimension_keys, reason, expected_effect, unknowns} | null}"
)


def generate_review(facts_text, review_type):
    """返回 {statements:[...], recommendation: {...}|None}。mock 模式本地规则生成。"""
    if provider_name() == "mock":
        statements = [{"statement_type": "fact", "text": t, "confidence": 1.0,
                       "uncertain_points": [], "theory": None} for t in facts_text.get("facts", [])]
        if facts_text.get("calculated"):
            statements.append({"statement_type": "calculation", "text": facts_text["calculated"],
                               "confidence": 1.0, "uncertain_points": [], "theory": None})
        if len(facts_text.get("facts", [])) < 3:
            statements.append({"statement_type": "limitation",
                               "text": "本期确认记录不足 3 条，结论代表性有限。",
                               "confidence": 1.0, "uncertain_points": ["样本少"], "theory": None})
            return {"statements": statements, "recommendation": None}
        statements.append({"statement_type": "inference",
                           "text": "从已确认记录看，本周行为以运动与学习为主（推断）。",
                           "confidence": 0.6, "uncertain_points": ["样本仍少"], "theory": None})
        return {"statements": statements,
                "recommendation": {"text": "维持当前节奏，本次不需要改变。", "action_type": "maintain",
                                   "target_dimension_keys": [], "reason": "已确认记录呈正向且无失衡证据",
                                   "expected_effect": "保持稳定", "unknowns": "长期效果未知"}}
    content = _call_openai_compatible(
        REVIEW_SYSTEM, json.dumps({"review_type": review_type, **facts_text}, ensure_ascii=False), 1600)
    data = _extract_json(content)
    statements = []
    for s in (data.get("statements") or [])[:20]:
        st = s.get("statement_type")
        if st not in ("fact", "calculation", "inference", "theory", "recommendation", "limitation"):
            continue
        statements.append({"statement_type": st, "text": str(s.get("text", ""))[:1000],
                           "confidence": s.get("confidence"),
                           "uncertain_points": s.get("uncertain_points") or [], "theory": s.get("theory")})
    rec = data.get("recommendation")
    if not isinstance(rec, dict) or not rec.get("text"):
        rec = None
    return {"statements": statements, "recommendation": rec}
