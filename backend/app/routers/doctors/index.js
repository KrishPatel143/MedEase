// doctors/index.js - Enhanced with proper delete permissions
const express = require('express');
const router = express.Router();
const doctorController = require('./lib/controllers');
const authMiddleware = require('../auth/lib/middlewares');

// All doctor routes require authentication
router.use(authMiddleware.protect);

// Routes for managing doctors
router.route('/')
  .get(doctorController.getAllDoctors)
  .post(authMiddleware.restrictTo('admin'), doctorController.addDoctor);

// Get doctors by department
router.get('/department/:department', doctorController.getDoctorsByDepartment);

// Routes for specific doctor by ID
router.route('/:id')
  .get(doctorController.getDoctorById)
  .put(doctorController.updateDoctor)
  .delete(authMiddleware.restrictTo('admin' ), doctorController.deleteDoctor);

// Update availability (doctors can update their own, admins can update any)
router.patch('/:id/availability', doctorController.updateAvailability);

// New route: Get appointments that will be affected before deletion (Admin only)
router.get('/:id/deletion-preview', 
  authMiddleware.restrictTo('admin', 'superadmin'), 
  doctorController.getDeletionPreview
);

module.exports = router;