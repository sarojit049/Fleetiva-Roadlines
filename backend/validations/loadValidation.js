const Joi = require('joi');

const postLoadSchema = Joi.object({
  material: Joi.string().trim().min(2).max(100).required(),
  requiredCapacity: Joi.number().positive().required(),
  from: Joi.string().trim().min(2).max(200).required(),
  to: Joi.string().trim().min(2).max(200).required(),
  consignorName: Joi.string().trim().min(2).max(200).required(),
  consigneeName: Joi.string().trim().min(2).max(200).required()
});

const loadListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().valid('createdAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});

module.exports = {
  postLoadSchema,
  loadListQuerySchema
};
