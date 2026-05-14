import pytest
import time
from src.backend.services import coingecko

@pytest.mark.asyncio
async def test_live_get_current_prices():
    """
    Tests that the CoinGecko API can connect and retrieve correct price data.
    Also tests that the retrieval speed is within an acceptable threshold.
    """
    start_time = time.time()
    prices = await coingecko.get_current_prices(["bitcoin", "ethereum"])
    end_time = time.time()
    
    elapsed = end_time - start_time
    
    # 1. Verify correct data retrieval
    assert isinstance(prices, dict)
    assert "bitcoin" in prices
    assert "ethereum" in prices
    assert isinstance(prices["bitcoin"], float)
    assert prices["bitcoin"] > 0
    assert prices["ethereum"] > 0
    
    # 2. Test speed of retrieval (should comfortably return under 3 seconds)
    print(f"\n[Speed] get_current_prices took {elapsed:.4f} seconds")
    assert elapsed < 3.0, f"API retrieval was too slow: {elapsed:.4f}s"

@pytest.mark.asyncio
async def test_live_search_coins():
    """
    Tests that the CoinGecko API search endpoint connects and returns valid results.
    Also tests the retrieval speed.
    """
    start_time = time.time()
    results = await coingecko.search_coins("solana")
    end_time = time.time()
    
    elapsed = end_time - start_time
    
    # 1. Verify correct data retrieval
    assert isinstance(results, list)
    assert len(results) > 0
    
    # Find if 'solana' exists in the returned items
    ids = [coin.get('id') if isinstance(coin, dict) else getattr(coin, 'id', '') for coin in results]
    assert any("solana" in id_str.lower() for id_str in ids), "Search did not return expected coin 'solana'"

    # 2. Test speed of retrieval
    print(f"\n[Speed] search_coins took {elapsed:.4f} seconds")
    assert elapsed < 3.0, f"API retrieval was too slow: {elapsed:.4f}s"
