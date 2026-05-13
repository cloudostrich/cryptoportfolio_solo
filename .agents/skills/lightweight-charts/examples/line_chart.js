// ─── Line Chart Example (Lightweight Charts v5 – Standalone Build) ──────────
//
// This example creates a simple line chart using the global LightweightCharts
// namespace (standalone production build). For ES module usage, replace
// `LightweightCharts.X` with named imports from 'lightweight-charts'.
//
// Usage: Include the standalone script in your HTML first:
//   <script src="https://unpkg.com/lightweight-charts@5/dist/lightweight-charts.standalone.production.js"></script>

function createLineChart(containerId) {
    const container = document.getElementById(containerId);

    // 1. Create chart with dark theme
    const chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 300,
        layout: {
            background: { type: 'solid', color: '#181a20' },
            textColor: '#848e9c',
            attributionLogo: false,
        },
        grid: {
            vertLines: { color: '#2b3139' },
            horzLines: { color: '#2b3139' },
        },
        rightPriceScale: { borderColor: '#2b3139' },
        timeScale: { borderColor: '#2b3139' },
    });

    // 2. Add a line series (v5 API: addSeries + type class)
    const lineSeries = chart.addSeries(LightweightCharts.LineSeries, {
        color: '#0ecb81',
        lineWidth: 2,
    });

    // 3. Set data — each point needs { time, value }
    //    time can be a UNIX timestamp (seconds) or 'YYYY-MM-DD' string
    lineSeries.setData([
        { time: '2025-01-01', value: 100 },
        { time: '2025-01-02', value: 105 },
        { time: '2025-01-03', value: 102 },
        { time: '2025-01-04', value: 110 },
        { time: '2025-01-05', value: 108 },
    ]);

    // 4. Fit the time range to show all data
    chart.timeScale().fitContent();

    // 5. Handle responsive resizing
    const resizeObserver = new ResizeObserver(() => {
        chart.applyOptions({ width: container.clientWidth });
    });
    resizeObserver.observe(container);

    // Return chart instance for external cleanup
    return chart;
}

// ─── CoinGecko Data Integration ─────────────────────────────────────────────
//
// CoinGecko market_chart API returns prices as [[timestamp_ms, price], ...].
// Convert to Lightweight Charts format before setting data:

function coinGeckoToLineData(rawPrices) {
    const formatted = rawPrices.map(([timestampMs, price]) => ({
        time: Math.floor(timestampMs / 1000),  // Convert ms → seconds
        value: price,
    }));

    // Sort and deduplicate by timestamp
    formatted.sort((a, b) => a.time - b.time);
    const seen = new Set();
    return formatted.filter(pt => {
        if (seen.has(pt.time)) return false;
        seen.add(pt.time);
        return true;
    });
}
