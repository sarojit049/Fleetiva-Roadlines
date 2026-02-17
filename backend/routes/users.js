const express = require('express');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const users = await User.find().select('name email phone role').sort({ createdAt: -1 });
  res.json(users);
}));

module.exports = router;
