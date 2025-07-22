// routes/adminRoutes.js
const express = require('express');
const adminHotelController = require('../controllers/admin/adminHotelController');
const adminRoomController = require('../controllers/admin/adminRoomController');
const roomAvailabilityController = require('../controllers/admin/roomAvailabilityController');
const adminUserController = require('../controllers/admin/adminUserController'); // NEW: Import adminUserController
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes in this file will require authentication and the 'admin' role.
router.use(protect);
router.use(authorizeRoles('admin'));

// Hotel Management Routes (Admin Only)
router.route('/hotels')
  .post(adminHotelController.createHotel)
  .get(adminHotelController.getAllHotels);

router.route('/hotels/:id')
  .get(adminHotelController.getHotelById)
  .put(adminHotelController.updateHotel)
  .delete(adminHotelController.deleteHotel);

// Room Management Routes (Admin Only)
router.route('/rooms')
  .post(adminRoomController.createRoom)
  .get(adminRoomController.getAllRooms);

router.route('/rooms/:id')
  .get(adminRoomController.getRoomById)
  .put(adminRoomController.updateRoom)
  .delete(adminRoomController.deleteRoom);

// Room Availability Management Routes (Admin Only)
router.route('/room-availability')
  .post(roomAvailabilityController.createOrUpdateAvailability)
  .get(roomAvailabilityController.getRoomAvailability);

router.route('/room-availability/:id')
  .get(roomAvailabilityController.getAvailabilityById)
  .put(roomAvailabilityController.updateAvailabilityRecord)
  .delete(roomAvailabilityController.deleteAvailabilityRecord);

router.post('/room-availability/range', roomAvailabilityController.setAvailabilityForDateRange);


// --- User Management for Admin (MOVED AND CORRECTED) ---
router.put('/users/:id/assign-hotel', adminUserController.updateUserRoleAndHotel);


module.exports = router;