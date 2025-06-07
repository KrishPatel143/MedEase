// Import models
const Appointment = require('../../../../models/lib/Appointment');
const User = require('../../../../models/lib/User');
const Doctor = require('../../../../models/lib/Doctor');
const Revenue = require('../../../../models/lib/Revenue');

const appointmentController = {};

/**
 * Get all appointments with optional filtering
 * GET /api/appointments
 */
appointmentController.getAllAppointments = async (req, res) => {
  try {
    const { 
      status, 
      department, 
      doctor, 
      patient, 
      date, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add filters if provided
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;
    
    // Add date filter if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      filter.appointmentDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    // Add search functionality if search term is provided
    if (search) {
      // Find users matching the search term
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      filter.$or = [
        { 'reason': { $regex: search, $options: 'i' } },
        { 'notes': { $regex: search, $options: 'i' } },
        { 'doctor': { $in: userIds } },
        { 'patient': { $in: userIds } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch appointments with pagination
    const appointments = await Appointment.find(filter)
      .populate('patient', 'firstName lastName email phoneNumber')
      .populate('doctor', 'firstName lastName department specialization')
      .sort({ appointmentDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Appointment.countDocuments(filter);

    res.json({
      message: 'Appointments retrieved successfully',
      data: appointments,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching appointments',
      details: error.message
    });
  }
};

/**
 * Get appointments for today
 * GET /api/appointments/today
 */
appointmentController.getTodayAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate('patient', 'firstName lastName email phoneNumber')
    .populate('doctor', 'firstName lastName department specialization')
    .sort({ appointmentDate: 1 });
    
    res.json({
      message: 'Today\'s appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching today\'s appointments',
      details: error.message
    });
  }
};

/**
 * Get upcoming appointments (future dates)
 * GET /api/appointments/upcoming
 */
appointmentController.getUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointments = await Appointment.find({
      appointmentDate: { $gt: today },
      status: { $ne: 'cancelled' }
    })
    .populate('patient', 'firstName lastName email phoneNumber')
    .populate('doctor', 'firstName lastName department specialization')
    .sort({ appointmentDate: 1 })
    .limit(50);
    
    res.json({
      message: 'Upcoming appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching upcoming appointments',
      details: error.message
    });
  }
};

/**
 * Get past appointments
 * GET /api/appointments/past
 */
appointmentController.getPastAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointments = await Appointment.find({
      appointmentDate: { $lt: today }
    })
    .populate('patient', 'firstName lastName email phoneNumber')
    .populate('doctor', 'firstName lastName department specialization')
    .sort({ appointmentDate: -1 })
    .limit(50);
    
    res.json({
      message: 'Past appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching past appointments',
      details: error.message
    });
  }
};

/**
 * Add a new appointment
 * POST /api/appointments
 */
appointmentController.addAppointment = async (req, res) => {
  try {
    console.log(req.body.doctor);
    
    // Check if the doctor exists
    const doctor = await User.findById(req.body.doctor);
    if (!doctor) {
      return res.status(400).json({
        error: true,
        message: 'Doctor not found'
      });
    }
    
    // Get doctor details
    const doctorDetails = await Doctor.findOne({ userId: req.body.doctor });
    if (!doctorDetails) {
      return res.status(400).json({
        error: true,
        message: 'Doctor details not found'
      });
    }
    
    // Check if the patient exists
    const patient = await User.findById(req.body.patient);
    if (!patient) {
      return res.status(400).json({
        error: true,
        message: 'Patient not found'
      });
    }
    
    // Check if the doctor is available at the requested time
    const appointmentDate = new Date(req.body.appointmentDate);
    const appointmentEndTime = new Date(appointmentDate.getTime() + 30 * 60000); // Assuming 30 min duration
    
    const conflictingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      appointmentDate: {
        $lt: appointmentEndTime,
        $gt: new Date(appointmentDate.getTime() - 30 * 60000)
      },
      status: { $ne: 'cancelled' }
    });
    
    if (conflictingAppointment) {
      return res.status(400).json({
        error: true,
        message: 'Doctor is not available at the requested time'
      });
    }

    // Create new appointment with payment details
    const newAppointment = new Appointment({
      patient: req.body.patient,
      doctor: req.body.doctor,
      department: req.body.department || doctorDetails.department,
      appointmentDate: appointmentDate,
      reason: req.body.reason,
      notes: req.body.notes,
      status: req.body.status || 'upcoming',
      amount: doctorDetails.consultationFee,
      paymentStatus: 'pending',
      createdBy: req.user.id
    });

    // Save to database
    const savedAppointment = await newAppointment.save();
    
    // Populate patient and doctor info
    await savedAppointment.populate('patient', 'firstName lastName email phoneNumber');
    await savedAppointment.populate('doctor', 'firstName lastName department specialization');

    res.status(201).json({
      message: 'Appointment added successfully',
      data: savedAppointment
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error adding appointment',
      details: error.message
    });
  }
};

/**
 * Get a single appointment by ID
 * GET /api/appointments/:id
 */
