require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./config/db");
const tokenRoutes = require("./routes/tokenRoutes");
const { startPumpSocket } = require("./bot/filter"); // ✅ This is what listens to Pump.fun real-time
const startHandler = require("./bot/start");
const registerHandlers = require("./handlers"); // 👈 This imports your handlers/index.js


// Connect to MongoDB
connectDB();

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Middlewares
app.use(express.json()); // ✅ FIXED: Added the missing parentheses

// Routes
app.use("/api", tokenRoutes);

// Start WebSocket listener
startPumpSocket();
startHandler(bot);
registerHandlers(bot);

 // ✅ THIS is what fetches tokens in real time

// Server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
