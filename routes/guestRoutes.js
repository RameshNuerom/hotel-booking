const express = require('express');
const bookingController = require('../controllers/bookingController');
const profileController = require('../controllers/profileController'); // NEW: Import profileController
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes in this file will require authentication (logged-in user)
router.use(protect);

// --- Booking Routes (Authenticated Users) ---

// Create a new booking
router.post('/bookings', bookingController.createBooking);

// Get all bookings for the authenticated user
router.get('/bookings/my', bookingController.getMyBookings);

// Get a specific booking by ID (accessible by owner, admin, or hotel_manager)
router.get('/bookings/:id', bookingController.getBookingById);

// Cancel a booking by ID (accessible by owner, admin, or hotel_manager)
router.put('/bookings/:id/cancel', bookingController.cancelBooking); // Using PUT for state change

// --- User Profile Routes (Authenticated Users) ---
router.route('/profile')
  .get(profileController.getMe)   // Get my own profile
  .put(profileController.updateMe); // Update my own profile


module.exports = router;