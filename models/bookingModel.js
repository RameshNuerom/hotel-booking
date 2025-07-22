// models/bookingModel.js
const { query } = require('../config/database');

const createBooking = async (bookingData) => {
  const {
    user_id, room_id, check_in_date, check_out_date,
    num_guests, num_rooms_booked, total_price, status = 'pending'
  } = bookingData;

  const res = await query(
    `INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, num_guests, num_rooms_booked, total_price, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [user_id, room_id, check_in_date, check_out_date, num_guests, num_rooms_booked, total_price, status]
  );
  return res.rows[0];
};

const findBookingById = async (id) => {
  const res = await query('SELECT * FROM bookings WHERE id = $1', [id]);
  return res.rows[0];
};

const findBookingsByUserId = async (userId) => {
  const res = await query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
};

const updateBooking = async (id, bookingData) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const key in bookingData) {
    if (Object.prototype.hasOwnProperty.call(bookingData, key)) {
      fields.push(`${key} = $${paramIndex++}`);
      values.push(bookingData[key]);
    }
  }

  if (fields.length === 0) {
    return findBookingById(id); // No fields to update
  }

  values.push(id); // Add id for the WHERE clause
  const res = await query(
    `UPDATE bookings SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return res.rows[0];
};

const deleteBooking = async (id) => {
  const res = await query('DELETE FROM bookings WHERE id = $1 RETURNING id', [id]);
  return res.rows[0];
};

module.exports = {
  createBooking,
  findBookingById,
  findBookingsByUserId,
  updateBooking,
  deleteBooking,
}; 
