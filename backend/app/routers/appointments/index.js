// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('./lib/controllers');
const authMiddleware = require('../auth/lib/middlewares');

// All appointment routes require authentication
router.use(authMiddleware.protect);

// Routes for managing appointments
router.route('/')
  .get(appointmentController.getAllAppointments)
  .post(appointmentController.addAppointment);

// Special filter routes
router.get('/today', appointmentController.getTodayAppointments);
router.get('/upcoming', appointmentController.getUpcomingAppointments);
router.get('/past', appointmentController.getPastAppointments);
router.get('/statistics', appointmentController.getStatistics);
router.get('/check-availability', appointmentController.checkAvailability);
router.get('/patient', appointmentController.getPatientAppointments);
router.get('/doctor', appointmentController.getDoctorAppointments);

// Routes for specific appointment by ID
router.route('/:id')
  .get(appointmentController.getAppointmentById)
  .put(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

// Specialized routes
router.patch('/:id/status', appointmentController.updateStatus);
router.patch('/:id/payment', appointmentController.updatePayment);

module.exports = router;