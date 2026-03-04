const Joi = require('joi');

const postLoadSchema = Joi.object({
  material: Joi.string().trim().min(2).max(100).required(),
  requiredCapacity: Joi.number().positive().required(),
  from: Joi.string().trim().min(2).max(200).required(),
  to: Joi.string().trim().min(2).max(200).required()
    .custom((value, helpers) => {
      if (value.trim().toLowerCase() === helpers.state.ancestors[0].from?.trim().toLowerCase()) {
        return helpers.error('any.invalid');
      }
      return value;
    }).messages({ 'any.invalid': 'Origin and destination cannot be the same.' }),
  consignorName: Joi.string().trim().min(2).max(200).required(),
  consigneeName: Joi.string().trim().min(2).max(200).required(),
});

module.exports = { postLoadSchema };