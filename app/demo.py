"""Public demo layer (three style-variant skins, one backend).

Design:
- /demo/                English picker page
- /demo/v1|v2|v3/       the three interactive skins (static, English)
- /demo-api/v1|v2|v3/.. mirror of /api/.. pinned to synthetic demo users —
  the browser cannot reach user 1's real data through the demo namespace even
  if it forges X-User-Id, because the uid is derived from the path server-side.

Guard rails for a public endpoint that calls a real LLM:
- LLM-heavy endpoints (extract / correct / reviews-generate) are rate limited
  per demo user and per client IP (in-memory, per process).
- Demo users start with fictional seed data so the Five Dimensions and Review
  views are never empty for visitors.

Demo user ids are far away from real ids and never default to 1.
"""
import re
import threading
import time
from collections import deque
from datetime import datetime, timedelta, timezone

import db as database

DEMO_UIDS = {"v1": 9001, "v2": 9002, "v3": 9003}
DEMO_VARIANTS = ("v1", "v2", "v3")

_PATH_RE = re.compile(r"^/demo-api/(v[123])(/|$)")


def uid_for_path(path):
    """Return the synthetic demo uid for a /demo-api/{variant}/... path, else None."""
    m = _PATH_RE.match(path or "")
    return DEMO_UIDS.get(m.group(1)) if m else None


# ---------------- rate limiting (LLM-calling endpoints, demo namespace only) ----------------
_LIMITS = (("user", 3600, 25), ("ip", 3600, 15))  # (scope, window seconds, max calls)
_hits = {}
_lock = threading.Lock()


def allow_llm(uid, ip):
    """Sliding-window limit; one call reserves a slot in both the per-user and per-IP window."""
    now = time.time()
    keys = [("user:%s" % uid, uid), ("ip:%s" % ip, ip)]
    with _lock:
        for scope, window, limit in _LIMITS:
            q = _hits.setdefault(scope, deque())
            while q and q[0][0] < now - window:
                q.popleft()
            if len(q) >= limit:
                return False
        for key, val in keys:
            _hits.setdefault(key, deque()).append((now, val))
    return True


LLM_PATH_RE = re.compile(r"(/extract|/correct)$")


def is_llm_call(path, method):
    return method == "POST" and (LLM_PATH_RE.search(path) or path.endswith("/reviews/generate"))


# ---------------- fictional seed data (all fictional, safe to show publicly) ----------------
def _ts(days_ago, hhmm):
    day = datetime.now(timezone.utc) - timedelta(days=days_ago)
    return "%sT%s:00+00:00" % (day.strftime("%Y-%m-%d"), hhmm)


# (raw_text, captured_at, [ (item_type, text_value, confidence, ai_reason,
#     [ (dimension_key, direction, degree, degree_positive, degree_negative, note) ]) ])
_SEED_CAPTURES = [
    ("Went for a 30-minute run before work and felt energized all morning.",
     _ts(3, "07:30"), [
        ("behavior", "Morning run, 30 minutes", 0.92,
         "Clear exercise event with duration and a subjective after-effect",
         [("health", "positive", 4, None, None, "Cardio exercise with clear duration; energized afterwards"),
          ("time", "negative", 1, None, None, "30 minutes of morning time spent"),
          ("wealth", "unknown", None, None, None, "No evidence about spending"),
          ("relationship", "unknown", None, None, None, "No evidence"),
          ("purpose", "unknown", None, None, None, "No evidence")]),
     ]),
    ("Stayed up scrolling on my phone until 1 AM and felt groggy in the 9 AM meeting.",
     _ts(2, "23:55"), [
        ("behavior", "Phone scrolling until 1 AM", 0.90,
         "Late-night phone use explicitly stated, with a next-morning consequence",
         [("health", "negative", 3, None, None, "Short sleep on a work night; grogginess reported next morning"),
          ("time", "negative", 2, None, None, "Late-night hours lost to scrolling"),
          ("purpose", "negative", 1, None, None, "Reported grogginess in a morning meeting"),
          ("wealth", "unknown", None, None, None, "No evidence"),
          ("relationship", "unknown", None, None, None, "No evidence")]),
     ]),
    ("Finished the quarterly plan two days early and my manager said it was solid.",
     _ts(2, "18:40"), [
        ("event", "Quarterly plan finished 2 days early", 0.88,
         "Work milestone with explicit deadline delta and feedback",
         [("purpose", "positive", 3, None, None, "Delivered ahead of deadline with positive feedback"),
          ("time", "mixed", None, 2, 1, "Ahead of deadline (plus) at the cost of heavier workdays (minus)"),
          ("relationship", "positive", 2, None, None, "Positive feedback from manager"),
          ("health", "unknown", None, None, None, "No evidence"),
          ("wealth", "unknown", None, None, None, "No evidence about income impact")]),
     ]),
    ("Ordered takeout twice this week instead of cooking.",
     _ts(1, "21:10"), [
        ("behavior", "Takeout twice in one week", 0.85,
         "Repeated spending/meal-prep behavior, amount not stated",
         [("wealth", "negative", 2, None, None, "Extra food spending (amount not stated)"),
          ("health", "negative", 1, None, None, "Home cooking replaced by takeout"),
          ("time", "positive", 1, None, None, "Cooking time saved"),
          ("relationship", "unknown", None, None, None, "No evidence"),
          ("purpose", "unknown", None, None, None, "No evidence")]),
     ]),
    ("Called mom on Sunday and chatted for an hour.",
     _ts(0, "12:15"), [
        ("behavior", "One-hour call with mom", 0.93,
         "Explicit family contact with duration",
         [("relationship", "positive", 4, None, None, "Sustained family contact"),
          ("time", "neutral", None, None, None, "An hour of free time reallocated; no clear direction"),
          ("health", "unknown", None, None, None, "No evidence"),
          ("wealth", "unknown", None, None, None, "No evidence"),
          ("purpose", "unknown", None, None, None, "No evidence")]),
     ]),
    ("Tried a new cafe downtown and read for about an hour.",
     _ts(0, "15:05"), [
        ("behavior", "Reading at a new cafe, about 1 hour", 0.80,
         "Leisure/reading event; spend amount not stated",
         [("purpose", "positive", 2, None, None, "Reading aligns with personal growth"),
          ("wealth", "negative", 1, None, None, "Cafe spend (amount not stated)"),
          ("time", "neutral", None, None, None, "Leisure hour; no clear direction"),
          ("health", "unknown", None, None, None, "No evidence"),
          ("relationship", "unknown", None, None, None, "No evidence")]),
     ]),
]

