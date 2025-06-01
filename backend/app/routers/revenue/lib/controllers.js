// revenueController.js
const Revenue = require('../../../../models/lib/Revenue');
const Appointment = require('../../../../models/lib/Appointment');

const revenueController = {};

/**
 * Get all revenue records
 * GET /api/revenue
 */
revenueController.getAllRevenue = async (req, res) => {
  try {
    const { startDate, endDate, doctorId, status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch revenue with pagination
    const revenue = await Revenue.find(filter)
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName')
      .populate('appointmentId', 'appointmentDate reason')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count and sum
    const total = await Revenue.countDocuments(filter);
    const totalRevenue = await Revenue.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      message: 'Revenue records retrieved successfully',
      data: revenue,
      total,
      totalRevenue: totalRevenue[0]?.total || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching revenue',
      details: error.message
    });
  }
};

/**
 * Get revenue summary/statistics
 * GET /api/revenue/summary
 */
revenueController.getRevenueSummary = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch(period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    // Get revenue by payment method
    const revenueByMethod = await Revenue.aggregate([
      { $match: { date: { $gte: startDate }, status: 'success' } },
      { $group: { 
        _id: '$paymentMethod', 
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { total: -1 } }
    ]);
    
    // Get revenue by department
    const revenueByDepartment = await Revenue.aggregate([
      { $match: { date: { $gte: startDate }, status: 'success' } },
      { $lookup: {
        from: 'appointments',
        localField: 'appointmentId',
        foreignField: '_id',
        as: 'appointment'
      }},
      { $unwind: '$appointment' },
      { $group: { 
        _id: '$appointment.department', 
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { total: -1 } }
    ]);
    
    // Get top doctors by revenue
    const topDoctors = await Revenue.aggregate([
      { $match: { date: { $gte: startDate }, status: 'success' } },
      { $group: { 
        _id: '$doctorId', 
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { total: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'doctor'
      }},
      { $unwind: '$doctor' },
      { $project: {
        doctorName: { $concat: ['$doctor.firstName', ' ', '$doctor.lastName'] },
        total: 1,
        count: 1
      }}
    ]);
    
    // Get total summary
    const totalSummary = await Revenue.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }}
    ]);

    res.json({
      message: 'Revenue summary retrieved successfully',
      data: {
        period,
        startDate,
        byPaymentMethod: revenueByMethod,
        byDepartment: revenueByDepartment,
        topDoctors,
        summary: totalSummary
      }
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching revenue summary',
      details: error.message
    });
  }
};

/**
 * Get revenue for a specific doctor
 * GET /api/revenue/doctor/:doctorId
 */
revenueController.getDoctorRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = { doctorId: req.params.doctorId, status: 'success' };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const revenue = await Revenue.find(filter)
      .populate('patientId', 'firstName lastName')
      .populate('appointmentId', 'appointmentDate reason')
      .sort({ date: -1 });
    
    const totalRevenue = await Revenue.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      message: 'Doctor revenue retrieved successfully',
      data: {
        records: revenue,
        totalRevenue: totalRevenue[0]?.total || 0,
        count: revenue.length
      }
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching doctor revenue',
      details: error.message
    });
  }
};

module.exports = revenueController;