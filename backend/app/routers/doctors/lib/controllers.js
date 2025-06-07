// Import models
const User = require('../../../../models/lib/User');
const Doctor = require('../../../../models/lib/Doctor');

const doctorController = {};

/**
 * Get all doctors
 * GET /api/doctors
 */
doctorController.getAllDoctors = async (req, res) => {
  try {
    const { status, department, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add filters if provided
    if (status) filter.status = status;
    if (department) filter.department = department;
    
    // Add search functionality if search term is provided
    let userIds = [];
    if (search) {
      const users = await User.find({
        role: { $in: ['physician', 'surgeon'] },
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      userIds = users.map(user => user._id);
      filter.userId = { $in: userIds };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch doctors with pagination
    const doctors = await Doctor.find(filter)
      .populate('userId', 'firstName lastName email phoneNumber isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Doctor.countDocuments(filter);

    res.json({
      message: 'Doctors retrieved successfully',
      data: doctors,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching doctors',
      details: error.message
    });
  }
};

/**
 * Add a new doctor
 * POST /api/doctors
 */
doctorController.addDoctor = async (req, res) => {
  let createdUser = null;
  
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      specialization, 
      department, 
      experience, 
      consultationFee,
      qualifications,
      availability 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !specialization || !department) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Missing required fields',
        details: 'firstName, lastName, email, password, specialization, and department are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid email format'
      });
    }

    // Validate department against enum
    const validDepartments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'General'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid department',
        details: `Must be one of: ${validDepartments.join(', ')}`
      });
    }

    // Validate and process numeric fields
    const experienceNum = parseInt(experience) || 0;
    const consultationFeeNum = parseInt(consultationFee) || 500;

    if (experienceNum < 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Experience cannot be negative'
      });
    }

    if (consultationFeeNum < 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Consultation fee cannot be negative'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: true,
        message: 'Email already in use'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Create user with doctor role
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password, // This should be hashed in your User model's pre-save middleware
      role: 'doctor',
    });

    createdUser = await newUser.save();

    // Process qualifications - filter out empty ones
    const processedQualifications = qualifications && Array.isArray(qualifications) 
      ? qualifications.filter(qual => 
          qual.degree && qual.degree.trim() && 
          qual.institution && qual.institution.trim()
        ).map(qual => ({
          degree: qual.degree.trim(),
          institution: qual.institution.trim(),
          year: parseInt(qual.year) || new Date().getFullYear()
        }))
      : [];

    // Process availability - validate time formats and ensure all days are present
    const processedAvailability = {};
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    // Default availability template
    const defaultDayAvailability = {
      start: '09:00',
      end: '17:00',
      isAvailable: true
    };

    for (const day of daysOfWeek) {
      if (availability && availability[day]) {
        const dayAvail = availability[day];
        
        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const start = dayAvail.start && timeRegex.test(dayAvail.start) ? dayAvail.start : '09:00';
        const end = dayAvail.end && timeRegex.test(dayAvail.end) ? dayAvail.end : '17:00';
        
        // Ensure end time is after start time
        const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
        const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
        
        if (endMinutes <= startMinutes) {
          // Cleanup: delete the created user if validation fails
          if (createdUser) {
            await User.findByIdAndDelete(createdUser._id);
          }
          return res.status(400).json({
            success: false,
            error: true,
            message: `Invalid time range for ${day}: End time must be after start time`
          });
        }

        processedAvailability[day] = {
          start,
          end,
          isAvailable: Boolean(dayAvail.isAvailable)
        };
      } else {
        // Use default for missing days
        processedAvailability[day] = day === 'sunday' 
          ? { ...defaultDayAvailability, isAvailable: false, start: '09:00', end: '13:00' }
          : defaultDayAvailability;
      }
    }

    // Create doctor profile with all details
    const newDoctor = new Doctor({
      userId: createdUser._id,
      specialization: specialization.trim(),
      department,
      qualifications: processedQualifications,
      experience: experienceNum,
      consultationFee: consultationFeeNum,
      availability: processedAvailability,
      status: 'active',
      ratings: {
        average: 0,
        count: 0
      }
    });

    const savedDoctor = await newDoctor.save();
    
    // Populate user details for response
    await savedDoctor.populate('userId', 'firstName lastName email phoneNumber');

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully with complete profile',
      data: savedDoctor
    });

  } catch (error) {
    console.error('Error adding doctor:', error);
    
    // Cleanup: If user was created but doctor creation failed, delete the user
    if (createdUser && error.name !== 'ValidationError') {
      try {
        await User.findByIdAndDelete(createdUser._id);
        console.log('Cleaned up orphaned user record');
      } catch (cleanupError) {
        console.error('Error cleaning up user record:', cleanupError);
      }
    }
    
    // Determine appropriate status code based on error type
    let statusCode = 400;
    let errorMessage = error.message;

    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
    } else if (error.code === 11000) {
      statusCode = 409;
      if (error.keyPattern && error.keyPattern.email) {
        errorMessage = 'Email already exists';
      } else if (error.keyPattern && error.keyPattern.userId) {
        errorMessage = 'Doctor profile already exists for this user';
      } else {
        errorMessage = 'Duplicate entry detected';
      }
    } else if (error.message.includes('Cast to ObjectId failed')) {
      statusCode = 400;
      errorMessage = 'Invalid user ID format';
    }

    res.status(statusCode).json({
      success: false,
      error: true,
      message: 'Error adding doctor',
      details: errorMessage
    });
  }
};

