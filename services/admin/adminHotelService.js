// services/admin/adminHotelService.js
const hotelModel = require('../../models/hotelModel');
const userModel = require('../../models/userModel'); // To validate manager_id

const createHotel = async (hotelData) => {
  const { manager_id } = hotelData;

  // Validate manager_id if provided: must be an existing user with 'hotel_manager' role
  if (manager_id) {
    const manager = await userModel.findUserById(manager_id);
    if (!manager || manager.role !== 'hotel_manager') {
      const error = new Error('Invalid manager_id: User not found or not a hotel manager.');
      error.statusCode = 400;
      throw error;
    }
  }

  const newHotel = await hotelModel.createHotel(hotelData);
  return newHotel;
};

const getAllHotels = async () => {
  const hotels = await hotelModel.findAllHotels();
  // Optionally, enrich hotel data with manager username
  for (const hotel of hotels) {
    if (hotel.manager_id) {
      const manager = await userModel.findUserById(hotel.manager_id);
      hotel.manager_username = manager ? manager.username : 'N/A';
    } else {
      hotel.manager_username = 'Unassigned';
    }
  }
  return hotels;
};

const getHotelById = async (hotelId) => {
  const hotel = await hotelModel.findHotelById(hotelId);
  if (!hotel) {
    const error = new Error('Hotel not found.');
    error.statusCode = 404;
    throw error;
  }
  // Enrich with manager username
  if (hotel.manager_id) {
    const manager = await userModel.findUserById(hotel.manager_id);
    hotel.manager_username = manager ? manager.username : 'N/A';
  } else {
    hotel.manager_username = 'Unassigned';
  }
  return hotel;
};

const updateHotel = async (hotelId, hotelData) => {
  const existingHotel = await hotelModel.findHotelById(hotelId);
  if (!existingHotel) {
    const error = new Error('Hotel not found.');
    error.statusCode = 404;
    throw error;
  }

  const { manager_id } = hotelData;
  // Validate manager_id if provided for update
  if (manager_id !== undefined && manager_id !== null) {
    const manager = await userModel.findUserById(manager_id);
    if (!manager || manager.role !== 'hotel_manager') {
      const error = new Error('Invalid manager_id: User not found or not a hotel manager.');
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedHotel = await hotelModel.updateHotel(hotelId, hotelData);
  return updatedHotel;
};

const deleteHotel = async (hotelId) => {
  const existingHotel = await hotelModel.findHotelById(hotelId);
  if (!existingHotel) {
    const error = new Error('Hotel not found.');
    error.statusCode = 404;
    throw error;
  }
  const deletedHotel = await hotelModel.deleteHotel(hotelId);
  return deletedHotel;
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
}; 
