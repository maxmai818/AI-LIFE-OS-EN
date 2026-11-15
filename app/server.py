"""AI Life OS — 应用层（流程编排 + API）。内核不变量 INV-01～12 在此强制执行。"""
import json
import os
import sys
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from typing import Optional
from pydantic import BaseModel, Field

sys.path.insert(0, os.path.dirname(__file__))
import db as database
import llm

app = FastAPI(title="AI Life OS")
STATIC = os.path.join(os.path.dirname(__file__), "static")


def get_user(request: Request):
    return int(request.headers.get("X-User-Id", "1"))


def conn_user(user_id):
    conn = database.connect()
    database.ensure_user(conn, user_id)
    return conn


class CaptureIn(BaseModel):
    raw_text: str = Field(min_length=1, max_length=20000)
    client_capture_id: Optional[str] = None
    captured_at: Optional[str] = None


class ReviseIn(BaseModel):
    field_name: str
    corrected_value: str


class ImpactReviseIn(BaseModel):
    direction: Optional[str] = None
    degree: Optional[int] = None
    degree_positive: Optional[int] = None
    degree_negative: Optional[int] = None
    note: Optional[str] = None


class GoalIn(BaseModel):
    title: str
    dimension_keys: list = []
    measurable: bool = False
    target_description: Optional[str] = None
    metric: Optional[str] = None
    horizon: Optional[str] = None


class ReviewIn(BaseModel):
    review_type: str = "weekly"
    period_days: int = 7


class FeedbackIn(BaseModel):
    changed: bool
    feedback_text: str = ""


class StatusIn(BaseModel):
    status: str


@app.get("/")
def index():
    return FileResponse(os.path.join(STATIC, "index.html"))


@app.get("/style.css")
def style_css():
    return FileResponse(os.path.join(STATIC, "style.css"), media_type="text/css")


@app.get("/app.js")
def app_js():
    return FileResponse(os.path.join(STATIC, "app.js"), media_type="application/javascript")


@app.post("/api/captures")
def create_capture(body: CaptureIn, request: Request):
    uid = get_user(request)
    ts = body.captured_at or database.now_iso()
    conn = conn_user(uid)
    cur = conn.execute(
        "INSERT INTO captures(user_id, source, raw_text, captured_at, client_capture_id) VALUES(?,?,?,?,?)",
        (uid, "web", body.raw_text, ts, body.client_capture_id))
    conn.commit()
    return {"id": cur.lastrowid, "status": "saved"}


@app.get("/api/captures")
def list_captures(request: Request, limit: int = 30):
    uid = get_user(request)
    conn = conn_user(uid)
    rows = conn.execute(
        "SELECT id, raw_text, captured_at, status FROM captures WHERE user_id=? ORDER BY id DESC LIMIT ?",
        (uid, limit)).fetchall()
    return {"captures": [dict(r) for r in rows]}


