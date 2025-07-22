// services/auth/authService.js
const userModel = require('../../models/userModel');
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const { generateToken } = require('../../utils/jwt');

const registerUser = async (username, email, password, role = 'guest') => {
  // 1. Check if user already exists
  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    const error = new Error('User with this email already exists.');
    error.statusCode = 409; // Conflict
    throw error;
  }

  // 2. Hash the password
  const passwordHash = await hashPassword(password);

  // 3. Create the user in the database
  const newUser = await userModel.createUser(username, email, passwordHash, role);

  // 4. Generate a JWT token for the new user
  const token = generateToken({ id: newUser.id, role: newUser.role });

  return { user: newUser, token };
};

const loginUser = async (email, password) => {
  // 1. Find the user by email
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // 2. Compare the provided password with the stored hash
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // 3. Generate a JWT token
  const token = generateToken({ id: user.id, role: user.role });

  // Return user details (without password hash) and the token
  const { password_hash, ...userWithoutHash } = user; // Destructure to exclude password_hash
  return { user: userWithoutHash, token };
};

module.exports = {
  registerUser,
  loginUser,
}; 
