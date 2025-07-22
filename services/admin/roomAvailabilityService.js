// services/admin/roomAvailabilityService.js
const roomAvailabilityModel = require('../../models/roomAvailabilityModel');
const roomModel = require('../../models/roomModel'); // To validate room_id
const { format } = require('date-fns'); // For date formatting

const createOrUpdateAvailability = async (availabilityData) => {
  const { room_id, date, available_rooms, price_override } = availabilityData;

  // 1. Validate room_id exists
  const room = await roomModel.findRoomById(room_id);
  if (!room) {
    const error = new Error('Invalid room_id: Room not found.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Validate essential fields
  if (available_rooms < 0) {
    const error = new Error('Available rooms count cannot be negative.');
    error.statusCode = 400;
    throw error;
  }
  if (price_override !== undefined && price_override !== null && price_override <= 0) {
    const error = new Error('Price override must be positive if provided.');
    error.statusCode = 400;
    throw error;
  }

  // Ensure date is in 'YYYY-MM-DD' format for database consistency
  const formattedDate = format(new Date(date), 'yyyy-MM-dd');

  const newAvailability = await roomAvailabilityModel.createAvailability(
    room_id, formattedDate, available_rooms, price_override
  );
  return newAvailability;
};

const getRoomAvailability = async (roomId, startDate, endDate) => {
  // 1. Validate room_id exists
  const room = await roomModel.findRoomById(roomId);
  if (!room) {
    const error = new Error('Invalid room_id: Room not found.');
    error.statusCode = 400; // Or 404 if the context is strictly about getting availability for an existing room
    throw error;
  }

  // 2. Format dates for database query
  const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd');
  const formattedEndDate = format(new Date(endDate), 'yyyy-MM-dd');

  const availabilityRecords = await roomAvailabilityModel.findAvailability(
    roomId, formattedStartDate, formattedEndDate
  );
  return availabilityRecords;
};

const getAvailabilityById = async (availabilityId) => {
  const availability = await roomAvailabilityModel.findAvailabilityById(availabilityId);
  if (!availability) {
    const error = new Error('Room availability record not found.');
    error.statusCode = 404;
    throw error;
  }
  return availability;
};

const updateAvailabilityRecord = async (availabilityId, updateData) => {
  const existingAvailability = await roomAvailabilityModel.findAvailabilityById(availabilityId);
  if (!existingAvailability) {
    const error = new Error('Room availability record not found.');
    error.statusCode = 404;
    throw error;
  }

  // Validate relevant fields if they are being updated
  if (updateData.room_id !== undefined && updateData.room_id !== null) {
    const room = await roomModel.findRoomById(updateData.room_id);
    if (!room) {
      const error = new Error('Invalid room_id: Room not found.');
      error.statusCode = 400;
      throw error;
    }
  }
  if (updateData.available_rooms !== undefined && updateData.available_rooms < 0) {
    const error = new Error('Available rooms count cannot be negative.');
    error.statusCode = 400;
    throw error;
  }
  if (updateData.price_override !== undefined && updateData.price_override !== null && updateData.price_override <= 0) {
    const error = new Error('Price override must be positive if provided.');
    error.statusCode = 400;
    throw error;
  }
  if (updateData.date) {
    updateData.date = format(new Date(updateData.date), 'yyyy-MM-dd'); // Format date if updating
  }

  const updatedAvailability = await roomAvailabilityModel.updateAvailability(availabilityId, updateData);
  return updatedAvailability;
};

const deleteAvailabilityRecord = async (availabilityId) => {
  const existingAvailability = await roomAvailabilityModel.findAvailabilityById(availabilityId);
  if (!existingAvailability) {
    const error = new Error('Room availability record not found.');
    error.statusCode = 404;
    throw error;
  }
  const deletedAvailability = await roomAvailabilityModel.deleteAvailability(availabilityId);
  return deletedAvailability;
};

// --- Helper function to manage availability for a range of dates ---
const setAvailabilityForDateRange = async (roomId, startDate, endDate, availableRooms, priceOverride = null) => {
  const room = await roomModel.findRoomById(roomId);
  if (!room) {
    const error = new Error('Invalid room_id: Room not found.');
    error.statusCode = 400;
    throw error;
  }

  if (availableRooms < 0) {
    const error = new Error('Available rooms count cannot be negative.');
    error.statusCode = 400;
    throw error;
  }
  if (priceOverride !== undefined && priceOverride !== null && priceOverride <= 0) {
    const error = new Error('Price override must be positive if provided.');
    error.statusCode = 400;
    throw error;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const results = [];

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const currentDate = format(d, 'yyyy-MM-dd');
    const result = await roomAvailabilityModel.createAvailability(roomId, currentDate, availableRooms, priceOverride);
    results.push(result);
  }
  return results;
};


module.exports = {
  createOrUpdateAvailability,
  getRoomAvailability,
  getAvailabilityById,
  updateAvailabilityRecord,
  deleteAvailabilityRecord,
  setAvailabilityForDateRange, // New function for bulk updates
};