
const { UserFilter } = require("../models/userFilter");

const VALID_REALTIME_FIELDS = [
  "dexPaid",
  "devBoughtNow",
  "graduatedNow",
  "sniper",
  "justFilter",
];

module.exports = async function realtimeTrigger(bot, chatId, telegram_id, toggleField = null) {
  try {
    const filter = await UserFilter.findOne({ telegram_id });

    if (!filter) {
      return await bot.sendMessage(chatId, "⚠️ No filter profile found.");
    }

    // Toggle logic, only if valid field
    if (toggleField) {
      if (!VALID_REALTIME_FIELDS.includes(toggleField)) {
        return await bot.sendMessage(chatId, "⚠️ Invalid trigger field.");
      }

      const current = filter.filters[toggleField];
      filter.filters[toggleField] = !current;
      await filter.save();

      const status = filter.filters[toggleField] ? "🟢 Enabled" : "🔴 Disabled";
      await bot.sendMessage(chatId, `✅ *${toggleField.replace(/([A-Z])/g, " $1")}* trigger is now *${status}*`, {
        parse_mode: "Markdown",
      });
    }

    const t = filter.filters;
    const emoji = (state) => (state ? "🟢" : "🔴");

    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `${emoji(t.dexPaid)} DEX Paid`, callback_data: "toggle_realtime_dexPaid" },
            { text: `${emoji(t.devBoughtNow)} Dev Bought Now`, callback_data: "toggle_realtime_devBoughtNow" },
          ],
          [
            { text: `${emoji(t.graduatedNow)} Graduated Now`, callback_data: "toggle_realtime_graduatedNow" },
            { text: `${emoji(t.sniper)} Sniper`, callback_data: "toggle_realtime_sniper" },
          ],
          [
            { text: `${emoji(t.justFilter)} Just Filter`, callback_data: "toggle_realtime_justFilter" },
          ],
        ],
      },
    };

    await bot.sendMessage(chatId, "🔔 *Select a real-time trigger filter:*", {
      parse_mode: "Markdown",
      ...inlineKeyboard,
    });
  } catch (error) {
    console.error("❌ Error in real-time trigger handler:", error);
    await bot.sendMessage(chatId, "⚠️ An error occurred while updating real-time triggers.");
  }
};


/*
const { UserFilter } = require("../models/userFilter");

module.exports = async function realtimeTrigger(bot, chatId, telegram_id, toggleField = null) {
  try {
    const filter = await UserFilter.findOne({ telegram_id });

    if (!filter) {
      return await bot.sendMessage(chatId, "⚠️ No filter profile found.");
    }

    // Toggle logic
    if (toggleField) {
      const current = filter.filters[toggleField];
      filter.filters[toggleField] = !current;
      await filter.save();

      const status = filter.filters[toggleField] ? "🟢 Enabled" : "🔴 Disabled";
      await bot.sendMessage(chatId, `✅ *${toggleField.replace(/([A-Z])/g, ' $1')}* trigger is now *${status}*`, {
        parse_mode: "Markdown",
      });
    }

    const t = filter.filters;
    const emoji = (state) => (state ? "🟢" : "🔴");

    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `${emoji(t.dexPaid)} DEX Paid`, callback_data: "toggle_realtime_dexPaid" },
            { text: `${emoji(t.devBoughtNow)} Dev Bought Now`, callback_data: "toggle_realtime_devBoughtNow" },
          ],
          [
            { text: `${emoji(t.graduatedNow)} Graduated Now`, callback_data: "toggle_realtime_graduatedNow" },
            { text: `${emoji(t.sniper)} Sniper`, callback_data: "toggle_realtime_sniper" },
          ],
          [
            { text: `${emoji(t.justFilter)} Just Filter`, callback_data: "toggle_realtime_justFilter" },
          ],
        ],
      },
    };

    await bot.sendMessage(chatId, "🔔 *Select a real-time trigger filter:*", {
      parse_mode: "Markdown",
      ...inlineKeyboard,
    });
  } catch (error) {
    console.error("❌ Error in real-time trigger handler:", error);
    await bot.sendMessage(chatId, "⚠️ An error occurred while updating real-time triggers.");
  }
};


*/