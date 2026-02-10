const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true, min: 0 },
    vehicleType: { type: String, required: true },
    currentLocation: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Truck', truckSchema);
