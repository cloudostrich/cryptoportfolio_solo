# AGENTS.md — B1 Builders Workspace

> This file guides AI coding agents working on this repository.
> It complements the README.md files found in each project subdirectory.

## Repository Overview

This project is built for the [42 Singapore B1 Builders Programme](../Reference_Materials/B1%20Builders%20Programme.md)

| Project | Scope | Directory |
|---|---|---|
| **Crypto Portfolio Solo** | Individual-use — single user tracks crypto trades vs BTC benchmark | `cyrpto-portfolio-solo/` |


---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | Vanilla HTML + CSS + JavaScript | Replicate CoinMarketCap dark-theme portfolio tracker style. Reference look/style, see [Screenshot_example](../Reference_Materials/Screenshot_example.png) |
| **Charts** | [TradingView Lightweight Charts v5.2](https://tradingview.github.io/lightweight-charts/) | `npm install lightweight-charts` — use `createChart`, `AreaSeries`, `CandlestickSeries` |
| **Backend** | Python 3.14 + [FastAPI](https://fastapi.tiangolo.com/) | Async REST API, Pydantic models, CORS middleware |
| **Database** | [DuckDB](https://duckdb.org/) via Python API | File-based OLAP database — no external server required |
| **Data Feed** | [CoinGecko API](https://docs.coingecko.com/) via `coingecko_sdk` | Pro API key; official Python SDK with built-in retries. (credentials reference in ../Reference_Materials/creds.md) |
| **Python Env** | Shared `.venv/` at workspace root | `source .venv/bin/activate` |

---

## Dev Environment Setup

### Prerequisites
- Python ≥ 3.14 (via shared `.venv/`)
- No Node.js required (Lightweight Charts loaded via CDN)

### Activate the environment
```bash
source .venv/bin/activate     # From workspace root
```

### Install backend dependencies
```bash
source .venv/bin/activate
pip install -r alpha-tracker/requirements.txt
pip install -r thesis-board/requirements.txt
```

---

## Project Structure (per project)

```
<project>/
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt        # Python backend deps
├── package.json            # Frontend deps (lightweight-charts, etc.)
│
├── src/
│   ├── backend/            # FastAPI app
│   │   ├── main.py         # FastAPI entrypoint
│   │   ├── routes/         # API route modules
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic (CoinGecko client, portfolio calc)
│   │   └── db/             # DuckDB schema & queries
│   │
│   └── frontend/           # Static HTML/CSS/JS served by FastAPI
│       ├── index.html
│       ├── css/
│       ├── js/
│       └── assets/
│
├── tests/                  # pytest tests
├── docs/                   # Extended documentation
├── scripts/                # Automation / utilities
├── assets/                 # Images, media
└── data/                   # DuckDB database files, sample data
```

---

## Build & Run Commands

### Start Crypto Portfolio Solo (port 8000)
```bash
source .venv/bin/activate
cd cyrpto-portfolio-solo && uvicorn src.backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Run tests
```bash
source .venv/bin/activate
cd cyrpto-portfolio-solo && pytest tests/ -v
```

### Lint / format
```bash
ruff check src/ tests/
ruff format src/ tests/
```

---

## Code Style Guidelines

### Python (Backend)
- Use **type hints** on all function signatures.
- Use **Pydantic v2 models** for request/response validation.
- Follow **PEP 8**; enforce with `ruff`.
- Use `async def` for all FastAPI route handlers.
- Store the CoinGecko API key in environment variables or a `.env` file — never hardcode secrets in source.
- DuckDB connections: use a single connection per request lifecycle via FastAPI dependency injection.

### JavaScript (Frontend)
- Use **ES modules** (`import`/`export`).
- Use **`const`** by default; `let` only when mutation is required.
- Naming: `camelCase` for variables/functions, `PascalCase` for classes.
- DOM queries: use `document.getElementById()` or `document.querySelector()`.
- All interactive elements must have unique, descriptive `id` attributes.

### CSS
- Dark theme by default (inspired by CoinMarketCap dark mode).
- Use CSS custom properties (`--var-name`) for the design system tokens.
- Mobile-first responsive design with media queries.

---

## API Integration Notes

### CoinGecko API (via `coingecko_sdk`)
- **SDK**: Always use `coingecko_sdk` — never `pycoingecko`, `requests`, or `httpx` for CoinGecko calls.
- **Client**: Initialise a single reusable `AsyncCoingecko` instance; set `max_retries=3`.
- **Auth**: Load `COINGECKO_PRO_API_KEY` from environment variables — never hardcode.
- **Error handling**: Catch `coingecko_sdk.RateLimitError` and `coingecko_sdk.APIError` — never bare `except Exception`.
- **Key SDK methods**:
  - `client.simple.price.get(ids=..., vs_currencies="usd")` — current prices
  - `client.coins.id.market_chart.get(id=..., vs_currency="usd", days=365)` — historical price chart
  - `client.coins.markets.get(vs_currency="usd", order="market_cap_desc")` — ranked coin list
  - `client.search.get(query=...)` — search coins by name/symbol
- **Important**: Never call CoinGecko from client-side JS. Proxy all requests through the FastAPI backend.
- **Rate limits**: Cache responses in DuckDB to minimise API calls. See `coingecko_rules.md` for full SDK rules.

### TradingView Lightweight Charts
- Import: `import { createChart, AreaSeries, LineSeries, CandlestickSeries } from 'lightweight-charts'`
- Data format: `{ time: 'YYYY-MM-DD', value: number }` for line/area; OHLC for candlestick
- Use `chart.timeScale().fitContent()` after setting data.
- Use `series.update(...)` for real-time updates — avoid `setData()` for incremental changes.
- Attribute TradingView per license requirements.

---

## Testing Instructions

- All Python tests use **pytest**.
- Run the full suite: `pytest tests/ -v`
- For a single test: `pytest tests/test_portfolio.py::test_add_trade -v`
- Add or update tests for every code change, even if nobody asked.
- Ensure all tests pass before committing.

---

## Security Considerations

- **API keys** must never be committed to the repository. Use `.env` files (listed in `.gitignore`).
- **CORS**: Configure FastAPI CORS middleware to only allow the frontend origin in production.
- **Input validation**: All user inputs must be validated via Pydantic models before reaching the database.
- **SQL injection**: Use parameterised queries with DuckDB — never string-interpolate user input into SQL.

---

## PR / Commit Instructions

- **Commit message format**: `[project-name] <type>: <description>` (e.g., `[crypto-portfolio-solo] feat: add portfolio summary endpoint`)
- **Types**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Always run `ruff check` and `pytest` before committing.
- Each PR should address a single concern.
