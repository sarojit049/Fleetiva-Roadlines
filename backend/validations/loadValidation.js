const Joi = require('joi');

const postLoadSchema = Joi.object({
  material: Joi.string().trim().min(2).max(100).required(),
  requiredCapacity: Joi.number().positive().required(),
  from: Joi.string().trim().min(2).max(200).required(),
  to: Joi.string().trim().min(2).max(200).required(),
  consignorName: Joi.string().trim().min(2).max(200).required(),
  consigneeName: Joi.string().trim().min(2).max(200).required()
});

module.exports = {
  postLoadSchema
};
