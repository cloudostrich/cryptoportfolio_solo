import { 
    fetchTrades, 
    addTrade, 
    deleteTrade, 
    fetchPortfolioSummary, 
    searchCoins, 
    fetchMarketHistory, 
    fetchPortfolioHistory,
    fetchCoinPrice,
    deleteCoin
} from './api.js';

import { 
    initHoldingsChart, 
    updateHoldingsData, 
    initPerformanceChart, 
    updatePerformanceData,
    initAllocationChart,
    updateAllocationData
} from './chart.js';

// DOM Elements
const totalValueEl = document.getElementById('total-value');
const totalPnlEl = document.getElementById('total-pnl');
const holdingsBody = document.getElementById('holdings-body');
const tradesBody = document.getElementById('trades-body');
const tradeForm = document.getElementById('trade-form');
const coinSearch = document.getElementById('coin-search');
const searchResults = document.getElementById('search-results');
const chartTitleCoin = document.getElementById('chart-title-coin');
const mainChartTitle = document.getElementById('main-chart-title');
const historyView = document.getElementById('history-view');
const allocationView = document.getElementById('allocation-view');

// State
let debounceTimer;
let currentChartDays = 30;
let currentMainView = 'history'; // 'history' or 'allocation'

// Utilities
function formatUsd(val) {
    if (typeof val !== 'number') val = 0;
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
    }).format(val);
}

function formatPct(val) {
    if (typeof val !== 'number') val = 0;
    return new Intl.NumberFormat('en-US', { 
        style: 'percent', 
        minimumFractionDigits: 2 
    }).format(val / 100);
}

// ─── Dashboard Logic ────────────────────────────────────────────────────────

async function loadDashboard() {
    try {
        console.log("Loading dashboard...");
        document.body.classList.add('loading-data');
        
        const [summary, trades] = await Promise.all([
            fetchPortfolioSummary(),
            fetchTrades()
        ]);

        renderSummary(summary);
        renderTrades(trades);

        // Load charts
        await Promise.all([
            loadHoldingsChart(currentChartDays),
            loadPerformanceChart(),
            updateAllocationData(summary.holdings, 'allocation-legend')
        ]);
        console.log("Dashboard loaded successfully");
    } catch (e) {
        console.error("Error loading dashboard:", e);
    } finally {
        document.body.classList.remove('loading-data');
    }
}

async function loadHoldingsChart(days) {
    if (chartTitleCoin) chartTitleCoin.textContent = `- Total Portfolio Value`;
    const container = document.getElementById('holdings-chart-container');
    if (container) container.style.opacity = '0.6';
    currentChartDays = days;

    try {
        const data = await fetchPortfolioHistory(days);
        if (data && data.length > 0) {
            updateHoldingsData(data);
        } else {
            console.warn("No portfolio history data available for holdings chart");
        }
    } catch (e) {
        console.error("Error loading holdings chart:", e);
    } finally {
        if (container) container.style.opacity = '1';
    }
}

async function loadPerformanceChart() {
    const container = document.getElementById('perf-chart-container');
    if (container) container.style.opacity = '0.6';
    try {
        const [portfolioData, btcData] = await Promise.all([
            fetchPortfolioHistory(180),
            fetchMarketHistory('bitcoin', 180)
        ]);
        updatePerformanceData(portfolioData, btcData);
    } catch (e) {
        console.error("Error loading performance chart:", e);
    } finally {
        if (container) container.style.opacity = '1';
    }
}

// ─── Rendering ──────────────────────────────────────────────────────────────

function renderSummary(summary) {
    if (!summary) return;
    
    if (totalValueEl) totalValueEl.textContent = formatUsd(summary.total_value_usd);
    if (totalPnlEl) {
        totalPnlEl.textContent = `${formatUsd(summary.total_pnl_usd)} (${formatPct(summary.total_pnl_percentage)})`;
        totalPnlEl.className = summary.total_pnl_usd >= 0 ? 'stat-value positive' : 'stat-value negative';
    }

    if (holdingsBody) {
        holdingsBody.innerHTML = '';
        if (summary.holdings) {
            summary.holdings.forEach(h => {
                const tr = document.createElement('tr');
                const pnlClass = h.pnl_usd >= 0 ? 'positive' : 'negative';
                tr.innerHTML = `
                    <td><strong>${h.coin_name}</strong> <span class="coin-symbol">${h.coin_symbol.toUpperCase()}</span></td>
                    <td>${h.total_amount.toFixed(4)}</td>
                    <td>${formatUsd(h.average_buy_price)}</td>
                    <td>${formatUsd(h.current_price_usd)}</td>
                    <td>${formatUsd(h.current_value_usd)}</td>
                    <td class="${pnlClass}">${formatUsd(h.pnl_usd)} (${formatPct(h.pnl_percentage)})</td>
                    <td><button class="btn btn-danger btn-sm btn-delete-holding" data-id="${h.coin_id}">Delete</button></td>
                `;
                holdingsBody.appendChild(tr);
            });
        }
    }

    // Attach delete listeners for holdings
    document.querySelectorAll('.btn-delete-holding').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const coinId = e.target.getAttribute('data-id');
            if (confirm(`Are you sure you want to delete all trades for ${coinId}? This will remove the coin from your portfolio.`)) {
                try {
                    await deleteCoin(coinId);
                    loadDashboard();
                } catch (err) {
                    console.error("Error deleting coin:", err);
                    alert("Error deleting coin");
                }
            }
        });
    });
}

