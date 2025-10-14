import os
import sqlite3
from pathlib import Path
from typing import Callable, Any

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

from auth import require_auth
from database import get_db_connection, ensure_db


def create_app() -> Flask:
    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.config["JSON_SORT_KEYS"] = False

    # Ensure SQLite exists with a basic schema
    ensure_db()

    # Enable CORS for API routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.get("/api/health")
    def health():
        try:
            with get_db_connection() as conn:
                conn.execute("SELECT 1")
            return jsonify({"ok": True, "db": "sqlite", "message": "healthy"})
        except Exception as e:  # noqa: BLE001
            return jsonify({"ok": False, "error": str(e)}), 500

    @app.get("/api/secure")
    @require_auth
    def secure_endpoint():
        return jsonify({"ok": True, "message": "authorized"})

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "3000"))
    app.run(host="0.0.0.0", port=port, debug=True)
