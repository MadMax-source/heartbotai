const fetch = require('node-fetch');

async function fetchSolanaTokens() {
    const url = 'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.tokens;
}

async function fetchMarketCap(coingeckoId) {
    if (!coingeckoId) return null;
    const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.market_data?.market_cap?.usd || null;
}

async function main() {
    const tokens = await fetchSolanaTokens();
    console.log(`Fetched ${tokens.length} tokens.`);
    // Limit to first 5 tokens for demo (remove .slice(0, 5) to process all)
    const sampleTokens = tokens.slice(0, 5);

    for (const token of sampleTokens) {
        const marketCap = await fetchMarketCap(token.extensions?.coingeckoId);
        console.log({
            name: token.name,
            symbol: token.symbol,
            address: token.address,
            coingeckoId: token.extensions?.coingeckoId || null,
            market_cap: marketCap
        });
    }
}

main().catch(err => {
    console.error('Error:', err);
});