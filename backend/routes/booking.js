const express = require('express');
const Booking = require('../models/Booking');
const Load = require('../models/Load');
const Truck = require('../models/Truck');
const Bilty = require('../models/Bilty');
const Payment = require('../models/Payment');
const BillingRecord = require('../models/BillingRecord');
const DriverAssignment = require('../models/DriverAssignment');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/combinedAuth');
const { generateBiltyPDF, generateInvoicePDF } = require('../utils/pdfGenerator');
const { createBookingSchema, updateStatusSchema, updatePaymentSchema } = require('../validations/bookingValidation');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

const router = express.Router();

const generateLRNumber = () =>
  `LR-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const getFreightRate = () => {
  const rate = Number(process.env.FREIGHT_RATE_PER_TON);
  return Number.isFinite(rate) && rate > 0 ? rate : 1000;
};

router.post('/create', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { error, value } = createBookingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }))
    });
  }

  const { loadId, truckId, advancePaid, paymentMode } = value;

  const session = await Booking.startSession();
  let responsePayload;

  try {
    await session.withTransaction(async () => {
      const load = await Load.findOneAndUpdate(
        { _id: loadId, status: 'pending' },
        { $set: { status: 'assigned' } },
        { new: true, session }
      );

      if (!load) {
        const existingLoad = await Load.findById(loadId).session(session);
        if (!existingLoad) {
          throw new AppError('Load not found.', 404);
        }
        throw new AppError('Load is already assigned.', 409);
      }

      const truck = await Truck.findOneAndUpdate(
        { _id: truckId, isAvailable: true },
        { $set: { isAvailable: false } },
        { new: true, session }
      );

      if (!truck) {
        throw new AppError('Truck is not available.', 400);
      }

      const driver = await User.findById(truck.driver).session(session);
      if (!driver) throw new AppError('Driver not found.', 404);

      const freightAmount = load.requiredCapacity * getFreightRate();
      const gstAmount = freightAmount * 0.12;
      const advance = Number(advancePaid) || 0;
      const total = freightAmount + gstAmount;
      const balanceAmount = Math.max(total - advance, 0);

      const [booking] = await Booking.create([
        {
          load: load._id,
          truck: truck._id,
          driver: truck.driver,
          customer: load.customer,
          status: 'assigned',
          paymentStatus: 'pending',
          freightAmount,
          advancePaid: advance,
          balanceAmount,
          paymentMode,
          gstAmount,
          from: load.from,
          to: load.to,
        }
      ], { session });

      let lrNumber = generateLRNumber();
      while (await Bilty.findOne({ lrNumber }).session(session)) {
        lrNumber = generateLRNumber();
      }

      const [bilty] = await Bilty.create([
        {
          booking: booking._id,
          lrNumber,
          consignorName: load.consignorName,
          consigneeName: load.consigneeName,
          pickupLocation: load.from,
          dropLocation: load.to,
          materialType: load.material,
          weight: load.requiredCapacity,
          truckType: truck.vehicleType,
          driverName: driver.name,
          driverPhone: driver.phone,
          vehicleNumber: truck.vehicleNumber,
          freightAmount,
          advancePaid: advance,
          balanceAmount,
          paymentMode,
          shipmentStatus: booking.status,
        }
      ], { session });

      await Payment.create([
        {
          booking: booking._id,
          amount: total,
          advancePaid: advance,
          balanceAmount,
          paymentMode,
          status: 'pending',
        }
      ], { session });

      await BillingRecord.create([
        {
          booking: booking._id,
          customer: booking.customer,
          driver: booking.driver,
          truck: booking.truck,
          load: booking.load,
          lrNumber,
          invoiceNumber: `INV-${booking._id.toString().slice(-6).toUpperCase()}`,
          freightAmount,
          gstAmount,
          totalAmount: total,
          advancePaid: advance,
          balanceAmount,
          paymentMode,
          paymentStatus: booking.paymentStatus,
        }
      ], { session });

      await DriverAssignment.create([
        {
          booking: booking._id,
          driver: truck.driver,
          truck: truck._id,
          assignedBy: req.user.userId,
          status: booking.status,
        }
      ], { session });

      responsePayload = { booking, bilty };
    });
  } finally {
    session.endSession();
  }

  res.status(201).json(responsePayload);
}));

router.get('/all', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('load')
    .populate('driver', 'name phone')
    .populate('truck', 'vehicleNumber vehicleType')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

router.get('/customer/bookings', authenticate, authorize('customer'), asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user.userId })
    .populate('load')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

router.get('/driver/bookings', authenticate, authorize('driver'), asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ driver: req.user.userId })
    .populate('load')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

router.patch('/:id/status', authenticate, authorize('driver'), asyncHandler(async (req, res) => {
  const { error, value } = updateStatusSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }))
    });
  }

  const { status } = value;

  const booking = await Booking.findOne({ _id: req.params.id, driver: req.user.userId });
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });

  booking.status = status;
  await booking.save();

  await DriverAssignment.findOneAndUpdate(
    { booking: booking._id },
    { status },
    { new: true }
  );

  await Bilty.findOneAndUpdate({ booking: booking._id }, { shipmentStatus: status });

  if (status === 'delivered') {
    await Load.findByIdAndUpdate(booking.load, { status: 'delivered' });
  }

  res.json(booking);
}));

router.post('/:id/payment', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { error, value } = updatePaymentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }))
    });
  }

  const { status } = value;

  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });

  booking.paymentStatus = status;
  await booking.save();

  await Payment.findOneAndUpdate(
    { booking: booking._id },
    { status, paidAt: status === 'paid' ? new Date() : null },
    { new: true }
  );

  await BillingRecord.findOneAndUpdate(
    { booking: booking._id },
    { paymentStatus: status, paidAt: status === 'paid' ? new Date() : null },
    { new: true }
  );

  res.json(booking);
}));

router.get('/:id/bilty', authenticate, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });

  const bilty = await Bilty.findOne({ booking: booking._id });
  if (!bilty) return res.status(404).json({ message: 'Bilty not found.' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=bilty-${bilty.lrNumber}.pdf`);
  generateBiltyPDF(bilty, res);
}));

router.get('/:id/invoice', authenticate, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('customer', 'name');
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename=invoice-${booking._id.toString().slice(-6)}.pdf`
  );
  generateInvoicePDF(booking, res);
}));

module.exports = router;
