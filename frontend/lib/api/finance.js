// lib/api/finance.js
import { get, post } from '../api';

/**
 * Simplified Finance API Client
 * Handles essential finance operations matching the backend routes
 */

// =============================================================================
// PAYMENT PROCESSING
// =============================================================================

/**
 * Process a payment
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} - Payment processing result
 */
export const processPayment = async (paymentData) => {
  try {
    return await post('/finance/payment/process', paymentData);
  } catch (error) {
    throw new Error(`Failed to process payment: ${error.message}`);
  }
};

/**
 * Get patient payment history
 * @param {string|number} patientId - Patient ID
 * @returns {Promise<Object>} - Payment history
 */
export const getPatientPaymentHistory = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    return await get(`/finance/payment/history/${patientId}`);
  } catch (error) {
    throw new Error(`Failed to fetch payment history: ${error.message}`);
  }
};

// =============================================================================
// FINANCIAL REPORTING
// =============================================================================

/**
 * Get doctor monthly revenue (Admin only)
 * @param {string|number} doctorId - Doctor ID
 * @returns {Promise<Object>} - Doctor revenue data
 */
export const getDoctorMonthlyRevenue = async (doctorId) => {
  try {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    return await get(`/finance/reports/doctor-revenue/${doctorId}`);
  } catch (error) {
    throw new Error(`Failed to fetch doctor revenue: ${error.message}`);
  }
};

/**
 * Get patient monthly spending (Admin only)
 * @param {string|number} patientId - Patient ID
 * @returns {Promise<Object>} - Patient spending data
 */
export const getPatientMonthlySpending = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    return await get(`/finance/reports/patient-spending/${patientId}`);
  } catch (error) {
    throw new Error(`Failed to fetch patient spending: ${error.message}`);
  }
};

/**
 * Generate patient invoice PDF
 * @param {string|number} patientId - Patient ID
 * @returns {Promise<Blob>} - PDF file
 */
export const generatePatientInvoicePDF = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    
    const response = await fetch(`/finance/reports/patient-invoice/${patientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth setup
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }
    
    return response.blob();
  } catch (error) {
    throw new Error(`Failed to generate invoice PDF: ${error.message}`);
  }
};

/**
 * Get department revenue (Admin only)
 * @param {URLSearchParams} params - Query parameters for filtering
 * @returns {Promise<Object>} - Department revenue data
 */
export const getDepartmentRevenue = async (params) => {
  try {
    const queryString = params ? `?${params.toString()}` : '';
    return await get(`/finance/reports/department-revenue${queryString}`);
  } catch (error) {
    throw new Error(`Failed to fetch department revenue: ${error.message}`);
  }
};

// Default export with all functions
export default {
  processPayment,
  getPatientPaymentHistory,
  getDoctorMonthlyRevenue,
  getPatientMonthlySpending,
  generatePatientInvoicePDF,
  getDepartmentRevenue
};