// finance/index.js
const express = require('express');
const router = express.Router();
const financeController = require('./lib/controllers');
const authMiddleware = require('../auth/lib/middlewares');

// All finance routes require authentication
router.use(authMiddleware.protect);

// Payment processing routes
router.post('/payment/process', financeController.processPayment);
router.get('/payment/history/:patientId', financeController.getPatientPaymentHistory);

// Admin-only financial reporting routes
router.get('/reports/doctor-revenue/:doctorId', 
  authMiddleware.restrictTo('admin'), 
  financeController.getDoctorMonthlyRevenue
);

router.get('/reports/patient-spending/:patientId', 
  authMiddleware.restrictTo('admin'), 
  financeController.getPatientMonthlySpending
);

router.get('/reports/patient-invoice/:patientId', 
  financeController.generatePatientInvoicePDF
);

router.get('/reports/department-revenue', 
  authMiddleware.restrictTo('admin'), 
  financeController.getDepartmentRevenue
);

module.exports = router;