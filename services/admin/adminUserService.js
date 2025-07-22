// services/admin/adminUserService.js
const userModel = require('../../models/userModel');
const hotelModel = require('../../models/hotelModel'); // Needed to validate hotel_id

// For Admin to update user role and assign hotel_id
const updateUserRoleAndHotel = async (userId, updateData) => {
  const { role, hotel_id } = updateData;

  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // Basic validation:
  if (role && !['admin', 'hotel_manager', 'guest'].includes(role)) {
    const error = new Error('Invalid role specified.');
    error.statusCode = 400;
    throw error;
  }

  // If assigning a hotel_id, ensure the hotel exists
  if (hotel_id !== undefined && hotel_id !== null) {
    const hotel = await hotelModel.findHotelById(hotel_id);
    if (!hotel) {
      const error = new Error('Invalid hotel_id: Hotel not found.');
      error.statusCode = 400;
      throw error;
    }
  }

  // If role is changing FROM hotel_manager and hotel_id is not provided, set hotel_id to null
  // Or if role is changing to 'admin' or 'guest', ensure hotel_id is cleared
  let finalHotelId = hotel_id;
  if (role && (role === 'admin' || role === 'guest') && hotel_id === undefined) {
      finalHotelId = null; // Clear hotel_id if setting to admin/guest unless explicitly provided
  } else if (role === 'hotel_manager' && hotel_id === undefined) {
      // If setting to hotel_manager, but no hotel_id provided, throw error or default to null based on policy
      const error = new Error('hotel_id is required when setting role to hotel_manager.');
      error.statusCode = 400;
      throw error;
  }


  const updatedFields = {};
  if (role !== undefined) updatedFields.role = role;
  if (finalHotelId !== undefined) updatedFields.hotel_id = finalHotelId;

  if (Object.keys(updatedFields).length === 0) {
    const error = new Error('No valid update fields provided.');
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await userModel.updateUser(userId, updatedFields);
  return updatedUser;
};


module.exports = {
  updateUserRoleAndHotel,
};