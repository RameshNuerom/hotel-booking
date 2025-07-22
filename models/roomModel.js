// models/roomModel.js
const { query } = require('../config/database');

const createRoom = async (roomData) => {
  const {
    hotel_id, room_type, description, capacity,
    price_per_night, num_rooms_available, amenities, image_urls
  } = roomData;

  // Convert array data to PostgreSQL array literal if not already handled by pg-pool (pg library usually does this)
  const amenitiesArray = amenities ? `{${amenities.map(a => `'${a}'`).join(',')}}` : null;
  const imageUrlsArray = image_urls ? `{${image_urls.map(u => `'${u}'`).join(',')}}` : null;


  const res = await query(
    `INSERT INTO rooms (hotel_id, room_type, description, capacity, price_per_night, num_rooms_available, amenities, image_urls)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [hotel_id, room_type, description, capacity, price_per_night, num_rooms_available, amenitiesArray, imageUrlsArray]
  );
  return res.rows[0];
};

const findAllRooms = async (hotelId = null) => {
  let sql = 'SELECT * FROM rooms';
  const params = [];
  if (hotelId) {
    sql += ' WHERE hotel_id = $1';
    params.push(hotelId);
  }
  const res = await query(sql, params);
  return res.rows;
};

const findRoomById = async (id) => {
  const res = await query('SELECT * FROM rooms WHERE id = $1', [id]);
  return res.rows[0];
};

const updateRoom = async (id, roomData) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const key in roomData) {
    if (Object.prototype.hasOwnProperty.call(roomData, key)) {
      let value = roomData[key];
      // Special handling for array types if they are being updated
      if (key === 'amenities' && Array.isArray(value)) {
        value = `{${value.map(a => `'${a}'`).join(',')}}`;
      } else if (key === 'image_urls' && Array.isArray(value)) {
        value = `{${value.map(u => `'${u}'`).join(',')}}`;
      }

      fields.push(`${key} = $${paramIndex++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return findRoomById(id); // No fields to update
  }

  values.push(id); // Add id for the WHERE clause
  const res = await query(
    `UPDATE rooms SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return res.rows[0];
};

const deleteRoom = async (id) => {
  const res = await query('DELETE FROM rooms WHERE id = $1 RETURNING id', [id]);
  return res.rows[0];
};

module.exports = {
  createRoom,
  findAllRooms,
  findRoomById,
  updateRoom,
  deleteRoom,
};