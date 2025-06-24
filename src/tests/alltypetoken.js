const fetch = require('node-fetch');

const BIRDEYE_API_KEY = 'd8ff109a1d4a43ec9b0dcd623f83f13e'; 
async function fetchAllTokensFromBirdeye() {
    let page = 1;
    let hasMore = true;
    const allTokens = [];

    while (hasMore) {
        const url = `https://public-api.birdeye.so/v1/tokens/list?sort_by=volume_24h&sort_type=desc&page=${page}&limit=1000`;
        const response = await fetch(url, {
            headers: {
                'accept': 'application/json',
                'X-API-KEY': BIRDEYE_API_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.data && data.data.tokens && data.data.tokens.length > 0) {
            allTokens.push(...data.data.tokens);
            page += 1;
        } else {
            hasMore = false;
        }
    }
    return allTokens;
}

(async () => {
    const tokens = await fetchAllTokensFromBirdeye();
    console.log(`Fetched ${tokens.length} tokens (including Pump.fun and others).`);
    // Print first 5 tokens as a sample
    console.log(tokens.slice(0, 5));
})();