appointmentController.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName email phoneNumber')
      .populate('doctor', 'firstName lastName department specialization')
      .populate('createdBy', 'firstName lastName');
    
    if (!appointment) {
      return res.status(404).json({
        error: true,
        message: 'Appointment not found'
      });
    }

    res.json({
      message: 'Appointment retrieved successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching appointment',
      details: error.message
    });
  }
};

/**
 * Get all appointments for a specific patient
 * GET /api/appointments/patient
 */
appointmentController.getPatientAppointments = async (req, res) => {
  try {
    // Check if user is authenticated and has patient role
    if (!req.user || !req.user.patient) {
      return res.status(403).json({
        error: true,
        message: 'Access denied. Only patients can view their appointments.'
      });
    }

    const patientId = req.user.patient;
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { patient: patientId };
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch appointments with pagination
    const appointments = await Appointment.find(filter)
      .populate('patient', 'firstName lastName email phoneNumber')
      .populate('doctor', 'firstName lastName department specialization')
      .sort({ appointmentDate: -1 }) // Most recent first
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Appointment.countDocuments(filter);

    res.json({
      message: 'Patient appointments retrieved successfully',
      data: appointments,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching patient appointments',
      details: error.message
    });
  }
};

/**
 * Update an appointment
 * PUT /api/appointments/:id
 */
appointmentController.updateAppointment = async (req, res) => {
  try {
    // Check if appointment exists
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        error: true,
        message: 'Appointment not found'
      });
    }
    
    // Check if the doctor is available at the requested time (if time is being updated)
    if (req.body.appointmentDate && req.body.doctor) {
      const appointmentDate = new Date(req.body.appointmentDate);
      const appointmentEndTime = new Date(appointmentDate.getTime() + 30 * 60000); // 30 min duration
      
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        doctor: req.body.doctor,
        appointmentDate: {
          $lt: appointmentEndTime,
          $gt: new Date(appointmentDate.getTime() - 30 * 60000)
        },
        status: { $ne: 'cancelled' }
      });
      
      if (conflictingAppointment) {
        return res.status(400).json({
          error: true,
          message: 'Doctor is not available at the requested time'
        });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        updatedAt: Date.now(),
        updatedBy: req.user.id
      },
      { new: true, runValidators: true }
    )
    .populate('patient', 'firstName lastName email phoneNumber')
    .populate('doctor', 'firstName lastName department specialization');

    res.json({
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error updating appointment',
      details: error.message
    });
  }
};

/**
 * Delete an appointment
 * DELETE /api/appointments/:id
 */
appointmentController.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        error: true,
        message: 'Appointment not found'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error deleting appointment',
      details: error.message
    });
  }
};

/**
 * Update appointment status
 * PATCH /api/appointments/:id/status
 */
appointmentController.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        error: true,
        message: 'Status is required'
      });
    }
    
    // Validate status - Updated to match your Appointment model
    const validStatuses = [
      'upcoming', 
      'completed', 
      'cancelled', 
      'rescheduled', 
      'check-in',     // Added this status
      'check-out',    // Added this status  
      'no-show'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: true,
        message: `Invalid status value. Valid statuses are: ${validStatuses.join(', ')}`
      });
    }

    // Prepare update object
    const updateData = {
      status,
      updatedAt: Date.now(),
      updatedBy: req.user.id
    };

    // Set completedAt timestamp when status is completed
    if (status === 'completed') {
      updateData.completedAt = Date.now();
    }

    // You can add additional logic here for different status transitions
    // For example, validate status transitions:
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        error: true,
        message: 'Appointment not found'
      });
    }

    // Optional: Add status transition validation
    const allowedTransitions = {
      'upcoming': ['check-in', 'cancelled', 'rescheduled', 'no-show'],
      'check-in': ['check-out', 'cancelled', 'no-show'],
      'check-out': ['completed', 'cancelled'],
      'completed': [], // Completed appointments cannot be changed
      'cancelled': ['upcoming', 'rescheduled'], // Allow reactivation
      'rescheduled': ['upcoming', 'cancelled'],
      'no-show': ['upcoming', 'rescheduled']
    };

    const currentStatus = appointment.status;
    const allowedNextStatuses = allowedTransitions[currentStatus] || [];
    
    // Skip validation if user is admin or if it's a valid transition
    const isValidTransition = allowedNextStatuses.includes(status) || currentStatus === status;
    
    if (!isValidTransition && req.user.role !== 'admin') {
      return res.status(400).json({
        error: true,
        message: `Cannot change status from '${currentStatus}' to '${status}'. Allowed transitions: ${allowedNextStatuses.join(', ') || 'none'}`
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('patient', 'firstName lastName email phoneNumber')
    .populate('doctor', 'firstName lastName department specialization');

    if (!updatedAppointment) {
      return res.status(404).json({
        error: true,
        message: 'Appointment not found'
      });
    }

    // Log the status change for audit purposes
    console.log(`Appointment ${req.params.id} status changed from '${currentStatus}' to '${status}' by user ${req.user.id}`);

    res.json({
      message: 'Appointment status updated successfully',
      data: updatedAppointment,
      previousStatus: currentStatus,
      newStatus: status
    });
    
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      error: true,
      message: 'Error updating appointment status',
      details: error.message
    });
  }
};

