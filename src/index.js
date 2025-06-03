require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./config/db");
const tokenRoutes = require("./routes/tokenRoutes");
const { startPumpSocket } = require("./bot/filter");
const startHandler = require("./bot/start");
const registerHandlers = require("./handlers");
const startNotifyUsersJob = require("./jobs/notifyUsersJob");
const updateNotifyJob = require("./jobs/notifyUsersJob");

connectDB();

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.use(express.json());
app.use("/api", tokenRoutes);

startPumpSocket();
startHandler(bot);
registerHandlers(bot);
startNotifyUsersJob(bot);
updateNotifyJob(bot);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
