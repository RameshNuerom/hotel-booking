// schemas/roomAvailabilitySchemas.js
const Joi = require('joi');

const availabilityDateSchema = Joi.date().iso().required(); // YYYY-MM-DD format

const createOrUpdateAvailabilitySchema = Joi.object({
  room_id: Joi.number().integer().min(1).required(),
  date: availabilityDateSchema,
  available_rooms: Joi.number().integer().min(0).required(),
  price_override: Joi.number().precision(2).min(0.01).optional().allow(null),
});

const updateAvailabilityRecordSchema = Joi.object({
  available_rooms: Joi.number().integer().min(0).optional(),
  price_override: Joi.number().precision(2).min(0.01).optional().allow(null),
});

const setAvailabilityRangeSchema = Joi.object({
  roomId: Joi.number().integer().min(1).required(),
  startDate: availabilityDateSchema,
  endDate: availabilityDateSchema,
  availableRooms: Joi.number().integer().min(0).required(),
  priceOverride: Joi.number().precision(2).min(0.01).optional().allow(null),
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && new Date(value.startDate) > new Date(value.endDate)) {
    return helpers.error('any.invalid', { message: 'startDate cannot be after endDate' });
  }
  return value;
}, 'date range validation');

const searchAvailabilityQuerySchema = Joi.object({
  location: Joi.string().min(1).optional(),
  checkInDate: availabilityDateSchema,
  checkOutDate: availabilityDateSchema,
  numGuests: Joi.number().integer().min(1).optional(),
  roomType: Joi.string().min(1).optional(),
}).custom((value, helpers) => {
  if (new Date(value.checkInDate) >= new Date(value.checkOutDate)) {
    return helpers.error('any.invalid', { message: 'checkOutDate must be after checkInDate' });
  }
  return value;
}, 'check-in/out date range validation');


module.exports = {
  createOrUpdateAvailabilitySchema,
  updateAvailabilityRecordSchema,
  setAvailabilityRangeSchema,
  searchAvailabilityQuerySchema,
};