const mongoose = require('mongoose');

const biltySchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    lrNumber: { type: String, required: true, unique: true, index: true },
    consignorName: { type: String, required: true },
    consigneeName: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    materialType: { type: String, required: true },
    weight: { type: Number, required: true, min: 0 },
    truckType: { type: String, required: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    freightAmount: { type: Number, required: true, min: 0 },
    advancePaid: { type: Number, default: 0, min: 0 },
    balanceAmount: { type: Number, required: true, min: 0 },
    paymentMode: { type: String, enum: ['cash', 'bank', 'upi', 'card'], required: true },
    shipmentStatus: {
      type: String,
      enum: ['assigned', 'in-transit', 'delivered'],
      default: 'assigned',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bilty', biltySchema);
