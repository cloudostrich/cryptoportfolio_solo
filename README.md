# Alpha Tracker (Crypto Portfolio Solo)

## Overview
### Inspiration
This project is inspired by the [CoinMarketCap Portfolio Tracker](https://coinmarketcap.com/portfolio-tracker/). We aimed to capture its intuitive design and seamless tracking experience while building a fully localized, private alternative.

### Problem
- **Who is affected?**: People who invest in cryptocurrency and want a simple way to track their different coins and see how they are performing.
- **What is the issue?**: While popular web-based tools like the [CoinMarketCap Portfolio Tracker](https://coinmarketcap.com/portfolio-tracker/) offer great features, many users are forced to choose between sharing their financial data with third-party platforms or managing complex, manual spreadsheets to maintain privacy.

### Outcome
- **What was achieved?**:

| Objective | Solution | Result |
| :--- | :--- | :--- |
| Real-time price tracking for all supported cryptocurrencies | Use CoinGecko API | Success |
| Interactive, fast and efficient chart | Lightweight Chart library | Success |
| Persistent record of portfolio | Use DuckDB for database | Success |
| Intuitive, seamless user experience with minimal load times | FastAPI driving a lightweight, browser-native frontend | Success |
- **Measurable results (if any)**: 
  
  | Metric / Feature | Manual Process | Alpha Tracker Result |
  | :--- | :--- | :--- |
  | **Data Privacy** | Cloud/third-party dependent | **100% Local Privacy** (runs entirely on your computer) |
  | **User Experience** | Fragmented, complex spreadsheets | **Seamless** (CoinMarketCap-inspired interface) |
  | **Price Updates** | Seconds/minutes to manually lookup | **~0.25 seconds** (via automated API) |
  | **Coin Searches** | Seconds/minutes to manually lookup | **~0.66 seconds** (via automated API) |

---
## Demo
- **How does the solution work from the user’s perspective**:
  1. You open the app and see a clean, dark-themed dashboard showing all the coins you own, your total money, and your overall profit or loss.
  2. You can search for any cryptocurrency to add it to your tracker.
  3. You log when you buy or sell a coin, including how much you bought and the price.
  4. The dashboard instantly updates with live market prices and recalculates your profits.
  5. A line chart shows you how your portfolio's value has changed over time, and compares it side-by-side with Bitcoin.
  6. The "Your Holdings" table provides a breakdown of all current assets, displaying the total amount, current market price, overall value, and performance (P&L) for each asset.
  7. The "Trade History" table serves as an audit log of all past transactions, offering details of every buy and sell alongside the functionality to delete specific trades.

- **Demo Media**:
  ![Dashboard Screenshot](./assets/screenshot_solo.png)

---
## Technology Stack
### Frontend components:
- **HTML/CSS/JS**: The core web technologies used to build the responsive, interactive, and beautifully dark-themed user interface.
- **TradingView Lightweight Charts**: A popular tool we use to draw the smooth, interactive performance graphs.

### Backend components:
- **Python & FastAPI**: The "brain" behind the scenes that securely handles your requests, talks to the internet to get live prices, and handles all the math.
- **DuckDB**: A super-fast, simple database that lives directly on your computer to securely save your trade history.
- **CoinGecko API**: The external service we connect to in order to fetch accurate, up-to-the-second cryptocurrency prices.

---
## Development Approach with AI
- **List of AI tools, services, models, and their purposes**:
  - **Antigravity (Gemini 3.1 Pro)**: Our AI coding assistant that helped design the project, write the code, set up the database, and build the user interface.
- **List of AI agents, including roles and skills**:
  - **Antigravity Agent**: Acted as our lead developer, using its ability to understand the whole project to write code and test it automatically.
- **List of key prompts used**:
  - "Build a complete Crypto Portfolio Solo web application from scratch using Python (FastAPI), DuckDB, and TradingView Lightweight Charts."
  - "Enhance the crypto portfolio tracker by implementing real-time data updates, improving performance visualizations, and adding interactive dashboard controls."
- **List of key review points and the corresponding decision made**:
  - *Review Point*: How should we save the user's data? *Decision*: We chose DuckDB because it saves everything in a simple file on your computer, meaning you don't need to set up a complicated database server.
  - *Review Point*: How do we stop the price provider (CoinGecko) from blocking us for asking for prices too often? *Decision*: We made the backend "brain" handle the requests and remember the prices for a little while, so the dashboard doesn't constantly ask CoinGecko for the same price.

---
## Installation
Steps to download and set up the project on your computer:
```bash
# 1. Download the project code to your computer
git clone https://github.com/cloudostrich/cryptoportfolio_solo.git
# 2. Open the project folder
cd cryptoportfolio_solo
# 3. Create a clean workspace for Python to install tools
python3 -m venv .venv
```

Steps to run the project for the first time:

```bash
# 1. Turn on your Python workspace
source .venv/bin/activate

# 2. Install all the necessary tools (if you haven't already)
pip install -r requirements.txt

# 3. Set up your secret passwords and settings
cp .env.example .env
# Open the .env file in a text editor and add your COINGECKO_DEMO_API_KEY

# 4. Set up the local database to save your trades
python -m src.backend.db.init_db
```

---
## Usage

### Starting the Application
How to start and use the application:

```bash
source .venv/bin/activate

# Start the application server
uvicorn src.backend.main:app --reload --host 0.0.0.0 --port 8000
```
- Open `http://localhost:8000` in your web browser.
- Use the screen to search for coins, log your trades, and view your charts.
- *For advanced users*: All API endpoints (the hidden messengers fetching your data) are available to review and interact with at `http://localhost:8000/docs`. Since we are using FastAPI, the technical details of generating this documentation are automatically taken care of for us behind the scenes.

### Testing

To ensure the application is functioning correctly, you can run the automated test suite.

**1. Run the Full Test Suite:**
This runs all automated tests for the backend logic and API routes without making any live external requests.
```bash
source .venv/bin/activate
pytest tests/ -v
```

**2. Run the Live CoinGecko API Speed Tests:**
This specifically tests the connection to the live CoinGecko API to ensure correct data retrieval and measures the response speed.
```bash
source .venv/bin/activate
pytest tests/test_coingecko_live.py -v -s
```

---
## Project Structure
- `.agents/`: Contains configurations, prompts, and memory files utilized by the Antigravity AI agent.
- `assets/`: Directory storing static media assets, such as screenshots used in the project documentation.
- `src/backend/`: The hidden "brain" of the app, including the main program, the logic, and database connections.
- `src/frontend/`: The visual parts of the app that you see in your browser (the design and buttons).
- `tests/`: Automated checks to make sure the app doesn't break.
- `data/`: The folder on your computer where your personal trade data is safely saved.
- `docs/` & `scripts/`: Collection of external guides, project guidelines, and extra helpful scripts for keeping the project running smoothly.

---
## Reflection
- **What worked**: Using a simple file-based database (DuckDB) made the app super easy to set up without making it slow. The charts from TradingView look great and are very responsive.
- **What failed**: At first, we tried getting live prices straight from the browser, but the provider blocked us for asking too often, and it wasn't secure.
- **Changes made**: We moved all price-checking to the backend "brain" of the app. It now asks for prices carefully and remembers them for a bit to avoid getting blocked.
- **Rationale**: We wanted to make sure the app was secure, fast, and never broke down or stopped showing prices for the user.
