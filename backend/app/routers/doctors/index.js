// doctors/index.js - Fixed route order to prevent conflicts
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

// Doctor's own patients (authenticated doctor only) - MOVED UP to prevent :id conflict
router.get('/my-patients', 
  authMiddleware.restrictTo('doctor'), 
  doctorController.getMyPatients
);

// Deletion preview route - MOVED UP to prevent :id conflict
router.get('/:id/deletion-preview', 
  authMiddleware.restrictTo('admin', 'superadmin'), 
  doctorController.getDeletionPreview
);

// Update availability route - MOVED UP to prevent :id conflict
router.patch('/:id/availability', doctorController.updateAvailability);

// Routes for specific doctor by ID - MOVED DOWN after specific routes
router.route('/:id')
  .get(doctorController.getDoctorById)
  .put(doctorController.updateDoctor)
  .delete(authMiddleware.restrictTo('admin'), doctorController.deleteDoctor);

module.exports = router;