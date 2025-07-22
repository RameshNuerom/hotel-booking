// controllers/admin/roomAvailabilityController.js
const roomAvailabilityService = require('../../services/admin/roomAvailabilityService');

const createOrUpdateAvailability = async (req, res, next) => {
  try {
    const newAvailability = await roomAvailabilityService.createOrUpdateAvailability(req.body);
    res.status(201).json({
      message: 'Room availability created or updated successfully!',
      availability: newAvailability,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomAvailability = async (req, res, next) => {
  try {
    const { roomId, startDate, endDate } = req.query; // Expecting query params for filtering
    if (!roomId || !startDate || !endDate) {
      const error = new Error('roomId, startDate, and endDate are required query parameters.');
      error.statusCode = 400;
      throw error;
    }
    const availabilityRecords = await roomAvailabilityService.getRoomAvailability(roomId, startDate, endDate);
    res.status(200).json({
      message: 'Room availability retrieved successfully!',
      count: availabilityRecords.length,
      availability: availabilityRecords,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailabilityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const availability = await roomAvailabilityService.getAvailabilityById(id);
    res.status(200).json({
      message: 'Room availability record retrieved successfully!',
      availability,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvailabilityRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedAvailability = await roomAvailabilityService.updateAvailabilityRecord(id, req.body);
    res.status(200).json({
      message: 'Room availability record updated successfully!',
      availability: updatedAvailability,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAvailabilityRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAvailability = await roomAvailabilityService.deleteAvailabilityRecord(id);
    res.status(200).json({
      message: 'Room availability record deleted successfully!',
      deletedAvailabilityId: deletedAvailability.id,
    });
  } catch (error) {
    next(error);
  }
};

const setAvailabilityForDateRange = async (req, res, next) => {
  try {
    const { roomId, startDate, endDate, availableRooms, priceOverride } = req.body;
    if (!roomId || !startDate || !endDate || availableRooms === undefined) {
      const error = new Error('roomId, startDate, endDate, and availableRooms are required fields.');
      error.statusCode = 400;
      throw error;
    }
    const results = await roomAvailabilityService.setAvailabilityForDateRange(
      roomId, startDate, endDate, availableRooms, priceOverride
    );
    res.status(200).json({
      message: 'Room availability set for date range successfully!',
      resultsCount: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createOrUpdateAvailability,
  getRoomAvailability,
  getAvailabilityById,
  updateAvailabilityRecord,
  deleteAvailabilityRecord,
  setAvailabilityForDateRange,
};