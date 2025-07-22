// schemas/roomSchemas.js
const Joi = require('joi');

const createRoomSchema = Joi.object({
  hotel_id: Joi.number().integer().min(1).required(),
  room_type: Joi.string().min(3).max(100).required(),
  price_per_night: Joi.number().precision(2).min(0.01).required(),
  capacity: Joi.number().integer().min(1).required(),
  description: Joi.string().min(10).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
});

const updateRoomSchema = Joi.object({
  hotel_id: Joi.number().integer().min(1).optional(), // Can update, but service will ensure manager owns it
  room_type: Joi.string().min(3).max(100).optional(),
  price_per_night: Joi.number().precision(2).min(0.01).optional(),
  capacity: Joi.number().integer().min(1).optional(),
  description: Joi.string().min(10).optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
};