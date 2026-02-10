const mongoose = require('mongoose');

const driverAssignmentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['assigned', 'in-transit', 'delivered'], default: 'assigned' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DriverAssignment', driverAssignmentSchema);
