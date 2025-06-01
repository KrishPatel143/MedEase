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
  try {
    // First create the user account
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'Email already in use'
      });
    }

    // Create user with doctor role
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: 'doctor',
    });

    const savedUser = await newUser.save();

    // Create doctor profile
    const newDoctor = new Doctor({
      userId: savedUser._id,
      specialization: req.body.specialization,
      department: req.body.department,
      qualifications: req.body.qualifications || [],
      experience: req.body.experience || 0,
      consultationFee: req.body.consultationFee || 500,
      availability: req.body.availability || {
        monday: { start: '09:00', end: '17:00', isAvailable: true },
        tuesday: { start: '09:00', end: '17:00', isAvailable: true },
        wednesday: { start: '09:00', end: '17:00', isAvailable: true },
        thursday: { start: '09:00', end: '17:00', isAvailable: true },
        friday: { start: '09:00', end: '17:00', isAvailable: true },
        saturday: { start: '09:00', end: '13:00', isAvailable: true },
        sunday: { start: '09:00', end: '13:00', isAvailable: false }
      }
    });

    const savedDoctor = await newDoctor.save();
    await savedDoctor.populate('userId', 'firstName lastName email phoneNumber');

    res.status(201).json({
      message: 'Doctor added successfully',
      data: savedDoctor
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error adding doctor',
      details: error.message
    });
  }
};

/**
 * Get a single doctor by ID
 * GET /api/doctors/:id
 */
doctorController.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber status isActive');
    
    if (!doctor) {
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
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        error: true,
        message: 'Doctor not found'
      });
    }

    // Update user details if provided
    if (req.body.firstName || req.body.lastName || req.body.phoneNumber) {
      await User.findByIdAndUpdate(doctor.userId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        updatedAt: Date.now()
      });
    }

    // Update doctor details
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        specialization: req.body.specialization,
        department: req.body.department,
        qualifications: req.body.qualifications,
        experience: req.body.experience,
        consultationFee: req.body.consultationFee,
        availability: req.body.availability,
        status: req.body.status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email phoneNumber');

    res.json({
      message: 'Doctor updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error updating doctor',
      details: error.message
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

module.exports = doctorController;