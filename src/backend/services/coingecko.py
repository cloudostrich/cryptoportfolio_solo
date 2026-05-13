import os
from dotenv import load_dotenv
load_dotenv()
from coingecko_sdk import AsyncCoingecko

api_key = os.environ.get("COINGECKO_DEMO_API_KEY")

client = AsyncCoingecko(
    demo_api_key=api_key,
    environment="demo",
    max_retries=3,
)

async def get_current_prices(coin_ids: list[str]) -> dict:
    if not coin_ids:
        return {}
    try:
        response = await client.simple.price.get(
            ids=",".join(coin_ids),
            vs_currencies="usd"
        )
        result = {}
        for coin_id in coin_ids:
            if isinstance(response, dict):
                item = response.get(coin_id)
                if item is None:
                    result[coin_id] = 0.0
                elif isinstance(item, dict):
                    result[coin_id] = item.get("usd", 0.0)
                else:
                    # SDK returns PriceGetResponseItem with .usd attribute
                    result[coin_id] = getattr(item, "usd", 0.0) or 0.0
            else:
                coin_data = getattr(response, coin_id, None)
                if coin_data:
                    result[coin_id] = getattr(coin_data, "usd", 0.0) or 0.0
                else:
                    result[coin_id] = 0.0
        return result
    except Exception as e:
        print(f"Error fetching prices: {e}")
        return {}

async def get_market_chart(coin_id: str, days: int = 365) -> list:
    try:
        response = await client.coins.market_chart.get(
            id=coin_id,
            vs_currency="usd",
            days=str(days)
        )
        if isinstance(response, dict):
            return response.get("prices", [])
        return getattr(response, "prices", [])
    except Exception as e:
        print(f"Error fetching chart: {e}")
        return []

async def get_top_coins(per_page: int = 50) -> list:
    try:
        response = await client.coins.markets.get(
            vs_currency="usd",
            order="market_cap_desc",
            per_page=per_page,
            page=1
        )
        return response
    except Exception as e:
        print(f"Error fetching top coins: {e}")
        return []

async def search_coins(query: str) -> list:
    try:
        response = await client.search.get(query=query)
        if isinstance(response, dict):
            return response.get("coins", [])
        return getattr(response, "coins", [])
    except Exception as e:
        print(f"Error searching coins: {e}")
        return []
