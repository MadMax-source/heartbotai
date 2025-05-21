const WebSocket = require("ws");
const { UserFilter } = require("../models/userFilter");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

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
    const event = JSON.parse(data);
    if (event?.event === "newToken") {
      const token = event.token;
      const users = await UserFilter.find();

      for (const user of users) {
        if (matchesFilter(token, user.filters)) {
          const message = formatTokenMessage(token);
          await sendTelegramMessage(user.telegramId, message);
        }
      }
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
