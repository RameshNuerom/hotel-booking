// models/hotelModel.js
const db = require('../config/database'); // This is your Knex instance

// Helper to check if a user is a hotel_manager
const isHotelManager = async (userId) => {
  const res = await db('users').select('role').where({ id: userId });
  return res.length > 0 && res[0].role === 'hotel_manager';
};

const createHotel = async (hotelData) => {
  const {
    name, address, city, state, country, postal_code,
    description, star_rating, image_url, manager_id
  } = hotelData;

  if (manager_id !== undefined && manager_id !== null) {
    const managerExistsAndIsManager = await isHotelManager(manager_id);
    if (!managerExistsAndIsManager) {
      const error = new Error('Provided manager_id does not exist or is not a hotel manager.');
      error.statusCode = 400;
      throw error;
    }
  }

  const res = await db('hotels')
    .insert({
      name, address, city, state, country, postal_code,
      description, star_rating, image_url, manager_id,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');
  return res[0];
};

const findAllHotels = async () => {
  return await db('hotels').select('*');
};

const findHotelById = async (id) => {
  const res = await db('hotels').where({ id }).first();
  return res;
};

const updateHotel = async (id, hotelData) => {
  if (hotelData.manager_id !== undefined && hotelData.manager_id !== null) {
    const managerExistsAndIsManager = await isHotelManager(hotelData.manager_id);
    if (!managerExistsAndIsManager) {
      const error = new Error('Provided manager_id does not exist or is not a hotel manager.');
      error.statusCode = 400;
      throw error;
    }
  }

  await db('hotels')
    .where({ id })
    .update({ ...hotelData, updated_at: db.fn.now() });

  return await findHotelById(id);
};

const deleteHotel = async (id) => {
  const res = await db('hotels').where({ id }).del().returning('id');
  return res[0];
};

module.exports = {
  createHotel,
  findAllHotels,
  findHotelById,
  updateHotel,
  deleteHotel,
  isHotelManager,
};
