const filterToken = require("./filteredToken");
const filterMenu = require("./filterMenu");
const botSettings = require("./botSettings");
const searchTokenMenu = require("./searchToken");
const realtimeTrigger = require("./real-time-triggers");
const filter_by_value = require("./filter-by-value");
const filteringTriggers = require("./filtering-trigger");
const { Token } = require("../models/pumpToken");
const { UserFilter } = require("../models/userFilter"); 
const { User } = require("../models/userModel");
const bs58 = require("bs58");
const { Keypair } = require("@solana/web3.js");
const userInfo = require("./userInfo");

const userState = {};
const userInputState = {};
const importWalletState = {};
module.exports = (bot) => {
  bot.onText(/\/filteringTriggers/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    filteringTriggers(bot, chatId, telegramId);
  })
  bot.onText(/\/realtimeTrigger/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    realtimeTrigger(bot, chatId, telegramId);
  })
  bot.onText(/\/filterByValue/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    filter_by_value(bot, chatId, telegramId);

  })
  bot.onText(/\/setfilters/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    filterMenu(bot, chatId, telegramId);
  });

  bot.onText(/\/searchtoken/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    searchTokenMenu(bot, chatId, telegramId); // assuming page 1
  });

  bot.onText(/\/viewinfo/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    userInfo(bot, chatId, telegramId);
  });
  bot.onText(/\/filteredtoken/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    filterToken(bot, chatId, telegramId);
  });

  bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;
    const telegramId = callbackQuery.from.id;


 if (action.startsWith("toggle_")) {
      const field = action.replace("toggle_", "");
      await filteringTriggers(bot, chatId, telegramId, field);
      return bot.answerCallbackQuery(callbackQuery.id);
    }

    if (action.startsWith("toggle_realtime_")) {
      const field = action.replace("toggle_realtime_", "");
      await realtimeTrigger(bot, chatId, telegramId, field);
      return bot.answerCallbackQuery(callbackQuery.id);
    }

  /*
    if (action.startsWith("toggle_")) {
    const field = action.replace("toggle_", "");
    return filteringTriggers(bot, chatId, telegramId, field);
  }

  if (action.startsWith("toggle_realtime_")) {
  const field = action.replace("toggle_realtime_", "");
  return realtimeTrigger(bot, chatId, telegramId, field);
  }
  */

    const filterHandled = await filterMenu.handleFilterCallback(
      bot,
      callbackQuery,
      userState
    );
    if (filterHandled) {
      return bot.answerCallbackQuery(callbackQuery.id);
    }
    

    if (action === "view_filtered_tokens") {
      filterToken(bot, chatId, telegramId, 1);
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
      await userInfo(bot, chatId, telegramId);
      return bot.answerCallbackQuery(callbackQuery.id);
    } else if (action === "bot_status") {
      bot.sendMessage(chatId, "📡 HeartBot AI is online and scanning...");
    } else if (
      action === "auto_buy_disabled" ||
      action === "auto_sell_disabled"
    ) {
      bot.sendMessage(chatId, "⚠️ Feature coming soon! Stay tuned.");
    } else if (action === "set_treasury_wallet") {
      const options = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🆕 Create New Wallet", callback_data: "create_wallet" }],
            [
              {
                text: "📥 Import Wallet (Private Key)",
                callback_data: "import_wallet",
              },
            ],
          ],
        },
      };
      await bot.sendMessage(chatId, "🔐 Choose a wallet option:", options);
      return bot.answerCallbackQuery(callbackQuery.id);
    } else if (action === "create_wallet") {
      const wallet = Keypair.generate();
      const publicKey = wallet.publicKey.toString();
      const privateKey = bs58.encode(wallet.secretKey);

      await User.findOneAndUpdate(
        { telegram_id: telegramId },
        { wallet: { publicKey, privateKey } },
        { upsert: true }
      );

      await bot.sendMessage(
        chatId,
        `🎉 <b>New wallet created successfully!</b>\n\n<b>Public Key:</b>\n<code>${publicKey}</code>\n\n<b>Private Key (Save this!):</b>\n<code>${privateKey}</code>`,
        { parse_mode: "HTML" }
      );
      return bot.answerCallbackQuery(callbackQuery.id);
    } else if (action === "import_wallet") {
      importWalletState[telegramId] = true;
      await bot.sendMessage(
        chatId,
        "📥 Please paste your private key to import the wallet (do not panic your private key is encrypted and safe):"
      );
      return bot.answerCallbackQuery(callbackQuery.id);
    } else if (action === "bot_settings") {
      botSettings(bot, chatId);
    } 
    else if (action === "real_time_triggers") {
      realtimeTrigger(bot, chatId, telegramId)
    }
    else if(action === "filtering_triggers") {
      filteringTriggers(bot, chatId, telegramId);}
      else if (action === "filter_by_value") {
      filter_by_value(bot, chatId);}
    else if (action === "filter"){}
    else if (action === "search_token") {
      searchTokenMenu(bot, chatId);
    } else if (
      action === "search_by_name" ||
      action === "search_by_symbol" ||
      action === "search_by_address"
    ) {
      const type = action.split("_").pop();
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

    if (importWalletState[telegramId]) {
      const privateKeyString = msg.text.trim();

      try {
        const secretKey = bs58.decode(privateKeyString);
        const wallet = Keypair.fromSecretKey(secretKey);
        const publicKey = wallet.publicKey.toString();

        await User.findOneAndUpdate(
          { telegram_id: telegramId },
          { wallet: { publicKey, privateKey: privateKeyString } },
          { upsert: true }
        );

        delete importWalletState[telegramId];

        return bot.sendMessage(
          chatId,
          `✅ <b>Wallet imported successfully!</b>\n\n<b>Public Key:</b>\n<code>${publicKey}</code>\n\n<b>Private Key (Save this!):</b>\n<code>${privateKeyString}</code>`,
          { parse_mode: "HTML" }
        );
      } catch (error) {
        return bot.sendMessage(
          chatId,
          "❌ Invalid private key. Please try again."
        );
      }
    }
    if (filterState) {
      const value = parseFloat(msg.text.trim());
      if (isNaN(value)) {
        return bot.sendMessage(chatId, "❌ Please enter a valid number.");
      }

      const filterKey = `filters.${filterState.field}`;

      if (filterState.step === "await_min") {
        userState[telegramId] = {
          ...filterState,
          step: "await_max",
          min: value,
        };
        return bot.sendMessage(
          chatId,
          `✏️ Now enter *maximum ${filterState.field.replace(
            "_",
            " "
          )}* (in SOL or minutes):`,
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
          `✅ Filter for *${filterState.field.replace("_", " ")}* set: min = ${
            filterState.min
          }, max = ${value}`,
          { parse_mode: "Markdown" }
        );
      }
    }

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
          const ageMinutes = Math.floor(
            (Date.now() / 1000 - token.created_at) / 60
          );
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
