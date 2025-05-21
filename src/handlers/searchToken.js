module.exports = (bot, chatId) => {
  bot.sendMessage(chatId, "🔍 Choose what to search by:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📝 Name", callback_data: "search_by_name" },
          { text: "🔤 Symbol", callback_data: "search_by_symbol" },
        ],
        [
          { text: "📄 Contract Address", callback_data: "search_by_address" },
        ]
      ],
    },
  });
};
