import os
import sys
import tempfile
import pytest

# Add project root to sys.path so that 'src' can be imported when running 'pytest'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

# 1. Set DB_PATH to a temporary file before importing the app or queries
db_fd, db_path = tempfile.mkstemp(suffix=".duckdb")
os.close(db_fd)
os.remove(db_path) # Delete the 0-byte file so DuckDB can create a valid db file
os.environ["DB_PATH"] = db_path

# 2. Now import app and db logic
from src.backend.main import app
from src.backend.db.init_db import init_db
from src.backend.db.queries import get_connection

@pytest.fixture(autouse=True, scope="session")
def setup_test_db():
    """Initializes the database schema once for the test session."""
    init_db()
    yield
    # Cleanup after all tests
    try:
        os.remove(db_path)
    except OSError:
        pass

@pytest.fixture(autouse=True)
def isolate_tests():
    """Clears the trades table before each test to ensure test isolation."""
    with get_connection() as conn:
        conn.execute("DELETE FROM trades")
    yield

@pytest.fixture
def client():
    """Returns a TestClient for testing FastAPI routes."""
    return TestClient(app)

@pytest.fixture
def mock_coingecko():
    """Mocks the CoinGecko API service calls to prevent real network requests."""
    with patch("src.backend.services.coingecko.get_current_prices", new_callable=AsyncMock) as mock_prices, \
         patch("src.backend.services.coingecko.get_market_chart", new_callable=AsyncMock) as mock_chart, \
         patch("src.backend.services.coingecko.search_coins", new_callable=AsyncMock) as mock_search:
        
        # Default mock returns
        mock_prices.return_value = {"bitcoin": 50000.0}
        mock_chart.return_value = [[1600000000000, 45000.0], [1600086400000, 50000.0]]
        mock_search.return_value = [{"id": "bitcoin", "symbol": "btc", "name": "Bitcoin"}]
        
        yield {
            "prices": mock_prices,
            "chart": mock_chart,
            "search": mock_search
        }
