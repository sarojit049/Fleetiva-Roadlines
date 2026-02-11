const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require('../middleware/combinedAuth');
module.exports = router;
