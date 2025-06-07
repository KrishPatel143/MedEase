// Import models
const User = require('../../../../models/lib/User');
const Patient = require('../../../../models/lib/Patient');

const patientController = {};

/**
 * Get all patients
 * GET /api/patients
 */
patientController.getAllPatients = async (req, res) => {
  try {
    const { gender, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add gender filter if provided
    if (gender) filter.gender = gender;
    
    // Add search functionality if search term is provided
    let userIds = [];
    if (search) {
      const users = await User.find({
        role: 'patient',
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
    
    // Fetch patients with pagination
    const patients = await Patient.find(filter)
      .populate('userId', 'firstName lastName email isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Patient.countDocuments(filter);

    res.json({
      message: 'Patients retrieved successfully',
      data: patients,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching patients',
      details: error.message
    });
  }
};

/**
 * Add a new patient
 * POST /api/patients
 */
patientController.addPatient = async (req, res) => {
  let createdUser = null;
  
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      dateOfBirth,
      gender,
      contactNumber,
      address,
      emergencyContact,
      medicalHistory
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !dateOfBirth || !gender) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Missing required fields',
        details: 'firstName, lastName, email, password, dateOfBirth, and gender are required'
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

    // Validate gender against enum
    const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid gender',
        details: `Must be one of: ${validGenders.join(', ')}`
      });
    }

    // Validate date of birth
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid date of birth'
      });
    }

    // Validate contact number if provided
    if (contactNumber && contactNumber.trim() && contactNumber.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Contact number must be at least 10 digits'
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
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Create user with patient role
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password, // This will be hashed in the User model's pre-save middleware
      role: 'patient',
    });

    createdUser = await newUser.save();

    // Process emergency contact
    const processedEmergencyContact = emergencyContact && 
      emergencyContact.name && 
      emergencyContact.phoneNumber ? {
        name: emergencyContact.name.trim(),
        relationship: emergencyContact.relationship ? emergencyContact.relationship.trim() : 'Unknown',
        phoneNumber: emergencyContact.phoneNumber.trim()
      } : null;

    // Process medical history - filter out empty entries
    const processedMedicalHistory = medicalHistory && Array.isArray(medicalHistory) 
      ? medicalHistory.filter(history => 
          history.condition && history.condition.trim()
        ).map(history => ({
          condition: history.condition.trim(),
          diagnosedDate: history.diagnosedDate ? new Date(history.diagnosedDate) : new Date(),
          notes: history.notes ? history.notes.trim() : ''
        }))
      : [];

    // Create patient profile with all details
    const newPatient = new Patient({
      userId: createdUser._id,
      dateOfBirth: birthDate,
      gender,
      contactNumber: contactNumber ? contactNumber.trim() : '',
      address: address ? address.trim() : '',
      emergencyContact: processedEmergencyContact,
      medicalHistory: processedMedicalHistory
    });

    const savedPatient = await newPatient.save();
    
    // Populate user details for response
    await savedPatient.populate('userId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Patient added successfully with complete profile',
      data: savedPatient
    });

  } catch (error) {
    console.error('Error adding patient:', error);
    
    // Cleanup: If user was created but patient creation failed, delete the user
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
        errorMessage = 'Patient profile already exists for this user';
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
      message: 'Error adding patient',
      details: errorMessage
    });
  }
};

/**
 * Get a single patient by ID
 * GET /api/patients/:id
 */
patientController.getPatientById = async (req, res) => {
  try {
    // First try to find existing patient
    let patient = await Patient.findOne({userId: req.params.id})
      .populate('userId', 'firstName lastName email isActive');
    
    if (!patient) {
      console.log('Patient not found, creating new patient profile');
      
      // Check if user exists
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        });
      }

      // Create new patient with default values
      const newPatient = new Patient({
        userId: req.params.id,
        dateOfBirth: new Date('1990-01-01'), // Default date of birth
        gender: 'prefer_not_to_say', // Default gender
        contactNumber: '',
        address: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phoneNumber: ''
        },
        medicalHistory: []
      });

      patient = await newPatient.save();
      
      // Populate user details for response
      await patient.populate('userId', 'firstName lastName email isActive');

      return res.status(201).json({
        message: 'Patient profile created successfully',
        data: patient,
        created: true
      });
    }

    res.json({
      message: 'Patient retrieved successfully',
      data: patient,
      created: false
    });
  } catch (error) {
    console.error('Error in getPatientById:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching/creating patient',
      details: error.message
    });
  }
};

/**
 * Update a patient
 * PUT /api/patients/:id
 */
patientController.updatePatient = async (req, res) => {
  let updatedUser = null;
  
  try {
    const patientId = req.params.id;
    
    // Validate ObjectId format
    if (!patientId || !patientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid patient ID format'
      });
    }

    // Find the patient first
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Patient not found'
      });
    }

    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      contactNumber,
      address,
      emergencyContact,
      medicalHistory
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !dateOfBirth || !gender) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Missing required fields',
        details: 'firstName, lastName, email, dateOfBirth, and gender are required'
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

    // Validate gender against enum
    const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid gender',
        details: `Must be one of: ${validGenders.join(', ')}`
      });
    }

    // Validate date of birth
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Invalid date of birth'
      });
    }

    // Validate contact number if provided
    if (contactNumber && contactNumber.trim() && contactNumber.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Contact number must be at least 10 digits'
      });
    }

    // Check if email is being changed and if it's already in use by another user
    if (email.toLowerCase().trim() !== patient.userId.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: patient.userId }
      });
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: true,
          message: 'Email already in use by another user'
        });
      }
    }

    // Process emergency contact
    const processedEmergencyContact = emergencyContact && 
      emergencyContact.name && 
      emergencyContact.phoneNumber ? {
        name: emergencyContact.name.trim(),
        relationship: emergencyContact.relationship ? emergencyContact.relationship.trim() : 'Unknown',
        phoneNumber: emergencyContact.phoneNumber.trim()
      } : patient.emergencyContact;

    // Process medical history if provided
    const processedMedicalHistory = medicalHistory && Array.isArray(medicalHistory) 
      ? medicalHistory.filter(history => 
          history.condition && history.condition.trim()
        ).map(history => ({
          condition: history.condition.trim(),
          diagnosedDate: history.diagnosedDate ? new Date(history.diagnosedDate) : new Date(),
          notes: history.notes ? history.notes.trim() : ''
        }))
      : patient.medicalHistory;

    // Update user details first
    const userUpdateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      updatedAt: Date.now()
    };

    updatedUser = await User.findByIdAndUpdate(
      patient.userId,
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

    // Update patient details
    const patientUpdateData = {
      dateOfBirth: birthDate,
      gender,
      contactNumber: contactNumber ? contactNumber.trim() : '',
      address: address ? address.trim() : '',
      emergencyContact: processedEmergencyContact,
      medicalHistory: processedMedicalHistory,
      updatedAt: Date.now()
    };

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      patientUpdateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email');

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'Patient not found after update'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });

  } catch (error) {
    console.error('Error updating patient:', error);
    
    // If user update succeeded but patient update failed, revert user changes
    if (updatedUser && error.name === 'ValidationError') {
      try {
        console.log('Patient update failed, user was updated successfully');
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
      message: 'Error updating patient',
      details: errorMessage
    });
  }
};

module.exports = patientController;