const express = require("express");
const router = express.Router();
const { getAllTokens } = require("../controllers/tokenControllers");

// ===>>  GET ALL TOKENS
router.get("/tokens", getAllTokens);

module.exports = router;
