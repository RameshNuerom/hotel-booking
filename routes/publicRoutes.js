// routes/publicRoutes.js
const express = require('express');
const publicViewController = require('../controllers/public/publicViewController');
const hotelSearchController = require('../controllers/public/hotelSearchController');

const router = express.Router();

// --- Public Access Routes (NO AUTHENTICATION REQUIRED) ---

// Get all hotels
router.get('/hotels', publicViewController.getAllHotels);

// Get hotel by ID
router.get('/hotels/:id', publicViewController.getHotelById);

// Get all rooms for a specific hotel
router.get('/hotels/:hotelId/rooms', publicViewController.getRoomsByHotelId);

// Get details of a specific room
router.get('/rooms/:id', publicViewController.getRoomDetailsById);

// Search for available rooms
// Example: /api/public/search?city=Hyderabad&checkInDate=2025-09-01&checkOutDate=2025-09-05&guests=2&minPrice=100&maxPrice=300&starRating=4
// router.get('/search', publicViewController.searchAvailableRooms);

// --- Public Hotel & Room Search ---
router.get('/search', hotelSearchController.searchAvailableRooms); // MOVED: This route now points to the new controller


module.exports = router; 
