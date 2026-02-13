const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    provider: { type: String, enum: ['local', 'google', 'firebase'] },
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
    ip: { type: String },
    userAgent: { type: String },
    reason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoginLog', loginLogSchema);