_SEED_GOALS = [
    ("Run 3 times a week", ["health"], "runs per week", "this quarter"),
    ("Ship the public beta before spring", ["purpose", "time"], "beta features shipped", "by March"),
]


def seed_demo_data():
    """Idempotent: fills each demo user with fictional entries only when empty."""
    for uid in DEMO_UIDS.values():
        conn = database.connect()
        database.ensure_user(conn, uid)
        if conn.execute("SELECT COUNT(*) c FROM captures WHERE user_id=?", (uid,)).fetchone()["c"]:
            conn.close()
            continue
        for raw_text, ts, items in _SEED_CAPTURES:
            cur = conn.execute(
                "INSERT INTO captures(user_id, source, raw_text, captured_at, status, processed_at)"
                " VALUES(?,?,?,?, 'processed', ?)", (uid, "seed", raw_text, ts, ts))
            cap_id = cur.lastrowid
            cur = conn.execute(
                "INSERT INTO extraction_runs(capture_id, provider, model, prompt_version, schema_version,"
                " started_at, finished_at, status) VALUES(?,?,?,?,?,?,?, 'succeeded')",
                (cap_id, "seed", "seed-fixture", "seed-v1", "seed-v1", ts, ts))
            run_id = cur.lastrowid
            for item_type, text_value, conf, reason, impacts in items:
                # the last seeded capture stays pending so demos can show the confirm flow
                pending = raw_text.startswith("Tried a new cafe")
                cur = conn.execute(
                    "INSERT INTO extracted_items(extraction_run_id, capture_id, user_id, item_type, text_value,"
                    " confidence, ai_reason, status, needs_confirmation, created_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
                    (run_id, cap_id, uid, item_type, text_value, conf, reason,
                     'proposed' if pending else 'confirmed', 1 if pending else 0, ts))
                item_id = cur.lastrowid
                for dim, direction, degree, dp, dn, note in impacts:
                    conn.execute(
                        "INSERT INTO behavior_dimension_impacts(extracted_item_id, user_id, dimension_key,"
                        " direction, degree_positive, degree_negative, degree, confidence, evaluation_mode, note)"
                        " VALUES(?,?,?,?,?,?,?,?, 'logic', ?)",
                        (item_id, uid, dim, direction, dp, dn, degree, conf, note))
        for title, dims, metric, horizon in _SEED_GOALS:
            conn.execute(
                "INSERT INTO goals(user_id, title, dimension_keys, measurable, metric, horizon, status,"
                " created_at, updated_at) VALUES(?,?,?,1,?,?, 'active', ?, ?)",
                (uid, title, "[%s]" % ", ".join('"%s"' % d for d in dims), metric, horizon,
                 database.now_iso(), database.now_iso()))
        conn.commit()
        conn.close()
