const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    load: { type: mongoose.Schema.Types.ObjectId, ref: 'Load', required: true },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['assigned', 'in-transit', 'delivered'], default: 'assigned' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    freightAmount: { type: Number, default: 0 },
    advancePaid: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    paymentMode: { type: String, enum: ['cash', 'bank', 'upi', 'card'], default: 'cash' },
    gstAmount: { type: Number, default: 0 },
    from: String,
    to: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
