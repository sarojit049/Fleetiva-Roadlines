const Joi = require('joi');

const postTruckSchema = Joi.object({
  vehicleNumber: Joi.string().trim().uppercase().min(2).max(20).required(),
  capacity: Joi.number().positive().required(),
  vehicleType: Joi.string().trim().min(2).max(50).required(),
  currentLocation: Joi.string().trim().min(2).max(200).required()
});

module.exports = {
  postTruckSchema
};
