const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  creator: String,
  address: { type: String, unique: true },
  market_cap: Number,
  liquidity: Number,
  created_at: Number,
  insertedAt: {
    type: Date,
    default: Date.now,
    expires: 72000, // 2 hours in seconds 10800
  },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = { Token };
