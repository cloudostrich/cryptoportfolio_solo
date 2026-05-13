---
name: fastapi
description: Uses FastAPI for backend routes, request and response models, dependency injection, validation, error handling, and service-layer integration in this project.
---

# Goal

Use this skill when building or modifying FastAPI-based backend functionality in this repository.

# When to use

Use this skill when the user asks for:
- New API routes or route refactors
- Request or response model design
- FastAPI dependency injection patterns
- Validation and error handling
- Service-layer integration from HTTP endpoints
- Background tasks, middleware, or API structure changes
- FastAPI tests and route-level debugging

Do not use this skill for:
- Pure library code with no FastAPI touchpoints
- Framework-agnostic backend advice when the project is clearly FastAPI-based
- Frontend API consumption logic

# Project assumptions

- FastAPI is the backend framework for this project.
- Route handlers should stay thin.
- Business logic belongs in services, not directly in endpoints.
- Request and response models should be explicit and typed.
- Validation and error behavior should be consistent across the app.

# Workflow

1. Identify whether the task belongs in a router, schema, service, dependency, or middleware.
2. Inspect the repository for existing route organization and naming conventions.
3. Reuse established patterns for routers, tags, prefixes, and dependencies.
4. Define or update Pydantic request and response models.
5. Keep route handlers focused on validation, orchestration, and response mapping.
6. Move data access and domain logic into services or repositories if that pattern exists.
7. Return clear HTTP status codes and structured error responses.
8. Add or update tests for success, validation failure, and not-found or conflict cases.

# Rules

- Keep endpoints thin and predictable.
- Do not embed complex business logic directly in route handlers.
- Use typed request and response models.
- Keep dependency wiring explicit.
- Standardize error payloads and status codes.
- Validate external data before passing it into domain logic.
- Prefer async patterns only where the project already supports them correctly.

# Output expectations

When implementing with this skill:
- Define clear routers and route prefixes
- Use Pydantic models for request and response contracts
- Reuse service-layer abstractions
- Add tests for main and failure paths
- Keep imports and module boundaries clean

# API design guidance

Prefer:
- `/health` for health checks
- versioned routes if the project already versions APIs
- clear nouns and stable response shapes
- explicit models rather than undocumented dict payloads

For errors:
- use appropriate HTTP status codes
- return structured details
- avoid leaking internal exceptions to clients

# References

Load only when relevant:
- `references/routing-patterns.md`
- `references/pydantic-models.md`
- `references/error-handling.md`
- `references/testing-patterns.md`

# Examples

Useful examples:
- `examples/router_example.py`
- `examples/service_pattern.py`
- `examples/request_response_models.py`

# Constraints

- Do not place large business workflows directly inside endpoints.
- Do not return inconsistent payload shapes across similar endpoints.
- Do not bypass shared dependencies or auth checks used elsewhere in the repository.
- Do not introduce framework patterns that clash with the existing project structure.

# Example tasks

- “Create a FastAPI endpoint that returns normalized market data from DuckDB.”
- “Refactor a route so validation lives in Pydantic models and business logic moves to a service.”
- “Add structured error handling to a price-history endpoint.”