// bot/filters.js
const { User } = require("../models/userModel");

module.exports = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    const userData = {
      telegram_id: msg.from.id,
      username: msg.from.username,
      first_name: msg.from.first_name,
      last_name: msg.from.last_name,
      is_bot: msg.from.is_bot,
      language_code: msg.from.language_code,
      chat_id: chatId,
    };

    const existingUser = await User.findOne({ telegram_id: msg.from.id });

    if (!existingUser) {
      try {
        await User.create(userData);
        console.log(
          "✅ New user saved:",
          userData.username || userData.first_name
        );
      } catch (error) {
        console.error("❌ Failed to save user:", error);
      }
    }

    const welcomeMessage = `
🤖 *Welcome to HeartBot AI!* 🔍

Get real-time alerts for *brand new Pump.fun token launches* 🚀

🎯 Set custom filters to track:
- 💰 Market Cap
- 💧 Liquidity
- 👤 Dev Holdings
- 📈 Volume
...and much more!

⚙️ Coming soon:
- 🛒 Auto-buy & sell sniper tools
- 🎯 Manual trading options

Tap the buttons below to set your filters and begin scanning! 🔎
    `;

    bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📊 View Filtered Tokens",
              callback_data: "view_filtered_tokens",
            },
          ],
          [{ text: "💰 Set Filters", callback_data: "open_filter_menu" }],
          [{ text: "🚀 Search for Token", callback_data: "search_token" }],
          [
            { text: "👤 View My Info", callback_data: "view_info" },
            { text: "⚙️ Bot Settings", callback_data: "bot_status" },
          ],
          [
            {
              text: "🤖 Auto Buy (Coming Soon)",
              callback_data: "auto_buy_disabled",
            },
            {
              text: "💼 Auto Sell (Coming Soon)",
              callback_data: "auto_sell_disabled",
            },
          ],
          [
            {
              text: "🏦 Set Treasury Wallet",
              callback_data: "set_treasury_wallet",
            },
          ],
        ],
      },
    });
  });
};
