const axios = require("axios");

// Replace with your actual Moralis API key
const MORALIS_API_KEY = "YOUR_API_KEY_HERE";

const fetchNewPumpFunTokens = async () => {
  try {
    const response = await axios.get(
      "https://solana-gateway.moralis.io/pumpfun/tokens/new",
      {
        headers: {
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    );

    const tokens = response.data;

    if (Array.isArray(tokens) && tokens.length > 0) {
      console.log(`Fetched ${tokens.length} new tokens:\n`);
      tokens.forEach((token, i) => {
        console.log(
          `${i + 1}. Name: ${token.name}, Symbol: ${token.symbol}, Launched: ${
            token.createdAt
          }`
        );
      });
    } else {
      console.log("No new tokens found.");
    }
  } catch (error) {
    console.error("Error fetching tokens:", error.message);
  }
};

fetchNewPumpFunTokens();
