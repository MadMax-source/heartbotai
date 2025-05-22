const { User } = require("../models/userModel");
const { UserFilter } = require("../models/userFilter");
const { clusterApiUrl, Connection, PublicKey } = require("@solana/web3.js");

// Connect to Solana RPC
//const connection = new Connection("https://api.mainnet-beta.solana.com");

const connection = new Connection(clusterApiUrl("devnet"));

module.exports = async function userInfo(bot, chatId, telegramId) {
  try {
    const user = await User.findOne({ telegram_id: telegramId });
    const filters = await UserFilter.findOne({ telegramId });

    let message = `👤 <b>Your Info</b>\n\n`;

    // Basic Telegram Info
    message += `• Username: @${user?.username || "N/A"}\n`;
    message += `• Name: ${user?.first_name || ""} ${user?.last_name || ""}\n`;

    // Wallet Info
    if (user?.wallet?.publicKey) {
      message += `\n💼 <b>Wallet Connected</b>\n`;
      message += `• Public Key:\n<code>${user.wallet.publicKey}</code>\n`;

      // Fetch balance
      try {
        const pubkey = new PublicKey(user.wallet.publicKey);
        const balanceLamports = await connection.getBalance(pubkey);
        const balanceSOL = balanceLamports / 1e9;
        message += `• Balance: ${balanceSOL.toFixed(4)} SOL\n`;
      } catch (err) {
        message += `• Balance: ⚠️ Failed to fetch\n`;
      }
    } else {
      message += `\n💼 <b>No Wallet Connected</b>\n`;
    }

    // Filter Info
    if (filters?.filters) {
      const f = filters.filters;
      message += `\n🎯 <b>Your Filters</b>\n`;

      if (f.market_cap) {
        message += `• Market Cap: ${f.market_cap.min} - ${f.market_cap.max} SOL\n`;
      }
      if (f.liquidity) {
        message += `• Liquidity: ${f.liquidity.min} - ${f.liquidity.max} SOL\n`;
      }
      if (f.created_at_minutes) {
        message += `• Time Created: ${f.created_at_minutes.min} - ${f.created_at_minutes.max} mins ago\n`;
      }
    } else {
      message += `\n🎯 <b>No filters set yet.</b>`;
    }

    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
  } catch (error) {
    console.error("Error in userInfo:", error);
    await bot.sendMessage(chatId, "⚠️ Failed to fetch user info.");
  }
};
