# Design Innovation Methodology (The 4 D's)

This document outlines how the **Alpha Tracker (Crypto Portfolio Solo)** project aligns with the DI Method Cards (2022) framework. The project was developed following the Double Diamond model's four phases:

### 1. Discover
- **Focus**: Empathizing with users and deeply understanding the problem space.
- **Context & Needs**: Crypto investors and traders often struggle to track multiple assets, calculate real-time profit and loss with cost basis, and compare performance against benchmarks (like BTC) without relying on disconnected tools, paid cloud services, or complex manual spreadsheets. There is a strong need for data privacy and local ownership.

### 2. Define
- **Focus**: Synthesizing findings to frame the opportunity and set concrete specifications.
- **Opportunity Statement**: Create a secure, self-hosted portfolio tracker that provides automated P&L calculations and benchmark visualizations, ensuring complete data privacy with zero reliance on cloud-based databases.
- **Design Criteria**: Must run locally, must have a premium dark-themed UI, must fetch real-time data securely without client-side API leaks.

### 3. Develop
- **Focus**: Ideation, technical design, and prototyping solutions within the defined constraints.
- **Execution & Architecture**:
  - Designed a dark-themed UI (inspired by industry leaders like CoinMarketCap) to ensure a premium user experience.
  - Built the backend using **Python 3.14 + FastAPI** to efficiently proxy external requests.
  - Selected **DuckDB** for fast, local OLAP data storage, eliminating the need for a separate database server.
  - Integrated **TradingView Lightweight Charts** for high-performance historical data rendering and benchmark overlay.

### 4. Deliver
- **Focus**: Refining, testing, and launching a reliable product while reducing the risk of failure.
- **Outcome & Refinement**: 
  - Iteratively tested and successfully proxied the **CoinGecko Pro API** through the backend to handle rate limiting securely and prevent API key exposure. 
  - Delivered a fully functional, locally-hosted web application backed by automated test suites (`pytest`), ensuring a robust, deployment-ready product for end-users.
