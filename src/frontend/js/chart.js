/* ─── Chart Module (Lightweight Charts v5) ──────────────────────────────────
 *  Two charts:
 *    1. Holdings chart  – line chart of portfolio / coin price over time
 *    2. Performance chart – two-line overlay: portfolio % return vs BTC % return
 * ──────────────────────────────────────────────────────────────────────────── */

// ─── Theme tokens (shared) ──────────────────────────────────────────────────
const THEME = {
    background: '#181a20',
    text: '#848e9c',
    grid: '#2b3139',
    border: '#2b3139',
    portfolioLine: '#0ecb81',   // green
    btcLine: '#f0b90b',         // gold / BTC orange
    holdingsLine: '#0ecb81',
};

// ─── Holdings Chart ─────────────────────────────────────────────────────────
let holdingsChart = null;
let holdingsSeries = null;

export function initHoldingsChart(container) {
    if (holdingsChart) {
        holdingsChart.remove();
    }

    holdingsChart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight || 300,
        layout: {
            background: { type: 'solid', color: THEME.background },
            textColor: THEME.text,
            attributionLogo: false,
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
            timeVisible: true,
            secondsVisible: false,
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
    });

    holdingsSeries = holdingsChart.addSeries(LightweightCharts.LineSeries, {
        color: THEME.holdingsLine,
        lineWidth: 2,
        priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
        },
    });

    const resizeObserver = new ResizeObserver(() => {
        if (holdingsChart) {
            holdingsChart.applyOptions({
                width: container.clientWidth,
                height: container.clientHeight || 300,
            });
        }
    });
    resizeObserver.observe(container);
}

/**
 * Feed raw CoinGecko market_chart price data into the holdings chart.
 * @param {Array} data - Array of [timestamp_ms, price] pairs from CoinGecko
 */
export function updateHoldingsData(data) {
    if (!holdingsSeries || !data || data.length === 0) return;

    const formatted = normalizeTimeSeries(data);
    holdingsSeries.setData(formatted);
    holdingsChart.timeScale().fitContent();
}

// ─── Performance Chart ──────────────────────────────────────────────────────
let perfChart = null;
let portfolioSeries = null;
let btcSeries = null;

export function initPerformanceChart(container) {
    if (perfChart) {
        perfChart.remove();
    }

    perfChart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight || 300,
        layout: {
            background: { type: 'solid', color: THEME.background },
            textColor: THEME.text,
            attributionLogo: false,
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
            timeVisible: false,
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
    });

    portfolioSeries = perfChart.addSeries(LightweightCharts.LineSeries, {
        color: THEME.portfolioLine,
        lineWidth: 2,
        title: 'Portfolio',
        priceFormat: {
            type: 'custom',
            formatter: (val) => val.toFixed(1) + '%',
        },
    });

    btcSeries = perfChart.addSeries(LightweightCharts.LineSeries, {
        color: THEME.btcLine,
        lineWidth: 2,
        title: 'BTC',
        priceFormat: {
            type: 'custom',
            formatter: (val) => val.toFixed(1) + '%',
        },
    });

    const resizeObserver = new ResizeObserver(() => {
        if (perfChart) {
            perfChart.applyOptions({
                width: container.clientWidth,
                height: container.clientHeight || 300,
            });
        }
    });
    resizeObserver.observe(container);
}

/**
 * Convert raw price series to percentage returns from the first data point.
 * @param {Array} data - Array of [timestamp_ms, price] from CoinGecko
 * @returns {Array} Array of { time, value } where value is % change from start
 */
function toPercentageReturn(data) {
    const points = normalizeTimeSeries(data);
    if (points.length === 0) return [];

    // Find first non-zero value to use as base
    const firstNonZero = points.find(p => p.value !== 0);
    if (!firstNonZero) return points.map(p => ({ time: p.time, value: 0 }));

    const base = firstNonZero.value;
    const baseTime = firstNonZero.time;

    return points.map(p => ({
        time: p.time,
        value: p.time < baseTime ? 0 : ((p.value - base) / base) * 100,
    }));
}

/**
 * Convert portfolio history [ts, val, cost] to percentage PnL.
 */
function toPortfolioPerformance(data) {
    if (!data || data.length === 0) return [];
    
    // Convert and deduplicate
    const points = data.map(p => ({
        time: Math.floor(p[0] / 1000),
        val: p[1],
        cost: p[2]
    })).sort((a, b) => a.time - b.time);

    const unique = [];
    const seen = new Set();
    for (const p of points) {
        if (!seen.has(p.time)) {
            seen.add(p.time);
            const perf = p.cost > 0 ? ((p.val - p.cost) / p.cost) * 100 : 0;
            unique.push({ time: p.time, value: perf });
        }
    }
    return unique;
}

/**
 * Update the performance chart with portfolio and BTC data.
 * @param {Array} portfolioData - Array of [ts, val, cost]
 * @param {Array} btcData - Array of [ts, price]
 */
export function updatePerformanceData(portfolioData, btcData) {
    if (!portfolioSeries || !btcSeries) return;

    if (portfolioData && portfolioData.length > 0) {
        portfolioSeries.setData(toPortfolioPerformance(portfolioData));
    }
    if (btcData && btcData.length > 0) {
        btcSeries.setData(toPercentageReturn(btcData));
    }

    perfChart.timeScale().fitContent();
}

// ─── Allocation (Donut) Chart ──────────────────────────────────────────────
let allocationChart = null;

const CHART_COLORS = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', 
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
];

export function initAllocationChart(canvasId, legendId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Clear existing
    if (allocationChart) {
        allocationChart.destroy();
    }

    allocationChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: CHART_COLORS,
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.raw.toFixed(1)}%`
                    }
                }
            }
        }
    });
}

export function updateAllocationData(holdings, legendId) {
    if (!allocationChart || !holdings) return;

    // Filter and sort holdings
    const valid = holdings
        .filter(h => h.current_value_usd > 0)
        .sort((a, b) => b.current_value_usd - a.current_value_usd);

    const total = valid.reduce((sum, h) => sum + h.current_value_usd, 0);
    
    const labels = valid.map(h => h.coin_name);
    const data = valid.map(h => (h.current_value_usd / total) * 100);

    allocationChart.data.labels = labels;
    allocationChart.data.datasets[0].data = data;
    allocationChart.update();

    // Custom Legend
    const legend = document.getElementById(legendId);
    if (legend) {
        legend.innerHTML = '';
        valid.forEach((h, i) => {
            const pct = ((h.current_value_usd / total) * 100).toFixed(2);
            const row = document.createElement('div');
            row.className = 'legend-row';
            row.innerHTML = `
                <div class="legend-left">
                    <div class="legend-color" style="background-color: ${CHART_COLORS[i % CHART_COLORS.length]}"></div>
                    <span>${h.coin_name}</span>
                </div>
                <span class="legend-pct">${pct}%</span>
            `;
            legend.appendChild(row);
        });
    }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Normalize CoinGecko [timestamp_ms, value] pairs into Lightweight Charts format.
 * Deduplicates and sorts by time.
 */
function normalizeTimeSeries(data) {
    const formatted = data.map(point => ({
        time: Math.floor(point[0] / 1000),
        value: point[1],
    }));

    formatted.sort((a, b) => a.time - b.time);

    // Deduplicate by timestamp
    const unique = [];
    const seen = new Set();
    for (const pt of formatted) {
        if (!seen.has(pt.time)) {
            seen.add(pt.time);
            unique.push(pt);
        }
    }
    return unique;
}
