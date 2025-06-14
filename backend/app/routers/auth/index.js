// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('./lib/controllers');
const authMiddleware = require('./lib/middlewares');

// Public routes (no authentication required)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
// IMPORTANT: Middleware must come BEFORE the controller
router.get('/profile', authMiddleware.protect, authController.getProfile);
router.put('/profile', authMiddleware.protect, authController.updateProfile);
router.post('/change-password', authMiddleware.protect, authController.changePassword);

module.exports = router;