from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class TradeCreate(BaseModel):
    coin_id: str
    coin_symbol: str
    coin_name: str
    amount: float
    price_usd: float
    trade_type: str

class TradeResponse(BaseModel):
    id: str
    coin_id: str
    coin_symbol: str
    coin_name: str
    amount: float
    price_usd: float
    timestamp: datetime
    trade_type: str
    model_config = ConfigDict(from_attributes=True)

class Holding(BaseModel):
    coin_id: str
    coin_symbol: str
    coin_name: str
    total_amount: float
    total_cost_usd: float
    average_buy_price: float
    current_price_usd: float
    current_value_usd: float
    pnl_usd: float
    pnl_percentage: float

class PortfolioSummary(BaseModel):
    total_value_usd: float
    total_cost_usd: float
    total_pnl_usd: float
    total_pnl_percentage: float
    holdings: List[Holding]

class MarketCoin(BaseModel):
    id: str
    symbol: str
    name: str
    current_price: float
    market_cap: float
    price_change_percentage_24h: float
