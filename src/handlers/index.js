const filterToken = require("./filteredToken");
const filterMenu = require("./filterMenu");
const botSettings = require("./botSettings");
const searchTokenMenu = require("./searchToken");
const { Token } = require("../models/pumpToken");
const { UserFilter } = require("../models/userFilter");

const userState = {}; // for filtering flow
const userInputState = {}; // for search flow

module.exports = (bot) => {
  bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;
    const telegramId = callbackQuery.from.id;

    // Handle filter input flow first
    const filterHandled = await filterMenu.handleFilterCallback(bot, callbackQuery, userState);
    if (filterHandled) {
      return bot.answerCallbackQuery(callbackQuery.id);
    }

    // === Main Actions ===
    if (action === "view_filtered_tokens") {
      filterToken(bot, chatId, telegramId, 1); // Page 1
    } else if (action.startsWith("page_")) {
      const page = parseInt(action.split("_")[1]);
      filterToken(bot, chatId, telegramId, page);
    } else if (action.startsWith("token_")) {
      const address = action.split("_")[1];
      const token = await Token.findOne({ address });

      if (token) {
        const details = `
🚀 <b>New Token Launched!</b>
🔤 Name: <b>${token.name}</b>
🔠 Symbol: <b>${token.symbol}</b>
👤 Creator: <code>${token.creator}</code>
🆔 Address: <code>${token.address}</code>
💰 Market Cap: <b>${token.market_cap?.toFixed(2)} SOL</b>
💧 Liquidity: <b>${token.liquidity?.toFixed(2)} SOL</b>
⏰ Time: ${new Date(token.created_at * 1000).toLocaleString()}
🔗 <a href="https://pump.fun/${token.address}">View on Pump.fun</a>`;
        bot.sendMessage(chatId, details, { parse_mode: "HTML" });
      } else {
        bot.sendMessage(chatId, "⚠️ Token details not found.");
      }
    } else if (action === "open_filter_menu") {
      filterMenu(bot, chatId);
    } else if (action === "view_info") {
      bot.sendMessage(chatId, "ℹ️ Here's your current info...");
    } else if (action === "bot_status") {
      bot.sendMessage(chatId, "📡 HeartBot AI is online and scanning...");
    } else if (action === "auto_buy_disabled" || action === "auto_sell_disabled") {
      bot.sendMessage(chatId, "⚠️ Feature coming soon! Stay tuned.");
    } else if (action === "set_treasury_wallet") {
      bot.sendMessage(chatId, "🏦 Please send your treasury wallet address.");
    } else if (action === "bot_settings") {
      botSettings(bot, chatId);
    }

    // === Search Token Actions ===
    else if (action === "search_token") {
      searchTokenMenu(bot, chatId);
    } else if (
      action === "search_by_name" ||
      action === "search_by_symbol" ||
      action === "search_by_address"
    ) {
      const type = action.split("_").pop(); // name, symbol, address
      userInputState[telegramId] = { step: "await_search", type };
      const label = type === "address" ? "contract address" : type;
      bot.sendMessage(chatId, `🔎 Enter ${label} to search:`);
    } else {
      bot.sendMessage(chatId, "❓ Unknown action.");
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    const state = userInputState[telegramId];
    const filterState = userState[telegramId];

    // === Handle filter input (min/max) ===
    if (filterState) {
      const value = parseFloat(msg.text.trim());
      if (isNaN(value)) {
        return bot.sendMessage(chatId, "❌ Please enter a valid number.");
      }

      const filterKey = `filters.${filterState.field}`;

      if (filterState.step === "await_min") {
        userState[telegramId] = { ...filterState, step: "await_max", min: value };
        return bot.sendMessage(
          chatId,
          `✏️ Now enter *maximum ${filterState.field.replace("_", " ")}* (in SOL or minutes):`,
          { parse_mode: "Markdown" }
        );
      }

      if (filterState.step === "await_max") {
        const filterUpdate = {
          [filterKey]: {
            min: filterState.min,
            max: value,
          },
        };

        await UserFilter.findOneAndUpdate(
          { telegramId },
          { $set: filterUpdate },
          { upsert: true }
        );

        delete userState[telegramId];

        return bot.sendMessage(
          chatId,
          `✅ Filter for *${filterState.field.replace("_", " ")}* set: min = ${filterState.min}, max = ${value}`,
          { parse_mode: "Markdown" }
        );
      }
    }

    // === Handle search input ===
    if (state?.step === "await_search") {
      const input = msg.text.trim();
      const regex = new RegExp(input, "i");

      let query;
      if (state.type === "name") {
        query = { name: regex };
      } else if (state.type === "symbol") {
        query = { symbol: regex };
      } else {
        query = { address: regex };
      }

      const tokens = await Token.find(query).limit(10);

      if (tokens.length === 0) {
        await bot.sendMessage(chatId, "❌ No tokens found.");
      } else {
        for (const token of tokens) {
          const ageMinutes = Math.floor((Date.now() / 1000 - token.created_at) / 60);
          const details = `
🔤 <b>${token.name}</b> (${token.symbol})
📄 Address: <code>${token.address}</code>
👤 Creator: <code>${token.creator}</code>
💧 Liquidity: <b>${token.liquidity?.toFixed(2)} SOL</b>
💰 Market Cap: <b>${token.market_cap?.toFixed(2)} SOL</b>
🕒 Age: ${ageMinutes} minutes
🔗 <a href="https://pump.fun/${token.address}">View on Pump.fun</a>`;
          await bot.sendMessage(chatId, details, { parse_mode: "HTML" });
        }
      }

      delete userInputState[telegramId];
    }
  });
};



