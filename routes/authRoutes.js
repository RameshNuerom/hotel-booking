// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/auth/authController');

const router = express.Router();

// Public routes for authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router; 
