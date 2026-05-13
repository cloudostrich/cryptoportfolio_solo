import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.environ.get("COINGECKO_PRO_API_KEY")

from coingecko_sdk import AsyncCoingecko
client = AsyncCoingecko(
    demo_api_key=api_key,
    environment="demo",
    max_retries=3,
)

async def main():
    res = await client.search.get(query="bitcoin")
    if hasattr(res, "coins"):
        print("RESULTS:", len(res.coins))
    elif isinstance(res, dict):
        print("RESULTS:", len(res.get("coins", [])))
    else:
        print("RESULTS:", res)

if __name__ == "__main__":
    asyncio.run(main())
