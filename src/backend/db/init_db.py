import os
import duckdb

# Resolve DB path relative to project root (this file is at src/backend/db/init_db.py)
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_default_db = os.path.join(_PROJECT_ROOT, "data", "portfolio.duckdb")
DB_PATH = os.environ.get("DB_PATH", _default_db)
if not os.path.isabs(DB_PATH):
    DB_PATH = os.path.join(_PROJECT_ROOT, DB_PATH)

def init_db():
    print(f"Initializing DuckDB database at {DB_PATH}")
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = duckdb.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS trades (
            id VARCHAR PRIMARY KEY,
            coin_id VARCHAR NOT NULL,
            coin_symbol VARCHAR NOT NULL,
            coin_name VARCHAR NOT NULL,
            amount DOUBLE NOT NULL,
            price_usd DOUBLE NOT NULL,
            timestamp DATETIME NOT NULL,
            trade_type VARCHAR NOT NULL CHECK (trade_type IN ('buy', 'sell'))
        );
    """)
    conn.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
