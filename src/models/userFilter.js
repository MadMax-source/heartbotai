const { User } = require("./userModel")
const mongoose = require("mongoose");
const userFilterSchema = new mongoose.Schema({
  telegram_id: { type: Number, required: true, unique: true },
// FILTERING TRIGGERS
   
// SET FILTER VALUES
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

    // => FILTER TRIGGERS 

    triggerCliches: {
  dev_sold_all: { type: Boolean, default: false },
  dev_not_sold: { type: Boolean, default: false },
  dev_bought_more: { type: Boolean, default: false },
  dev_holding: { type: Boolean, default: false },
  has_social: { type: Boolean, default: false },
  dex_paid: { type: Boolean, default: false },
  boosted: { type: Boolean, default: false },
  whale: { type: Boolean, default: false },
  graduated: { type: Boolean, default: false },
},
  



    // REAL TIME TRIGGERS
    dexPaid: { type: Boolean, default: false },
      devBoughtNow: { type: Boolean, default: false },
      graduatedNow: { type: Boolean, default: false },
      sniper: { type: Boolean, default: false },
      justFilter: { type: Boolean, default: false },
  },
});

const UserFilter = mongoose.model("UserFilter", userFilterSchema);
module.exports = { UserFilter };