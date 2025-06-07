// patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('./lib/controllers/patientController');
const authMiddleware = require('../auth/lib/middlewares');

// All patient routes require authentication
router.use(authMiddleware.protect);

// Routes for managing patients
router.route('/')
  .get(patientController.getAllPatients)  // GET /api/patients - Get all patients with pagination and search
  .post( patientController.addPatient);  // POST /api/patients - Add new patient

// Individual patient routes
router.route('/:id')
  .get(patientController.getPatientById)  // GET /api/patients/:id - Get specific patient
  .put( patientController.updatePatient);  // PUT /api/patients/:id - Update patient

module.exports = router;