const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid('customer', 'driver', 'admin', 'superadmin').default('customer'),
  companyName: Joi.string().trim().max(200).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const firebaseLoginSchema = Joi.object({
  idToken: Joi.string().required()
});

const firebaseRegisterSchema = Joi.object({
  idToken: Joi.string().required(),
  name: Joi.string().trim().min(2).max(100).required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  role: Joi.string().valid('customer', 'driver', 'admin', 'superadmin').default('customer'),
  companyName: Joi.string().trim().max(200).optional()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(8).max(128).required()
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  firebaseLoginSchema,
  firebaseRegisterSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  listQuerySchema
};
