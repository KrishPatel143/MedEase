
import { get, post,patch } from "../api";

export const getAllAppointments = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/api/appointments?${queryString}` : '/api/appointments';
    return await get(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }
};

export const getAllDoctorsAppointments = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/appointments/doctor${queryString ? `?${queryString}` : ''}`;;

    return await get(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch doctor appointments: ${error.message}`);
  }
};

export const getAllPatientAppointments = async () => {
  try {
    const endpoint = `/api/appointments/patient`;
    return await get(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch patient appointments: ${error.message}`);
  }
};

/**
 * Get appointment by ID
 * @param {string|number} appointmentId - Appointment ID
 * @returns {Promise<Object>} - Appointment details
 */
export const getAppointmentById = async (appointmentId) => {
  try {
    if (!appointmentId) {
      throw new Error('Appointment ID is required');
    }
    return await get(`/api/appointments/${appointmentId}`);
  } catch (error) {
    throw new Error(`Failed to fetch appointment: ${error.message}`);
  }
};

/**
 * Add new appointment
 * @param {Object} appointmentData - Appointment information
 * @returns {Promise<Object>} - Created appointment
 */
export const addAppointment = async (appointmentData) => {
  try {
    if (!appointmentData || typeof appointmentData !== 'object') {
      throw new Error('Valid appointment data is required');
    }

    // Validate required fields
    const requiredFields = ['patient', 'doctor', 'appointmentDate', 'reason'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return await post('/api/appointments', appointmentData);
  } catch (error) {
    throw new Error(`Failed to add appointment: ${error.message}`);
  }
};

/**
 * Update appointment
 * @param {string|number} appointmentId - Appointment ID
 * @param {Object} updateData - Updated appointment information
 * @returns {Promise<Object>} - Updated appointment
 */
export const updateAppointment = async (appointmentId, updateData) => {
  try {
    if (!appointmentId) {
      throw new Error('Appointment ID is required');
    }
    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Valid update data is required');
    }
    return await put(`/api/appointments/${appointmentId}`, updateData);
  } catch (error) {
    throw new Error(`Failed to update appointment: ${error.message}`);
  }
};

/**
 * Delete appointment
 * @param {string|number} appointmentId - Appointment ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteAppointment = async (appointmentId) => {
  try {
    if (!appointmentId) {
      throw new Error('Appointment ID is required');
    }
    return await del(`/api/appointments/${appointmentId}`);
  } catch (error) {
    throw new Error(`Failed to delete appointment: ${error.message}`);
  }
};

// =============================================================================
// SPECIALIZED APPOINTMENT QUERIES
// =============================================================================

/**
 * Get today's appointments
 * @returns {Promise<Object>} - Today's appointments
 */
export const getTodayAppointments = async () => {
  try {
    return await get('/api/appointments/today');
  } catch (error) {
    throw new Error(`Failed to fetch today's appointments: ${error.message}`);
  }
};

/**
 * Get upcoming appointments
 * @returns {Promise<Object>} - Upcoming appointments
 */
export const getUpcomingAppointments = async () => {
  try {
    return await get('/api/appointments/upcoming');
  } catch (error) {
    throw new Error(`Failed to fetch upcoming appointments: ${error.message}`);
  }
};

/**
 * Get past appointments
 * @returns {Promise<Object>} - Past appointments
 */
export const getPastAppointments = async () => {
  try {
    return await get('/api/appointments/past');
  } catch (error) {
    throw new Error(`Failed to fetch past appointments: ${error.message}`);
  }
};

/**
 * Get appointment statistics
 * @returns {Promise<Object>} - Appointment statistics
 */
export const getAppointmentStats = async () => {
  try {
    return await get('/api/appointments/statistics');
  } catch (error) {
    throw new Error(`Failed to fetch appointment statistics: ${error.message}`);
  }
};

/**
 * Check doctor availability for a specific date/time
 * @param {Object} params - Availability check parameters
 * @returns {Promise<Object>} - Availability status
 */
export const checkAvailability = async (params) => {
  try {
    const { doctorId, date, appointmentId } = params;
    
    if (!doctorId || !date) {
      throw new Error('Doctor ID and date are required');
    }
    
    const queryString = new URLSearchParams(params).toString();
    return await get(`/api/appointments/check-availability?${queryString}`);
  } catch (error) {
    throw new Error(`Failed to check availability: ${error.message}`);
  }
};

// =============================================================================
// STATUS AND PAYMENT UPDATES
// =============================================================================

/**
 * Update appointment status
 * @param {string|number} appointmentId - Appointment ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated appointment
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {

    
    return await patch(`/api/appointments/${appointmentId}/status`, { status });
  } catch (error) {
    throw new Error(`Failed to update appointment status: ${error.message}`);
  }
};

/**
 * Update payment status
 * @param {string|number} appointmentId - Appointment ID
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} - Updated appointment
 */
