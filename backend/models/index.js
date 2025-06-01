/* eslint-disable prettier/prettier */
const userModel = require('./lib/User');
const patientModel = require('./lib/Patient');
const appointmentModel = require('./lib/Appointment');
const doctorModel = require('./lib/Doctor');
const revenueModel = require('./lib/Revenue');
const financialReportModel = require('./lib/FinancialReport');
const activityLogModel = require('./lib/ActivityLog');
const invoiceModel = require('./lib/Invoice');

module.exports = {
    userModel,
    patientModel,
    appointmentModel,
    doctorModel,
    revenueModel,
    financialReportModel,
    activityLogModel,
    invoiceModel,
};