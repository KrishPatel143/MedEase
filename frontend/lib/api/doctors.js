// lib/api/doctors.js
import { get, post, put, del, apiRequest } from '../api';

/**
 * Doctors API Client
 * Handles all doctor-related API operations
 */

// =============================================================================
// DOCTOR MANAGEMENT
// =============================================================================

/**
 * Get all doctors
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise<Object>} - List of doctors
 */
export const getAllDoctors = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/doctors?${queryString}` : '/doctors';
    return await get(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch doctors: ${error.message}`);
  }
};

/**
 * Get doctor by ID
 * @param {string|number} doctorId - Doctor ID
 * @returns {Promise<Object>} - Doctor details
 */
export const getDoctorById = async (doctorId) => {
  try {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    return await get(`/doctors/${doctorId}`);
  } catch (error) {
    throw new Error(`Failed to fetch doctor: ${error.message}`);
  }
};

/**
 * Get doctors by department
 * @param {string} department - Department name
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - List of doctors in department
 */
export const getDoctorsByDepartment = async (department, params = {}) => {
  try {
    if (!department) {
      throw new Error('Department is required');
    }
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `/doctors/department/${encodeURIComponent(department)}?${queryString}`
      : `/doctors/department/${encodeURIComponent(department)}`;
    return await get(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch doctors by department: ${error.message}`);
  }
};

/**
 * Add new doctor (Admin/SuperAdmin only)
 * @param {Object} doctorData - Doctor information
 * @returns {Promise<Object>} - Created doctor
 */
export const addDoctor = async (doctorData) => {
  try {
    if (!doctorData || typeof doctorData !== 'object') {
      throw new Error('Valid doctor data is required');
    }


    return await post('/doctors', doctorData);
  } catch (error) {
    throw new Error(`Failed to add doctor: ${error.message}`);
  }
};

/**
 * Update doctor information (Admin/SuperAdmin only)
 * @param {string|number} doctorId - Doctor ID
 * @param {Object} updateData - Updated doctor information
 * @returns {Promise<Object>} - Updated doctor
 */
export const updateDoctor = async (doctorId, updateData) => {
  try {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Valid update data is required');
    }
    return await put(`/doctors/${doctorId}`, updateData);
  } catch (error) {
    throw new Error(`Failed to update doctor: ${error.message}`);
  }
};

/**
 * Delete doctor (SuperAdmin only)
 * @param {string|number} doctorId - Doctor ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteDoctor = async (doctorId) => {
  try {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    return await del(`/doctors/${doctorId}`);
  } catch (error) {
    throw new Error(`Failed to delete doctor: ${error.message}`);
  }
};

// =============================================================================
// AVAILABILITY MANAGEMENT
// =============================================================================

/**
 * Update doctor availability
 * @param {string|number} doctorId - Doctor ID
 * @param {Object} availabilityData - Availability information
 * @returns {Promise<Object>} - Updated availability
 */
export const updateDoctorAvailability = async (doctorId, availabilityData) => {
  try {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    if (!availabilityData || typeof availabilityData !== 'object') {
      throw new Error('Valid availability data is required');
    }
    
    return await apiRequest(`/doctors/${doctorId}/availability`, {
      method: 'PATCH',
      body: JSON.stringify(availabilityData)
    });
  } catch (error) {
    throw new Error(`Failed to update doctor availability: ${error.message}`);
  }
};

/**
 * Get doctor availability
 * @param {string|number} doctorId - Doctor ID
 * @param {Object} params - Query parameters (date range, etc.)
 * @returns {Promise<Object>} - Doctor availability
 */
export const getDoctorAvailability = async (doctorId, params = {}) => {
  try {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString 
      ? `/doctors/${doctorId}/availability?${queryString}`
      : `/doctors/${doctorId}/availability`;
    return await get(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch doctor availability: ${error.message}`);
  }
};

// =============================================================================
// SEARCH AND FILTER FUNCTIONS
// =============================================================================

/**
 * Search doctors by name, specialization, or department
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} - Search results
 */
export const searchDoctors = async (searchTerm, filters = {}) => {
  try {
    const params = {
      search: searchTerm,
      ...filters
    };
    return await getAllDoctors(params);
  } catch (error) {
    throw new Error(`Failed to search doctors: ${error.message}`);
  }
};

/**
 * Get available doctors for a specific date/time
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} time - Time (HH:MM)
 * @param {string} department - Department filter (optional)
 * @returns {Promise<Object>} - Available doctors
 */
export const getAvailableDoctors = async (date, time, department = null) => {
  try {
    if (!date || !time) {
      throw new Error('Date and time are required');
    }
    
    const params = {
      date,
      time,
      available: true,
      ...(department && { department })
    };
    
    return await getAllDoctors(params);
  } catch (error) {
    throw new Error(`Failed to fetch available doctors: ${error.message}`);
  }
};

/**
 * Get doctors by specialization
 * @param {string} specialization - Medical specialization
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - List of doctors with specialization
 */
