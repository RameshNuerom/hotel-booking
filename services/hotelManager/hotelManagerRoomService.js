 
// services/hotelManager/hotelManagerRoomService.js
const roomModel = require('../../models/roomModel'); // Needed for room operations

// --- Room Management (specific to manager's hotel) ---
const createRoomForManagedHotel = async (managerHotelId, roomData) => {
  if (roomData.hotel_id && roomData.hotel_id != managerHotelId) {
    const error = new Error('Cannot create room for a different hotel.');
    error.statusCode = 403;
    throw error;
  }
  roomData.hotel_id = managerHotelId; // Ensure room is linked to manager's hotel
  const newRoom = await roomModel.createRoom(roomData);
  return newRoom;
};

const getRoomsForManagedHotel = async (managerHotelId) => {
  const rooms = await roomModel.findAllRooms(managerHotelId); // findAllRooms already filters by hotel_id
  return rooms;
};

const getRoomDetailsForManagedHotel = async (managerHotelId, roomId) => {
  const room = await roomModel.findRoomById(roomId);
  if (!room || room.hotel_id != managerHotelId) {
    const error = new Error('Room not found or not part of your managed hotel.');
    error.statusCode = 404;
    throw error;
  }
  return room;
};

const updateRoomForManagedHotel = async (managerHotelId, roomId, updateData) => {
  const room = await roomModel.findRoomById(roomId);
  if (!room || room.hotel_id != managerHotelId) {
    const error = new Error('Room not found or not part of your managed hotel.');
    error.statusCode = 404;
    throw error;
  }
  // Ensure hotel_id isn't accidentally changed
  if (updateData.hotel_id && updateData.hotel_id != managerHotelId) {
    const error = new Error('Cannot change room hotel_id.');
    error.statusCode = 403;
    throw error;
  }
  const updatedRoom = await roomModel.updateRoom(roomId, updateData);
  return updatedRoom;
};

const deleteRoomForManagedHotel = async (managerHotelId, roomId) => {
  const room = await roomModel.findRoomById(roomId);
  if (!room || room.hotel_id != managerHotelId) {
    const error = new Error('Room not found or not part of your managed hotel.');
    error.statusCode = 404;
    throw error;
  }
  const deletedRoom = await roomModel.deleteRoom(roomId);
  return deletedRoom;
};

module.exports = {
  createRoomForManagedHotel,
  getRoomsForManagedHotel,
  getRoomDetailsForManagedHotel,
  updateRoomForManagedHotel,
  deleteRoomForManagedHotel,
};