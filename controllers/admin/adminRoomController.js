// controllers/admin/adminRoomController.js
const adminRoomService = require('../../services/admin/adminRoomService');

const createRoom = async (req, res, next) => {
  try {
    const newRoom = await adminRoomService.createRoom(req.body);
    res.status(201).json({
      message: 'Room created successfully!',
      room: newRoom,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRooms = async (req, res, next) => {
  try {
    // Allows filtering rooms by hotel_id from query parameter (e.g., /api/admin/rooms?hotelId=1)
    const hotelId = req.query.hotelId;
    const rooms = await adminRoomService.getAllRooms(hotelId);
    res.status(200).json({
      message: 'Rooms retrieved successfully!',
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await adminRoomService.getRoomById(id);
    res.status(200).json({
      message: 'Room retrieved successfully!',
      room,
    });
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRoom = await adminRoomService.updateRoom(id, req.body);
    res.status(200).json({
      message: 'Room updated successfully!',
      room: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRoom = await adminRoomService.deleteRoom(id);
    res.status(200).json({
      message: 'Room deleted successfully!',
      deletedRoomId: deletedRoom.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
}; 
