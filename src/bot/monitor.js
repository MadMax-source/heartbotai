// bot/monitor.js
const pumpService = require("../services/pumpfun");
const userFilters = require("../data/users");
const formatMessage = require("./messages");

let isMonitoring = {};

module.exports = (bot) => {
  // this is here to allow dynamic import from filter.js
};

module.exports.startMonitoring = (chatId, bot) => {
  if (isMonitoring[chatId]) return;

  isMonitoring[chatId] = true;

  pumpService.onNewToken(async (token) => {
    const filters = userFilters.getFilters(chatId);

    if (passesFilters(token, filters)) {
      const message = formatMessage(token);
      bot.sendMessage(chatId, message, { disable_web_page_preview: true });
    }
  });
};

function passesFilters(token, filters) {
  // Example checks (add all filters)
  if (filters.marketCap) {
    const { min, max } = filters.marketCap;
    if (token.marketCap < min || token.marketCap > max) return false;
  }
  // ... more checks ...
  return true;
}
