// schemas/bookingSchemas.js
const Joi = require('joi');

const bookingDateSchema = Joi.date().iso().required(); // YYYY-MM-DD format

const createBookingSchema = Joi.object({
  room_id: Joi.number().integer().min(1).required(),
  check_in_date: bookingDateSchema,
  check_out_date: bookingDateSchema,
  num_guests: Joi.number().integer().min(1).required(),
  num_rooms_booked: Joi.number().integer().min(1).required(),
}).custom((value, helpers) => {
  if (new Date(value.check_in_date) >= new Date(value.check_out_date)) {
    return helpers.error('any.invalid', { message: 'check_out_date must be after check_in_date' });
  }
  return value;
}, 'check-in/out date range validation');

const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').required(),
});

module.exports = {
  createBookingSchema,
  updateBookingStatusSchema,
};