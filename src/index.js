// index.js
require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./config/db");
connectDB();

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

require("./bot/start")(bot);
require("./handlers/index")(bot);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