@app.post("/api/captures/{capture_id}/extract")
def extract_capture(capture_id: int, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    cap = conn.execute("SELECT * FROM captures WHERE id=? AND user_id=?", (capture_id, uid)).fetchone()
    if not cap:
        raise HTTPException(404, "capture not found")
    conn.execute("UPDATE captures SET status='processing' WHERE id=?", (capture_id,))  # raw_text 不动 (INV-01)
    conn.commit()
    started = database.now_iso()
    cur = conn.execute(
        "INSERT INTO extraction_runs(capture_id, provider, model, prompt_version, schema_version, started_at, status)"
        " VALUES(?,?,?,?,?,?, 'running')",
        (capture_id, llm.provider_name(), llm.model_name(), llm.PROMPT_VERSION, llm.SCHEMA_VERSION, started))
    run_id = cur.lastrowid
    try:
        items = llm.extract(cap["raw_text"])
    except Exception as exc:  # AI 失败原文仍在 (DP-002)
        conn.execute("UPDATE extraction_runs SET status='failed', finished_at=? WHERE id=?",
                     (database.now_iso(), run_id))
        conn.execute("UPDATE captures SET status='failed' WHERE id=?", (capture_id,))
        conn.commit()
        raise HTTPException(502, "AI extraction failed: %s" % exc)
    item_ids = []
    for it in items:
        cur = conn.execute(
            "INSERT INTO extracted_items(extraction_run_id, capture_id, user_id, item_type, text_value,"
            " normalized_value, quantity, unit, item_date, confidence, ai_reason, status, needs_confirmation, created_at)"
            " VALUES(?,?,?,?,?,?,?,?,?,?,?, 'proposed', 1, ?)",
            (run_id, capture_id, uid, it["item_type"], it["text_value"], it.get("normalized_value"),
             it.get("quantity"), it.get("unit"), it.get("item_date"), it.get("confidence"),
             it.get("ai_reason"), database.now_iso()))
        item_id = cur.lastrowid
        item_ids.append(item_id)
        for imp in it["impacts"]:
            conn.execute(
                "INSERT INTO behavior_dimension_impacts(extracted_item_id, user_id, dimension_key, direction,"
                " degree_positive, degree_negative, degree, confidence, evaluation_mode, note)"
                " VALUES(?,?,?,?,?,?,?,?, 'logic', ?)",
                (item_id, uid, imp["dimension_key"], imp["direction"], imp.get("degree_positive"),
                 imp.get("degree_negative"), imp.get("degree"), imp.get("confidence"), imp.get("basis")))
    conn.execute("UPDATE extraction_runs SET status='succeeded', finished_at=? WHERE id=?",
                 (database.now_iso(), run_id))
    conn.execute("UPDATE captures SET status='processed', processed_at=? WHERE id=?",
                 (database.now_iso(), capture_id))
    conn.commit()
    return {"capture_id": capture_id, "run_id": run_id, "item_ids": item_ids}


def _items_with_impacts(conn, uid, capture_id=None):
    q = "SELECT * FROM extracted_items WHERE user_id=?"
    args = [uid]
    if capture_id:
        q += " AND capture_id=?"
        args.append(capture_id)
    items = conn.execute(q + " ORDER BY id", args).fetchall()
    out = []
    for it in items:
        impacts = conn.execute(
            "SELECT * FROM behavior_dimension_impacts WHERE extracted_item_id=? ORDER BY dimension_key",
            (it["id"],)).fetchall()
        imp_ids = [i["id"] for i in impacts]
        ph = ",".join("?" * len(imp_ids)) or "-1"
        revs = conn.execute(
            "SELECT target_type, field_name, original_value, corrected_value, corrected_at FROM user_revisions"
            " WHERE (target_type='extracted_item' AND target_id=?)"
            " OR (target_type='dimension_impact' AND target_id IN (%s)) ORDER BY id" % ph,
            [it["id"]] + imp_ids).fetchall()
        out.append({**dict(it), "impacts": [dict(i) for i in impacts], "revisions": [dict(r) for r in revs]})
    return out


@app.get("/api/captures/{capture_id}/items")
def capture_items(capture_id: int, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    return {"items": _items_with_impacts(conn, uid, capture_id)}


@app.get("/api/pending")
def pending_items(request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    rows = conn.execute(
        "SELECT * FROM extracted_items WHERE user_id=? AND status IN ('proposed','unresolved') ORDER BY id",
        (uid,)).fetchall()
    out = []
    for it in rows:
        impacts = conn.execute(
            "SELECT id, dimension_key, direction, degree, degree_positive, degree_negative, note"
            " FROM behavior_dimension_impacts WHERE extracted_item_id=? ORDER BY dimension_key",
            (it["id"],)).fetchall()
        out.append({**dict(it), "impacts": [dict(i) for i in impacts]})
    return {"items": out}


def _require_item(conn, uid, item_id):
    it = conn.execute("SELECT * FROM extracted_items WHERE id=? AND user_id=?", (item_id, uid)).fetchone()
    if not it:
        raise HTTPException(404, "item not found")
    return it


@app.post("/api/items/{item_id}/confirm")
def confirm_item(item_id: int, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    _require_item(conn, uid, item_id)
    conn.execute("UPDATE extracted_items SET status='confirmed', needs_confirmation=0 WHERE id=?", (item_id,))
    conn.commit()
    return {"id": item_id, "status": "confirmed"}


@app.post("/api/items/{item_id}/reject")
def reject_item(item_id: int, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    _require_item(conn, uid, item_id)
    conn.execute("UPDATE extracted_items SET status='rejected', needs_confirmation=0 WHERE id=?", (item_id,))
    conn.commit()
    return {"id": item_id, "status": "rejected"}


@app.post("/api/items/{item_id}/later")
def later_item(item_id: int, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    _require_item(conn, uid, item_id)
    conn.execute("UPDATE extracted_items SET status='unresolved' WHERE id=?", (item_id,))
    conn.commit()
    return {"id": item_id, "status": "unresolved"}


@app.post("/api/items/{item_id}/revise")
def revise_item(item_id: int, body: ReviseIn, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    it = _require_item(conn, uid, item_id)
    allowed = {"text_value", "item_type", "item_date", "quantity", "unit"}
    if body.field_name not in allowed:
        raise HTTPException(422, "field not revisable")
    original = it[body.field_name]
    conn.execute(
        "INSERT INTO user_revisions(user_id, target_type, target_id, field_name, original_value,"
        " corrected_value, corrected_at) VALUES(?,?,?,?,?,?,?)",
        (uid, "extracted_item", item_id, body.field_name, str(original), body.corrected_value,
         database.now_iso()))
    conn.execute("UPDATE extracted_items SET %s=?, status='modified', needs_confirmation=0 WHERE id=?"
                 % body.field_name, (body.corrected_value, item_id))
    conn.commit()
    return {"id": item_id, "status": "modified", "field": body.field_name}


@app.post("/api/impacts/{impact_id}/revise")
def revise_impact(impact_id: int, body: ImpactReviseIn, request: Request):
    """修订 AI 候选影响的方向/程度（INV-02 双值：原始值存 user_revisions）。"""
    uid = get_user(request)
    conn = conn_user(uid)
    imp = conn.execute("SELECT * FROM behavior_dimension_impacts WHERE id=? AND user_id=?",
                       (impact_id, uid)).fetchone()
    if not imp:
        raise HTTPException(404, "impact not found")
    updates = {}
    for f in ("direction", "degree", "degree_positive", "degree_negative", "note"):
        v = getattr(body, f)
        if v is not None:
            updates[f] = v
    if not updates:
        raise HTTPException(422, "nothing to revise")
    if "direction" in updates and updates["direction"] not in (
            "positive", "negative", "mixed", "neutral", "unknown"):
        raise HTTPException(422, "bad direction")
    for f, v in updates.items():
        conn.execute(
            "INSERT INTO user_revisions(user_id, target_type, target_id, field_name, original_value,"
            " corrected_value, corrected_at) VALUES(?,?,?,?,?,?,?)",
            (uid, "dimension_impact", impact_id, f, str(imp[f]), str(v), database.now_iso()))
        conn.execute("UPDATE behavior_dimension_impacts SET %s=? WHERE id=?" % f, (v, impact_id))
    conn.execute("UPDATE extracted_items SET status='modified', needs_confirmation=0 WHERE id=?",
                 (imp["extracted_item_id"],))
    conn.commit()
    return {"id": impact_id, "revised": sorted(updates.keys())}


@app.get("/api/dimensions")
def dimensions(request: Request):
    """五维视图：只聚合 confirmed|modified 且非 unknown 的影响（INV-03/04）；无总分、无排名。"""
    uid = get_user(request)
    conn = conn_user(uid)
    rows = conn.execute(
        "SELECT i.dimension_key, i.direction, i.degree, it.text_value, it.id AS item_id"
        " FROM behavior_dimension_impacts i JOIN extracted_items it ON it.id = i.extracted_item_id"
        " WHERE i.user_id=? AND it.status IN ('confirmed','modified') ORDER BY it.id",
        (uid,)).fetchall()
    dims = {}
    for k in database.DIMENSIONS:
        dims[k] = {"key": k, "name": database.DIM_NAMES[k], "positive": 0, "negative": 0,
                   "mixed": 0, "neutral": 0, "unknown": 0, "degrees": [], "evidence": []}
    for r in rows:
        d = dims[r["dimension_key"]]
        d[r["direction"]] = d.get(r["direction"], 0) + 1
        if r["direction"] != "unknown" and r["degree"]:
            d["degrees"].append(r["degree"])
        if r["direction"] != "unknown":
            d["evidence"].append({"item_id": r["item_id"], "text": r["text_value"], "direction": r["direction"]})
    for d in dims.values():
        d["avg_degree"] = round(sum(d["degrees"]) / len(d["degrees"]), 2) if d["degrees"] else None
        # unknown 计数来自未定影响（含被排除的），补统计：
        d["qualitative"] = ("正向证据居多" if d["positive"] > d["negative"] else
                            "负向证据居多" if d["negative"] > d["positive"] else
                            "混合" if d["mixed"] else ("有证据无方向" if d["neutral"] else "数据不足"))
        del d["degrees"]
    return {"dimensions": list(dims.values()), "note": "五维非零和，无总分；仅统计已确认影响"}


@app.get("/api/goals")
def list_goals(request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    rows = conn.execute("SELECT * FROM goals WHERE user_id=? AND status!='deleted' ORDER BY id", (uid,)).fetchall()
    return {"goals": [dict(r) for r in rows]}


@app.post("/api/goals")
def create_goal(body: GoalIn, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    active = conn.execute(
        "SELECT COUNT(*) c FROM goals WHERE user_id=? AND status='active'", (uid,)).fetchone()["c"]
    goal_rows = conn.execute(
        "SELECT COUNT(*) c FROM goals WHERE user_id=? AND status NOT IN ('deleted','completed')", (uid,)).fetchone()["c"]
    if goal_rows >= 3:
        raise HTTPException(422, "核心目标最多 3 个（产品范围约束）")
    ts = database.now_iso()
    cur = conn.execute(
        "INSERT INTO goals(user_id, title, dimension_keys, measurable, target_description, metric,"
        " horizon, status, created_at, updated_at) VALUES(?,?,?,?,?,?,?, 'active', ?, ?)",
        (uid, body.title, json.dumps(body.dimension_keys, ensure_ascii=False), int(body.measurable),
         body.target_description, body.metric, body.horizon, ts, ts))
    conn.commit()
    return {"id": cur.lastrowid, "status": "active", "active_before": active}


@app.post("/api/goals/{goal_id}/status")
def goal_status(goal_id: int, body: StatusIn, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    if body.status not in ("active", "paused", "completed", "draft"):
        raise HTTPException(422, "bad status")
    conn.execute("UPDATE goals SET status=?, updated_at=? WHERE id=? AND user_id=?",
                 (body.status, database.now_iso(), goal_id, uid))
    conn.commit()
    return {"id": goal_id, "status": body.status}


@app.post("/api/reviews/generate")
def generate_review(body: ReviewIn, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    period_end = datetime.now(timezone.utc)
    period_start = period_end - timedelta(days=body.period_days)
    rows = conn.execute(
        "SELECT it.text_value, it.id AS item_id, i.dimension_key, i.direction, i.degree, c.id AS capture_id,"
        " c.raw_text FROM behavior_dimension_impacts i"
        " JOIN extracted_items it ON it.id = i.extracted_item_id"
        " JOIN captures c ON c.id = it.capture_id"
        " WHERE i.user_id=? AND it.status IN ('confirmed','modified') AND i.direction!='unknown'"
        " ORDER BY it.id", (uid,)).fetchall()
    facts = []
    seen = set()
    for r in rows:
        if r["item_id"] in seen:
            continue
        seen.add(r["item_id"])
        facts.append(r["text_value"])
    calculated = "本期共确认 %d 条记录，覆盖 %d 个维度的非 unknown 影响 %d 条。" % (
        len(facts), len({r['dimension_key'] for r in rows}), len(rows))
    facts_payload = {"facts": facts, "calculated": calculated if facts else ""}
    if not facts:  # 数据不足 → 只给 limitation，不给建议
        statements = [{"statement_type": "limitation",
                       "text": "本期没有已确认的记录，无法生成实质复盘。", "confidence": 1.0,
                       "uncertain_points": ["无确认数据"], "theory": None}]
        recommendation = None
    else:
        result = llm.generate_review(facts_payload, body.review_type)
        statements = result["statements"]
        recommendation = result["recommendation"]
    cur = conn.execute(
        "INSERT INTO reviews(user_id, review_type, period_start, period_end, generated_at, model,"
        " prompt_version, schema_version, title) VALUES(?,?,?,?,?,?,?,?,?)",
        (uid, body.review_type, period_start.isoformat(), period_end.isoformat(), database.now_iso(),
         llm.model_name(), llm.REVIEW_PROMPT_VERSION, llm.SCHEMA_VERSION,
         "%s 复盘" % body.review_type))
    review_id = cur.lastrowid
    evidence_map = [{"item_id": r["item_id"], "capture_id": r["capture_id"], "text": r["raw_text"][:120]}
                    for r in rows[:20]]
    for s in statements[:20]:
        th = s.get("theory")
        theory_id = None
        cur2 = conn.execute(
            "INSERT INTO review_statements(review_id, statement_type, text, confidence,"
            " uncertain_points, supporting_evidence) VALUES(?,?,?,?,?,?)",
            (review_id, s["statement_type"], s["text"], s.get("confidence"),
             json.dumps(s.get("uncertain_points") or [], ensure_ascii=False),
             json.dumps(evidence_map if s["statement_type"] in ("fact", "calculation", "inference") else [],
                        ensure_ascii=False)))
        theory_id = cur2.lastrowid
        if isinstance(th, dict) and th.get("author") and th.get("source_title"):
            conn.execute(
                "INSERT INTO theory_references(review_statement_id, author, source_title, year, citation,"
                " verifiability, assumption_boundary) VALUES(?,?,?,?,?,?,?)",
                (theory_id, th.get("author"), th.get("source_title"), th.get("year"),
                 th.get("citation"), th.get("verifiability"), th.get("assumption_boundary")))
    if recommendation:  # INV-06：零或一
        conn.execute(
            "INSERT INTO recommendations(review_id, text, action_type, target_dimension_keys, reason,"
            " evidence_refs, expected_effect, unknowns) VALUES(?,?,?,?,?,?,?,?)",
            (review_id, recommendation.get("text", ""), recommendation.get("action_type"),
             json.dumps(recommendation.get("target_dimension_keys") or [], ensure_ascii=False),
             recommendation.get("reason"), json.dumps(evidence_map[:5], ensure_ascii=False),
             recommendation.get("expected_effect"), recommendation.get("unknowns")))
    conn.commit()
    return {"review_id": review_id, "statements": len(statements),
            "recommendation": bool(recommendation)}


@app.get("/api/reviews")
def list_reviews(request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    rows = conn.execute(
        "SELECT id, review_type, period_start, period_end, generated_at, title FROM reviews"
        " WHERE user_id=? ORDER BY id DESC LIMIT 20", (uid,)).fetchall()
    return {"reviews": [dict(r) for r in rows]}


@app.get("/api/reviews/{review_id}")
def get_review(review_id: int, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    rev = conn.execute("SELECT * FROM reviews WHERE id=? AND user_id=?", (review_id, uid)).fetchone()
    if not rev:
        raise HTTPException(404, "review not found")
    stmts = conn.execute(
        "SELECT * FROM review_statements WHERE review_id=? ORDER BY id", (review_id,)).fetchall()
    out_stmts = []
    for s in stmts:
        theory = conn.execute(
            "SELECT * FROM theory_references WHERE review_statement_id=?", (s["id"],)).fetchall()
        out_stmts.append({**dict(s), "theory": [dict(t) for t in theory]})
    recs = conn.execute(
        "SELECT * FROM recommendations WHERE review_id=? ORDER BY id", (review_id,)).fetchall()
    return {"review": dict(rev), "statements": out_stmts, "recommendations": [dict(r) for r in recs]}


@app.post("/api/reviews/{review_id}/feedback")
def review_feedback(review_id: int, body: FeedbackIn, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    if not conn.execute("SELECT id FROM reviews WHERE id=? AND user_id=?", (review_id, uid)).fetchone():
        raise HTTPException(404, "review not found")
    conn.execute(
        "INSERT INTO feedback(user_id, review_id, changed, feedback_text, created_at) VALUES(?,?,?,?,?)",
        (uid, review_id, int(body.changed), body.feedback_text, database.now_iso()))
    conn.commit()
    return {"review_id": review_id, "feedback": "saved"}


@app.post("/api/recommendations/{rec_id}/status")
def rec_status(rec_id: int, body: StatusIn, request: Request):
    uid = get_user(request)
    conn = conn_user(uid)
    if body.status not in ("accepted", "rejected", "modified", "completed", "proposed"):
        raise HTTPException(422, "bad status")
    conn.execute("UPDATE recommendations SET status=? WHERE id=?", (body.status, rec_id))
    conn.commit()
    return {"id": rec_id, "status": body.status}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("PORT", "8787")))