/*
const filterToken = require("./filteredToken");
const filterMenu = require("./filterMenu");
const botSettings = require("./botSettings");
const monitoring = require("./monitoring");
const { Token } = require("../models/pumpToken");

const userState = {}; // Shared user input state

module.exports = (bot) => {
  bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;
    const telegramId = callbackQuery.from.id;

    // 1. Try filter menu handlers first
    const filterHandled = await filterMenu.handleFilterCallback(bot, callbackQuery, userState);
    if (filterHandled) return bot.answerCallbackQuery(callbackQuery.id);

    if (action === "view_filtered_tokens") {
      filterToken(bot, chatId, telegramId, 1); // Page 1
    } else if (action.startsWith("page_")) {
      const page = parseInt(action.split("_")[1]);
      filterToken(bot, chatId, telegramId, page);
    } else if (action.startsWith("token_")) {
      const address = action.split("_")[1];
      const token = await Token.findOne({ address });

      if (token) {
        const details = `
🚀 <b>New Token Launched!</b>
🔤 Name: <b>${token.name}</b>
🔠 Symbol: <b>${token.symbol}</b>
👤 Creator: <code>${token.creator}</code>
🆔 Address: <code>${token.address}</code>
💰 Market Cap: <b>${token.market_cap?.toFixed(2)} SOL</b>
💧 Liquidity: <b>${token.liquidity?.toFixed(2)} SOL</b>
⏰ Time: ${new Date(token.created_at * 1000).toLocaleString()}
🔗 <a href="https://pump.fun/${token.address}">View on Pump.fun</a>`;
        bot.sendMessage(chatId, details, { parse_mode: "HTML" });
      } else {
        bot.sendMessage(chatId, "⚠️ Token details not found.");
      }
    } else if (action === "open_filter_menu") {
      filterMenu(bot, chatId);
    } else if (action === "view_info") {
      bot.sendMessage(chatId, "ℹ️ Here's your current info...");
    } else if (action === "bot_status") {
      bot.sendMessage(chatId, "📡 HeartBot AI is online and scanning...");
    } else if (
      action === "auto_buy_disabled" ||
      action === "auto_sell_disabled"
    ) {
      bot.sendMessage(chatId, "⚠️ Feature coming soon! Stay tuned.");
    } else if (action === "set_treasury_wallet") {
      bot.sendMessage(chatId, "🏦 Please send your treasury wallet address.");
    } else if (action === "bot_settings") {
      botSettings(bot, chatId);
    } else if (action === "search_token") {
      monitoring(bot, chatId);
    } else {
      bot.sendMessage(chatId, "❓ Unknown action.");
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });

  // Handle min/max text inputs
  bot.on("message", async (msg) => {
    const telegramId = msg.from.id;
    const chatId = msg.chat.id;
    const state = userState[telegramId];
    const { UserFilter } = require("../models/userFilter");

    if (!state) return;

    const value = parseFloat(msg.text.trim());
    if (isNaN(value)) {
      return bot.sendMessage(chatId, "❌ Please enter a valid number.");
    }

    const filterKey = `filters.${state.field}`;

    if (state.step === "await_min") {
      userState[telegramId] = { ...state, step: "await_max", min: value };
      return bot.sendMessage(chatId, `✏️ Now enter *maximum ${state.field.replace("_", " ")}* (in SOL or minutes):`, {
        parse_mode: "Markdown",
      });
    }

    if (state.step === "await_max") {
      const filterUpdate = {
        [filterKey]: {
          min: state.min,
          max: value,
        },
      };

      await UserFilter.findOneAndUpdate(
        { telegramId },
        { $set: filterUpdate },
        { upsert: true }
      );

      delete userState[telegramId];

      return bot.sendMessage(chatId, `✅ Filter for *${state.field.replace("_", " ")}* set: min = ${state.min}, max = ${value}`, {
        parse_mode: "Markdown",
      });
    }
  });
};



*/