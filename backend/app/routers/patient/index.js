// patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('./lib/controllers');
const authMiddleware = require('../auth/lib/middlewares');

// All patient routes require authentication
router.use(authMiddleware.protect);

// Routes for managing patients
router.route('/')
  .get(patientController.getAllPatients)
  .post( patientController.addPatient);

// Individual patient routes
router.route('/:id')
  .get(patientController.getPatientById)
  .put( patientController.updatePatient); 

module.exports = router;