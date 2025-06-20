const fetch = require('node-fetch');
async function getJupiterPools(tokenMint) {
  const url = `https://quote-api.jup.ag/v6/pools?mint=${tokenMint}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}
const usdcMint = 'EPjFWdd5AufqSSqeM2q8j4bQN3E5s3Uu9vUaPznvybG';
getJupiterPools(usdcMint);