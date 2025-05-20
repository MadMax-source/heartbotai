module.exports = (bot, chatId) => {
  const message = `🛠 *Filter Settings Menu*\nSelect a filter to customize your token scan preferences:`;

  const keyboard = [
    [{ text: "💰 Market Cap", callback_data: "set_market_cap" }],
    [{ text: "💧 Liquidity", callback_data: "set_liquidity" }],
    [{ text: "⏱ Time Created (min)", callback_data: "set_time_created" }],
    [{ text: "🧠 Dev Holding %", callback_data: "set_dev_holding" }],
    [{ text: "👑 Top Holder %", callback_data: "set_top_holder" }],
    [{ text: "📦 Bundle %", callback_data: "set_bundle_pct" }],
    [{ text: "🏦 Insiders %", callback_data: "set_insiders_pct" }],
    [{ text: "👥 Total Holders", callback_data: "set_total_holders" }],
    [{ text: "📈 5-min Volume", callback_data: "set_volume_5m" }],
    [{ text: "📢 Social Media Presence", callback_data: "toggle_social" }],
    [{ text: "✅ Start Monitoring", callback_data: "start_monitoring" }],
  ];

  bot.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
};
