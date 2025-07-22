const db = require('../config/database');

const createRoom = async (roomData) => {
  const {
    hotel_id, room_type, description, capacity,
    price_per_night, num_rooms_available, amenities, image_urls
  } = roomData;

  const [room] = await db('rooms')
    .insert({
      hotel_id,
      room_type,
      description,
      capacity,
      price_per_night,
      num_rooms_available,
      amenities,
      image_urls
    })
    .returning('*');

  return room;
};

const findAllRooms = async (hotelId = null) => {
  if (hotelId) {
    return db('rooms').where({ hotel_id: hotelId });
  }
  return db('rooms');
};

const findRoomById = async (id) => {
  const room = await db('rooms').where({ id }).first();
  return room;
};

const updateRoom = async (id, roomData) => {
  const [room] = await db('rooms')
    .where({ id })
    .update({ ...roomData, updated_at: db.fn.now() })
    .returning('*');
  return room;
};

const deleteRoom = async (id) => {
  const [deleted] = await db('rooms').where({ id }).del().returning('id');
  return deleted;
};

module.exports = {
  createRoom,
  findAllRooms,
  findRoomById,
  updateRoom,
  deleteRoom,
};
