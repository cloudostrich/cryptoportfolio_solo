import pytest
from src.backend.models.schemas import TradeCreate

def test_trade_create_model():
    trade = TradeCreate(
        coin_id="bitcoin",
        coin_symbol="btc",
        coin_name="Bitcoin",
        amount=1.5,
        price_usd=50000.0,
        trade_type="buy"
    )
    assert trade.coin_id == "bitcoin"
    assert trade.trade_type == "buy"
