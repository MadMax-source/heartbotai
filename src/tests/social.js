// Example: Check for social links using Solscan API
const fetch = require('node-fetch');

async function hasSocials(tokenMint) {
    const url = `https://public-api.solscan.io/token/meta?tokenAddress=${tokenMint}`;
    const response = await fetch(url);
    if (!response.ok) return false;
    const data = await response.json();

    // Check for social fields
    const socials = [
        data?.twitter,
        data?.telegram,
        data?.discord,
        data?.website
    ];
    // Return true if at least one is present and non-empty
    return socials.some(link => link && link.trim() !== '');
}

// Usage
hasSocials('Es9vMFrzaCERk6Ls4P1FQh6F6bJbL5o6tG9k1bQ3h8Qm').then(console.log);