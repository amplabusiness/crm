import os
import sqlite3
from pathlib import Path
from contextlib import contextmanager
from typing import Iterator

DB_DIR = Path("instance")
DB_PATH = DB_DIR / "app.db"

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
"""


def ensure_db() -> None:
    DB_DIR.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.executescript(SCHEMA_SQL)


@contextmanager
def get_db_connection() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
    finally:
        conn.close()
