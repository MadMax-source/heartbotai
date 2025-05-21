module.exports = (bot, chatId) => {
  const message = `🛠 *Filter Settings Menu*\nSelect a filter to customize your token scan preferences:`;

  const keyboard = [
    [{ text: "💰 Market Cap", callback_data: "set_market_cap" }],
    [{ text: "💧 Liquidity", callback_data: "set_liquidity" }],
    [{ text: "⏱ Time Created (min)", callback_data: "set_time_created" }],
    [{ text: "✅ Start Monitoring", callback_data: "start_monitoring" }],
  ];

  bot.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
};

module.exports.handleFilterCallback = async (bot, callbackQuery, userState) => {
  const action = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const telegramId = callbackQuery.from.id;

  const askForRange = async (label, key) => {
    userState[telegramId] = { step: "await_min", field: key };
    await bot.sendMessage(chatId, `✏️ Enter *minimum ${label}* (in SOL or minutes):`, {
      parse_mode: "Markdown",
    });
  };

  if (action === "set_liquidity") {
    await askForRange("liquidity", "liquidity");
    return true;
  }

  if (action === "set_market_cap") {
    await askForRange("market cap", "market_cap");
    return true;
  }

  if (action === "set_time_created") {
    await askForRange("age in minutes", "created_at_minutes");
    return true;
  }

  return false; // Let main handler handle other callback_data
};
