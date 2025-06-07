// doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('./lib/controllers');
const authMiddleware = require('../auth/lib/middlewares');

// All doctor routes require authentication
router.use(authMiddleware.protect);

// Routes for managing doctors
router.route('/')
  .get(doctorController.getAllDoctors)
  .post(authMiddleware.restrictTo('admin', 'superadmin'), doctorController.addDoctor);

// Get doctors by department
router.get('/department/:department', doctorController.getDoctorsByDepartment);

router.route('/:id')
  .get(doctorController.getDoctorById)
  .put(authMiddleware.restrictTo('admin', 'superadmin'), doctorController.updateDoctor)
  .delete(authMiddleware.restrictTo('admin' ), doctorController.deleteDoctor);

// Update availability
router.patch('/:id/availability', doctorController.updateAvailability);

module.exports = router;