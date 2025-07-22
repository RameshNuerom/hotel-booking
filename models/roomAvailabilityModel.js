 
// models/roomAvailabilityModel.js
const { query } = require('../config/database');

const createAvailability = async (roomId, date, availableRooms, priceOverride = null) => {
  const res = await query(
    `INSERT INTO room_availability (room_id, date, available_rooms, price_override)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (room_id, date) DO UPDATE SET
       available_rooms = EXCLUDED.available_rooms,
       price_override = COALESCE(EXCLUDED.price_override, room_availability.price_override),
       updated_at = NOW()
     RETURNING *`,
    [roomId, date, availableRooms, priceOverride]
  );
  return res.rows[0];
};

const findAvailability = async (roomId, startDate, endDate) => {
  const res = await query(
    `SELECT * FROM room_availability
     WHERE room_id = $1 AND date BETWEEN $2 AND $3
     ORDER BY date`,
    [roomId, startDate, endDate]
  );
  return res.rows;
};

const findAvailabilityById = async (availabilityId) => {
  const res = await query(
    `SELECT * FROM room_availability
     WHERE id = $1`,
    [availabilityId]
  );
  return res.rows[0];
};

const updateAvailability = async (availabilityId, data) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      fields.push(`${key} = $${paramIndex++}`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) {
    return findAvailabilityById(availabilityId); // No fields to update
  }

  values.push(availabilityId); // Add id for the WHERE clause
  const res = await query(
    `UPDATE room_availability SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return res.rows[0];
};

const deleteAvailability = async (availabilityId) => {
  const res = await query('DELETE FROM room_availability WHERE id = $1 RETURNING id', [availabilityId]);
  return res.rows[0];
};

// --- Additional helpers for booking logic (read-only) ---
const getAvailableRoomsForBooking = async (roomId, date) => {
  const res = await query(
    `SELECT available_rooms, COALESCE(price_override, r.price_per_night) AS effective_price
     FROM room_availability ra
     JOIN rooms r ON ra.room_id = r.id
     WHERE ra.room_id = $1 AND ra.date = $2`,
    [roomId, date]
  );
  return res.rows[0]; // Returns { available_rooms, effective_price } or undefined
};


const decrementAvailableRooms = async (roomId, date, quantity) => {
  const res = await query(
    `UPDATE room_availability
     SET available_rooms = available_rooms - $3, updated_at = NOW()
     WHERE room_id = $1 AND date = $2 AND available_rooms >= $3
     RETURNING available_rooms`,
    [roomId, date, quantity]
  );
  return res.rows[0]; // Returns updated available_rooms or undefined if update failed (e.g., not enough rooms)
};

const incrementAvailableRooms = async (roomId, date, quantity) => {
  const res = await query(
    `UPDATE room_availability
     SET available_rooms = available_rooms + $3, updated_at = NOW()
     WHERE room_id = $1 AND date = $2
     RETURNING available_rooms`,
    [roomId, date, quantity]
  );
  return res.rows[0]; // Returns updated available_rooms or undefined if update failed
};


module.exports = {
  createAvailability,
  findAvailability,
  findAvailabilityById,
  updateAvailability,
  deleteAvailability,
  getAvailableRoomsForBooking,
  decrementAvailableRooms,
  incrementAvailableRooms,
};