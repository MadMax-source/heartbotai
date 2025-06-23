// Script to fetch metadata for a Solana token using Solscan API

const fetch = require('node-fetch');

async function getTokenMetadata(tokenMint) {
    const url = `https://public-api.solscan.io/v2/token/meta?tokenAddress=${tokenMint}`;
    const response = await fetch(url, {
        headers: {
            'accept': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// Usage example:
getTokenMetadata('Es9vMFrzaCERk6Ls4P1FQh6F6bJbL5o6tG9k1bQ3h8Qm') // USDC
    .then(metadata => {
        console.log(metadata);
    })
    .catch(err => {
        console.error(err);
    });