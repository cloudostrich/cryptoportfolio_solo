# Theming (Lightweight Charts v5)

> Dark and light theme configuration patterns for this project.

## Project Dark Theme Tokens

These are the canonical theme values used across all charts in this project:

```javascript
const THEME = {
    background: '#181a20',    // --bg-card
    text: '#848e9c',          // --text-secondary
    grid: '#2b3139',          // --border
    border: '#2b3139',
    portfolioLine: '#0ecb81', // --success (green)
    btcLine: '#f0b90b',       // --btc-gold
    holdingsLine: '#0ecb81',
    danger: '#f6465d',        // --danger (red)
    accent: '#fcd535',        // --accent (yellow)
};
```

## Applying Theme to Chart

```javascript
const chart = LightweightCharts.createChart(container, {
    layout: {
        background: { type: 'solid', color: THEME.background },
        textColor: THEME.text,
        attributionLogo: false,  // hide TV logo (requires attribution elsewhere)
    },
    grid: {
        vertLines: { color: THEME.grid },
        horzLines: { color: THEME.grid },
    },
    rightPriceScale: {
        borderColor: THEME.border,
    },
    timeScale: {
        borderColor: THEME.border,
    },
});
```

## Key Notes

- `attributionLogo: false` hides the TradingView watermark/logo. Per the Apache 2.0 license, you must provide attribution elsewhere (e.g., a footer link).
- `background.type` must be `'solid'` for a flat color. Gradient backgrounds are not natively supported.
- All color values should reference the centralized theme tokens, not be hardcoded inline in chart creation calls.

## Light Theme (Alternative)

If the project ever needs a light mode:

```javascript
const LIGHT_THEME = {
    background: '#ffffff',
    text: '#333333',
    grid: '#e0e0e0',
    border: '#d1d4dc',
};
```
