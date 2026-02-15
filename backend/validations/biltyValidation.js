const Joi = require('joi');

const createBiltySchema = Joi.object({
  booking: Joi.string().hex().length(24).required(),
  lrNumber: Joi.string().trim().uppercase().optional(),
  consignorName: Joi.string().trim().min(2).max(200).optional(),
  consigneeName: Joi.string().trim().min(2).max(200).optional(),
  pickupLocation: Joi.string().trim().min(2).max(200).optional(),
  dropLocation: Joi.string().trim().min(2).max(200).optional(),
  materialType: Joi.string().trim().min(2).max(100).optional(),
  weight: Joi.number().positive().optional(),
  truckType: Joi.string().trim().min(2).max(50).optional(),
  driverName: Joi.string().trim().min(2).max(100).optional(),
  driverPhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  vehicleNumber: Joi.string().trim().uppercase().min(2).max(20).optional(),
  freightAmount: Joi.number().min(0).optional(),
  advancePaid: Joi.number().min(0).optional(),
  balanceAmount: Joi.number().min(0).optional(),
  paymentMode: Joi.string().valid('cash', 'online', 'cheque', 'upi').optional(),
  shipmentStatus: Joi.string().valid('assigned', 'in-transit', 'delivered').optional()
});

const updateBiltySchema = Joi.object({
  lrNumber: Joi.string().trim().uppercase().optional(),
  consignorName: Joi.string().trim().min(2).max(200).optional(),
  consigneeName: Joi.string().trim().min(2).max(200).optional(),
  pickupLocation: Joi.string().trim().min(2).max(200).optional(),
  dropLocation: Joi.string().trim().min(2).max(200).optional(),
  materialType: Joi.string().trim().min(2).max(100).optional(),
  weight: Joi.number().positive().optional(),
  truckType: Joi.string().trim().min(2).max(50).optional(),
  driverName: Joi.string().trim().min(2).max(100).optional(),
  driverPhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  vehicleNumber: Joi.string().trim().uppercase().min(2).max(20).optional(),
  freightAmount: Joi.number().min(0).optional(),
  advancePaid: Joi.number().min(0).optional(),
  balanceAmount: Joi.number().min(0).optional(),
  paymentMode: Joi.string().valid('cash', 'online', 'cheque', 'upi').optional(),
  shipmentStatus: Joi.string().valid('assigned', 'in-transit', 'delivered').optional()
}).min(1);

module.exports = {
  createBiltySchema,
  updateBiltySchema
};
