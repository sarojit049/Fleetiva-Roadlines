const express = require('express');
const Truck = require('../models/Truck');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/post', authenticate, authorize('driver'), asyncHandler(async (req, res) => {
  const { vehicleNumber, capacity, vehicleType, currentLocation } = req.body;

  if (!vehicleNumber || !vehicleType || !currentLocation) {
    return res.status(400).json({ message: 'Vehicle details are required.' });
  }

  const truckCapacity = Number(capacity);
  if (!Number.isFinite(truckCapacity) || truckCapacity <= 0) {
    return res.status(400).json({ message: 'Capacity must be a valid number greater than 0.' });
  }

  const truck = await Truck.create({
    driver: req.user.userId,
    vehicleNumber,
    capacity: truckCapacity,
    vehicleType,
    currentLocation,
  });

  res.status(201).json(truck);
}));

router.get('/my-trucks', authenticate, authorize('driver', 'admin', 'superadmin'), asyncHandler(async (req, res) => {
  const trucks = await Truck.find({ driver: req.user.userId }).sort({ createdAt: -1 });
  res.json(trucks);
}));

router.get('/available', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const trucks = await Truck.find({ isAvailable: true }).sort({ createdAt: -1 });
  res.json(trucks);
}));

module.exports = router;
