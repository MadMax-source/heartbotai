require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./config/db");
const tokenRoutes = require("./routes/tokenRoutes");
const { startPumpSocket } = require("./bot/filter");
const startHandler = require("./bot/start");
const registerHandlers = require("./handlers");
const startNotifyUsersJob = require("./jobs/notifyUsersJob");

connectDB();

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.use(express.json());
app.use("/api", tokenRoutes);

startPumpSocket();
startHandler(bot);
registerHandlers(bot);
startNotifyUsersJob(bot);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});


/*
this code initializes an Express server, connects to a MongoDB database, sets up a Telegram bot using the node-telegram-bot-api library, and starts various functionalities including handling incoming messages, notifying users, and managing pump socket connections. It uses environment variables for configuration and listens on a specified port.
*/