export const getDoctorsBySpecialization = async (specialization, params = {}) => {
  try {
    if (!specialization) {
      throw new Error('Specialization is required');
    }
    
    const queryParams = {
      specialization,
      ...params
    };
    
    return await getAllDoctors(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch doctors by specialization: ${error.message}`);
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get list of all departments
 * @returns {Promise<Array>} - List of departments
 */
export const getDepartments = async () => {
  try {
    return await get('/doctors/departments');
  } catch (error) {
    // If endpoint doesn't exist, extract from doctors list
    try {
      const doctors = await getAllDoctors();
      const departments = [...new Set(doctors.data?.map(doc => doc.department) || [])];
      return { data: departments.sort() };
    } catch (fallbackError) {
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }
  }
};

/**
 * Get list of all specializations
 * @returns {Promise<Array>} - List of specializations
 */
export const getSpecializations = async () => {
  try {
    return await get('/api/doctors/specializations');
  } catch (error) {
    // If endpoint doesn't exist, extract from doctors list
    try {
      const doctors = await getAllDoctors();
      const specializations = [...new Set(doctors.data?.map(doc => doc.specialization) || [])];
      return { data: specializations.sort() };
    } catch (fallbackError) {
      throw new Error(`Failed to fetch specializations: ${error.message}`);
    }
  }
};

/**
 * Validate doctor data before submission
 * @param {Object} doctorData - Doctor data to validate
 * @returns {Object} - Validation result
 */
export const validateDoctorData = (doctorData) => {
  const errors = [];
  const requiredFields = {
    name: 'Doctor name',
    email: 'Email address',
    department: 'Department',
    specialization: 'Specialization'
  };

  // Check required fields
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!doctorData[field] || (typeof doctorData[field] === 'string' && !doctorData[field].trim())) {
      errors.push(`${label} is required`);
    }
  });

  // Validate email format
  if (doctorData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctorData.email)) {
    errors.push('Please enter a valid email address');
  }

  // Validate phone number if provided
  if (doctorData.phone && doctorData.phone.length < 10) {
    errors.push('Please enter a valid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format doctor data for display
 * @param {Object} doctor - Doctor object
 * @returns {Object} - Formatted doctor data
 */
export const formatDoctorData = (doctor) => {
  if (!doctor) return null;

  return {
    ...doctor,
    fullName: doctor.name,
    displayName: `Dr. ${doctor.name}`,
    departmentDisplay: doctor.department?.charAt(0).toUpperCase() + doctor.department?.slice(1),
    specializationDisplay: doctor.specialization?.charAt(0).toUpperCase() + doctor.specialization?.slice(1),
    isAvailable: doctor.availability?.isAvailable || false,
    nextAvailable: doctor.availability?.nextAvailable || null
  };
};

// =============================================================================
// BULK OPERATIONS
// =============================================================================

/**
 * Bulk update multiple doctors
 * @param {Array} doctorUpdates - Array of doctor update objects
 * @returns {Promise<Object>} - Bulk update results
 */
export const bulkUpdateDoctors = async (doctorUpdates) => {
  try {
    if (!Array.isArray(doctorUpdates) || doctorUpdates.length === 0) {
      throw new Error('Valid doctor updates array is required');
    }

    return await post('/api/doctors/bulk-update', { updates: doctorUpdates });
  } catch (error) {
    throw new Error(`Failed to bulk update doctors: ${error.message}`);
  }
};

/**
 * Import doctors from CSV/Excel data
 * @param {Array} doctorsData - Array of doctor data objects
 * @returns {Promise<Object>} - Import results
 */
export const importDoctors = async (doctorsData) => {
  try {
    if (!Array.isArray(doctorsData) || doctorsData.length === 0) {
      throw new Error('Valid doctors data array is required');
    }

    // Validate each doctor record
    const validationResults = doctorsData.map((doctor, index) => ({
      index,
      ...validateDoctorData(doctor)
    }));

    const invalidRecords = validationResults.filter(result => !result.isValid);
    
    if (invalidRecords.length > 0) {
      throw new Error(`Invalid records found: ${invalidRecords.map(r => `Row ${r.index + 1}: ${r.errors.join(', ')}`).join('; ')}`);
    }

    return await post('/api/doctors/import', { doctors: doctorsData });
  } catch (error) {
    throw new Error(`Failed to import doctors: ${error.message}`);
  }
};

// Default export with all functions
export default {
  // Basic CRUD
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  
  // Department and specialization
  getDoctorsByDepartment,
  getDoctorsBySpecialization,
  getDepartments,
  getSpecializations,
  
  // Availability
  updateDoctorAvailability,
  getDoctorAvailability,
  getAvailableDoctors,
  
  // Search and filter
  searchDoctors,
  
  // Utilities
  validateDoctorData,
  formatDoctorData,
  
  // Bulk operations
  bulkUpdateDoctors,
  importDoctors
};