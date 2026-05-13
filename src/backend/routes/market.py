from fastapi import APIRouter, HTTPException
from ..services import coingecko

router = APIRouter(prefix="/api/market", tags=["market"])

@router.get("/listings")
async def get_listings():
    try:
        coins = await coingecko.get_top_coins()
        if isinstance(coins, list):
            result = []
            for coin in coins:
                if isinstance(coin, dict):
                    result.append(coin)
                else:
                    result.append(coin.to_dict() if hasattr(coin, "to_dict") else vars(coin))
            return result
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_market(query: str):
    try:
        results = await coingecko.search_coins(query)
        if isinstance(results, list):
            out = []
            for coin in results:
                if isinstance(coin, dict):
                    out.append(coin)
                else:
                    out.append(coin.to_dict() if hasattr(coin, "to_dict") else vars(coin))
            return out
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{coin_id}")
async def get_history(coin_id: str, days: int = 365):
    try:
        return await coingecko.get_market_chart(coin_id, days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/price/{coin_id}")
async def get_coin_price(coin_id: str):
    try:
        prices = await coingecko.get_current_prices([coin_id])
        return {"price": prices.get(coin_id, 0.0)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
