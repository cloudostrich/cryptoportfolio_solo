import os
import uuid
from datetime import datetime, timezone
import duckdb

# Resolve DB path relative to project root (this file is at src/backend/db/queries.py)
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_default_db = os.path.join(_PROJECT_ROOT, "data", "portfolio.duckdb")
DB_PATH = os.environ.get("DB_PATH", _default_db)
if not os.path.isabs(DB_PATH):
    DB_PATH = os.path.join(_PROJECT_ROOT, DB_PATH)

def get_connection():
    return duckdb.connect(DB_PATH, read_only=False)

def get_read_connection():
    return duckdb.connect(DB_PATH, read_only=True)

def add_trade(coin_id: str, coin_symbol: str, coin_name: str, amount: float, price_usd: float, trade_type: str) -> dict:
    trade_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc)
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO trades (id, coin_id, coin_symbol, coin_name, amount, price_usd, timestamp, trade_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (trade_id, coin_id, coin_symbol, coin_name, amount, price_usd, timestamp, trade_type))
        
        result = conn.execute("SELECT * FROM trades WHERE id = ?", (trade_id,)).fetchone()
        columns = [col[0] for col in conn.description]
    return dict(zip(columns, result))

def get_all_trades():
    with get_read_connection() as conn:
        result = conn.execute("SELECT * FROM trades ORDER BY timestamp DESC").fetchall()
        columns = [col[0] for col in conn.description]
        return [dict(zip(columns, row)) for row in result]

def delete_trade(trade_id: str) -> bool:
    with get_connection() as conn:
        conn.execute("DELETE FROM trades WHERE id = ?", (trade_id,))
        return True

def delete_all_coin_trades(coin_id: str) -> bool:
    with get_connection() as conn:
        conn.execute("DELETE FROM trades WHERE coin_id = ?", (coin_id,))
        return True
