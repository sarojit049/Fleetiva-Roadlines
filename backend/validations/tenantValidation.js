const Joi = require('joi');

const updateTenantStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
});

module.exports = {
  updateTenantStatusSchema
};
