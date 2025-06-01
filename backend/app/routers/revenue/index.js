// revenueRoutes.js
const express = require('express');
const router = express.Router();
const revenueController = require('./lib/controllers');
const authMiddleware = require('../auth/lib/middlewares');

// All revenue routes require authentication
router.use(authMiddleware.protect);

// Routes for revenue
router.get('/', authMiddleware.restrictTo('admin', 'superadmin'), revenueController.getAllRevenue);
router.get('/summary', authMiddleware.restrictTo('admin', 'superadmin'), revenueController.getRevenueSummary);
router.get('/doctor/:doctorId', revenueController.getDoctorRevenue);

module.exports = router;