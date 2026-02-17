const Joi = require('joi');

const loadIdSchema = Joi.object({
  loadId: Joi.string().hex().length(24).required()
});

module.exports = {
  loadIdSchema
};
