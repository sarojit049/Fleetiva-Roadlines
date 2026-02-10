const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    consignorName: { type: String, required: true },
    consigneeName: { type: String, required: true },
    material: { type: String, required: true },
    requiredCapacity: { type: Number, required: true, min: 0 },
    from: { type: String, required: true },
    to: { type: String, required: true },
    status: { type: String, enum: ['pending', 'matched', 'delivered'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Load', loadSchema);
