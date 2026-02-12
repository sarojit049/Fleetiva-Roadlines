const express = require('express');
const Truck = require('../models/Truck');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const { postTruckSchema } = require('../validations/truckValidation');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/post', authenticate, authorize('driver'), asyncHandler(async (req, res, next) => {
  const { error, value } = postTruckSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }))
    });
  }

  const { vehicleNumber, capacity, vehicleType, currentLocation } = value;

  const truck = await Truck.create({
    driver: req.user.userId,
    vehicleNumber,
    capacity,
    vehicleType,
    currentLocation,
  });

  res.status(201).json(truck);
}));

router.get('/available', authenticate, authorize('admin'), asyncHandler(async (req, res, next) => {
  const trucks = await Truck.find({ isAvailable: true }).sort({ createdAt: -1 });
  res.json(trucks);
}));

router.get('/driver', authenticate, authorize('driver'), asyncHandler(async (req, res, next) => {
  const trucks = await Truck.find({ driver: req.user.userId }).sort({ createdAt: -1 });
  res.json(trucks);
}));

module.exports = router;
