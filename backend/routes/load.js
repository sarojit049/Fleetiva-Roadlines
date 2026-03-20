const express = require('express');
const Load = require('../models/Load');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const { postLoadSchema, loadListQuerySchema } = require('../validations/loadValidation');
const asyncHandler = require('../utils/asyncHandler');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/post', authenticate, authorize('customer'), validateRequest({ body: postLoadSchema }), asyncHandler(async (req, res) => {
  const { material, requiredCapacity, from, to, consignorName, consigneeName } = req.body;

  const load = await Load.create({
    customer: req.user.userId,
    material,
    requiredCapacity,
    from,
    to,
    consignorName,
    consigneeName,
  });

  res.status(201).json(load);
}));

router.get('/customer', authenticate, authorize('customer'), validateRequest({ query: loadListQuerySchema }), asyncHandler(async (req, res) => {
  const loads = await Load.find({ customer: req.user.userId }).sort({ createdAt: -1 });
  res.json(loads);
}));

router.get('/available', authenticate, authorize('admin'), validateRequest({ query: loadListQuerySchema }), asyncHandler(async (req, res) => {
  const loads = await Load.find().sort({ createdAt: -1 });
  res.json(loads);
}));

module.exports = router;
