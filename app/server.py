"""AI Life OS — application layer (flow orchestration + API). Kernel invariants INV-01..12 are enforced here."""
import json
import os
import secrets
import sys
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, RedirectResponse
from typing import Optional
from pydantic import BaseModel, Field

sys.path.insert(0, os.path.dirname(__file__))
import db as database
import llm
import auth as authmod

app = FastAPI(title="AI Life OS")

# ---- Login layer (enabled only for cloud deployments: AI_LIFE_OS_AUTH=1)----
if os.environ.get("AI_LIFE_OS_AUTH") == "1":
    @app.middleware("http")
    async def _auth_gate(request: Request, call_next):
        return await authmod.gate(request, call_next)


@app.get("/setup")
def setup_get():
    return authmod.setup_page()


async def _form_password(request: Request) -> str:
    """Parse the urlencoded form by hand to avoid pulling in the python-multipart dependency."""
    from urllib.parse import parse_qs
    body = (await request.body()).decode("utf-8", "ignore")
    return (parse_qs(body).get("password") or [""])[0]


@app.post("/setup")
async def setup_post(request: Request):
    if authmod.is_setup():
        return RedirectResponse("/", 302)
    password = await _form_password(request)
    if len(password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")
    salt = secrets.token_hex(16)
    state = {"password_hash": f"{salt}${authmod._hash(password, salt)}",
             "secret": secrets.token_hex(32)}
    authmod._save(state)
    return authmod.issue_cookie(RedirectResponse("/", 302), state)


@app.get("/login")
def login_get():
    return authmod.login_page()


@app.post("/login")
async def login_post(request: Request):
    state = authmod._load()
    password = await _form_password(request)
    if not state.get("password_hash") or not authmod._verify(password, state):
        return authmod.login_page()
    return authmod.issue_cookie(RedirectResponse("/", 302), state)


@app.get("/logout")
def logout():
    response = RedirectResponse("/login", 302)
    response.delete_cookie(authmod.COOKIE)
    return response
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


# ---- PWA shell assets (app experience pack) ----
@app.get("/manifest.json")
def pwa_manifest():
    return FileResponse(os.path.join(STATIC, "manifest.json"), media_type="application/manifest+json")


@app.get("/sw.js")
def pwa_sw():
    # scope limited to the root path; no-cache keeps SW updates timely
    return FileResponse(os.path.join(STATIC, "sw.js"), media_type="application/javascript",
                        headers={"Cache-Control": "no-cache", "Service-Worker-Allowed": "/"})


@app.get("/apple-touch-icon.png")
def pwa_apple_touch_icon():
    return FileResponse(os.path.join(STATIC, "apple-touch-icon.png"), media_type="image/png")


@app.get("/icons/{name}")
def pwa_icon(name: str):
    if "/" in name or "\\" in name or not name.endswith(".png"):
        raise HTTPException(404, "icon not found")
    path = os.path.join(STATIC, "icons", name)
    if not os.path.isfile(path):
        raise HTTPException(404, "icon not found")
    return FileResponse(path, media_type="image/png")


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
    conn.execute("UPDATE captures SET status='processing' WHERE id=?", (capture_id,))  # raw_text untouched (INV-01)
    conn.commit()
    started = database.now_iso()
    cur = conn.execute(
        "INSERT INTO extraction_runs(capture_id, provider, model, prompt_version, schema_version, started_at, status)"
        " VALUES(?,?,?,?,?,?, 'running')",
        (capture_id, llm.provider_name(), llm.model_name(), llm.PROMPT_VERSION, llm.SCHEMA_VERSION, started))
    run_id = cur.lastrowid
    try:
        items = llm.extract(cap["raw_text"])
    except Exception as exc:  # on AI failure the original text is kept (DP-002)
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


class CorrectIn(BaseModel):
    feedback: str


@app.post("/api/items/{item_id}/correct")
def correct_item(item_id: int, body: CorrectIn, request: Request):
    """Natural-language correction: the user says "what's wrong", the AI revises; all original values go into user_revisions (INV-02)."""
    uid = get_user(request)
    conn = conn_user(uid)
    it = conn.execute("SELECT * FROM extracted_items WHERE id=? AND user_id=?", (item_id, uid)).fetchone()
    if not it:
        raise HTTPException(404, "item not found")
    if it["status"] == "rejected":
        raise HTTPException(422, "item already deleted")
    if not body.feedback.strip():
        raise HTTPException(422, "feedback required")
    impacts = conn.execute(
        "SELECT * FROM behavior_dimension_impacts WHERE extracted_item_id=? ORDER BY dimension_key",
        (item_id,)).fetchall()
    result = llm.correct(dict(it), [dict(i) for i in impacts], body.feedback.strip())
    now = database.now_iso()
    changed = []
    tv = result.get("text_value")
    if tv and tv != it["text_value"]:
        conn.execute(
            "INSERT INTO user_revisions(user_id, target_type, target_id, field_name, original_value,"
            " corrected_value, corrected_at) VALUES(?,?,?,?,?,?,?)",
            (uid, "extracted_item", item_id, "text_value", it["text_value"], tv, now))
        conn.execute("UPDATE extracted_items SET text_value=? WHERE id=?", (tv, item_id))
        changed.append("text_value")
    imp_by_dim = {i["dimension_key"]: i for i in impacts}
    for u in result.get("impacts") or []:
        imp = imp_by_dim.get(u.get("dimension_key"))
        if not imp:
            continue
        for f in ("direction", "degree", "degree_positive", "degree_negative", "note"):
            v = u.get(f)
            if v is None or v == imp[f]:
                continue
            if f == "direction" and v not in ("positive", "negative", "mixed", "neutral", "unknown"):
                continue
            conn.execute(
                "INSERT INTO user_revisions(user_id, target_type, target_id, field_name, original_value,"
                " corrected_value, corrected_at) VALUES(?,?,?,?,?,?,?)",
                (uid, "dimension_impact", imp["id"], f, str(imp[f]), str(v), now))
            conn.execute("UPDATE behavior_dimension_impacts SET %s=? WHERE id=?" % f, (v, imp["id"]))
            changed.append(f"{u['dimension_key']}.{f}")
    if not changed:
        return {"id": item_id, "changed": [], "note": "Feedback recorded, but there was nothing that could be safely changed (no guessing)"}
    conn.execute("UPDATE extracted_items SET status='modified', needs_confirmation=0 WHERE id=?", (item_id,))
    conn.commit()
    return {"id": item_id, "changed": changed}


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
    """Revise the direction/degree of an AI-candidate impact (INV-02 dual values: the original goes into user_revisions)."""
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
    """Five-dimension view: aggregates only confirmed|modified and non-unknown impacts (INV-03/04); no total score, no ranking."""
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
        # the unknown count comes from undetermined impacts (including excluded ones); extra summary:
        d["qualitative"] = ("Mostly positive evidence" if d["positive"] > d["negative"] else
                            "Mostly negative evidence" if d["negative"] > d["positive"] else
                            "Mixed" if d["mixed"] else ("Evidence without direction" if d["neutral"] else "Not enough data"))
        del d["degrees"]
    return {"dimensions": list(dims.values()), "note": "The five dimensions are non-zero-sum, with no total score; only confirmed impacts are counted"}


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
        raise HTTPException(422, "At most 3 core goals (product scope constraint)")
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
    calculated = "%d entries confirmed this period, covering %d dimensions with %d non-unknown impacts." % (
        len(facts), len({r['dimension_key'] for r in rows}), len(rows))
    facts_payload = {"facts": facts, "calculated": calculated if facts else ""}
    if not facts:  # not enough data -> give only a limitation, no recommendation
        statements = [{"statement_type": "limitation",
                       "text": "There are no confirmed entries this period, so no substantive review can be generated.", "confidence": 1.0,
                       "uncertain_points": ["No confirmed data"], "theory": None}]
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
         "%s review" % body.review_type))
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
    if recommendation:  # INV-06: zero or one
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
