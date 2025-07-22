 
// controllers/admin/adminUserController.js
const adminUserService = require('../../services/admin/adminUserService'); // NEW: Import adminUserService

// Update user role and assign hotel (Admin only)
const updateUserRoleAndHotel = async (req, res, next) => {
  try {
    const { id } = req.params; // User ID to update
    const { role, hotel_id } = req.body; // New role and hotel_id

    // Ensure that an admin cannot change their own role or assign themselves a hotel_id
    // This is a safety measure; full self-management prevention could be more complex.
    if (req.user.id == id && (role || hotel_id !== undefined)) { // Use == for comparison as id from params is string
      const error = new Error('Admin cannot change their own role or hotel assignment via this endpoint.');
      error.statusCode = 403;
      throw error;
    }

    const updatedUser = await adminUserService.updateUserRoleAndHotel(id, { role, hotel_id });
    res.status(200).json({
      message: 'User role and/or hotel assigned successfully!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUserRoleAndHotel,
};