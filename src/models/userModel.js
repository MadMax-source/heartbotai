const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Define User Schema
const userSchema = new mongoose.Schema({
  telegram_id: { type: Number, required: true, unique: true },
  username: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  is_bot: { type: Boolean, default: false },
  language_code: { type: String },
  chat_id: { type: Number },

  // wallet-info
  wallet: {
    publicKey: { type: String },
    privateKey: { type: String },
    password: { type: String },
  },
  //referral schemas
  referred_by: { type: String, default: null },
  referrals: { type: [String], default: [] },
  referralCount: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referralLink: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
