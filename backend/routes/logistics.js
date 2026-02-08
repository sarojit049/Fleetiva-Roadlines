const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "Logistics route working" });
});

module.exports = router;
