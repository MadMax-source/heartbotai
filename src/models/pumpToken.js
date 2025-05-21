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
    expires: 60, // 2 hours in seconds 7200
  },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = { Token };
