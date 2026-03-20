const Joi = require('joi');

const DEFAULT_OPTIONS = {
  abortEarly: false,
  stripUnknown: true,
};

const formatValidationErrors = (details, location) =>
  details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message,
    location,
  }));

const validateRequest = (schemas = {}, options = {}) => {
  const validationOptions = { ...DEFAULT_OPTIONS, ...options };

  return (req, res, next) => {
    const errors = [];

    for (const location of ['body', 'params', 'query']) {
      const schema = schemas[location];
      if (!schema || !Joi.isSchema(schema)) continue;

      const { error, value } = schema.validate(req[location], validationOptions);

      if (error) {
        errors.push(...formatValidationErrors(error.details, location));
        continue;
      }

      req[location] = value;
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    return next();
  };
};

module.exports = validateRequest;