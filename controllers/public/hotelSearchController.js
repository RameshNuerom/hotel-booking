 
// controllers/public/hotelSearchController.js
const roomAvailabilityService = require('../../services/admin/roomAvailabilityService'); // Assuming search logic is here

const searchAvailableRooms = async (req, res, next) => {
  try {
    const { location, checkInDate, checkOutDate, numGuests, roomType } = req.query;

    // Basic validation (more comprehensive validation can be in the service or a dedicated validator)
    if (!checkInDate || !checkOutDate) {
      const error = new Error('Check-in and check-out dates are required.');
      error.statusCode = 400;
      throw error;
    }

    const filters = { location, numGuests, roomType };

    const availableRooms = await roomAvailabilityService.searchAvailableRooms(
      checkInDate,
      checkOutDate,
      filters
    );

    res.status(200).json({
      message: 'Available rooms retrieved successfully!',
      count: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchAvailableRooms,
};