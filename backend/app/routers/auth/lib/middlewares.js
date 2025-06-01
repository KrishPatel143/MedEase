const jwt = require('jsonwebtoken');
// Make sure this path correctly points to your Admin model
const User = require('../../../../models/lib/User');

const authMiddleware = {};

// Middleware to protect routes - verifies JWT token
authMiddleware.protect = async (req, res, next) => {
  try {
    let token;
    // console.log('Headers:', req.headers);

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? 'Yes (length: ' + token.length + ')' : 'No');
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret'
      );
      // console.log('Decoded token:', decoded);

      // Check if admin still exists
      const admin = await User.findById(decoded.id);
      log
      if (!admin) {
        return res.status(401).json({
          error: true,
          message: 'The admin belonging to this token no longer exists'
        });
      }

      // Check if admin is active
      if (!admin.isActive) {
        return res.status(403).json({
          error: true,
          message: 'Admin account is deactivated'
        });
      }

      // Grant access to protected route
      req.user = decoded;
      // console.log('Setting req.user:', req.user);
      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({
        error: true,
        message: 'Not authorized. Invalid token.',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(500).json({
      error: true,
      message: 'Error in authentication middleware',
      details: error.message
    });
  }
};

// Middleware to restrict access based on admin role
authMiddleware.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('Checking role restriction. Admin role:', req.user?.role, 'Allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = authMiddleware;