function renderTrades(trades) {
    if (!tradesBody || !trades) return;
    
    tradesBody.innerHTML = '';
    trades.forEach(t => {
        const tr = document.createElement('tr');
        const date = new Date(t.timestamp).toLocaleString();
        const typeColor = t.trade_type === 'buy' ? 'var(--success)' : 'var(--danger)';
        tr.innerHTML = `
            <td>${date}</td>
            <td style="color:${typeColor};font-weight:bold;text-transform:uppercase;">${t.trade_type}</td>
            <td>${t.coin_name} (${t.coin_symbol.toUpperCase()})</td>
            <td>${t.amount}</td>
            <td>${formatUsd(t.price_usd)}</td>
            <td><button class="btn btn-danger btn-sm" data-id="${t.id}">Delete</button></td>
        `;
        tradesBody.appendChild(tr);
    });

    // Re-attach delete listeners
    tradesBody.querySelectorAll('.btn-danger').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm("Are you sure you want to delete this trade?")) {
                await deleteTrade(id);
                loadDashboard();
            }
        });
    });
}

// ─── Event Listeners ────────────────────────────────────────────────────────

// Main Chart Toggle (History vs Allocation)
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        currentMainView = view;
        
        // Update Buttons
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update Views
        if (view === 'history') {
            if (historyView) historyView.classList.remove('hidden');
            if (allocationView) allocationView.classList.add('hidden');
            if (mainChartTitle) mainChartTitle.innerHTML = `History <span id="chart-title-coin" class="chart-subtitle"></span>`;
        } else {
            if (historyView) historyView.classList.add('hidden');
            if (allocationView) allocationView.classList.remove('hidden');
            if (mainChartTitle) mainChartTitle.innerHTML = `Allocation`;
        }
    });
});

// Timeframe tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const days = parseInt(btn.getAttribute('data-days'));
        loadHoldingsChart(days);
    });
});

// Coin Search with Debounce
if (coinSearch) {
    coinSearch.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const q = e.target.value.trim();
        if (q.length < 2) {
            if (searchResults) searchResults.classList.add('hidden');
            return;
        }
        
        debounceTimer = setTimeout(async () => {
            try {
                const results = await searchCoins(q);
                if (searchResults) {
                    searchResults.innerHTML = '';
                    if (results && results.length > 0) {
                        results.slice(0, 10).forEach(c => {
                            const li = document.createElement('li');
                            li.innerHTML = `<span>${c.name}</span> <span class="coin-symbol">${c.symbol.toUpperCase()}</span>`;
                            li.addEventListener('click', async () => {
                                document.getElementById('selected-coin-id').value = c.id;
                                document.getElementById('selected-coin-symbol').value = c.symbol;
                                document.getElementById('selected-coin-name').value = c.name;
                                coinSearch.value = `${c.name} (${c.symbol.toUpperCase()})`;
                                searchResults.classList.add('hidden');

                                // Fetch and populate current price
                                try {
                                    const { price } = await fetchCoinPrice(c.id);
                                    if (price) {
                                        document.getElementById('price').value = price;
                                    }
                                } catch (err) {
                                    console.error("Error fetching coin price:", err);
                                }
                            });
                            searchResults.appendChild(li);
                        });
                        searchResults.classList.remove('hidden');
                    } else {
                        searchResults.classList.add('hidden');
                    }
                }
            } catch (err) {
                console.error("Search error:", err);
            }
        }, 300);
    });
}

// Close search results on outside click
document.addEventListener('click', (e) => {
    if (searchResults && !e.target.closest('.form-group')) {
        searchResults.classList.add('hidden');
    }
});

// Trade Form Submit
if (tradeForm) {
    tradeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const trade = {
            coin_id: document.getElementById('selected-coin-id').value,
            coin_symbol: document.getElementById('selected-coin-symbol').value,
            coin_name: document.getElementById('selected-coin-name').value,
            amount: parseFloat(document.getElementById('amount').value),
            price_usd: parseFloat(document.getElementById('price').value),
            trade_type: document.getElementById('type').value
        };

        if (!trade.coin_id) {
            alert("Please select a coin from the search dropdown.");
            return;
        }

        try {
            await addTrade(trade);
            tradeForm.reset();
            document.getElementById('selected-coin-id').value = '';
            document.getElementById('selected-coin-symbol').value = '';
            document.getElementById('selected-coin-name').value = '';
            loadDashboard();
        } catch (err) {
            console.error("Error adding trade:", err);
            alert("Error adding trade. Please check console for details.");
        }
    });
}

// ─── Initialization ─────────────────────────────────────────────────────────

function init() {
    const holdingsContainer = document.getElementById('holdings-chart-container');
    const perfContainer = document.getElementById('perf-chart-container');

    if (holdingsContainer) initHoldingsChart(holdingsContainer);
    if (perfContainer) initPerformanceChart(perfContainer);
    
    // Init Allocation Chart
    initAllocationChart('allocation-chart', 'allocation-legend');

    loadDashboard();
}

// Refresh Button
const refreshBtn = document.getElementById('refresh-btn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        loadDashboard();
    });
}

// Start app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
