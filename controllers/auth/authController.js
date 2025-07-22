// controllers/auth/authController.js
const authService = require('../../services/auth/authService');

const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Basic input validation
    if (!username || !email || !password) {
      const error = new Error('Username, email, and password are required.');
      error.statusCode = 400; // Bad Request
      throw error;
    }

    // Call the service to register the user
    const { user, token } = await authService.registerUser(username, email, password, role);

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      const error = new Error('Email and password are required.');
      error.statusCode = 400; // Bad Request
      throw error;
    }

    // Call the service to log in the user
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      message: 'Logged in successfully!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

module.exports = {
  register,
  login,
}; 
