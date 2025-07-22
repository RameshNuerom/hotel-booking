// schemas/hotelSchemas.js
const Joi = require('joi');

const createHotelSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  location: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  amenities: Joi.array().items(Joi.string()).optional(),
  star_rating: Joi.number().integer().min(1).max(5).optional(),
  contact_email: Joi.string().email().optional(),
  contact_phone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).optional(), // Basic phone number pattern
});

const updateHotelSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  location: Joi.string().min(3).max(255).optional(),
  description: Joi.string().min(10).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  star_rating: Joi.number().integer().min(1).max(5).optional(),
  contact_email: Joi.string().email().optional(),
  contact_phone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).optional(),
});

module.exports = {
  createHotelSchema,
  updateHotelSchema,
};