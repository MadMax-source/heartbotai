const { Token } = require("../models/pumpToken");

const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ created_at: -1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tokens" });
  }
};

module.exports = { getAllTokens };
