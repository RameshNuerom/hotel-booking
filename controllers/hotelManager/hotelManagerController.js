 
// controllers/hotelManager/hotelManagerController.js
const hotelManagerService = require('../../services/hotelManager/hotelManagerService');

// Helper to get manager's hotel ID
const getManagerHotelId = (req) => {
  if (!req.user || !req.user.hotel_id) {
    const error = new Error('Hotel Manager is not assigned to a hotel.');
    error.statusCode = 403;
    throw error;
  }
  return req.user.hotel_id;
};

// --- Hotel Details ---
const getManagedHotelDetails = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const hotel = await hotelManagerService.getManagedHotelDetails(managerHotelId);
    res.status(200).json({
      message: 'Managed hotel details retrieved successfully!',
      hotel,
    });
  } catch (error) {
    next(error);
  }
};

const updateManagedHotelDetails = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const updatedHotel = await hotelManagerService.updateManagedHotelDetails(managerHotelId, req.body);
    res.status(200).json({
      message: 'Managed hotel details updated successfully!',
      hotel: updatedHotel,
    });
  } catch (error) {
    next(error);
  }
};

// --- Room Management ---
const createRoomForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const newRoom = await hotelManagerService.createRoomForManagedHotel(managerHotelId, req.body);
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
    const rooms = await hotelManagerService.getRoomsForManagedHotel(managerHotelId);
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
    const room = await hotelManagerService.getRoomDetailsForManagedHotel(managerHotelId, id);
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
    const updatedRoom = await hotelManagerService.updateRoomForManagedHotel(managerHotelId, id, req.body);
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
    const deletedRoom = await hotelManagerService.deleteRoomForManagedHotel(managerHotelId, id);
    res.status(200).json({
      message: 'Room for managed hotel deleted successfully!',
      deletedRoomId: deletedRoom.id,
    });
  } catch (error) {
    next(error);
  }
};

// --- Room Availability Management ---
const createOrUpdateAvailabilityForManagedRoom = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const newAvailability = await hotelManagerService.createOrUpdateAvailabilityForManagedRoom(managerHotelId, req.body);
    res.status(201).json({
      message: 'Room availability for managed room created or updated successfully!',
      availability: newAvailability,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailabilityForManagedRoom = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { roomId, startDate, endDate } = req.query; // Expecting query params for filtering
    if (!roomId || !startDate || !endDate) {
      const error = new Error('roomId, startDate, and endDate are required query parameters.');
      error.statusCode = 400;
      throw error;
    }
    const availabilityRecords = await hotelManagerService.getAvailabilityForManagedRoom(managerHotelId, roomId, startDate, endDate);
    res.status(200).json({
      message: 'Room availability for managed room retrieved successfully!',
      count: availabilityRecords.length,
      availability: availabilityRecords,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvailabilityRecordForManagedRoom = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { id } = req.params; // Availability ID
    const updatedAvailability = await hotelManagerService.updateAvailabilityRecordForManagedRoom(managerHotelId, id, req.body);
    res.status(200).json({
      message: 'Room availability record for managed room updated successfully!',
      availability: updatedAvailability,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAvailabilityRecordForManagedRoom = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { id } = req.params; // Availability ID
    const deletedAvailability = await hotelManagerService.deleteAvailabilityRecordForManagedRoom(managerHotelId, id);
    res.status(200).json({
      message: 'Room availability record for managed room deleted successfully!',
      deletedAvailabilityId: deletedAvailability.id,
    });
  } catch (error) {
    next(error);
  }
};

const setAvailabilityForManagedRoomDateRange = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { roomId, startDate, endDate, availableRooms, priceOverride } = req.body;
    if (!roomId || !startDate || !endDate || availableRooms === undefined) {
      const error = new Error('roomId, startDate, endDate, and availableRooms are required fields.');
      error.statusCode = 400;
      throw error;
    }
    const results = await hotelManagerService.setAvailabilityForManagedRoomDateRange(
      managerHotelId, roomId, startDate, endDate, availableRooms, priceOverride
    );
    res.status(200).json({
      message: 'Room availability for managed room set for date range successfully!',
      resultsCount: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};


// --- Booking Management ---
const getBookingsForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const bookings = await hotelManagerService.getBookingsForManagedHotel(managerHotelId);
    res.status(200).json({
      message: 'Bookings for managed hotel retrieved successfully!',
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

const getBookingDetailsForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { id } = req.params; // Booking ID
    const booking = await hotelManagerService.getBookingDetailsForManagedHotel(managerHotelId, id);
    res.status(200).json({
      message: 'Booking details for managed hotel retrieved successfully!',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatusForManagedHotel = async (req, res, next) => {
  try {
    const managerHotelId = getManagerHotelId(req);
    const { id } = req.params; // Booking ID
    const { status } = req.body; // New status
    if (!status) {
      const error = new Error('New status is required.');
      error.statusCode = 400;
      throw error;
    }
    const updatedBooking = await hotelManagerService.updateBookingStatusForManagedHotel(managerHotelId, id, status);
    res.status(200).json({
      message: 'Booking status for managed hotel updated successfully!',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getManagedHotelDetails,
  updateManagedHotelDetails,
  createRoomForManagedHotel,
  getRoomsForManagedHotel,
  getRoomDetailsForManagedHotel,
  updateRoomForManagedHotel,
  deleteRoomForManagedHotel,
  createOrUpdateAvailabilityForManagedRoom,
  getAvailabilityForManagedRoom,
  updateAvailabilityRecordForManagedRoom,
  deleteAvailabilityRecordForManagedRoom,
  setAvailabilityForManagedRoomDateRange,
  getBookingsForManagedHotel,
  getBookingDetailsForManagedHotel,
  updateBookingStatusForManagedHotel,
};