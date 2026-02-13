const mongoose = require('mongoose');

const billingRecordSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    load: { type: mongoose.Schema.Types.ObjectId, ref: 'Load' },
    lrNumber: { type: String, index: true },
    invoiceNumber: { type: String, index: true },
    freightAmount: { type: Number, required: true, min: 0 },
    gstAmount: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    advancePaid: { type: Number, default: 0, min: 0 },
    balanceAmount: { type: Number, required: true, min: 0 },
    paymentMode: { type: String, enum: ['cash', 'bank', 'upi', 'card'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BillingRecord', billingRecordSchema);
