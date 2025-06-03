// bot/filters.js
const { User } = require("../models/userModel");
const { UserFilter } = require("../models/userFilter");
module.exports = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    const userData = {
      telegram_id: telegramId,
      username: msg.from.username,
      first_name: msg.from.first_name,
      last_name: msg.from.last_name,
      is_bot: msg.from.is_bot,
      language_code: msg.from.language_code,
      chat_id: chatId,
    };

    const existingUser = await User.findOne({ telegram_id: telegramId });
    const existingFilter = await UserFilter.findOne({ telegram_id: telegramId }); 


  if (!existingFilter) {
    await UserFilter.create({
      telegram_id: telegramId,
      filters: {
        triggerCliches: {
          dev_sold_all: false,
          dev_not_sold: false,
          dev_bought_more: false,
          dev_holding: false,
          has_social: false,
          dex_paid: false,
          boosted: false,
          whale: false,
          graduated: false,
        },
        // real time triggers
         dexPaid: false,
          devBoughtNow: false,
          graduatedNow: false,
          sniper: false,
          justFilter: false,
      },
    });

    console.log("✅ UserFilter created for chatId:", chatId);
  }

  if (!existingUser) {
    try {
      await User.create(userData);
      console.log("✅ New user saved:", userData.username || userData.first_name);
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
  [
    {
      text: "🛠️ Filtering Triggers",
      callback_data: "filtering_triggers",
    },
  ],
  [
    {
      text: "💰 Filter by Value",
      callback_data: "filter_by_value",
    },
  ],
  [
    {
      text: "🔔 Real-Time Triggers",
      callback_data: "real_time_triggers",
    },
  ],
  [
    {
      text: "🔍 Search for Token",
      callback_data: "search_token",
    },
    {
      text: "🆕 Create Token (Coming Soon)",
      callback_data: "create_token",
    },
  ],


          [
            { text: "👤 View My Info", callback_data: "view_info" },
            {
              text: "⚙️ Bot Settings (coming soon)",
              callback_data: "bot_status",
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