/**
 * Update payment status and create revenue record
 * PATCH /api/appointments/:id/payment
 */
appointmentController.updatePayment = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod, transactionId } = req.body;
    
    if (!paymentStatus || !paymentMethod) {
      return res.status(400).json({
        error: true,
        message: 'Payment status and method are required'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        error: true,
        message: 'Appointment not found'
      });
    }

    // Update appointment payment details
    appointment.paymentStatus = paymentStatus;
    appointment.paymentMethod = paymentMethod;
    if (paymentStatus === 'paid') {
      appointment.paymentDate = Date.now();
    }
    await appointment.save();

    // Create revenue record if payment is successful
    if (paymentStatus === 'paid') {
      const revenue = new Revenue({
        appointmentId: appointment._id,
        patientId: appointment.patient,
        doctorId: appointment.doctor,
        amount: appointment.amount,
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        status: 'success',
        description: `Payment for ${appointment.reason}`
      });
      await revenue.save();
    }

    res.json({
      message: 'Payment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error updating payment',
      details: error.message
    });
  }
};

/**
 * Get appointment statistics
 * GET /api/appointments/statistics
 */
appointmentController.getStatistics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get counts for different statuses
    const upcomingCount = await Appointment.countDocuments({ 
      status: 'upcoming',
      appointmentDate: { $gte: today }
    });
    
    const todayCount = await Appointment.countDocuments({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    const completedCount = await Appointment.countDocuments({ 
      status: 'completed' 
    });
    
    const cancelledCount = await Appointment.countDocuments({ 
      status: 'cancelled' 
    });
    
    // Get department statistics
    const departmentStats = await Appointment.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get revenue statistics
    const revenueStats = await Revenue.aggregate([
      { $match: { status: 'success' } },
      { $group: { 
        _id: null, 
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }}
    ]);
    
    res.json({
      message: 'Appointment statistics retrieved successfully',
      data: {
        counts: {
          upcoming: upcomingCount,
          today: todayCount,
          completed: completedCount,
          cancelled: cancelledCount,
          total: upcomingCount + completedCount + cancelledCount
        },
        departments: departmentStats,
        revenue: revenueStats[0] || { total: 0, count: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching appointment statistics',
      details: error.message
    });
  }
};

/**
 * Check doctor availability
 * GET /api/appointments/check-availability
 */
appointmentController.checkAvailability = async (req, res) => {
  try {
    const { doctorId, date, appointmentId } = req.query;
    
    if (!doctorId || !date) {
      return res.status(400).json({
        error: true,
        message: 'Doctor ID and date are required'
      });
    }
    
    // Parse the date string
    const requestedDate = new Date(date);
    const startTime = new Date(requestedDate);
    startTime.setMinutes(startTime.getMinutes() - 30);
    
    const endTime = new Date(requestedDate);
    endTime.setMinutes(endTime.getMinutes() + 30);
    
    // Build query to check for conflicts
    const query = {
      doctor: doctorId,
      appointmentDate: {
        $gt: startTime,
        $lt: endTime
      },
      status: { $ne: 'cancelled' }
    };
    
    // If we're checking for an existing appointment, exclude it from the search
    if (appointmentId) {
      query._id = { $ne: appointmentId };
    }
    
    const conflicts = await Appointment.find(query);
    
    res.json({
      message: 'Availability checked successfully',
      data: {
        available: conflicts.length === 0,
        conflicts: conflicts
      }
    });
    
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error checking availability',
      details: error.message
    });
  }
};

/**
 * Get all appointments for the authenticated doctor
 * GET /api/appointments/doctor
 */
appointmentController.getDoctorAppointments = async (req, res) => {
  try {
    // Check if user is authenticated and has doctor role
    if (!req.user) {
      return res.status(403).json({
        error: true,
        message: 'Access denied. Only doctors can view their appointments.'
      });
    }

    const doctorId = req.user.id;
    const { status, date, search, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { doctor: doctorId };
    if (status) filter.status = status;

    // Add date filter if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      filter.appointmentDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Add search functionality if search term is provided
    if (search) {
      // Find users matching the search term
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      filter.$or = [
        { 'reason': { $regex: search, $options: 'i' } },
        { 'notes': { $regex: search, $options: 'i' } },
        { 'patient': { $in: userIds } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch appointments with pagination
    const appointments = await Appointment.find(filter)
      .populate('patient', 'firstName lastName email phoneNumber')
      .populate('doctor', 'firstName lastName department specialization')
      .sort({ appointmentDate: -1 }) // Most recent first
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Appointment.countDocuments(filter);

    res.json({
      message: 'Doctor appointments retrieved successfully',
      data: appointments,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching doctor appointments',
      details: error.message
    });
  }
};

module.exports = appointmentController;