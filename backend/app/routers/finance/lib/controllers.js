// finance/lib/controllers.js - FIXED VERSION WITH DEBUGGING
const Appointment = require('../../../../models/lib/Appointment');
const Revenue = require('../../../../models/lib/Revenue');
const User = require('../../../../models/lib/User');
const Doctor = require('../../../../models/lib/Doctor');
const mongoose = require('mongoose');

const financeController = {};

/**
 * Get doctor's monthly revenue (Admin only) - FIXED VERSION
 * GET /finance/reports/doctor-revenue/:doctorId?month=11&year=2024
 */
financeController.getDoctorMonthlyRevenue = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { month, year } = req.query;

    // Convert doctorId to ObjectId if it's a string
    const doctorObjectId = mongoose.Types.ObjectId.isValid(doctorId) 
      ? new mongoose.Types.ObjectId(doctorId) 
      : doctorId;

    // Default to current month/year if not provided
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    // Calculate start and end dates for the month
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 1);

    // Get doctor info
    const doctor = await User.findById(doctorObjectId).select('firstName lastName');
    if (!doctor) {
      return res.status(404).json({
        error: true,
        message: 'Doctor not found'
      });
    }

    // DEBUG: Check if any revenue records exist for this doctor
    const allDoctorRevenue = await Revenue.find({ doctorId: doctorObjectId });
    

    // Get monthly revenue data - FIXED VERSION
    const monthlyRevenue = await Revenue.aggregate([
      {
        $match: {
          doctorId: doctorObjectId,
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalAppointments: { $sum: 1 },
          avgPerAppointment: { $avg: '$amount' }
        }
      }
    ]);

    // Alternative query without date filter to check data exists
    const allTimeRevenue = await Revenue.aggregate([
      {
        $match: {
          doctorId: doctorObjectId,
          status: 'success'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalAppointments: { $sum: 1 }
        }
      }
    ]);


    // Get daily breakdown - FIXED VERSION
    const dailyBreakdown = await Revenue.aggregate([
      {
        $match: {
          doctorId: doctorObjectId,
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          dailyRevenue: { $sum: '$amount' },
          appointmentCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get payment method breakdown - FIXED VERSION
    const paymentMethodBreakdown = await Revenue.aggregate([
      {
        $match: {
          doctorId: doctorObjectId,
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = monthlyRevenue[0] || {
      totalRevenue: 0,
      totalAppointments: 0,
      avgPerAppointment: 0
    };

    res.json({
      message: 'Doctor monthly revenue retrieved successfully',
      debug: {
        doctorId: doctorObjectId,
        dateRange: { startDate, endDate },
        allTimeData: allTimeRevenue[0] || { totalRevenue: 0, totalAppointments: 0 },
        monthlyData: summary
      },
      data: {
        doctor: {
          id: doctorId,
          name: `${doctor.firstName} ${doctor.lastName}`
        },
        period: {
          month: targetMonth + 1,
          year: targetYear,
          monthName: startDate.toLocaleString('default', { month: 'long' })
        },
        summary: {
          totalRevenue: summary.totalRevenue,
          totalAppointments: summary.totalAppointments,
          averagePerAppointment: Math.round(summary.avgPerAppointment || 0)
        },
        dailyBreakdown: dailyBreakdown,
        paymentMethodBreakdown: paymentMethodBreakdown
      }
    });

  } catch (error) {
    console.error('Error in getDoctorMonthlyRevenue:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching doctor revenue',
      details: error.message
    });
  }
};

/**
 * Get patient's monthly spending - FIXED VERSION
 * GET /finance/reports/patient-spending/:patientId?month=11&year=2024
 */
financeController.getPatientMonthlySpending = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { month, year } = req.query;

    // Convert patientId to ObjectId if it's a string
    const patientObjectId = mongoose.Types.ObjectId.isValid(patientId) 
      ? new mongoose.Types.ObjectId(patientId) 
      : patientId;

    // Default to current month/year if not provided
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    // Calculate start and end dates for the month
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 1);

    // Get patient info
    const patient = await User.findById(patientObjectId).select('firstName lastName');
    if (!patient) {
      return res.status(404).json({
        error: true,
        message: 'Patient not found'
      });
    }

    // DEBUG: Check if any revenue records exist for this patient
    const allPatientRevenue = await Revenue.find({ patientId: patientObjectId });

    // Get monthly spending summary - FIXED VERSION
    const monthlySpending = await Revenue.aggregate([
      {
        $match: {
          patientId: patientObjectId,
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          totalAppointments: { $sum: 1 }
        }
      }
    ]);

    // Alternative query without date filter
    const allTimeSpending = await Revenue.aggregate([
      {
        $match: {
          patientId: patientObjectId,
          status: 'success'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          totalAppointments: { $sum: 1 }
        }
      }
    ]);

    // Get doctor-wise spending breakdown - FIXED VERSION
    const doctorWiseSpending = await Revenue.aggregate([
      {
        $match: {
          patientId: patientObjectId,
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment'
        }
      },
      { $unwind: '$appointment' },
      {
        $group: {
          _id: '$doctorId',
          doctorName: { $first: { $concat: ['$doctor.firstName', ' ', '$doctor.lastName'] } },
          department: { $first: '$appointment.department' },
          totalSpent: { $sum: '$amount' },
          appointmentCount: { $sum: 1 },
          avgPerVisit: { $avg: '$amount' }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    // Get department-wise spending - FIXED VERSION
    const departmentWiseSpending = await Revenue.aggregate([
      {
        $match: {
          patientId: patientObjectId,
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment'
        }
      },
      { $unwind: '$appointment' },
      {
        $group: {
          _id: '$appointment.department',
          totalSpent: { $sum: '$amount' },
          visitCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    const summary = monthlySpending[0] || {
      totalSpent: 0,
      totalAppointments: 0
    };

    res.json({
      message: 'Patient monthly spending retrieved successfully',
      debug: {
        patientId: patientObjectId,
        dateRange: { startDate, endDate },
        allTimeData: allTimeSpending[0] || { totalSpent: 0, totalAppointments: 0 },
        monthlyData: summary
      },
      data: {
        patient: {
          id: patientId,
          name: `${patient.firstName} ${patient.lastName}`
        },
        period: {
          month: targetMonth + 1,
          year: targetYear,
          monthName: startDate.toLocaleString('default', { month: 'long' })
        },
        summary: {
          totalSpent: summary.totalSpent,
          totalAppointments: summary.totalAppointments,
          averagePerAppointment: summary.totalAppointments > 0 ? 
            Math.round(summary.totalSpent / summary.totalAppointments) : 0
        },
        doctorWiseBreakdown: doctorWiseSpending.map(doc => ({
          doctorId: doc._id,
          doctorName: doc.doctorName,
          department: doc.department,
          totalSpent: doc.totalSpent,
          appointmentCount: doc.appointmentCount,
          averagePerVisit: Math.round(doc.avgPerVisit)
        })),
        departmentWiseBreakdown: departmentWiseSpending
      }
    });

  } catch (error) {
    console.error('Error in getPatientMonthlySpending:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching patient spending',
      details: error.message
    });
  }
};

// Add the other controller methods here (processPayment, getPatientPaymentHistory, getFinancialOverview)
// ... (keeping them the same as they were working)

/**
 * Process payment for an appointment
 * POST /finance/payment/process
 */
financeController.processPayment = async (req, res) => {
  try {
    const { appointmentId, paymentMethod, transactionId } = req.body;
    
    if (!appointmentId || !paymentMethod) {
      return res.status(400).json({
        error: true,
        message: 'Appointment ID and payment method are required'
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName');
    
    if (!appointment) {
      return res.status(404).json({
        error: true,
        message: 'Appointment not found'
      });
    }

    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({
        error: true,
        message: 'Payment has already been processed for this appointment'
      });
    }

    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user.id) {
      return res.status(403).json({
        error: true,
        message: 'You can only make payments for your own appointments'
      });
    }

    // Update appointment payment status
    appointment.paymentStatus = 'paid';
    appointment.paymentMethod = paymentMethod;
    appointment.paymentDate = new Date();
    await appointment.save();

    // Create revenue record
    const revenue = new Revenue({
      appointmentId: appointment._id,
      patientId: appointment.patient._id,
      doctorId: appointment.doctor._id,
      amount: appointment.amount,
      paymentMethod: paymentMethod,
      transactionId: transactionId,
      status: 'success',
      description: `Payment for ${appointment.reason} consultation`
    });

    await revenue.save();

    res.json({
      message: 'Payment processed successfully',
      data: {
        appointmentId: appointment._id,
        amount: appointment.amount,
        paymentMethod: paymentMethod,
        paymentDate: appointment.paymentDate,
        patient: appointment.patient.firstName + ' ' + appointment.patient.lastName,
        doctor: appointment.doctor.firstName + ' ' + appointment.doctor.lastName,
        transactionId: transactionId
      }
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error processing payment',
      details: error.message
    });
  }
};

/**
 * Get patient's payment history
 * GET /finance/payment/history/:patientId
 */
financeController.getPatientPaymentHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    // Convert to ObjectId
    const patientObjectId = mongoose.Types.ObjectId.isValid(patientId) 
      ? new mongoose.Types.ObjectId(patientId) 
      : patientId;

    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }

    const filter = { 
      patientId: patientObjectId,
      status: 'success'
    };
    
    if (Object.keys(dateFilter).length > 0) {
      filter.date = dateFilter;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const payments = await Revenue.find(filter)
      .populate('doctorId', 'firstName lastName')
      .populate('appointmentId', 'appointmentDate reason department')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Revenue.countDocuments(filter);
    const totalAmount = await Revenue.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      message: 'Payment history retrieved successfully',
      data: {
        payments: payments,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        },
        summary: {
          totalSpent: totalAmount[0]?.total || 0,
          totalTransactions: total
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching payment history',
      details: error.message
    });
  }
};

/**
 * Get financial overview (Admin only)
 * GET /finance/reports/overview
 */
financeController.getFinancialOverview = async (req, res) => {
  try {
    const { period = 'month', month, year } = req.query;
    
    const currentDate = new Date();
    let startDate, endDate;

    if (period === 'month') {
      const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
      const targetYear = year ? parseInt(year) : currentDate.getFullYear();
      startDate = new Date(targetYear, targetMonth, 1);
      endDate = new Date(targetYear, targetMonth + 1, 1);
    } else if (period === 'year') {
      const targetYear = year ? parseInt(year) : currentDate.getFullYear();
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear + 1, 0, 1);
    } else {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }

    const totalStats = await Revenue.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const topDoctors = await Revenue.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: '$doctorId',
          revenue: { $sum: '$amount' },
          appointments: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      {
        $project: {
          doctorName: { $concat: ['$doctor.firstName', ' ', '$doctor.lastName'] },
          revenue: 1,
          appointments: 1
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    const departmentRevenue = await Revenue.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
          status: 'success'
        }
      },
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appointment'
        }
      },
      { $unwind: '$appointment' },
      {
        $group: {
          _id: '$appointment.department',
          revenue: { $sum: '$amount' },
          appointments: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const stats = totalStats[0] || { totalRevenue: 0, totalTransactions: 0 };

    res.json({
      message: 'Financial overview retrieved successfully',
      data: {
        period: {
          type: period,
          startDate: startDate,
          endDate: endDate,
          displayName: period === 'month' ? 
            startDate.toLocaleString('default', { month: 'long', year: 'numeric' }) :
            startDate.getFullYear().toString()
        },
        summary: {
          totalRevenue: stats.totalRevenue,
          totalTransactions: stats.totalTransactions,
          averageTransactionValue: stats.totalTransactions > 0 ? 
            Math.round(stats.totalRevenue / stats.totalTransactions) : 0
        },
        topDoctors: topDoctors,
        departmentBreakdown: departmentRevenue
      }
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching financial overview',
      details: error.message
    });
  }
};

module.exports = financeController;