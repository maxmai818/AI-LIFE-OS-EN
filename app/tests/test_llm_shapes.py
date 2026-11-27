"""Regression: real-LLM response shapes must not crash SQLite writes.

Mock LLM returns theory as None and unknowns as a string; real LLMs return
lists. Both used to reach sqlite3 binding as raw lists (500) or get silently
dropped (theory). INV-06 / review pipeline."""
import os
import sys

os.environ["AI_LIFE_OS_LLM_PROVIDER"] = "mock"
os.environ["AI_LIFE_OS_DB"] = ":memory:"
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import pytest
from fastapi.testclient import TestClient
import db as database
import llm
import server

client = TestClient(server.app)


@pytest.fixture(autouse=True)
def fresh_db(tmp_path, monkeypatch):
    monkeypatch.setattr(database, "DB_PATH", str(tmp_path / "test.db"))
    yield


def _capture_extract_confirm(text):
    cid = client.post("/api/captures", json={"raw_text": text},
                      headers={"X-User-Id": "1"}).json()["id"]
    client.post(f"/api/captures/{cid}/extract", headers={"X-User-Id": "1"})
    for it in client.get(f"/api/captures/{cid}/items", headers={"X-User-Id": "1"}).json()["items"]:
        client.post(f"/api/items/{it['id']}/confirm", headers={"X-User-Id": "1"})
        # mock extraction yields all-unknown impacts; give the review real evidence
        for imp in it["impacts"][:1]:
            client.post(f"/api/impacts/{imp['id']}/revise",
                        json={"direction": "negative", "degree": 2},
                        headers={"X-User-Id": "1"})
    return cid


def test_review_survives_real_llm_list_shapes(monkeypatch):
    """theory as list-of-dicts and unknowns as list must both round-trip."""
    _capture_extract_confirm("Ran 30 minutes and slept early.")

    def fake_review(facts_payload, review_type):
        return {
            "statements": [
                {
                    "statement_type": "inference",
                    "text": "Your confirmed entries lean negative on time this period.",
                    "confidence": 0.6,
                    "uncertain_points": ["Only a few days covered"],
                    "theory": [
                        {"author": "Kahneman", "source_title": "Attention and Effort",
                         "year": 1973, "citation": "Kahneman (1973)",
                         "verifiability": "peer-reviewed",
                         "assumption_boundary": "applies under sustained attention load"},
                        {"author": "Duhigg", "source_title": "The Power of Habit",
                         "year": 2012, "citation": "Duhigg (2012)",
                         "verifiability": "trade",
                         "assumption_boundary": "applies to habit loops"},
                    ],
                }
            ],
            "recommendation": {
                "text": "Move one evening screen block to a walk.",
                "action_type": "micro",
                "target_dimension_keys": ["health"],
                "reason": "stabilize sleep",
                "expected_effect": "small",
                "unknowns": ["how busy next week is", "whether you prefer mornings"],
            },
        }

    monkeypatch.setattr(llm, "generate_review", fake_review)
    r = client.post("/api/reviews/generate",
                    json={"review_type": "daily", "period_days": 1},
                    headers={"X-User-Id": "1"})
    assert r.status_code == 200, r.text
    rid = r.json()["review_id"]

    got = client.get(f"/api/reviews/{rid}", headers={"X-User-Id": "1"}).json()
    stmt = got["statements"][0]
    assert [t["author"] for t in stmt["theory"]] == ["Kahneman", "Duhigg"]  # list theory kept
    rec = got["recommendations"][0]
    # unknowns list must survive (JSON-serialised string, per DB contract)
    unk = rec["unknowns"]
    parsed = json.loads(unk) if isinstance(unk, str) else unk
    assert parsed == ["how busy next week is", "whether you prefer mornings"]
