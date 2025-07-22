 
// middlewares/validationMiddleware.js
const Joi = require('joi');

/**
 * A generic validation middleware factory.
 * It validates request properties (body, query, params) against a Joi schema.
 * @param {object} schema - An object where keys are 'body', 'query', 'params' and values are Joi schemas.
 * @returns {function} Express middleware function.
 */
const validate = (schema) => (req, res, next) => {
  // Validate req.body
  if (schema.body) {
    const { error } = schema.body.validate(req.body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.statusCode = 400; // Bad Request
      return next(validationError);
    }
  }

  // Validate req.query
  if (schema.query) {
    const { error } = schema.query.validate(req.query);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.statusCode = 400; // Bad Request
      return next(validationError);
    }
  }

  // Validate req.params
  if (schema.params) {
    const { error = null } = schema.params.validate(req.params); // Use default value for error
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.statusCode = 400; // Bad Request
      return next(validationError);
    }
  }

  next(); // Proceed to the next middleware/controller
};

module.exports = validate;