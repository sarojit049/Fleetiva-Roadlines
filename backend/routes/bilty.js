const express = require('express');
const Bilty = require('../models/Bilty');
const Booking = require('../models/Booking');
const BillingRecord = require('../models/BillingRecord');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const { createBiltySchema, updateBiltySchema } = require('../validations/biltyValidation');

const router = express.Router();

const generateLRNumber = () =>
  `LR-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const ensureUniqueLRNumber = async (lrNumber) => {
  let next = lrNumber || generateLRNumber();
  while (await Bilty.findOne({ lrNumber: next })) {
    next = generateLRNumber();
  }
  return next;
};

const allowedUpdateFields = new Set([
  'lrNumber',
  'consignorName',
  'consigneeName',
  'pickupLocation',
  'dropLocation',
  'materialType',
  'weight',
  'truckType',
  'driverName',
  'driverPhone',
  'vehicleNumber',
  'freightAmount',
  'advancePaid',
  'balanceAmount',
  'paymentMode',
  'shipmentStatus',
]);

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const bilties = await Bilty.find()
    .populate('booking', '_id status paymentStatus')
    .sort({ createdAt: -1 });
  res.json(bilties);
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { error, value } = createBiltySchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }))
    });
  }

  const { booking: bookingId, lrNumber, ...rest } = value;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  const existing = await Bilty.findOne({ booking: bookingId });
  if (existing) {
    return res.status(409).json({ message: 'Bilty already exists for this booking.' });
  }

  const finalLRNumber = await ensureUniqueLRNumber(lrNumber?.trim());

  const bilty = await Bilty.create({
    booking: bookingId,
    lrNumber: finalLRNumber,
    ...rest,
  });

  await BillingRecord.findOneAndUpdate(
    { booking: bookingId },
    { lrNumber: finalLRNumber },
    { new: true }
  );

  res.status(201).json(bilty);
});

router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { error, value } = updateBiltySchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }))
    });
  }

  const updates = {};
  for (const key of allowedUpdateFields) {
    if (value[key] !== undefined) {
      updates[key] = value[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No valid fields to update.' });
  }

  if (updates.lrNumber) {
    updates.lrNumber = await ensureUniqueLRNumber(updates.lrNumber.trim());
  }

  const bilty = await Bilty.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!bilty) {
    return res.status(404).json({ message: 'Bilty not found.' });
  }

  if (updates.lrNumber) {
    await BillingRecord.findOneAndUpdate(
      { booking: bilty.booking },
      { lrNumber: updates.lrNumber },
      { new: true }
    );
  }

  res.json(bilty);
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const bilty = await Bilty.findByIdAndDelete(req.params.id);
  if (!bilty) {
    return res.status(404).json({ message: 'Bilty not found.' });
  }

  await BillingRecord.findOneAndUpdate(
    { booking: bilty.booking },
    { $unset: { lrNumber: '' } },
    { new: true }
  );

  res.json({ message: 'Bilty deleted.' });
});

module.exports = router;
