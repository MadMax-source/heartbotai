const { User } = require("../models/userModel");
const { UserFilter } = require("../models/userFilter");

module.exports = async function filter_by_value(bot, chatId) {
  try {
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "💰 MarketCap Min?", callback_data: "marketcap_min" },
            { text: "💰 MarketCap Max?", callback_data: "marketcap_max" },
          ],
          [
            { text: "📊 Volume Min?", callback_data: "volume_min" },
            { text: "📊 Volume Max?", callback_data: "volume_max" },
          ],
          [
            { text: "⏱️ Time Min? (Minutes)", callback_data: "time_min" },
            { text: "⏱️ Time Max?", callback_data: "time_max" },
          ],
          [
            { text: "🔝 TopHolder Min?", callback_data: "top_holder_min" },
            { text: "🔝 TopHolder Max?", callback_data: "top_holder_max" },
          ],
          [
            { text: "👨‍💻 DevHolding Min?", callback_data: "dev_holding_min" },
            { text: "👨‍💻 DevHolding Max?", callback_data: "dev_holding_max" },
          ],
          [
            { text: "🕵️ Insider Min?", callback_data: "insider_min" },
            { text: "🕵️ Insider Max?", callback_data: "insider_max" },
          ],
          [
            { text: "🎯 Sniper Min?", callback_data: "sniper_min" },
            { text: "🎯 Sniper Max?", callback_data: "sniper_max" },
          ],
          [
            { text: "🫧 BubbleMap Min?", callback_data: "bubblemap_min" },
            { text: "🫧 BubbleMap Max?", callback_data: "bubblemap_max" },
          ],
        ],
      },
    };

    await bot.sendMessage(
      chatId,
      "🧮 *Set Your Filter Values:*",
      { parse_mode: "Markdown", ...inlineKeyboard }
    );
  } catch (error) {
    console.log("❌ Error in filter_by_value handler:", error);
    await bot.sendMessage(chatId, "⚠️ An error occurred while applying filters.");
  }
};
