// services/admin/adminRoomService.js
const roomModel = require('../../models/roomModel');
const hotelModel = require('../../models/hotelModel'); // To validate hotel_id

const createRoom = async (roomData) => {
  const { hotel_id, capacity, price_per_night, num_rooms_available } = roomData;

  // 1. Validate hotel_id exists
  const hotel = await hotelModel.findHotelById(hotel_id);
  if (!hotel) {
    const error = new Error('Invalid hotel_id: Hotel not found.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Validate essential fields
  if (capacity <= 0 || price_per_night <= 0 || num_rooms_available < 0) {
    const error = new Error('Capacity, price per night must be positive. Number of rooms available must be non-negative.');
    error.statusCode = 400;
    throw error;
  }

  const newRoom = await roomModel.createRoom(roomData);
  return newRoom;
};

const getAllRooms = async (hotelId = null) => {
  // If a hotelId is provided, retrieve rooms for that specific hotel
  if (hotelId) {
    const hotel = await hotelModel.findHotelById(hotelId);
    if (!hotel) {
      const error = new Error('Hotel not found.');
      error.statusCode = 404;
      throw error;
    }
  }
  const rooms = await roomModel.findAllRooms(hotelId);
  return rooms;
};

const getRoomById = async (roomId) => {
  const room = await roomModel.findRoomById(roomId);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }
  return room;
};

const updateRoom = async (roomId, roomData) => {
  const existingRoom = await roomModel.findRoomById(roomId);
  if (!existingRoom) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }

  // Validate hotel_id if it's being updated
  if (roomData.hotel_id !== undefined && roomData.hotel_id !== null && roomData.hotel_id !== existingRoom.hotel_id) {
    const hotel = await hotelModel.findHotelById(roomData.hotel_id);
    if (!hotel) {
      const error = new Error('Invalid hotel_id: Hotel not found.');
      error.statusCode = 400;
      throw error;
    }
  }

  // Validate numeric fields if they are being updated
  if (roomData.capacity !== undefined && roomData.capacity <= 0) {
    const error = new Error('Capacity must be positive.');
    error.statusCode = 400;
    throw error;
  }
  if (roomData.price_per_night !== undefined && roomData.price_per_night <= 0) {
    const error = new Error('Price per night must be positive.');
    error.statusCode = 400;
    throw error;
  }
  if (roomData.num_rooms_available !== undefined && roomData.num_rooms_available < 0) {
    const error = new Error('Number of rooms available must be non-negative.');
    error.statusCode = 400;
    throw error;
  }

  const updatedRoom = await roomModel.updateRoom(roomId, roomData);
  return updatedRoom;
};

const deleteRoom = async (roomId) => {
  const existingRoom = await roomModel.findRoomById(roomId);
  if (!existingRoom) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }
  const deletedRoom = await roomModel.deleteRoom(roomId);
  return deletedRoom;
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
}; 
