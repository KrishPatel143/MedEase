// Update import path to match your project structure
// Make sure this path correctly points to your Admin model
const User = require('../../../../models/lib/User');

const authController = {};

// Register a new admin
authController.register = async (req, res) => {
    try {
      // Check if the email already exists
      const existingAdmin = await User.findOne({ email: req.body.email });
      if (existingAdmin) {
        return res.status(400).json({
          error: true,
          message: 'Email already in use'
        });
      }
  
      const newAdmin = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || 'patient' 
      });
  
      // Save admin to the database
      const savedAdmin = await newAdmin.save();
  
      // Generate JWT token
      const token = savedAdmin.generateAuthToken();
  
      // Return admin data and token (excluding password)
      const adminData = savedAdmin.toObject();
      delete adminData.password;
  
      res.status(201).json({
        message: 'Admin registered successfully',
        admin: adminData,
        token
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: 'Error registering admin',
        details: error.message
      });
    }
  };

// Login admin
authController.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: true,
          message: 'Please provide both email and password'
        });
      }
  
      // Find admin by email (include password for comparison)
      const user = await User.findOne({ email }).select('+password');
  
      // Check if user exists and password is correct
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          error: true,
          message: 'Invalid credentials'
        });
      }
  
      // Check if user account is active
      if (!user.isActive) {
        return res.status(403).json({
          error: true,
          message: 'Account is deactivated. Please contact super user.'
        });
      }
  
      // Update last login time
      user.lastLogin = Date.now();
      await user.save();
  
      // Generate token
      const token = user.generateAuthToken();
  
      // Return user data and token (excluding password)
      const userData = user.toObject();
      delete userData.password;
  
      res.json({
        message: 'Login successful',
        user: userData,
        token
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'Error during login',
        details: error.message
      });
    }
  };

// Get current admin profile
authController.getProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    
    if (!admin) {
      return res.status(404).json({
        error: true,
        message: 'Admin not found'
      });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching admin profile',
      details: error.message
    });
  }
};

// Update admin profile
authController.updateProfile = async (req, res) => {
  try {
    // Don't allow role updates through this endpoint
    if (req.body.role) {
      delete req.body.role;
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        error: true,
        message: 'Admin not found'
      });
    }

    res.json({
      message: 'Profile updated successfully',
      admin: updatedAdmin
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error updating profile',
      details: error.message
    });
  }
};

// Change admin password
authController.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: true,
        message: 'Please provide both current and new password'
      });
    }

    // Find admin with password
    const admin = await User.findById(req.user.id).select('+password');

    // Verify current password
    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({
        error: true,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Error changing password',
      details: error.message
    });
  }
};

module.exports = authController;