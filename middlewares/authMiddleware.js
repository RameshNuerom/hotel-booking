// middlewares/authMiddleware.js
const { verifyToken } = require('../utils/jwt');
const userModel = require('../models/userModel'); // To fetch fresh user data if needed (optional but good practice)

/**
 * Middleware to protect routes: verifies JWT and attaches user to request.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token is in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token from "Bearer TOKEN"
      const decoded = verifyToken(token); // Verify token using our utility

      if (!decoded) {
        const error = new Error('Not authorized, token failed or expired.');
        error.statusCode = 401; // Unauthorized
        throw error;
      }

      // Attach user information to the request object
      // It's good practice to fetch the user from DB to ensure it's current,
      // though for basic auth, decoded payload might suffice.
      // We're fetching minimal info to reduce payload.
      const user = await userModel.findUserById(decoded.id);

      if (!user) {
        const error = new Error('Not authorized, user not found.');
        error.statusCode = 401;
        throw error;
      }

      req.user = { id: user.id, role: user.role, email: user.email }; // Attach user info (id, role, email)
      next(); // Proceed to the next middleware/route handler

    } catch (error) {
      // Handle various token verification errors
      if (error.name === 'TokenExpiredError') {
        error.message = 'Token expired, please log in again.';
        error.statusCode = 401;
      } else if (error.name === 'JsonWebTokenError') {
        error.message = 'Invalid token, please log in again.';
        error.statusCode = 401;
      }
      next(error); // Pass the error to the error handling middleware
    }
  }

  if (!token) {
    const error = new Error('Not authorized, no token.');
    error.statusCode = 401;
    next(error);
  }
};

/**
 * Middleware factory to authorize users based on roles.
 * @param {Array<string>} roles - An array of allowed roles (e.g., ['admin', 'hotel_manager'])
 * @returns {function} Express middleware function
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user must be set by the 'protect' middleware before this is called
    if (!req.user || !req.user.role) {
      const error = new Error('User role not found or not authenticated. Ensure protect middleware is used.');
      error.statusCode = 403; // Forbidden
      throw error;
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role (${req.user.role}) is not authorized to access this resource.`);
      error.statusCode = 403; // Forbidden
      throw error;
    }
    next(); // User is authorized, proceed
  };
};

module.exports = {
  protect,
  authorizeRoles,
}; 
