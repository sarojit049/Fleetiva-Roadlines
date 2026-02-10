const express = require('express');
const Load = require('../models/Load');
const { authenticate, authorize } = require('../middleware/combinedAuth');

const router = express.Router();

router.post('/post', authenticate, authorize('customer'), async (req, res) => {
  const { material, requiredCapacity, from, to, consignorName, consigneeName } = req.body;

  if (!material || !from || !to || !consignorName || !consigneeName) {
    return res.status(400).json({ message: 'All load fields are required.' });
  }

  if (Number(requiredCapacity) <= 0) {
    return res.status(400).json({ message: 'Capacity must be greater than 0.' });
  }

  const load = await Load.create({
    customer: req.user.userId,
    material,
    requiredCapacity: Number(requiredCapacity),
    from,
    to,
    consignorName,
    consigneeName,
  });

  res.status(201).json(load);
});

router.get('/available', authenticate, authorize('admin'), async (req, res) => {
  const loads = await Load.find().sort({ createdAt: -1 });
  res.json(loads);
});

module.exports = router;
