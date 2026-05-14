import pytest
from src.backend.services import portfolio
from src.backend.db import queries

@pytest.mark.asyncio
async def test_portfolio_summary_calculation(mock_coingecko):
    queries.add_trade("cardano", "ada", "Cardano", 1000.0, 1.0, "buy")
    queries.add_trade("cardano", "ada", "Cardano", 500.0, 2.0, "sell")
    
    # Cost basis: buy 1000 @ 1.0 = 1000. sell 500 @ 2.0 = 1000. Remaining cost basis = 0.
    # Total amount = 500.
    mock_coingecko["prices"].return_value = {"cardano": 1.5}
    
    summary = await portfolio.get_portfolio_summary()
    holding = next((h for h in summary.holdings if h.coin_id == "cardano"), None)
    
    assert holding is not None
    assert holding.total_amount == 500.0
    assert holding.total_cost_usd == 0.0
    assert holding.current_price_usd == 1.5
    assert holding.current_value_usd == 750.0
    assert holding.pnl_usd == 750.0

@pytest.mark.asyncio
async def test_empty_portfolio(mock_coingecko):
    summary = await portfolio.get_portfolio_summary()
    assert summary.total_value_usd == 0.0
    assert summary.total_cost_usd == 0.0
    assert len(summary.holdings) == 0
