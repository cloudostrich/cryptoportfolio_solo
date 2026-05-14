from src.backend.db import queries

def test_add_and_get_trade():
    trade = queries.add_trade(
        coin_id="ethereum",
        coin_symbol="eth",
        coin_name="Ethereum",
        amount=2.0,
        price_usd=2000.0,
        trade_type="buy"
    )
    assert trade["coin_id"] == "ethereum"
    assert trade["amount"] == 2.0
    
    trades = queries.get_all_trades()
    assert len(trades) == 1
    assert trades[0]["id"] == trade["id"]
    
def test_delete_trade():
    trade = queries.add_trade(
        coin_id="solana",
        coin_symbol="sol",
        coin_name="Solana",
        amount=10.0,
        price_usd=100.0,
        trade_type="buy"
    )
    
    assert queries.delete_trade(trade["id"]) is True
    
    trades = queries.get_all_trades()
    assert not any(t["id"] == trade["id"] for t in trades)

def test_delete_all_coin_trades():
    queries.add_trade("solana", "sol", "Solana", 10.0, 100.0, "buy")
    queries.add_trade("solana", "sol", "Solana", 5.0, 150.0, "sell")
    queries.add_trade("bitcoin", "btc", "Bitcoin", 1.0, 50000.0, "buy")
    
    assert queries.delete_all_coin_trades("solana") is True
    
    trades = queries.get_all_trades()
    assert len(trades) == 1
    assert trades[0]["coin_id"] == "bitcoin"
