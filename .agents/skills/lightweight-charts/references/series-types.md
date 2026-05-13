# Series Types (Lightweight Charts v5)

> Reference for all built-in series types available in TradingView Lightweight Charts v5.

## v5 API Pattern

In v5, all series are created with the unified `addSeries()` method:

```javascript
// Standalone build (global namespace)
const series = chart.addSeries(LightweightCharts.LineSeries, { /* options */ });

// ES module import
import { createChart, LineSeries } from 'lightweight-charts';
const series = chart.addSeries(LineSeries, { /* options */ });
```

> **Migration note**: The v4 methods `addLineSeries()`, `addAreaSeries()`, etc. are **removed** in v5.

---

## Line Series

Simple line connecting data points. Best for price trends and portfolio value.

```javascript
const series = chart.addSeries(LightweightCharts.LineSeries, {
    color: '#2962FF',
    lineWidth: 2,
    lineStyle: 0,  // 0=Solid, 1=Dotted, 2=Dashed, 3=LargeDashed
    crosshairMarkerVisible: true,
});
```

**Data shape**: `{ time, value }`

---

## Area Series

Line with a filled gradient beneath. Good for highlighting cumulative value.

```javascript
const series = chart.addSeries(LightweightCharts.AreaSeries, {
    topColor: 'rgba(41, 98, 255, 0.5)',
    bottomColor: 'rgba(41, 98, 255, 0.0)',
    lineColor: '#2962FF',
    lineWidth: 2,
});
```

**Data shape**: `{ time, value }`

---

## Candlestick Series

OHLC bars. Standard for crypto/stock price action.

```javascript
const series = chart.addSeries(LightweightCharts.CandlestickSeries, {
    upColor: '#0ecb81',
    downColor: '#f6465d',
    borderUpColor: '#0ecb81',
    borderDownColor: '#f6465d',
    wickUpColor: '#0ecb81',
    wickDownColor: '#f6465d',
});
```

**Data shape**: `{ time, open, high, low, close }`

---

## Bar Series

OHLC bars displayed as vertical lines with ticks.

```javascript
const series = chart.addSeries(LightweightCharts.BarSeries, {
    upColor: '#0ecb81',
    downColor: '#f6465d',
});
```

**Data shape**: `{ time, open, high, low, close }`

---

## Histogram Series

Vertical bars from baseline. Common for volume or delta indicators.

```javascript
const series = chart.addSeries(LightweightCharts.HistogramSeries, {
    color: '#26a69a',
    priceFormat: { type: 'volume' },
    priceScaleId: 'volume',
});

// Per-bar coloring
series.setData([
    { time: '2025-01-01', value: 1000, color: '#0ecb81' },
    { time: '2025-01-02', value: 1500, color: '#f6465d' },
]);
```

**Data shape**: `{ time, value }` (optional `color` per bar)

---

## Baseline Series

Line with two colors above/below a base value. Good for profit/loss display.

```javascript
const series = chart.addSeries(LightweightCharts.BaselineSeries, {
    baseValue: { type: 'price', price: 0 },
    topLineColor: '#0ecb81',
    topFillColor1: 'rgba(14, 203, 129, 0.3)',
    topFillColor2: 'rgba(14, 203, 129, 0.0)',
    bottomLineColor: '#f6465d',
    bottomFillColor1: 'rgba(246, 70, 93, 0.0)',
    bottomFillColor2: 'rgba(246, 70, 93, 0.3)',
});
```

**Data shape**: `{ time, value }`

---

## Common Options

All series support these shared options:

| Option          | Type     | Description                        |
|-----------------|----------|------------------------------------|
| `title`         | string   | Label shown on the price scale     |
| `visible`       | boolean  | Show/hide the series               |
| `priceScaleId`  | string   | Which price scale to use           |
| `priceFormat`   | object   | Number formatting config           |
| `lastValueVisible` | boolean | Show last value label           |

### Price Format Types

```javascript
// USD price
priceFormat: { type: 'price', precision: 2, minMove: 0.01 }

// Volume
priceFormat: { type: 'volume' }

// Percentage
priceFormat: { type: 'custom', formatter: (val) => val.toFixed(1) + '%' }
```
