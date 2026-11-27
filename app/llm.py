"""AI Life OS — LLM service layer.

- The provider is configured via environment variables; keys are injected only from the environment, never written to disk or into the repo (INV-08 provenance + repository red lines).
- The mock provider is used for tests and keyless smoke runs: deterministic rule-based output, no network requests at all.
- INV-03: dimension impacts without an evidential basis are always forced to direction=unknown, no provider is exempt.
"""
import json
import os
import re
import urllib.request

PROMPT_VERSION = "extract-v1"
SCHEMA_VERSION = "extracted_item@contract-v0.6"
REVIEW_PROMPT_VERSION = "review-v2"

ALLOWED_ITEM_TYPES = {"behavior", "thought", "emotion", "event", "plan", "constraint", "question", "summary"}
DIMS = ["time", "health", "wealth", "relationship", "purpose"]


def provider_name():
    return os.environ.get("AI_LIFE_OS_LLM_PROVIDER", "mock")


def model_name():
    return os.environ.get("AI_LIFE_OS_LLM_MODEL", "mock-model")


def _enforce_unknown_no_basis(impacts):
    """INV-03: no basis (evidence / grounding in the original text) -> unknown."""
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
    for dim in DIMS:  # full five-dimension coverage (direction may be unknown)
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
    "You are the structuring assistant of AI Life OS. Extract the user's raw Capture text into "
    "behavior/thought/emotion/event/plan/constraint/question/summary entries. "
    "For each entry, assess the impact on all five dimensions (time/health/wealth/relationship/purpose): "
    "direction in positive|negative|mixed|neutral|unknown; without an evidential basis it must be unknown; "
    "degree 1-5 is independent of direction. "
    "Never invent facts that are not in the original text. Output JSON: "
    "{items:[{item_type,text_value,normalized_value,quantity,unit,"
    "item_date,confidence,ai_reason,impacts:[{dimension_key,direction,degree,degree_positive,"
    "degree_negative,confidence,basis}]}]} "
    "Write text_value, normalized_value and ai_reason in the same language as the input sentence."
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
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode())
    choice = data["choices"][0]
    content = choice["message"].get("content") or ""
    if not content.strip():
        raise RuntimeError(
            f"AI returned an empty response (finish_reason={choice.get('finish_reason')}; "
            "a reasoning model may have burned through its output budget) — please retry")
    return content


def _extract_json(text):
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        raise RuntimeError("AI response contained no JSON — please retry")
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError as e:
        raise RuntimeError(f"AI returned JSON that could not be parsed — please retry ({e})")


def _mock_extract(raw_text):
    """Deterministic mock: produces entries by keyword match for tests/smoke runs; still goes through INV-03 validation."""
    items = []
    rules = [
        (r"run|ran|jog|exercise|workout|gym", "behavior", "health", "positive", 3),
        (r"sleep|insomnia|stayed up|stay up", "behavior", "health", "positive", 2),
        (r"study|studied|read|book|course|practice", "behavior", "time", "positive", 3),
        (r"mom|dad|family|friend|chat|call", "behavior", "relationship", "positive", 3),
        (r"overtime|work|meeting|project", "event", "time", "negative", 2),
        (r"spent|bought|shopping|expense|save", "behavior", "wealth", "negative", 2),
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
                                    "basis": "Source keyword: " + m.group(0)})
                else:
                    impacts.append({"dimension_key": d, "direction": "unknown", "degree": None,
                                    "degree_positive": None, "degree_negative": None,
                                    "confidence": None, "basis": ""})
            items.append({"item_type": itype, "text_value": raw_text.strip()[:120],
                          "normalized_value": None, "quantity": None, "unit": None,
                          "item_date": None, "confidence": 0.7,
                          "ai_reason": "mock rule match: " + m.group(0), "impacts": impacts})
    if not items:
        items = _normalize_item({"item_type": "thought", "text_value": raw_text.strip()[:120],
                                 "ai_reason": "mock: no keyword matched", "impacts": []})
        return [items]
    return [_normalize_item(i) for i in items]


def extract(raw_text):
    """Returns a list of items (each with 5-dimension impacts, all basis-validated)."""
    if provider_name() == "mock":
        return _mock_extract(raw_text)
    content = _call_openai_compatible(EXTRACT_SYSTEM, raw_text + _lang_anchor(raw_text), 4000)
    data = _extract_json(content)
    return [_normalize_item(i) for i in (data.get("items") or [])]


CORRECT_SYSTEM = (
    "You are the revision assistant of AI Life OS. The user is not happy with one AI-structured result "
    "and explains in natural language what is wrong. Revise the entry and the five-dimension impacts "
    "based on the user's feedback (direction in positive|negative|mixed|neutral|unknown, degree 1-5 is "
    "independent of direction; without evidence it must be unknown). Change only the parts the user "
    "mentions; leave everything else untouched. "
    "Output JSON: {text_value: string|null, impacts: [{dimension_key, direction, degree,"
    " degree_positive, degree_negative, note}]} (list only the impacts that changed)."
    " Write the changed text and notes in the same language as the user's feedback."
)


