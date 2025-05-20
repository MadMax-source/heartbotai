const filterToken = require("./filterToken");
const filterMenu = require("./filterMenu");
const botSettings = require("./botSettings");
const monitoring = require("./monitoring");

module.exports = (bot) => {
  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    if (action === "view_filtered_tokens") {
      filterToken(bot, chatId);
    } else if (action === "open_filter_menu") {
      filterMenu(bot, chatId);
    } else if (action === "view_info") {
      bot.sendMessage(chatId, "ℹ️ Here's your current info...");
    } else if (action === "bot_status") {
      bot.sendMessage(chatId, "📡 HeartBot AI is online and scanning...");
    } else if (
      action === "auto_buy_disabled" ||
      action === "auto_sell_disabled"
    ) {
      bot.sendMessage(chatId, "⚠️ Feature coming soon! Stay tuned.");
    } else if (action === "set_treasury_wallet") {
      bot.sendMessage(chatId, "🏦 Please send your treasury wallet address.");
    } else if (action === "bot_settings") {
      botSettings(bot, chatId);
    } else if (action === "start_monitoring") {
      monitoring(bot, chatId);
    } else {
      bot.sendMessage(chatId, "❓ Unknown action.");
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });
};
