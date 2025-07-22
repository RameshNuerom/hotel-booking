 
// controllers/profileController.js
const profileService = require('../services/profileService');

// Get the profile of the authenticated user
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id; // User ID from authenticated token
    const userProfile = await profileService.getUserProfile(userId);
    res.status(200).json({
      message: 'User profile retrieved successfully!',
      user: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

// Update the profile of the authenticated user
const updateMe = async (req, res, next) => {
  try {
    const userId = req.user.id; // User ID from authenticated token
    // Allow updating username, email, and password from the request body
    const { username, email, password } = req.body;
    const updateData = { username, email, password };

    // Remove undefined values to avoid attempting to update non-provided fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedUser = await profileService.updateUserProfile(userId, updateData);
    res.status(200).json({
      message: 'User profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getMe,
  updateMe,
};