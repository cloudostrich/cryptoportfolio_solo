def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_add_trade_api(client):
    payload = {
        "coin_id": "bitcoin",
        "coin_symbol": "btc",
        "coin_name": "Bitcoin",
        "amount": 1.5,
        "price_usd": 50000.0,
        "trade_type": "buy"
    }
    response = client.post("/api/trades", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["coin_id"] == "bitcoin"
    assert data["amount"] == 1.5
    assert "id" in data

def test_get_trades_api(client):
    response = client.get("/api/trades")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_portfolio_summary(client, mock_coingecko):
    # Setup state
    client.post("/api/trades", json={
        "coin_id": "bitcoin",
        "coin_symbol": "btc",
        "coin_name": "Bitcoin",
        "amount": 1.0,
        "price_usd": 40000.0,
        "trade_type": "buy"
    })
    
    response = client.get("/api/portfolio/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_value_usd" in data
    assert "holdings" in data
    
    # Validate calculations
    assert len(data["holdings"]) == 1
    assert data["holdings"][0]["current_price_usd"] == 50000.0  # From mock
    assert data["holdings"][0]["pnl_usd"] == 10000.0

def test_trade_validation_error(client):
    # Missing required field `price_usd`
    payload = {
        "coin_id": "bitcoin",
        "coin_symbol": "btc",
        "coin_name": "Bitcoin",
        "amount": 1.5,
        "trade_type": "buy"
    }
    response = client.post("/api/trades", json=payload)
    assert response.status_code == 422
