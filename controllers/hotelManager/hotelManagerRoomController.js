 
// controllers/hotelManager/hotelManagerRoomController.js
const hotelManagerRoomService = require('../../services/hotelManager/hotelManagerRoomService'); // NEW: Import new service

// Helper to get manager's hotel ID (duplicate from hotelManagerController for now, consider a common util)
const getManagerHotelId = (req) => {
  if (!req.user || !req.user.hotel_id) {
    const error = new Error('Hotel Manager is not assigned to a hotel.');
    error.statusCode = 403;
    throw error;
  }
  return req.user.hotel_id;
};

// --- Room Management ---
const createRoomForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const newRoom = await hotelManagerRoomService.createRoomForManagedHotel(managerHotelId, req.body);
    res.status(201).json({
      message: 'Room created for managed hotel successfully!',
      room: newRoom,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomsForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const rooms = await hotelManagerRoomService.getRoomsForManagedHotel(managerHotelId);
    res.status(200).json({
      message: 'Rooms for managed hotel retrieved successfully!',
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomDetailsForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { id } = req.params; // Room ID
    const room = await hotelManagerRoomService.getRoomDetailsForManagedHotel(managerHotelId, id);
    res.status(200).json({
      message: 'Room details for managed hotel retrieved successfully!',
      room,
    });
  } catch (error) {
    next(error);
  }
};

const updateRoomForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { id } = req.params; // Room ID
    const updatedRoom = await hotelManagerRoomService.updateRoomForManagedHotel(managerHotelId, id, req.body);
    res.status(200).json({
      message: 'Room for managed hotel updated successfully!',
      room: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoomForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { id } = req.params; // Room ID
    const deletedRoom = await hotelManagerRoomService.deleteRoomForManagedHotel(managerHotelId, id);
    res.status(200).json({
      message: 'Room for managed hotel deleted successfully!',
      deletedRoomId: deletedRoom.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoomForManagedHotel,
  getRoomsForManagedHotel,
  getRoomDetailsForManagedHotel,
  updateRoomForManagedHotel,
  deleteRoomForManagedHotel,
};