const express = require('express');
const Log = require('../models/Log');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', authenticate, authorize('superadmin'), asyncHandler(async (req, res) => {
  const logs = await Log.find()
    .populate('tenant', 'name')
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
}));

router.delete('/', authenticate, authorize('superadmin'), asyncHandler(async (req, res) => {
  await Log.deleteMany({});
  res.json({ message: 'Logs cleared.' });
}));

module.exports = router;
