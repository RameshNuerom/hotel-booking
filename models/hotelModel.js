 
// models/hotelModel.js
const { query } = require('../config/database');

// Helper to check if a user is a hotel_manager
const isHotelManager = async (userId) => {
  const res = await query('SELECT role FROM users WHERE id = $1', [userId]);
  return res.rows.length > 0 && res.rows[0].role === 'hotel_manager';
};

const createHotel = async (hotelData) => {
  const {
    name, address, city, state, country, postal_code,
    description, star_rating, image_url, manager_id
  } = hotelData;

  // Optional: Validate manager_id belongs to an actual hotel_manager user before insert
  if (manager_id !== undefined && manager_id !== null) {
    const managerExistsAndIsManager = await isHotelManager(manager_id);
    if (!managerExistsAndIsManager) {
      const error = new Error('Provided manager_id does not exist or does not belong to a hotel manager.');
      error.statusCode = 400;
      throw error;
    }
  }

  const res = await query(
    `INSERT INTO hotels (name, address, city, state, country, postal_code, description, star_rating, image_url, manager_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [name, address, city, state, country, postal_code, description, star_rating, image_url, manager_id]
  );
  return res.rows[0];
};

const findAllHotels = async () => {
  const res = await query('SELECT * FROM hotels');
  return res.rows;
};

const findHotelById = async (id) => {
  const res = await query('SELECT * FROM hotels WHERE id = $1', [id]);
  return res.rows[0];
};

const updateHotel = async (id, hotelData) => {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const key in hotelData) {
    if (Object.prototype.hasOwnProperty.call(hotelData, key)) {
      if (key === 'manager_id' && hotelData[key] !== undefined && hotelData[key] !== null) {
        const managerExistsAndIsManager = await isHotelManager(hotelData[key]);
        if (!managerExistsAndIsManager) {
          const error = new Error('Provided manager_id does not exist or does not belong to a hotel manager.');
          error.statusCode = 400;
          throw error;
        }
      }
      fields.push(`${key} = $${paramIndex++}`);
      values.push(hotelData[key]);
    }
  }

  if (fields.length === 0) {
    return findHotelById(id); // No fields to update, return current hotel
  }

  values.push(id); // Add id for the WHERE clause
  const res = await query(
    `UPDATE hotels SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return res.rows[0];
};

const deleteHotel = async (id) => {
  const res = await query('DELETE FROM hotels WHERE id = $1 RETURNING id', [id]);
  return res.rows[0]; // Returns the ID of the deleted hotel if successful
};


module.exports = {
  createHotel,
  findAllHotels,
  findHotelById,
  updateHotel,
  deleteHotel,
  isHotelManager // Exported for potential external use or testing
};