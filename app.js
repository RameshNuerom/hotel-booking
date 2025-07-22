// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes'); // Import public routes

// Import Error Handler Middleware
const errorHandler = require('./middlewares/errorHandler');

// --- Middleware ---
app.use(express.json());

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Hotel Booking Backend!');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes); // Mount public routes under /api/public

// --- Error Handling Middleware ---
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access auth routes at http://localhost:${PORT}/api/auth`);
  console.log(`Access admin routes at http://localhost:${PORT}/api/admin`);
  console.log(`Access public routes at http://localhost:${PORT}/api/public`);
});