export const updatePaymentStatus = async (appointmentId, paymentData) => {
  try {
    if (!appointmentId) {
      throw new Error('Appointment ID is required');
    }
    if (!paymentData || typeof paymentData !== 'object') {
      throw new Error('Valid payment data is required');
    }
    if (!paymentData.paymentStatus || !paymentData.paymentMethod) {
      throw new Error('Payment status and method are required');
    }
    
    return await patch(`/api/appointments/${appointmentId}/payment`, paymentData);
  } catch (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }
};

// =============================================================================
// SEARCH AND FILTER FUNCTIONS
// =============================================================================

/**
 * Search appointments by patient name, doctor, or reason
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} - Search results
 */
export const searchAppointments = async (searchTerm, filters = {}) => {
  try {
    const params = {
      search: searchTerm,
      ...filters
    };
    return await getAllAppointments(params);
  } catch (error) {
    throw new Error(`Failed to search appointments: ${error.message}`);
  }
};

/**
 * Get appointments by status
 * @param {string} status - Appointment status
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - Filtered appointments
 */
export const getAppointmentsByStatus = async (status, params = {}) => {
  try {
    if (!status) {
      throw new Error('Status is required');
    }
    
    const queryParams = {
      status,
      ...params
    };
    
    return await getAllAppointments(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch appointments by status: ${error.message}`);
  }
};

/**
 * Get appointments by department
 * @param {string} department - Department name
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - Filtered appointments
 */
export const getAppointmentsByDepartment = async (department, params = {}) => {
  try {
    if (!department) {
      throw new Error('Department is required');
    }
    
    const queryParams = {
      department,
      ...params
    };
    
    return await getAllAppointments(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch appointments by department: ${error.message}`);
  }
};

/**
 * Get appointments by doctor
 * @param {string} doctorId - Doctor ID
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - Doctor's appointments
 */
export const getAppointmentsByDoctor = async (doctorId, params = {}) => {
  try {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    
    const queryParams = {
      doctor: doctorId,
      ...params
    };
    
    return await getAllAppointments(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch appointments by doctor: ${error.message}`);
  }
};

/**
 * Get appointments by patient
 * @param {string} patientId - Patient ID
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - Patient's appointments
 */
export const getAppointmentsByPatient = async (patientId, params = {}) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    
    const queryParams = {
      patient: patientId,
      ...params
    };
    
    return await getAllAppointments(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch appointments by patient: ${error.message}`);
  }
};

/**
 * Get appointments for a specific date
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - Appointments for the date
 */
