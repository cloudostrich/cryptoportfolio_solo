---
name: duckdb
description: Uses DuckDB for local analytics, embedded SQL workflows, schema design, ingestion, migrations, and efficient query patterns in this project.
---

# Goal

Use this skill when the task involves DuckDB schema design, querying, ingestion, analytics workflows, or embedding DuckDB into backend or local data pipelines.

# When to use

Use this skill when the user asks for:
- DuckDB table design or schema updates
- Local analytics or reporting queries
- Ingestion from CSV, JSON, Parquet, or in-memory dataframes
- Python code that reads or writes DuckDB
- Query optimization for analytical workloads
- Project-specific migration or bootstrapping logic

Do not use this skill for:
- Production OLTP database design better suited to Postgres or MySQL
- ORM-first advice that ignores embedded DuckDB workflows
- Generic SQL tips unrelated to this repository’s data model

# Project assumptions

- DuckDB is the analytical or embedded database for this project.
- Schema and query style should match repository conventions.
- SQL should be reproducible, readable, and safe to rerun when possible.
- Analytical transforms should live in dedicated modules or scripts, not be scattered across unrelated files.

# Workflow

1. Inspect the existing schema, migrations, and query helpers.
2. Determine whether the task is ingestion, transformation, storage, or reporting.
3. Prefer explicit schemas for persisted tables.
4. Keep ingestion logic separate from query-serving logic.
5. Write SQL that is readable, deterministic, and easy to test.
6. Validate edge cases: nulls, timestamp parsing, duplicates, and type coercion.
7. For expensive or repeated logic, extract shared views, macros, or helper functions if the project uses them.
8. Add tests or verification queries for expected outputs.

# Rules

- Use parameterized queries from application code when possible.
- Keep raw staging tables separate from cleaned analytical tables.
- Be explicit about timestamp, timezone, and numeric precision handling.
- Prefer Parquet-friendly and analytics-friendly structures when designing data flows.
- Document primary keys, unique keys, and deduplication logic even if DuckDB does not enforce every constraint the same way as a server database.

# Output expectations

When implementing with this skill:
- Provide clear schema definitions
- Separate staging, normalized, and presentation layers where useful
- Keep queries composable
- Include small verification queries or tests
- Avoid hidden type coercions and magic column naming

# Preferred table design guidance

Use a consistent naming pattern such as:
- `raw_*` for ingestion tables
- `stg_*` for cleaned staging
- `fact_*` for event or metric tables
- `dim_*` for lookup entities
- `vw_*` for reusable views if the project uses them

Document:
- grain of the table
- source of truth
- refresh strategy
- deduplication rule

# References

Load only when needed:
- `references/schema-conventions.md`
- `references/common-queries.md`
- `references/ingestion-patterns.md`
- `references/time-series-notes.md`

# Examples

Useful examples:
- `examples/analytics_query.py`
- `examples/load_parquet.py`
- `examples/create_price_fact_table.sql`

# Constraints

- Do not mix ad hoc notebook-style SQL into route handlers or UI code.
- Do not create silent schema drift.
- Do not rely on implicit casting when parsing financial or timestamp data.
- Do not use DuckDB where the project explicitly requires transactional multi-user database semantics.

# Example tasks

- “Design a DuckDB schema for normalized crypto price history.”
- “Create a query that aggregates hourly OHLC into daily candles.”
- “Ingest CoinGecko chart data into raw and cleaned tables.”