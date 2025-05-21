const { Token } = require("../models/pumpToken");
const { UserFilter } = require("../models/userFilter");

const TOKENS_PER_PAGE = 50;

module.exports = async (bot, chatId, telegramId, page = 1) => {
  try {
    const userFilters = await UserFilter.findOne({ telegramId });
    const now = Math.floor(Date.now() / 1000);

    let query = {};

    if (userFilters?.filters) {
      const filters = userFilters.filters;

      if (filters.market_cap) {
        query.market_cap = {
          ...(filters.market_cap.min !== undefined && { $gte: filters.market_cap.min }),
          ...(filters.market_cap.max !== undefined && { $lte: filters.market_cap.max }),
        };
      }

      if (filters.liquidity) {
        query.liquidity = {
          ...(filters.liquidity.min !== undefined && { $gte: filters.liquidity.min }),
          ...(filters.liquidity.max !== undefined && { $lte: filters.liquidity.max }),
        };
      }

      if (filters.created_at_minutes) {
        const minAge = filters.created_at_minutes.min || 0;
        const maxAge = filters.created_at_minutes.max || 999999;
        const minTime = now - maxAge * 60;
        const maxTime = now - minAge * 60;
        query.created_at = { $gte: minTime, $lte: maxTime };
      }
    }

    const skip = (page - 1) * TOKENS_PER_PAGE;

    const totalCount = await Token.countDocuments(query);
    const matchedTokens = await Token.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(TOKENS_PER_PAGE);

    if (matchedTokens.length === 0) {
      return bot.sendMessage(chatId, "🔎 No tokens found for your filters.");
    }

    const inlineKeyboard = matchedTokens.map(token => [
      {
        text: `${token.name} (${token.symbol})`,
        callback_data: `token_${token.address}`,
      },
    ]);

    // Add pagination controls
    const totalPages = Math.ceil(totalCount / TOKENS_PER_PAGE);
    const paginationRow = [];

    if (page > 1) {
      paginationRow.push({ text: "⬅️ Prev", callback_data: `page_${page - 1}` });
    }
    if (page < totalPages) {
      paginationRow.push({ text: "➡️ Next", callback_data: `page_${page + 1}` });
    }

    if (paginationRow.length > 0) {
      inlineKeyboard.push(paginationRow);
    }

    await bot.sendMessage(chatId, `🪙 Tokens (Page ${page}/${totalPages}):`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });

  } catch (err) {
    console.error("❌ Error in filteredToken handler:", err);
    bot.sendMessage(chatId, "⚠️ An error occurred while fetching tokens.");
  }
};



/*
const { Token } = require("../models/pumpToken");
const { UserFilter } = require("../models/userFilter");

module.exports = async (bot, chatId, telegramId, page = 1) => {
  try {
    const userFilters = await UserFilter.findOne({ telegramId });
    const now = Math.floor(Date.now() / 1000);
    let query = {};

    if (userFilters?.filters) {
      const filters = userFilters.filters;

      query = {
        ...(filters.name && { name: new RegExp(filters.name, "i") }),
        ...(filters.symbol && { symbol: new RegExp(filters.symbol, "i") }),
        ...(filters.creator && { creator: filters.creator }),
        ...(filters.address && { address: filters.address }),
        ...(filters.market_cap && {
          market_cap: {
            ...(filters.market_cap.min && { $gte: filters.market_cap.min }),
            ...(filters.market_cap.max && { $lte: filters.market_cap.max }),
          },
        }),
        ...(filters.liquidity && {
          liquidity: {
            ...(filters.liquidity.min && { $gte: filters.liquidity.min }),
            ...(filters.liquidity.max && { $lte: filters.liquidity.max }),
          },
        }),
      };

      if (filters.created_at_minutes) {
        const minAge = filters.created_at_minutes.min || 0;
        const maxAge = filters.created_at_minutes.max || 99999;
        const minTime = now - maxAge * 60;
        const maxTime = now - minAge * 60;
        query.created_at = { $gte: minTime, $lte: maxTime };
      }
    }

    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const [matchedTokens, totalTokens] = await Promise.all([
      Token.find(query).sort({ created_at: -1 }).skip(skip).limit(pageSize),
      Token.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalTokens / pageSize);

    if (matchedTokens.length === 0) {
      return bot.sendMessage(chatId, "🔎 No tokens found.");
    }

    const inlineKeyboard = matchedTokens.map((token) => [
      {
        text: `${token.name} (${token.symbol})`,
        callback_data: `token_${token.address}`,
      },
    ]);

    const navigationButtons = [];

    if (page > 1) {
      navigationButtons.push({
        text: "⬅️ Prev",
        callback_data: `page_${page - 1}`,
      });
    }

    if (page < totalPages) {
      navigationButtons.push({
        text: "➡️ Next",
        callback_data: `page_${page + 1}`,
      });
    }

    if (navigationButtons.length) {
      inlineKeyboard.push(navigationButtons);
    }

    await bot.sendMessage(chatId, `🪙 Tokens (Page ${page}/${totalPages}):`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  } catch (err) {
    console.error("❌ Error in filteredToken handler:", err);
    bot.sendMessage(chatId, "⚠️ An error occurred while fetching tokens.");
  }
};


*/