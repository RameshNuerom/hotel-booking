// controllers/bookingController.js
const bookingService = require('../services/bookingService');

// Create a new booking
const createBooking = async (req, res, next) => {
  try {
    // user_id will come from req.user (set by auth middleware)
    const userId = req.user.id;
    const bookingData = { ...req.body, user_id: userId };

    const newBooking = await bookingService.createBooking(bookingData);
    res.status(201).json({
      message: 'Booking created successfully!',
      booking: newBooking,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single booking by ID (for authenticated user or admin/hotel_manager)
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // User making the request
    const userRole = req.user.role; // Role of the user making the request

    const booking = await bookingService.findBookingById(id);

    // Authorization: User can only view their own bookings, unless they are admin/hotel_manager
    if (!booking || (booking.user_id !== userId && userRole !== 'admin' && userRole !== 'hotel_manager')) {
      const error = new Error('Booking not found or unauthorized access.');
      error.statusCode = 404; // Use 404 for not found or unauthorized to prevent enumeration attacks
      throw error;
    }

    res.status(200).json({
      message: 'Booking retrieved successfully!',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings for the authenticated user
const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id; // User making the request
    const bookings = await bookingService.findBookingsByUserId(userId);
    res.status(200).json({
      message: 'My bookings retrieved successfully!',
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel a booking
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const cancelledBooking = await bookingService.cancelBooking(id, userId, userRole);
    res.status(200).json({
      message: 'Booking cancelled successfully!',
      booking: cancelledBooking,
    });
  } catch (error) {
    next(error);
  }
};

// --- Admin/Hotel Manager specific controller functions for booking management ---

// Get all bookings (Admin/Hotel Manager only)
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({
      message: 'All bookings retrieved successfully!',
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status (Admin/Hotel Manager only)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // New status from request body

    if (!status) {
      const error = new Error('New status is required.');
      error.statusCode = 400;
      throw error;
    }

    const updatedBooking = await bookingService.updateBookingStatus(id, status);
    res.status(200).json({
      message: 'Booking status updated successfully!',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createBooking,
  getBookingById,
  getMyBookings,
  cancelBooking,
  // Admin/Hotel Manager specific
  getAllBookings,
  updateBookingStatus,
}; 
