// services/public/publicViewService.js
const hotelModel = require('../../models/hotelModel');
const roomModel = require('../../models/roomModel');
const roomAvailabilityModel = require('../../models/roomAvailabilityModel');
const { format, eachDayOfInterval, isAfter, parseISO } = require('date-fns'); // For date operations

const getAllHotels = async () => {
  const hotels = await hotelModel.findAllHotels();
  return hotels;
};

const getHotelById = async (hotelId) => {
  const hotel = await hotelModel.findHotelById(hotelId);
  if (!hotel) {
    const error = new Error('Hotel not found.');
    error.statusCode = 404;
    throw error;
  }
  return hotel;
};

const getRoomsByHotelId = async (hotelId) => {
  const rooms = await roomModel.findAllRooms(hotelId);
  // Optionally enrich rooms with hotel name if needed, but for public view often simpler data is fine.
  return rooms;
};

const getRoomDetailsById = async (roomId) => {
  const room = await roomModel.findRoomById(roomId);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }
  return room;
};

/**
 * Searches for available rooms within a date range and filters by criteria.
 * @param {Object} searchCriteria - Object containing search parameters.
 * @param {string} searchCriteria.city - City to search in.
 * @param {string} searchCriteria.checkInDate - Start date (YYYY-MM-DD).
 * @param {string} searchCriteria.checkOutDate - End date (YYYY-MM-DD).
 * @param {number} [searchCriteria.guests] - Number of guests (optional).
 * @param {number} [searchCriteria.minPrice] - Minimum price (optional).
 * @param {number} [searchCriteria.maxPrice] - Maximum price (optional).
 * @param {number} [searchCriteria.starRating] - Minimum star rating (optional).
 * @returns {Array} - List of hotels with available rooms matching criteria.
 */
const searchAvailableRooms = async (searchCriteria) => {
  const { city, checkInDate, checkOutDate, guests, minPrice, maxPrice, starRating } = searchCriteria;

  if (!city || !checkInDate || !checkOutDate) {
    const error = new Error('City, check-in date, and check-out date are required for search.');
    error.statusCode = 400;
    throw error;
  }

  const parsedCheckIn = parseISO(checkInDate);
  const parsedCheckOut = parseISO(checkOutDate);

  if (!isAfter(parsedCheckOut, parsedCheckIn)) {
    const error = new Error('Check-out date must be after check-in date.');
    error.statusCode = 400;
    throw error;
  }

  // Get all hotels in the specified city, optionally filtered by star rating
  let hotelsQuery = `SELECT * FROM hotels WHERE city ILIKE $1`;
  const hotelParams = [`%${city}%`];
  if (starRating) {
    hotelsQuery += ` AND star_rating >= $${hotelParams.length + 1}`;
    hotelParams.push(starRating);
  }
  const { rows: hotels } = await hotelModel.query(hotelsQuery, hotelParams);

  const results = [];

  for (const hotel of hotels) {
    // Get all room types for the current hotel
    const roomTypes = await roomModel.findAllRooms(hotel.id);
    const availableRoomsInHotel = [];

    for (const room of roomTypes) {
      if (guests && room.capacity < guests) {
        continue; // Skip if room capacity is less than requested guests
      }

      const datesInInterval = eachDayOfInterval({ start: parsedCheckIn, end: parsedCheckOut });
      let allDatesAvailable = true;
      let minEffectivePriceForRoom = Infinity;

      for (const day of datesInInterval) {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const availability = await roomAvailabilityModel.getAvailableRoomsForBooking(room.id, formattedDate);

        if (!availability || availability.available_rooms <= 0) {
          allDatesAvailable = false;
          break; // This room type is not available for one of the dates
        }
        // Track the highest effective price for this room over the period for overall price check
        minEffectivePriceForRoom = Math.min(minEffectivePriceForRoom, parseFloat(availability.effective_price));
      }

      if (allDatesAvailable) {
        // Filter by price if minPrice or maxPrice are provided
        const roomPrice = minEffectivePriceForRoom; // Use the min effective price found
        if ((minPrice && roomPrice < minPrice) || (maxPrice && roomPrice > maxPrice)) {
          continue; // Skip if price out of range
        }
        availableRoomsInHotel.push(room);
      }
    }

    if (availableRoomsInHotel.length > 0) {
      results.push({
        hotel: hotel,
        available_room_types: availableRoomsInHotel,
      });
    }
  }
  return results;
};


module.exports = {
  getAllHotels,
  getHotelById,
  getRoomsByHotelId,
  getRoomDetailsById,
  searchAvailableRooms,
};