const Joi = require('joi');

const createBiltySchema = Joi.object({
  booking: Joi.string().hex().length(24).required(),
  lrNumber: Joi.string().trim().uppercase().optional(), // autopopulated if missing
  consignorName: Joi.string().trim().min(2).max(200).required(),
  consigneeName: Joi.string().trim().min(2).max(200).required(),
  pickupLocation: Joi.string().trim().min(2).max(200).required(),
  dropLocation: Joi.string().trim().min(2).max(200).required(),
  materialType: Joi.string().trim().min(2).max(100).required(),
  weight: Joi.number().positive().required(),
  truckType: Joi.string().trim().min(2).max(50).required(),
  driverName: Joi.string().trim().min(2).max(100).required(),
  driverPhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  vehicleNumber: Joi.string().trim().uppercase().min(2).max(20).required(),
  freightAmount: Joi.number().min(0).required(),
  advancePaid: Joi.number().min(0).default(0),
  balanceAmount: Joi.number().min(0).required(),
  paymentMode: Joi.string().valid('cash', 'bank', 'upi', 'card').required(),
  shipmentStatus: Joi.string().valid('assigned', 'in-transit', 'delivered').default('assigned')
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
  paymentMode: Joi.string().valid('cash', 'bank', 'upi', 'card').optional(),
  shipmentStatus: Joi.string().valid('assigned', 'in-transit', 'delivered').optional()
}).min(1);

module.exports = {
  createBiltySchema,
  updateBiltySchema
};
