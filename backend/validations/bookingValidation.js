const Joi = require('joi');

const createBookingSchema = Joi.object({
  loadId: Joi.string().hex().length(24).required(),
  truckId: Joi.string().hex().length(24).required(),
  advancePaid: Joi.number().min(0).default(0),
  paymentMode: Joi.string().valid('cash', 'online', 'cheque', 'upi').default('cash')
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('assigned', 'in-transit', 'delivered').required()
});

const updatePaymentSchema = Joi.object({
  status: Joi.string().valid('paid', 'pending').required()
});

module.exports = {
  createBookingSchema,
  updateStatusSchema,
  updatePaymentSchema
};