/**
 * Get a single doctor by ID
 * GET /api/doctors/:id
 */
doctorController.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({userId:req.params.id})
      .populate('userId');
    
    if (!doctor) {
      console.log('Doctor not found');
      
      return res.status(404).json({
        error: true,
        message: 'Doctor not found'
      });
    }

    res.json({
      message: 'Doctor retrieved successfully',
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching doctor',
      details: error.message
    });
  }
};

/**
 * Update a doctor
 * PUT /api/doctors/:id
 */
doctorController.updateDoctor = async (req, res) => {
  let updatedUser = null;
  
  try {
    const doctorId = req.params.id;
    
    // Validate ObjectId format
    if (!doctorId || !doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid doctor ID format'
      });
    }

    // Find the doctor first
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Doctor not found'
      });
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      specialization,
      department,
      experience,
      consultationFee,
      status,
      qualifications,
      availability
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !specialization || !department) {
      console.log(firstName + " " + lastName + " " + email + " " + specialization + " " + department);
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Missing required fields',
        details: 'firstName, lastName, email, specialization, and department are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid email format'
      });
    }

    // Validate department against enum
    const validDepartments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'General'];
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid department',
        details: `Must be one of: ${validDepartments.join(', ')}`
      });
    }

    // Validate status against enum
    const validStatuses = ['active', 'on_leave', 'inactive'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid status',
        details: `Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate numeric fields
    const experienceNum = parseInt(experience) || 0;
    const consultationFeeNum = parseInt(consultationFee) || 500;

    if (experienceNum < 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Experience cannot be negative'
      });
    }

    if (consultationFeeNum < 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Consultation fee cannot be negative'
      });
    }

    // Validate phone number if provided
    if (phoneNumber && phoneNumber.trim() && phoneNumber.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Phone number must be at least 10 digits'
      });
    }

    // Check if email is being changed and if it's already in use by another user
    if (email.toLowerCase().trim() !== doctor.userId.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: doctor.userId }
      });
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: true,
          message: 'Email already in use by another user'
        });
      }
    }

    // Process qualifications - filter out empty ones
    const processedQualifications = qualifications && Array.isArray(qualifications) 
      ? qualifications.filter(qual => 
          qual.degree && qual.degree.trim() && 
          qual.institution && qual.institution.trim()
        ).map(qual => ({
          degree: qual.degree.trim(),
          institution: qual.institution.trim(),
          year: parseInt(qual.year) || new Date().getFullYear()
        }))
      : doctor.qualifications;

    // Process availability if provided
    let processedAvailability = doctor.availability;
    if (availability && typeof availability === 'object') {
      processedAvailability = {};
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      for (const day of daysOfWeek) {
        if (availability[day]) {
          const dayAvail = availability[day];
          
          // Validate time format (HH:MM)
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          const start = dayAvail.start && timeRegex.test(dayAvail.start) ? dayAvail.start : '09:00';
          const end = dayAvail.end && timeRegex.test(dayAvail.end) ? dayAvail.end : '17:00';
          
          // Ensure end time is after start time
          const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
          const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
          
          if (endMinutes <= startMinutes && dayAvail.isAvailable) {
            return res.status(400).json({
              success: false,
              error: true,
              message: `Invalid time range for ${day}: End time must be after start time`
            });
          }

          processedAvailability[day] = {
            start,
            end,
            isAvailable: Boolean(dayAvail.isAvailable)
          };
        } else {
          // Keep existing availability for days not provided
          processedAvailability[day] = doctor.availability[day] || {
            start: '09:00',
            end: '17:00',
            isAvailable: true
          };
        }
      }
    }

    // Update user details first
    const userUpdateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      updatedAt: Date.now()
    };

    // Only update phoneNumber if it's provided and not empty
    if (phoneNumber && phoneNumber.trim()) {
      userUpdateData.phoneNumber = phoneNumber.trim();
    }

    updatedUser = await User.findByIdAndUpdate(
      doctor.userId,
      userUpdateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Associated user not found'
      });
    }

    // Update doctor details
    const doctorUpdateData = {
      specialization: specialization.trim(),
      department,
      qualifications: processedQualifications,
      experience: experienceNum,
      consultationFee: consultationFeeNum,
      availability: processedAvailability,
      updatedAt: Date.now()
    };

    // Only update status if provided
    if (status) {
      doctorUpdateData.status = status;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      doctorUpdateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email phoneNumber');

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Doctor not found after update'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor
    });

  } catch (error) {
    console.error('Error updating doctor:', error);
    
    // If user update succeeded but doctor update failed, revert user changes
    if (updatedUser && error.name === 'ValidationError') {
      try {
        // You might want to revert user changes here if needed
        console.log('Doctor update failed, user was updated successfully');
      } catch (revertError) {
        console.error('Error reverting user changes:', revertError);
      }
    }
    
    // Determine appropriate status code based on error type
    let statusCode = 400;
    let errorMessage = error.message;

    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
    } else if (error.name === 'CastError') {
      statusCode = 400;
      errorMessage = 'Invalid data format';
    } else if (error.code === 11000) {
      statusCode = 409;
      if (error.keyPattern && error.keyPattern.email) {
        errorMessage = 'Email already exists';
      } else {
        errorMessage = 'Duplicate entry detected';
      }
    } else if (error.message.includes('Cast to ObjectId failed')) {
      statusCode = 400;
      errorMessage = 'Invalid ID format';
    }

    res.status(statusCode).json({
      success: false,
      error: true,
      message: 'Error updating doctor',
      details: errorMessage
    });
  }
};

/**
 * Delete a doctor
 * DELETE /api/doctors/:id
 */
doctorController.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        error: true,
        message: 'Doctor not found'
      });
    }

    // Delete doctor profile
    await Doctor.findByIdAndDelete(req.params.id);
    
    // Delete user account
    await User.findByIdAndDelete(doctor.userId);

    res.json({
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error deleting doctor',
      details: error.message
    });
  }
};

/**
 * Get doctors by department
 * GET /api/doctors/department/:department
 */
doctorController.getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await Doctor.find({ 
      department: req.params.department,
      status: 'active'
    })
    .populate('userId', 'firstName lastName email phoneNumber')
    .sort({ experience: -1 });

    res.json({
      message: 'Doctors retrieved successfully',
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching doctors',
      details: error.message
    });
  }
};

/**
 * Update doctor availability
 * PATCH /api/doctors/:id/availability
 */
doctorController.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    
    if (!availability) {
      return res.status(400).json({
        error: true,
        message: 'Availability is required'
      });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availability, updatedAt: Date.now() },
      { new: true }
    ).populate('userId', 'firstName lastName');

    if (!updatedDoctor) {
      return res.status(404).json({
        error: true,
        message: 'Doctor not found'
      });
    }

    res.json({
      message: 'Doctor availability updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error updating availability',
      details: error.message
    });
  }
};

/**
 * Get deletion preview - shows what will be affected when doctor is deleted
 * GET /doctors/:id/deletion-preview
 * 
 * This API shows admin what appointments and records will be affected
 * before actually deleting the doctor
 */
doctorController.getDeletionPreview = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Find the doctor profile
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        error: true,
        message: 'Doctor not found'
      });
    }

    // Find the user account
    const user = await User.findById(doctor.userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Doctor user account not found'
      });
    }

    // Get all appointments for this doctor
    const allAppointments = await Appointment.find({ doctor: doctor.userId })
      .populate('patient', 'firstName lastName email phoneNumber')
      .sort({ appointmentDate: 1 });
    
    // Categorize appointments
    const pendingAppointments = allAppointments.filter(apt => 
      ['upcoming', 'rescheduled', 'check-in'].includes(apt.status)
    );
    
    const completedAppointments = allAppointments.filter(apt => 
      ['completed', 'check-out'].includes(apt.status)
    );
    
    const cancelledAppointments = allAppointments.filter(apt => 
      ['cancelled', 'no-show'].includes(apt.status)
    );

    // Get revenue statistics
    const revenueStats = await Revenue.aggregate([
      { $match: { doctorId: doctor.userId } },
      { 
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    // Get upcoming appointments with patient details
    const upcomingDetails = pendingAppointments.map(apt => ({
      appointmentId: apt._id,
      appointmentDate: apt.appointmentDate,
      patient: {
        name: apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'Unknown',
        email: apt.patient ? apt.patient.email : 'Unknown',
        phone: apt.patient ? apt.patient.phoneNumber : 'Unknown'
      },
      reason: apt.reason,
      status: apt.status,
      amount: apt.amount
    }));

    const deletionImpact = {
      doctor: {
        id: doctorId,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        department: doctor.department,
        specialization: doctor.specialization,
        status: doctor.status
      },
      appointmentImpact: {
        willBeCancelled: pendingAppointments.length,
        willBeMarkedHistorical: completedAppointments.length,
        alreadyCancelled: cancelledAppointments.length,
        totalAppointments: allAppointments.length
      },
      revenueImpact: {
        totalRevenueGenerated: revenueStats[0]?.totalRevenue || 0,
        totalTransactions: revenueStats[0]?.totalTransactions || 0,
        note: "Revenue records will be preserved but marked as historical"
      },
      upcomingAppointments: upcomingDetails,
      warnings: []
    };

    // Add warnings based on impact
    if (pendingAppointments.length > 0) {
      deletionImpact.warnings.push(`${pendingAppointments.length} upcoming appointments will be automatically cancelled`);
    }
    
    if (revenueStats[0]?.totalRevenue > 0) {
      deletionImpact.warnings.push(`₹${revenueStats[0].totalRevenue} in historical revenue records will be preserved but marked`);
    }

    if (pendingAppointments.length > 5) {
      deletionImpact.warnings.push('High number of upcoming appointments - consider reassigning patients to other doctors first');
    }

    res.json({
      message: 'Deletion preview generated successfully',
      data: deletionImpact
    });

  } catch (error) {
    console.error('Error in getDeletionPreview:', error);
    res.status(500).json({
      error: true,
      message: 'Error generating deletion preview',
      details: error.message
    });
  }
};

// Add this method to your existing doctorController object in controllers.js
// Place it before the module.exports line

/**
 * Get all patients connected to the authenticated doctor
 * GET /doctors/my-patients?page=1&limit=10&search=john&status=active
 */
doctorController.getMyPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = 'lastVisit' } = req.query;
    
    // Get the doctor's user ID (from JWT token)
    const doctorUserId = req.user.id;
    
    // Verify the user is actually a doctor
    const doctorProfile = await Doctor.findOne({ userId: doctorUserId });
    if (!doctorProfile) {
      return res.status(403).json({
        error: true,
        message: 'Access denied. Doctor profile not found.'
      });
    }

    // Import required models
    const Appointment = require('../../../../models/lib/Appointment');
    const Revenue = require('../../../../models/lib/Revenue');

    // Find all appointments for this doctor to get connected patients
    const appointmentQuery = { doctor: doctorUserId };
    
    // Add status filter to appointments if provided
    if (status && status !== 'all') {
      if (status === 'active') {
        appointmentQuery.status = { $in: ['upcoming', 'completed', 'check-in', 'check-out'] };
      } else {
        appointmentQuery.status = status;
      }
    }

    // Get all appointments for this doctor
    const appointments = await Appointment.find(appointmentQuery)
      .populate('patient', 'firstName lastName email phoneNumber isActive')
      .sort({ appointmentDate: -1 });

    // Group appointments by patient and get patient statistics
    const patientMap = new Map();
    
    appointments.forEach(appointment => {
      if (!appointment.patient) return;
      
      const patientId = appointment.patient._id.toString();
      
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          patient: appointment.patient,
          appointments: [],
          stats: {
            totalAppointments: 0,
            completedAppointments: 0,
            upcomingAppointments: 0,
            cancelledAppointments: 0,
            totalAmountPaid: 0,
            lastVisitDate: null,
            nextAppointmentDate: null,
            firstVisitDate: null
          }
        });
      }
      
      const patientData = patientMap.get(patientId);
      patientData.appointments.push(appointment);
      
      // Update statistics
      patientData.stats.totalAppointments++;
      
      if (appointment.status === 'completed' || appointment.status === 'check-out') {
        patientData.stats.completedAppointments++;
        if (!patientData.stats.lastVisitDate || appointment.appointmentDate > patientData.stats.lastVisitDate) {
          patientData.stats.lastVisitDate = appointment.appointmentDate;
        }
      }
      
      if (appointment.status === 'upcoming' || appointment.status === 'check-in') {
        patientData.stats.upcomingAppointments++;
        if (!patientData.stats.nextAppointmentDate || appointment.appointmentDate < patientData.stats.nextAppointmentDate) {
          patientData.stats.nextAppointmentDate = appointment.appointmentDate;
        }
      }
      
      if (appointment.status === 'cancelled' || appointment.status === 'no-show') {
        patientData.stats.cancelledAppointments++;
      }
      
      if (appointment.paymentStatus === 'paid') {
        patientData.stats.totalAmountPaid += appointment.amount || 0;
      }
      
      // Track first visit
      if (!patientData.stats.firstVisitDate || appointment.appointmentDate < patientData.stats.firstVisitDate) {
        patientData.stats.firstVisitDate = appointment.appointmentDate;
      }
    });

    // Convert map to array and add search functionality
    let patients = Array.from(patientMap.values());
    
    // Apply search filter
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      patients = patients.filter(item => {
        const patient = item.patient;
        return (
          patient.firstName.toLowerCase().includes(searchTerm) ||
          patient.lastName.toLowerCase().includes(searchTerm) ||
          patient.email.toLowerCase().includes(searchTerm) ||
          (patient.phoneNumber && patient.phoneNumber.includes(searchTerm))
        );
      });
    }

    // Apply sorting
    patients.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.patient.firstName} ${a.patient.lastName}`.localeCompare(`${b.patient.firstName} ${b.patient.lastName}`);
        case 'lastVisit':
          const aDate = a.stats.lastVisitDate || new Date(0);
          const bDate = b.stats.lastVisitDate || new Date(0);
          return bDate - aDate; // Most recent first
        case 'totalVisits':
          return b.stats.completedAppointments - a.stats.completedAppointments;
        case 'totalSpent':
          return b.stats.totalAmountPaid - a.stats.totalAmountPaid;
        case 'nextAppointment':
          const aNext = a.stats.nextAppointmentDate || new Date('9999-12-31');
          const bNext = b.stats.nextAppointmentDate || new Date('9999-12-31');
          return aNext - bNext; // Soonest first
        default:
          return bDate - aDate;
      }
    });

    // Apply pagination
    const total = patients.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedPatients = patients.slice(skip, skip + parseInt(limit));

    // Format response data
    const formattedPatients = paginatedPatients.map(item => {
      const patient = item.patient;
      const stats = item.stats;
      
      return {
        patientId: patient._id,
        personalInfo: {
          name: `${patient.firstName} ${patient.lastName}`,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          isActive: patient.isActive
        },
        appointmentHistory: {
          totalAppointments: stats.totalAppointments,
          completedAppointments: stats.completedAppointments,
          upcomingAppointments: stats.upcomingAppointments,
          cancelledAppointments: stats.cancelledAppointments,
          firstVisitDate: stats.firstVisitDate,
          lastVisitDate: stats.lastVisitDate,
          nextAppointmentDate: stats.nextAppointmentDate
        },
        financialSummary: {
          totalAmountPaid: stats.totalAmountPaid,
          averagePerVisit: stats.completedAppointments > 0 ? 
            Math.round(stats.totalAmountPaid / stats.completedAppointments) : 0
        },
        recentAppointments: item.appointments
          .sort((a, b) => b.appointmentDate - a.appointmentDate)
          .slice(0, 3)
          .map(apt => ({
            appointmentId: apt._id,
            appointmentDate: apt.appointmentDate,
            reason: apt.reason,
            status: apt.status,
            paymentStatus: apt.paymentStatus,
            amount: apt.amount,
            notes: apt.notes
          }))
      };
    });

    // Calculate summary statistics for all patients
    const summary = {
      totalPatients: total,
      activePatients: patients.filter(p => p.patient.isActive).length,
      totalRevenue: patients.reduce((sum, p) => sum + p.stats.totalAmountPaid, 0),
      totalAppointments: patients.reduce((sum, p) => sum + p.stats.totalAppointments, 0),
      patientsWithUpcomingAppointments: patients.filter(p => p.stats.upcomingAppointments > 0).length
    };

    res.json({
      message: 'Patients retrieved successfully',
      data: {
        patients: formattedPatients,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalPatients: total,
          patientsPerPage: parseInt(limit),
          hasNextPage: skip + parseInt(limit) < total,
          hasPreviousPage: parseInt(page) > 1
        },
        summary: summary,
        filters: {
          search: search || null,
          status: status || 'all',
          sortBy: sortBy
        }
      }
    });

  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching patients',
      details: error.message
    });
  }
};

module.exports = doctorController;