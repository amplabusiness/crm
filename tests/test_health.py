from app import app


def test_health():
    client = app.test_client()
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["ok"] is True
    assert data["db"] == "sqlite"