def _mock_correct(impacts, feedback):
    """Deterministic mock: revises based on feedback keywords; still goes through INV-03 validation."""
    updates = []
    fb = feedback or ""
    weaker = re.search(r"not that (strong|high|much)|too (high|much|strong)|a bit (lower|smaller|weaker)|lower|weaker|less", fb)
    stronger = re.search(r"not that (low|weak|small)|a bit (higher|bigger|stronger)|higher|stronger|more", fb)
    to_neg = re.search(r"actually.*(tired|bad|draining|negative|unpleasant)|a bit (tired|unpleasant)|bad|negative|wrong way", fb)
    to_pos = re.search(r"actually.*(good|great|positive|helpful)|pretty good|nice|positive|helpful", fb)
    no_change = re.search(r"about right|correct|that's right|as is|no change|leave it", fb)
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
            chg["note"] = "User revision: " + fb[:80]
            updates.append(chg)
    return updates


def correct(item, impacts, feedback):
    """Revises based on natural-language user feedback. Returns {text_value|None, impacts:[{dimension_key,...}]}."""
    if provider_name() == "mock":
        return {"text_value": None, "impacts": _mock_correct(impacts, feedback)}
    user = json.dumps({"item": {k: item[k] for k in ("text_value", "item_type")},
                       "impacts": [dict(i) for i in impacts], "feedback": feedback},
                      ensure_ascii=False)
    content = _call_openai_compatible(CORRECT_SYSTEM, user + _lang_anchor(feedback), 2000)
    data = _extract_json(content)
    updates = []
    for u in (data.get("impacts") or []):
        if u.get("dimension_key") in DIMS:
            updates.append({k: u.get(k) for k in
                            ("dimension_key", "direction", "degree", "degree_positive",
                             "degree_negative", "note")})
    return {"text_value": data.get("text_value"), "impacts": updates}


REVIEW_SYSTEM = (
    "You are the review assistant of AI Life OS. Generate review paragraphs based only on the given "
    "confirmed facts. statement_type in fact|calculation|inference|theory|recommendation|limitation must "
    "be labeled separately; never mix facts with inferences; theory references must include "
    "author/source_title/year and their applicability boundary, and if they cannot be verified do not "
    "give a theory; at most one main recommendation (zero or one), which may be none; never fabricate "
    "data. Output JSON: "
    "{statements:[{statement_type,text,confidence,uncertain_points,theory:{author,source_title,year,"
    "citation,verifiability,assumption_boundary}}], recommendation: {text, action_type,"
    "target_dimension_keys, reason, expected_effect, unknowns} | null} "
    "Write statement text, recommendation text, reason and unknowns in the same language as the "
    "confirmed facts."
)


def _lang_anchor(text):
    """Deterministic output-language pin for the end of the user turn —
    soft wording in system prompts is ignored by some models."""
    if any("\u4e00" <= ch <= "\u9fff" for ch in text):
        return ("\n\nOUTPUT LANGUAGE: the input above is written in Chinese. "
                "Write ALL output in Chinese.")
    return ("\n\nOUTPUT LANGUAGE: the input above is written in English. "
            "Write ALL output in English. Do not translate the input.")


def generate_review(facts_text, review_type):
    """Returns {statements:[...], recommendation: {...}|None}. In mock mode, generated by local rules."""
    if provider_name() == "mock":
        statements = [{"statement_type": "fact", "text": t, "confidence": 1.0,
                       "uncertain_points": [], "theory": None} for t in facts_text.get("facts", [])]
        if facts_text.get("calculated"):
            statements.append({"statement_type": "calculation", "text": facts_text["calculated"],
                               "confidence": 1.0, "uncertain_points": [], "theory": None})
        if len(facts_text.get("facts", [])) < 3:
            statements.append({"statement_type": "limitation",
                               "text": "Fewer than 3 confirmed entries this period; the conclusions have limited representativeness.",
                               "confidence": 1.0, "uncertain_points": ["Small sample"], "theory": None})
            return {"statements": statements, "recommendation": None}
        statements.append({"statement_type": "inference",
                           "text": "Judging from the confirmed entries, this week's behavior was mainly exercise and study (inference).",
                           "confidence": 0.6, "uncertain_points": ["Sample still small"], "theory": None})
        return {"statements": statements,
                "recommendation": {"text": "Keep the current pace; no change is needed this time.", "action_type": "maintain",
                                   "target_dimension_keys": [], "reason": "The confirmed entries look positive and show no evidence of imbalance",
                                   "expected_effect": "Stay steady", "unknowns": "Long-term effects unknown"}}
    # Pin the output language deterministically at the end of the user turn —
    # soft "same language as the facts" wording in the system prompt is ignored
    # by some models (e.g. zh-tuned ones answer zh even for English facts).
    user_payload = json.dumps({"review_type": review_type, **facts_text}, ensure_ascii=False)
    has_cjk = any("\u4e00" <= ch <= "\u9fff" for ch in user_payload)
    user_payload += (
        "\n\nOUTPUT LANGUAGE: the confirmed facts above are written in "
        + ("Chinese. Write ALL output (statement text, recommendation text, reason, unknowns) in Chinese."
           if has_cjk else
           "English. Write ALL output (statement text, recommendation text, reason, unknowns) in English. "
           "Do not translate the facts.")
    )
    content = _call_openai_compatible(REVIEW_SYSTEM, user_payload, 3000)
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
