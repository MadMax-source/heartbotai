const fetch = require('node-fetch');

async function fetchTokenMarketData(coingeckoId) {
    const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return {
        name: data.name,
        symbol: data.symbol,
        market_cap: data.market_data.market_cap.usd,
        liquidity: data.liquidity_score // Not actual liquidity, but a proxy
    };
}

// Example usage:
fetchTokenMarketData('solana')
    .then(console.log)
    .catch(console.error);