// services/profileService.js
const userModel = require('../models/userModel');
const { hashPassword } = require('../utils/passwordHash'); // For hashing new passwords

// Get user profile by ID
const getUserProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  // Remove sensitive data before returning
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Update user profile by ID
const updateUserProfile = async (userId, updateData) => {
  const { username, email, password } = updateData;
  const updatedFields = {};

  if (username) {
    updatedFields.username = username;
  }
  if (email) {
    // Basic email format validation can be added here or in controller
    updatedFields.email = email;
  }
  if (password) {
    // Hash new password before storing
    updatedFields.password = await hashPassword(password);
  }

  if (Object.keys(updatedFields).length === 0) {
    const error = new Error('No valid profile update fields provided.');
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await userModel.updateUser(userId, updatedFields);
  if (!updatedUser) {
    const error = new Error('Failed to update user profile.');
    error.statusCode = 500; // Or 404 if user disappeared
    throw error;
  }
  // Remove sensitive data before returning
  const { password: updatedPassword, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
}; 
