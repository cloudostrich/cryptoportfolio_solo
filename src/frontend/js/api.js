export async function fetchTrades() {
    const res = await fetch('/api/trades');
    return res.json();
}

export async function addTrade(trade) {
    const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function deleteTrade(id) {
    const res = await fetch(`/api/trades/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function fetchPortfolioSummary() {
    const res = await fetch('/api/portfolio/summary');
    return res.json();
}

export async function searchCoins(query) {
    const res = await fetch(`/api/market/search?query=${encodeURIComponent(query)}`);
    return res.json();
}

export async function fetchMarketHistory(coinId, days = 365) {
    const res = await fetch(`/api/market/history/${coinId}?days=${days}`);
    return res.json();
}

export async function fetchPortfolioHistory(days = 365) {
    const res = await fetch(`/api/portfolio/chart?days=${days}`);
    return res.json();
}

export async function fetchCoinPrice(coinId) {
    const res = await fetch(`/api/market/price/${coinId}`);
    return res.json();
}

export async function deleteCoin(coinId) {
    const res = await fetch(`/api/portfolio/coin/${coinId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
