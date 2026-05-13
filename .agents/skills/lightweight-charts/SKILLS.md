---
name: lightweight-charts
description: Uses TradingView Lightweight Charts for responsive financial chart rendering, time-series formatting, theming, resizing, and clean frontend integration in this project.
---

# Goal

Use this skill when building, updating, or debugging frontend chart components that use TradingView Lightweight Charts.

# When to use

Use this skill when the task involves:
- Candlestick, line, area, histogram, or baseline charts
- Rendering OHLC or time-series price data
- Chart theming and dark or light mode integration
- Crosshair, tooltip, markers, or timescale behavior
- Responsive resizing and component lifecycle cleanup
- Transforming backend time-series data into chart-ready frontend structures

Do not use this skill for:
- Backend-only analytics without frontend rendering
- General-purpose charting libraries not based on Lightweight Charts
- Highly custom SVG chart systems unless this repo explicitly mixes them

# Project assumptions

- The charting standard for financial visuals in this project is TradingView Lightweight Charts **v5**.
- Data should arrive in a normalized format before it reaches presentation code.
- Theme, sizing, and cleanup behavior should be consistent across all chart components.

## Critical: v5 API (not v4)

This project uses **Lightweight Charts v5**. The v4 convenience methods are **removed**:

```javascript
// ❌ WRONG (v4 — will fail silently, showing only TV logo)
chart.addLineSeries({ color: '#2962FF' });

// ✅ CORRECT (v5 — unified addSeries)
chart.addSeries(LightweightCharts.LineSeries, { color: '#2962FF' });
```

- **Standalone build**: All types are under `LightweightCharts.*` global namespace.
- **ES modules**: Import types directly: `import { LineSeries } from 'lightweight-charts';`
- To hide the TV logo: `layout: { attributionLogo: false }` (Apache 2.0 requires attribution elsewhere).
- Chart initialization should be encapsulated in reusable UI helpers or components.

# Workflow

1. Identify the chart type needed: line, area, candlestick, histogram, or mixed.
2. Check whether the repository already has a base chart component or wrapper.
3. Normalize incoming timestamps and numeric fields before chart creation.
4. Create the chart with project theme settings.
5. Add the minimum necessary series and options.
6. Implement resize handling and teardown cleanup.
7. Verify empty, loading, and error states in the surrounding UI.
8. Confirm that dark and light themes both work.

# Rules

- Keep data transformation separate from rendering code.
- Use one canonical time format across the app.
- Dispose of chart instances on unmount or teardown.
- Avoid duplicating chart creation logic across components.
- Prefer repository-standard wrappers and hooks over direct ad hoc chart setup.

# Output expectations

When implementing with this skill:
- Use a reusable chart setup pattern
- Keep theme tokens centralized
- Handle no-data states gracefully
- Support responsive container resizing
- Ensure price series and volume series use predictable field shapes

# Data shape guidance

For candlesticks, expect fields shaped like:
- `time`
- `open`
- `high`
- `low`
- `close`

For line or area charts, expect:
- `time`
- `value`

For volume:
- `time`
- `value`
- optional color if the project uses directional coloring

# UI integration guidance

- Keep chart container sizing explicit
- Avoid hidden overflow bugs from parent flex layouts
- Recalculate size on mount and resize
- Ensure the chart works with both SSR-aware and client-only frontend patterns used in the repo

# References

Load only when relevant:
- `references/series-types.md`
- `references/theming.md`
- `references/responsive-behavior.md`
- `references/tooltip-patterns.md`

# Examples

Useful examples (all use v5 API):
- `examples/line_chart.js` — Standalone build line chart + CoinGecko data normalization
- `examples/candlestick_chart.js` — OHLC candlestick chart (placeholder)
- `examples/react_chart_component.tsx` — React wrapper (placeholder)

# Constraints

- Do not pass raw backend payloads straight into the chart without normalization.
- Do not leak chart instances or event subscriptions.
- Do not hardcode colors inline if the project has shared theme tokens.
- Do not mix multiple chart setup styles unless the codebase already does so intentionally.

# Example tasks

- “Render BTC daily candlesticks with volume below.”
- “Create a reusable React wrapper for Lightweight Charts.”
- “Fix a chart that breaks on resize inside a flex container.”