// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Determine the status code based on the error or default to 500
  const statusCode = err.statusCode || 500;

  // Determine the message
  const message = err.message || 'Something went wrong on the server.';

  // Log the error for debugging purposes (optional, but highly recommended)
  console.error(err.stack); // Logs the full stack trace

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message: message,
    // Include stack trace only in development for debugging
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorHandler; 
