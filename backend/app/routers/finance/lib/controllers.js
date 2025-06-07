// finance/lib/controllers.js - FIXED VERSION WITH DEBUGGING
const Appointment = require('../../../../models/lib/Appointment');
const Revenue = require('../../../../models/lib/Revenue');
const User = require('../../../../models/lib/User');
const Doctor = require('../../../../models/lib/Doctor');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

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
 * Generate Patient Invoice PDF - FIXED VERSION
 * GET /finance/invoice/:patientId/pdf?startDate=2024-01-01&endDate=2024-12-31&format=pdf
 */
financeController.generatePatientInvoicePDF = async (req, res) => {
  try {
    console.log('--- PDF Generation Start ---');
    const { patientId } = req.params;
    const { startDate, endDate, format = 'pdf' } = req.query;
    console.log('Params:', { patientId, startDate, endDate, format });

    // Convert to ObjectId
    const patientObjectId = mongoose.Types.ObjectId.isValid(patientId) 
      ? new mongoose.Types.ObjectId(patientId) 
      : patientId;
    console.log('Patient ObjectId:', patientObjectId);

    // Get patient info
    const patient = await User.findById(patientObjectId).select('firstName lastName email phoneNumber');
    if (!patient) {
      console.log('Patient not found:', patientId);
      return res.status(404).json({
        error: true,
        message: 'Patient not found'
      });
    }
    console.log('Patient found:', patient.firstName, patient.lastName);

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }
    console.log('Date filter:', dateFilter);

    const filter = { 
      patientId: patientObjectId,
      status: 'success'
    };
    if (Object.keys(dateFilter).length > 0) {
      filter.date = dateFilter;
    }
    console.log('Mongo filter:', filter);

    // Get revenue records with details
    const revenueRecords = await Revenue.find(filter)
      .populate('doctorId', 'firstName lastName')
      .populate('appointmentId', 'appointmentDate reason department')
      .sort({ date: -1 });
    console.log('Revenue records found:', revenueRecords.length);

    if (revenueRecords.length === 0) {
      console.log('No revenue records found for patient:', patientId);
      return res.status(404).json({
        error: true,
        message: 'No revenue records found for the specified period'
      });
    }

    // Calculate totals
    const totalAmount = revenueRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalTransactions = revenueRecords.length;
    console.log('Total amount:', totalAmount, 'Total transactions:', totalTransactions);

    // Enhanced HTML generation with better styling and complete invoice structure
    const generateHTML = () => {
      const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: 'Asia/Kolkata'
        });
      };
      
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2
        }).format(amount || 0);
      };

      const periodText = startDate && endDate 
        ? `${formatDate(startDate)} to ${formatDate(endDate)}`
        : 'All Time';

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Medical Invoice - ${patient.firstName} ${patient.lastName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              font-size: 12px;
              line-height: 1.6;
              color: #333;
              background: #fff;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            
            .invoice-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
            }
            
            .invoice-title {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            
            .invoice-subtitle {
              font-size: 14px;
              color: #666;
            }
            
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              gap: 20px;
            }
            
            .patient-info, .invoice-details {
              flex: 1;
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .info-title {
              font-size: 14px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 5px;
            }
            
            .info-row {
              margin-bottom: 5px;
              display: flex;
              justify-content: space-between;
            }
            
            .info-label {
              font-weight: 600;
              color: #374151;
            }
            
            .info-value {
              color: #6b7280;
            }
            
            .transactions-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              background: white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .transactions-table th {
              background: #2563eb;
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-weight: 600;
              font-size: 11px;
            }
            
            .transactions-table td {
              padding: 10px 8px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 11px;
            }
            
            .transactions-table tr:nth-child(even) {
              background: #f9fafb;
            }
            
            .transactions-table tr:hover {
              background: #f3f4f6;
            }
            
            .amount-cell {
              text-align: right;
              font-weight: 600;
              color: #059669;
            }
            
            .date-cell {
              color: #6b7280;
            }
            
            .summary-section {
              background: #f8fafc;
              border: 2px solid #2563eb;
              border-radius: 12px;
              padding: 20px;
              margin-top: 30px;
            }
            
            .summary-title {
              font-size: 18px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 15px;
              text-align: center;
            }
            
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            
            .summary-item {
              text-align: center;
              padding: 10px;
              background: white;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .summary-label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 5px;
            }
            
            .summary-value {
              font-size: 18px;
              font-weight: bold;
              color: #059669;
            }
            
            .total-amount {
              font-size: 24px;
              color: #dc2626;
            }
            
            .invoice-footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 10px;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            
            @media print {
              body { font-size: 11px; }
              .invoice-container { padding: 10px; }
              .transactions-table th,
              .transactions-table td { padding: 6px 4px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
              <div class="invoice-title">Medical Invoice</div>
              <div class="invoice-subtitle">Healthcare Services Payment Summary</div>
            </div>

            <!-- Invoice Information -->
            <div class="invoice-info">
              <div class="patient-info">
                <div class="info-title">Patient Information</div>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${patient.firstName} ${patient.lastName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${patient.email || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${patient.phoneNumber || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Patient ID:</span>
                  <span class="info-value">${patientId}</span>
                </div>
              </div>

              <div class="invoice-details">
                <div class="info-title">Invoice Details</div>
                <div class="info-row">
                  <span class="info-label">Invoice Date:</span>
                  <span class="info-value">${formatDate(new Date())}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Period:</span>
                  <span class="info-value">${periodText}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Total Transactions:</span>
                  <span class="info-value">${totalTransactions}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Invoice #:</span>
                  <span class="info-value">INV-${patientId.slice(-6)}-${new Date().getTime().toString().slice(-6)}</span>
                </div>
              </div>
            </div>

            <!-- Transactions Table -->
            <table class="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Service</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${revenueRecords.map(record => `
                  <tr>
                    <td class="date-cell">${formatDate(record.date)}</td>
                    <td>Dr. ${record.doctorId ? `${record.doctorId.firstName} ${record.doctorId.lastName}` : 'N/A'}</td>
                    <td>${record.appointmentId?.department || 'General'}</td>
                    <td>${record.appointmentId?.reason || record.description || 'Medical Consultation'}</td>
                    <td style="text-transform: capitalize;">${record.paymentMethod || 'Cash'}</td>
                    <td class="amount-cell">${formatCurrency(record.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Summary Section -->
            <div class="summary-section">
              <div class="summary-title">Payment Summary</div>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-label">Total Transactions</div>
                  <div class="summary-value">${totalTransactions}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Average per Visit</div>
                  <div class="summary-value">${formatCurrency(totalTransactions > 0 ? totalAmount / totalTransactions : 0)}</div>
                </div>
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <div class="summary-label">Total Amount Paid</div>
                <div class="summary-value total-amount">${formatCurrency(totalAmount)}</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="invoice-footer">
              <p>This is a computer-generated invoice and does not require a signature.</p>
              <p>Generated on ${formatDate(new Date())} | For any queries, please contact our billing department.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    };

    const filename = `invoice_${patient.firstName}_${patient.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Filename:', filename);

    if (format === 'html') {
      console.log('Sending HTML preview');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(generateHTML());
    }

    // Generate PDF with Puppeteer
    console.log('Generating PDF with Puppeteer...');
    const html = generateHTML();
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      
      // Set content with proper encoding
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Generate PDF with proper options
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true
      });

      console.log('PDF buffer generated, size:', pdfBuffer.length);

      // Set proper headers for PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      
      // Send the PDF buffer
      res.end(pdfBuffer);
      console.log('PDF sent to client successfully');

    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      throw pdfError;
    } finally {
      if (browser) {
        await browser.close();
        console.log('Browser closed');
      }
    }

    console.log('--- PDF Generation End ---');

  } catch (error) {
    console.error('Error generating patient invoice PDF:', error);
    
    // Ensure headers haven't been sent before sending error response
    if (!res.headersSent) {
      res.status(500).json({
        error: true,
        message: 'Error generating invoice PDF',
        details: error.message
      });
    }
  }
};

/**
 * Get department-wise revenue breakdown
 * GET /finance/reports/department-revenue?month=11&year=2024&period=month
 */
/**
 * Get department-wise revenue breakdown
 * GET /finance/reports/department-revenue?month=11&year=2024&period=month
 */
financeController.getDepartmentRevenue = async (req, res) => {
  try {
    // Check if user exists (for debugging)
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Authentication required. Please login first.'
      }); 
    }

    const { month, year, period = 'month' } = req.query;
    
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
      // Default to current month
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }

    // DEBUG: Check what data exists in Revenue collection
    const allRevenues = await Revenue.find({}).sort({ date: -1 }).limit(5);
    console.log('Sample Revenue Records:', allRevenues);
    
    // DEBUG: Check date filtering
    console.log('Date Filter Debug:', {
      startDate,
      endDate,
      targetMonth: month ? parseInt(month) - 1 : currentDate.getMonth(),
      targetYear: year ? parseInt(year) : currentDate.getFullYear()
    });

    // Check if any revenues exist in the date range
    const revenuesInRange = await Revenue.find({
      date: { $gte: startDate, $lt: endDate }
    });
    console.log('Revenues in date range:', revenuesInRange.length);

    // Get department-wise revenue with detailed breakdown
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
          totalRevenue: { $sum: '$amount' },
          totalAppointments: { $sum: 1 },
          averagePerAppointment: { $avg: '$amount' },
          uniquePatients: { $addToSet: '$patientId' },
          uniqueDoctors: { $addToSet: '$doctorId' }
        }
      },
      {
        $project: {
          department: '$_id',
          totalRevenue: 1,
          totalAppointments: 1,
          averagePerAppointment: { $round: ['$averagePerAppointment', 2] },
          uniquePatients: { $size: '$uniquePatients' },
          uniqueDoctors: { $size: '$uniqueDoctors' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Calculate total revenue across all departments
    const totalRevenue = departmentRevenue.reduce((sum, dept) => sum + dept.totalRevenue, 0);

    // Add percentage calculation to each department
    const departmentData = departmentRevenue.map(dept => ({
      ...dept,
      revenuePercentage: totalRevenue > 0 ? 
        Math.round((dept.totalRevenue / totalRevenue) * 100 * 100) / 100 : 0
    }));

    res.json({
      message: 'Department-wise revenue retrieved successfully',
      debug: {
        dateFilter: { startDate, endDate },
        sampleRevenues: allRevenues.map(r => ({ 
          date: r.date, 
          amount: r.amount, 
          status: r.status,
          appointmentId: r.appointmentId 
        })),
        revenuesInRange: revenuesInRange.length,
        departmentQuery: departmentRevenue.length
      },
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
          totalRevenue: totalRevenue,
          totalDepartments: departmentData.length,
          totalAppointments: departmentData.reduce((sum, dept) => sum + dept.totalAppointments, 0)
        },
        departments: departmentData
      }
    });

  } catch (error) {
    console.error('Error in getDepartmentRevenue:', error);
    res.status(500).json({
      error: true,
      message: 'Error fetching department revenue',
      details: error.message
    });
  }
};

module.exports = financeController;