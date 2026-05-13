from fastapi import APIRouter, HTTPException
from typing import List
from ..models.schemas import TradeCreate, TradeResponse, PortfolioSummary
from ..db import queries
from ..services import portfolio

router = APIRouter(prefix="/api", tags=["portfolio"])

@router.get("/trades", response_model=List[TradeResponse])
def get_trades():
    trades = queries.get_all_trades()
    return trades

@router.post("/trades", response_model=TradeResponse)
def add_trade(trade: TradeCreate):
    try:
        new_trade = queries.add_trade(
            coin_id=trade.coin_id,
            coin_symbol=trade.coin_symbol,
            coin_name=trade.coin_name,
            amount=trade.amount,
            price_usd=trade.price_usd,
            trade_type=trade.trade_type
        )
        return new_trade
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/trades/{trade_id}")
def delete_trade(trade_id: str):
    success = queries.delete_trade(trade_id)
    if not success:
        raise HTTPException(status_code=404, detail="Trade not found")
    return {"status": "success"}

@router.delete("/portfolio/coin/{coin_id}")
def delete_coin(coin_id: str):
    try:
        success = queries.delete_all_coin_trades(coin_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/portfolio/summary", response_model=PortfolioSummary)
async def get_summary():
    try:
        return await portfolio.get_portfolio_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/portfolio/chart")
async def get_portfolio_chart(days: int = 365):
    try:
        return await portfolio.get_portfolio_history(days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
