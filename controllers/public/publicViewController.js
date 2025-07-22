// controllers/public/publicViewController.js
const publicViewService = require('../../services/public/publicViewService');

const getAllHotels = async (req, res, next) => {
  try {
    const hotels = await publicViewService.getAllHotels();
    res.status(200).json({
      message: 'Hotels retrieved successfully!',
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    next(error);
  }
};

const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await publicViewService.getHotelById(id);
    res.status(200).json({
      message: 'Hotel retrieved successfully!',
      hotel,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomsByHotelId = async (req, res, next) => {
  try {
    const { hotelId } = req.params; // Expecting hotel ID from URL params
    const rooms = await publicViewService.getRoomsByHotelId(hotelId);
    res.status(200).json({
      message: `Rooms for hotel ID ${hotelId} retrieved successfully!`,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params; // Expecting room ID from URL params
    const room = await publicViewService.getRoomDetailsById(id);
    res.status(200).json({
      message: 'Room details retrieved successfully!',
      room,
    });
  } catch (error) {
    next(error);
  }
};

const searchAvailableRooms = async (req, res, next) => {
  try {
    // Search criteria passed via query parameters
    const { city, checkInDate, checkOutDate, guests, minPrice, maxPrice, starRating } = req.query;

    const searchCriteria = {
      city,
      checkInDate,
      checkOutDate,
      guests: guests ? parseInt(guests, 10) : undefined, // Parse to integer
      minPrice: minPrice ? parseFloat(minPrice) : undefined, // Parse to float
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      starRating: starRating ? parseInt(starRating, 10) : undefined,
    };

    const results = await publicViewService.searchAvailableRooms(searchCriteria);
    res.status(200).json({
      message: 'Available rooms search completed successfully!',
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHotels,
  getHotelById,
  getRoomsByHotelId,
  getRoomDetailsById,
  searchAvailableRooms,
};