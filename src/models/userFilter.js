const { User } = require("./userModel")
const mongoose = require("mongoose");
const userFilterSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  filters: {
    market_cap: {
      min: Number,
      max: Number,
    },
    liquidity: {
      min: Number,
      max: Number,
    },
    created_at_minutes: {
      min: Number,
      max: Number,
    },
  },
});

const UserFilter = mongoose.model("UserFilter", userFilterSchema);
module.exports = { UserFilter };



    // ==>> datas below have not been gotten
    /*
    developer_hold_percent: {
      min: Number,
      max: Number,
    },
    top_holder_percent: {
      min: Number,
      max: Number,
    },
    bundle_percent: {
      min: Number,
      max: Number,
    },
    insiders_percent: {
      min: Number,
      max: Number,
    },
    total_holders: {
      min: Number,
      max: Number,
    },
    volume_5min: {
      min: Number,
      max: Number,
    },
    social_presence_required: {
      type: Boolean,
      default: false,
    },
    */