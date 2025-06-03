const { UserFilter } = require("../models/userFilter");

module.exports = async function filteringTriggers(bot, chatId, telegram_id, toggleField = null) {
  try {
    const filter = await UserFilter.findOne({ telegram_id });

    if (!filter) {
      return await bot.sendMessage(chatId, "⚠️ No filter profile found.");
    }

    // 🔄 Toggle logic
    if (toggleField) {
      const current = filter.filters.triggerCliches[toggleField];
      const updated = !current;
      filter.filters.triggerCliches[toggleField] = updated;
      await filter.save();

      // Format field name nicely
      const fieldDisplayName = toggleField
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const statusMsg = updated
        ? `✅ ${fieldDisplayName} trigger enabled.`
        : `❌ ${fieldDisplayName} trigger disabled.`;

      await bot.sendMessage(chatId, statusMsg);
    }

    const t = filter.filters.triggerCliches;
    const emoji = (state) => (state ? "🟢" : "🔴");

    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `${emoji(t.dev_sold_all)} Dev Sold All`, callback_data: "toggle_dev_sold_all" },
            { text: `${emoji(t.dev_not_sold)} Dev Not Sold`, callback_data: "toggle_dev_not_sold" },
          ],
          [
            { text: `${emoji(t.dev_bought_more)} Dev Bought More`, callback_data: "toggle_dev_bought_more" },
            { text: `${emoji(t.dev_holding)} Dev Holding`, callback_data: "toggle_dev_holding" },
          ],
          [
            { text: `${emoji(t.has_social)} At Least 1 Social`, callback_data: "toggle_has_social" },
            { text: `${emoji(t.dex_paid)} DEX Paid`, callback_data: "toggle_dex_paid" },
          ],
          [
            { text: `${emoji(t.boosted)} Boosted`, callback_data: "toggle_boosted" },
            { text: `${emoji(t.whale)} Whale`, callback_data: "toggle_whale" },
          ],
          [{ text: `${emoji(t.graduated)} Graduated`, callback_data: "toggle_graduated" }],
        ],
      },
    };

    await bot.sendMessage(chatId, "🛠️ *Select a Filtering Trigger:*", {
      parse_mode: "Markdown",
      ...inlineKeyboard,
    });
  } catch (error) {
    console.log("❌ Error in filteringTriggers handler:", error);
    await bot.sendMessage(chatId, "⚠️ An error occurred while sending the filtering triggers menu.");
  }
};