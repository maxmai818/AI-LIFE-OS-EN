"""AI Life OS — 数据层。Schema 对齐 Capture-Data-AI-Output-Contract v0.6（Approved）。

不变量落点：
- INV-01  captures.raw_text 永不 UPDATE（本模块不提供任何改写 raw_text 的接口）。
- INV-10  所有查询带 user_id。
"""
import os
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.environ.get("AI_LIFE_OS_DB", os.path.join(os.path.dirname(__file__), "data.db"))

DIMENSIONS = ["time", "health", "wealth", "relationship", "purpose"]

SCHEMA = """
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS profiles(
  user_id INTEGER PRIMARY KEY,
  current_challenge TEXT,
  privacy_mode TEXT DEFAULT 'private',
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS life_dimensions(
  user_id INTEGER NOT NULL,
  dim_key TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  baseline TEXT,
  updated_at TEXT,
  PRIMARY KEY(user_id, dim_key)
);
CREATE TABLE IF NOT EXISTS goals(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  dimension_keys TEXT DEFAULT '[]',
  measurable INTEGER DEFAULT 0,
  target_description TEXT,
  metric TEXT,
  baseline_value TEXT,
  current_value TEXT,
  horizon TEXT,
  status TEXT DEFAULT 'draft',
  evidence TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS captures(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  source TEXT DEFAULT 'web',
  raw_text TEXT NOT NULL,
  content_type TEXT DEFAULT 'text/plain',
  captured_at TEXT NOT NULL,
  processed_at TEXT,
  status TEXT DEFAULT 'saved',
  timezone TEXT,
  client_capture_id TEXT
);
CREATE TABLE IF NOT EXISTS extraction_runs(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  capture_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT DEFAULT 'running'
);
CREATE TABLE IF NOT EXISTS extracted_items(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  extraction_run_id INTEGER NOT NULL,
  capture_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  item_type TEXT NOT NULL,
  text_value TEXT NOT NULL,
  normalized_value TEXT,
  quantity REAL,
  unit TEXT,
  item_date TEXT,
  confidence REAL,
  ai_reason TEXT,
  status TEXT DEFAULT 'proposed',
  needs_confirmation INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS behavior_dimension_impacts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  extracted_item_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  dimension_key TEXT NOT NULL,
  direction TEXT NOT NULL,
  degree_positive INTEGER,
  degree_negative INTEGER,
  degree INTEGER,
  confidence REAL,
  evaluation_mode TEXT DEFAULT 'logic',
  rule_id TEXT,
  rule_version TEXT,
  note TEXT
);
CREATE TABLE IF NOT EXISTS user_revisions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_type TEXT NOT NULL,
  target_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  original_value TEXT,
  corrected_value TEXT,
  corrected_by TEXT DEFAULT 'user',
  corrected_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reviews(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  review_type TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  model TEXT,
  prompt_version TEXT,
  schema_version TEXT,
  status TEXT DEFAULT 'generated',
  title TEXT
);
CREATE TABLE IF NOT EXISTS review_statements(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL,
  statement_type TEXT NOT NULL,
  text TEXT NOT NULL,
  confidence REAL,
  uncertain_points TEXT DEFAULT '[]',
  supporting_evidence TEXT DEFAULT '[]',
  theory_reference_id INTEGER,
  revision_state TEXT DEFAULT 'unchanged'
);
CREATE TABLE IF NOT EXISTS theory_references(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_statement_id INTEGER NOT NULL,
  author TEXT,
  source_title TEXT,
  year TEXT,
  citation TEXT,
  verifiability TEXT,
  assumption_boundary TEXT
);
CREATE TABLE IF NOT EXISTS recommendations(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  action_type TEXT,
  target_dimension_keys TEXT DEFAULT '[]',
  reason TEXT,
  evidence_refs TEXT DEFAULT '[]',
  expected_effect TEXT,
  unknowns TEXT,
  status TEXT DEFAULT 'proposed'
);
CREATE TABLE IF NOT EXISTS feedback(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  changed INTEGER,
  feedback_text TEXT,
  created_at TEXT NOT NULL
);
"""

DIM_NAMES = {
    "time": "时间", "health": "健康", "wealth": "财富",
    "relationship": "关系", "purpose": "目的",
}


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn


def ensure_user(conn, user_id=1):
    row = conn.execute("SELECT id FROM users WHERE id=?", (user_id,)).fetchone()
    if not row:
        conn.execute("INSERT INTO users(id, created_at) VALUES(?,?)", (user_id, now_iso()))
        conn.execute("INSERT INTO profiles(user_id) VALUES(?)", (user_id,))
        for k in DIMENSIONS:
            conn.execute(
                "INSERT INTO life_dimensions(user_id, dim_key, name, updated_at) VALUES(?,?,?,?)",
                (user_id, k, DIM_NAMES[k], now_iso()))
        conn.commit()


def effective_impact(row):
    """INV-02：用户修订值优先于 AI 值。返回 dict(effective, original)。"""
    rev = row["degree"]
    return {"effective": rev, "original": rev}
