const WebSocket = require("ws");
const { UserFilter } = require("../models/userFilter");
const { Token } = require("../models/pumpToken");
const axios = require("axios");
require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;

function matchesFilter(token, filters) {
  if (
    filters.name &&
    !token.name.toLowerCase().includes(filters.name.toLowerCase())
  )
    return false;
  if (
    filters.symbol &&
    !token.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
  )
    return false;
  return true;
}

function formatTokenMessage(token) {
  return `
🚀 <b>New Token Launched!</b>
🔤 Name: <b>${token.name}</b>
🔠 Symbol: <b>${token.symbol}</b>
👤 Creator: <code>${token.creator}</code>
🆔 Address: <code>${token.address}</code>
💰 Market Cap: <b>${token.market_cap?.toFixed(2)} SOL</b>
💧 Liquidity: <b>${token.liquidity?.toFixed(2)} SOL</b>
⏰ Time: ${new Date(token.created_at * 1000).toLocaleString()}
🔗 <a href="https://pump.fun/${token.address}">View on Pump.fun</a>
  `;
}


async function sendTelegramMessage(chatId, text) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
  }
}

function startPumpSocket() {
  const ws = new WebSocket("wss://pumpportal.fun/api/data");

  ws.on("open", () => {
    console.log("✅ Connected to Pump.fun WebSocket");
    ws.send(JSON.stringify({ method: "subscribeNewToken" }));
  });
  
  ws.on("message", async (data) => {
    try {
      const rawString = data.toString();
      const parsed = JSON.parse(rawString);
  
      if (parsed.txType === "create") {
        const tokenData = {
          name: parsed.name,
          symbol: parsed.symbol,
          creator: parsed.traderPublicKey,
          address: parsed.mint,
          market_cap: parsed.marketCapSol,               // ✅ Market Cap in SOL
          liquidity: parsed.vSolInBondingCurve,          // ✅ Liquidity in SOL
          created_at: Math.floor(Date.now() / 1000),     // ✅ Timestamp in seconds
        };
  
        await Token.create(tokenData); // ✅ Save to DB
        console.log("✅ Token saved:", tokenData);
      }
    } catch (err) {
      console.error("❌ Error parsing or saving token:", err);
    }
  });
  

  ws.on("error", (err) => {
    console.error("❌ WebSocket error:", err.message);
  });

  ws.on("close", () => {
    console.warn("🔌 WebSocket disconnected. Reconnecting in 5s...");
    setTimeout(startPumpSocket, 5000);
  });
}

module.exports = { startPumpSocket };