export const getAppointmentsByDate = async (date, params = {}) => {
  try {
    if (!date) {
      throw new Error('Date is required');
    }
    
    const queryParams = {
      date,
      ...params
    };
    
    return await getAllAppointments(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch appointments by date: ${error.message}`);
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Validate appointment data before submission
 * @param {Object} appointmentData - Appointment data to validate
 * @returns {Object} - Validation result
 */
export const validateAppointmentData = (appointmentData) => {
  const errors = [];
  const requiredFields = {
    patient: 'Patient',
    doctor: 'Doctor',
    appointmentDate: 'Appointment date',
    reason: 'Reason for visit'
  };

  // Check required fields
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!appointmentData[field]) {
      errors.push(`${label} is required`);
    }
  });

  // Validate appointment date
  if (appointmentData.appointmentDate) {
    const appointmentDate = new Date(appointmentData.appointmentDate);
    const now = new Date();
    
    if (appointmentDate <= now) {
      errors.push('Appointment date must be in the future');
    }
  }

  // Validate status
  if (appointmentData.status) {
    const validStatuses = ['upcoming', 'completed', 'cancelled', 'rescheduled', 'no-show'];
    if (!validStatuses.includes(appointmentData.status)) {
      errors.push('Invalid appointment status');
    }
  }

  // Validate reason
  if (appointmentData.reason) {
    const validReasons = ['Consultation', 'Follow-up', 'Procedure', 'Emergency', 'Routine Check-up'];
    if (!validReasons.includes(appointmentData.reason)) {
      errors.push('Invalid reason for visit');
    }
  }

  // Validate department
  if (appointmentData.department) {
    const validDepartments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'General'];
    if (!validDepartments.includes(appointmentData.department)) {
      errors.push('Invalid department');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format appointment data for display
 * @param {Object} appointment - Appointment object
 * @returns {Object} - Formatted appointment data
 */
export const formatAppointmentData = (appointment) => {
  if (!appointment) return null;

  const appointmentDate = new Date(appointment.appointmentDate);
  
  return {
    ...appointment,
    formattedDate: appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    formattedTime: appointmentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    formattedDateTime: appointmentDate.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    patientName: appointment.patient ? 
      `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown Patient',
    doctorName: appointment.doctor ? 
      `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 'Unknown Doctor',
    canCancel: appointment.status === 'upcoming' && 
      new Date(appointment.appointmentDate) > new Date(Date.now() + 2 * 60 * 60 * 1000),
    isUpcoming: appointment.status === 'upcoming' && 
      new Date(appointment.appointmentDate) > new Date(),
    isPast: new Date(appointment.appointmentDate) < new Date(),
    statusColor: getStatusColor(appointment.status),
    paymentStatusColor: getPaymentStatusColor(appointment.paymentStatus)
  };
};

/**
 * Get color for appointment status
 * @param {string} status - Appointment status
 * @returns {string} - Color class or hex code
 */
export const getStatusColor = (status) => {
  const statusColors = {
    upcoming: '#3B82F6', // blue
    completed: '#10B981', // green
    cancelled: '#EF4444', // red
    rescheduled: '#F59E0B', // yellow
    'no-show': '#6B7280' // gray
  };
  return statusColors[status] || '#6B7280';
};

/**
 * Get color for payment status
 * @param {string} paymentStatus - Payment status
 * @returns {string} - Color class or hex code
 */
export const getPaymentStatusColor = (paymentStatus) => {
  const paymentColors = {
    pending: '#F59E0B', // yellow
    paid: '#10B981', // green
    refunded: '#6B7280', // gray
    failed: '#EF4444' // red
  };
  return paymentColors[paymentStatus] || '#6B7280';
};

/**
 * Generate time slots for a given date
 * @param {Date} date - Date to generate slots for
 * @param {number} intervalMinutes - Interval between slots (default: 30)
 * @param {string} startTime - Start time (default: '09:00')
 * @param {string} endTime - End time (default: '17:00')
 * @returns {Array} - Array of time slot objects
 */
export const generateTimeSlots = (date, intervalMinutes = 30, startTime = '09:00', endTime = '17:00') => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startDate = new Date(date);
  startDate.setHours(startHour, startMinute, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(endHour, endMinute, 0, 0);
  
  const current = new Date(startDate);
  
  while (current < endDate) {
    slots.push({
      time: current.toTimeString().slice(0, 5),
      formatted: current.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      datetime: new Date(current),
      available: true // This would be determined by checking existing appointments
    });
    
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }
  
  return slots;
};

// =============================================================================
// BULK OPERATIONS
// =============================================================================

/**
 * Bulk update multiple appointments
 * @param {Array} appointmentUpdates - Array of appointment update objects
 * @returns {Promise<Object>} - Bulk update results
 */
export const bulkUpdateAppointments = async (appointmentUpdates) => {
  try {
    if (!Array.isArray(appointmentUpdates) || appointmentUpdates.length === 0) {
      throw new Error('Valid appointment updates array is required');
    }

    // Process each update individually since backend doesn't have bulk endpoint
    const results = await Promise.allSettled(
      appointmentUpdates.map(update => 
        updateAppointment(update.id, update.data)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected').map(r => r.reason);

    return {
      successful: successful.length,
      failed: failed.length,
      results: successful,
      errors: failed
    };
  } catch (error) {
    throw new Error(`Failed to bulk update appointments: ${error.message}`);
  }
};

/**
 * Cancel multiple appointments
 * @param {Array} appointmentIds - Array of appointment IDs to cancel
 * @returns {Promise<Object>} - Cancellation results
 */
export const bulkCancelAppointments = async (appointmentIds) => {
  try {
    const updates = appointmentIds.map(id => ({
      id,
      data: { status: 'cancelled' }
    }));
    
    return await bulkUpdateAppointments(updates);
  } catch (error) {
    throw new Error(`Failed to bulk cancel appointments: ${error.message}`);
  }
};

// Default export with all functions
export default {
  // Basic CRUD
  getAllAppointments,
  getAppointmentById,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  
  // Specialized queries
  getTodayAppointments,
  getUpcomingAppointments,
  getPastAppointments,
  getAppointmentStats,
  checkAvailability,
  
  // Status and payment
  updateAppointmentStatus,
  updatePaymentStatus,
  
  // Search and filter
  searchAppointments,
  getAppointmentsByStatus,
  getAppointmentsByDepartment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getAppointmentsByDate,
  
  // Utilities
  validateAppointmentData,
  formatAppointmentData,
  getStatusColor,
  getPaymentStatusColor,
  generateTimeSlots,
  
  // Bulk operations
  bulkUpdateAppointments,
  bulkCancelAppointments
};