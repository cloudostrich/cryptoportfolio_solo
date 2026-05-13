import asyncio
import os
from dotenv import load_dotenv
from coingecko_sdk import AsyncCoingecko
load_dotenv()

api_key = os.environ.get("COINGECKO_PRO_API_KEY")

async def test_env(env_name, key_arg):
    print(f"\n--- Testing environment: {env_name} ---")
    kwargs = {key_arg: api_key, "environment": env_name, "max_retries": 1}
    client = AsyncCoingecko(**kwargs)
    
    try:
        res = await client.search.get(query="bitcoin")
        print(f"Search successful in {env_name}.")
    except Exception as e:
        print(f"Search error in {env_name}: {e}")
        
    try:
        res = await client.simple.price.get(ids="bitcoin", vs_currencies="usd")
        print(f"Price successful in {env_name}.")
    except Exception as e:
        print(f"Price error in {env_name}: {e}")

async def main():
    await test_env("pro", "pro_api_key")
    await test_env("demo", "demo_api_key")

if __name__ == "__main__":
    asyncio.run(main())
