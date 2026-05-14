---
name: pytest
description: Testing guidelines using pytest for the FastAPI and DuckDB backend.
---

# Skill: Backend Testing with pytest

## 🚨 Critical Rules

1.  **Framework**:
    - **ALWAYS** use `pytest` for all backend tests.
    - Tests should live in the `tests/` directory at the project root.

2.  **Testing FastAPI**:
    - Use `fastapi.testclient.TestClient` to test API routes.
    - Test successful responses (200 OK) as well as validation errors (422 Unprocessable Entity) and custom errors.

3.  **Mocking External Services**:
    - **ALWAYS** mock calls to the CoinGecko API to prevent hitting rate limits and to ensure tests are deterministic.
    - Use `unittest.mock.patch` or pytest fixtures to mock the `coingecko_sdk` client methods.

4.  **Database Testing (DuckDB)**:
    - **ALWAYS** use an in-memory DuckDB database (or a separate test file) for testing so that the real database (`data/`) is not modified.
    - Override the database dependency in FastAPI using `app.dependency_overrides`.

## ✅ Correct Implementation Example

```python
# tests/test_portfolio.py
import pytest
from fastapi.testclient import TestClient
from src.backend.main import app
from src.backend.db.duckdb_client import get_db

# Override the DB dependency to use in-memory DuckDB for tests
def override_get_db():
    import duckdb
    conn = duckdb.connect(':memory:')
    # setup schema...
    yield conn
    conn.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_get_portfolio_empty():
    response = client.get("/api/portfolio")
    assert response.status_code == 200
    assert response.json() == []
```
