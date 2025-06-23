const fetch = require('node-fetch');
const coingeckoId = 'tether';

async function get24hVolume(coingeckoId) {
    const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Error: HTTP ${response.status}`);
            return;
        }
        const data = await response.json();
        const volume = data.market_data?.total_volume?.usd;
        if (volume !== undefined) {
            console.log(`24h Volume: $${volume}`);
        } else {
            console.log('24h volume data not available for this token.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

get24hVolume(coingeckoId);