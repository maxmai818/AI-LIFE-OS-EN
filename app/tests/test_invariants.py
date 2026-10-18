"""不变量验收测试（INV-01～12 逐条对应用层行为）。mock provider，零网络。"""
import os
import sys

os.environ["AI_LIFE_OS_LLM_PROVIDER"] = "mock"
os.environ["AI_LIFE_OS_DB"] = ":memory:"
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
import db as database
import server

client = TestClient(server.app)


@pytest.fixture(autouse=True)
def fresh_db(tmp_path, monkeypatch):
    monkeypatch.setattr(database, "DB_PATH", str(tmp_path / "test.db"))
    yield


def mk_capture(text, uid=1):
    r = client.post("/api/captures", json={"raw_text": text}, headers={"X-User-Id": str(uid)})
    return r.json()["id"]


def extract(cid, uid=1):
    return client.post(f"/api/captures/{cid}/extract", headers={"X-User-Id": str(uid)}).json()


def test_inv01_raw_text_never_overwritten():
    cid = mk_capture("今天跑了 30 分钟")
    extract(cid)
    rows = database.connect().execute("SELECT raw_text, status FROM captures WHERE id=?", (cid,)).fetchone()
    assert rows["raw_text"] == "今天跑了 30 分钟"
    assert rows["status"] == "processed"


def test_extract_produces_proposed_items_with_five_dims():
    cid = mk_capture("今天跑步了 30 分钟，晚上和妈妈通电话")
    r = extract(cid)
    assert r["item_ids"]
    items = client.get(f"/api/captures/{cid}/items").json()["items"]
    for it in items:
        assert it["status"] == "proposed" and it["needs_confirmation"] == 1
        assert len(it["impacts"]) == 5  # 五维全覆盖


def test_inv03_no_basis_means_unknown():
    cid = mk_capture("今天跑步了")
    items = client.get(f"/api/captures/{cid}/items").json()["items"] if extract(cid) else []
    for it in items:
        for imp in it["impacts"]:
            if not (imp["note"] or "").strip():
                assert imp["direction"] == "unknown"


def test_inv04_only_confirmed_non_unknown_count():
    cid = mk_capture("今天跑步了")
    extract(cid)
    before = client.get("/api/dimensions").json()["dimensions"]
    assert all(d["positive"] + d["negative"] + d["mixed"] == 0 for d in before)
    item_id = client.get("/api/pending").json()["items"][0]["id"]
    client.post(f"/api/items/{item_id}/confirm")
    after = client.get("/api/dimensions").json()["dimensions"]
    assert any(d["positive"] > 0 for d in after)


def test_inv02_revision_stored_and_dual_value():
    cid = mk_capture("今天跑步了")
    extract(cid)
    item_id = client.get("/api/pending").json()["items"][0]["id"]
    client.post(f"/api/items/{item_id}/revise",
                json={"field_name": "text_value", "corrected_value": "今天跑步 45 分钟"})
    items = client.get(f"/api/captures/{cid}/items").json()["items"]
    it = [i for i in items if i["id"] == item_id][0]
    assert it["status"] == "modified"
    assert it["revisions"][0]["original_value"] != it["revisions"][0]["corrected_value"]
    # 原文仍在
    caps = client.get("/api/captures").json()["captures"]
    assert any(c["raw_text"] == "今天跑步了" for c in caps)


def test_goals_max_three():
    for i in range(3):
        assert client.post("/api/goals", json={"title": f"g{i}"}).status_code == 200
    r = client.post("/api/goals", json={"title": "g4"})
    assert r.status_code == 422  # 产品范围约束


def test_inv06_recommendation_zero_or_one():
    cid = mk_capture("今天跑步了")
    extract(cid)
    for it in client.get("/api/pending").json()["items"]:
        client.post(f"/api/items/{it['id']}/confirm")
    r = client.post("/api/reviews/generate", json={"review_type": "weekly"}).json()
    data = client.get(f"/api/reviews/{r['review_id']}").json()
    assert len(data["recommendations"]) <= 1
    types = [s["statement_type"] for s in data["statements"]]
    assert set(types) <= {"fact", "calculation", "inference", "theory", "recommendation", "limitation"}


def test_review_no_data_gives_limitation_no_rec():
    r = client.post("/api/reviews/generate", json={"review_type": "weekly"}).json()
    data = client.get(f"/api/reviews/{r['review_id']}").json()
    assert data["recommendations"] == []
    assert data["statements"][0]["statement_type"] == "limitation"


def test_inv08_extraction_provenance():
    cid = mk_capture("今天跑步了")
    r = extract(cid)
    row = database.connect().execute(
        "SELECT provider, model, prompt_version, schema_version FROM extraction_runs WHERE id=?",
        (r["run_id"],)).fetchone()
    assert row["provider"] == "mock" and row["model"] and row["prompt_version"] and row["schema_version"]


def test_inv10_multi_user_isolation():
    cid1 = mk_capture("今天跑步了", uid=1)
    cid2 = mk_capture("今天开会了一整天", uid=2)
    caps1 = client.get("/api/captures", headers={"X-User-Id": "1"}).json()["captures"]
    caps2 = client.get("/api/captures", headers={"X-User-Id": "2"}).json()["captures"]
    assert all(c["id"] != cid2 for c in caps1)
    assert all(c["id"] != cid1 for c in caps2)


def test_feedback_and_rec_status():
    cid = mk_capture("今天跑步了")
    extract(cid)
    for it in client.get("/api/pending").json()["items"]:
        client.post(f"/api/items/{it['id']}/confirm")
    r = client.post("/api/reviews/generate", json={"review_type": "weekly"}).json()
    assert client.post(f"/api/reviews/{r['review_id']}/feedback",
                       json={"changed": False, "feedback_text": "本次不需要改变"}).status_code == 200
    recs = client.get(f"/api/reviews/{r['review_id']}").json()["recommendations"]
    if recs:
        assert client.post(f"/api/recommendations/{recs[0]['id']}/status",
                           json={"status": "rejected"}).status_code == 200
