# Agent Workflow Guide

This document provides step-by-step instructions for AI agents on how to execute common tasks in this repository.

## 1. Adding a New API Endpoint

1.  **Define the Model**: Create request and response schemas using Pydantic in `src/backend/models/`.
2.  **Database Logic (if needed)**: Add any new DuckDB queries or schema migrations in `src/backend/db/`.
3.  **Service Logic**: Implement the core business logic (e.g., fetching from CoinGecko, crunching numbers) in `src/backend/services/`.
4.  **Route Handler**: Add the FastAPI route in `src/backend/routes/`. Inject dependencies (like the DB connection or CoinGecko client) as needed.
5.  **Write Tests**: Add a test in `tests/` using `pytest` and `TestClient` to verify the endpoint works and handles errors correctly.

## 2. Adding a New Frontend Feature

1.  **HTML Structure**: Add the necessary semantic HTML elements to `src/frontend/index.html`. Ensure all interactive elements have unique `id` attributes.
2.  **Styling**: Add CSS in `src/frontend/css/index.css`. Use existing CSS variables for colors to maintain the dark theme.
3.  **Logic**: Implement the feature in `src/frontend/js/`.
    - If it involves calling the backend, add an API utility function.
    - Keep DOM manipulation functions clean and separate from data fetching.
4.  **Charting (if applicable)**: If adding a chart, use Lightweight Charts v5. Prepare the data into the correct format (e.g., `time`, `value`) before passing it to the chart series.
