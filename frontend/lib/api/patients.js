// lib/api/patients.js
import { get, post, put, del, apiRequest } from '../api';

/**
 * Patients API Client
 * Handles all patient-related API operations
 */

// =============================================================================
// PATIENT MANAGEMENT
// =============================================================================

/**
 * Get all patients
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise<Object>} - List of patients
 */
export const getAllPatients = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/patients?${queryString}` : '/patients';
    return await get(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch patients: ${error.message}`);
  }
};

/**
 * Get patient by ID
 * @param {string|number} patientId - Patient ID
 * @returns {Promise<Object>} - Patient details
 */
export const getPatientById = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    return await get(`/patients/${patientId}`);
  } catch (error) {
    throw new Error(`Failed to fetch patient: ${error.message}`);
  }
};

/**
 * Add new patient
 * @param {Object} patientData - Patient information
 * @returns {Promise<Object>} - Created patient
 */
export const addPatient = async (patientData) => {
  try {
    if (!patientData || typeof patientData !== 'object') {
      throw new Error('Valid patient data is required');
    }

    return await post('/patients', patientData);
  } catch (error) {
    throw new Error(`Failed to add patient: ${error.message}`);
  }
};

/**
 * Update patient information
 * @param {string|number} patientId - Patient ID
 * @param {Object} updateData - Updated patient information
 * @returns {Promise<Object>} - Updated patient
 */
export const updatePatient = async (patientId, updateData) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Valid update data is required');
    }
    return await put(`/patients/${patientId}`, updateData);
  } catch (error) {
    throw new Error(`Failed to update patient: ${error.message}`);
  }
};

/**
 * Delete patient (Admin only)
 * @param {string|number} patientId - Patient ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deletePatient = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    return await del(`/patients/${patientId}`);
  } catch (error) {
    throw new Error(`Failed to delete patient: ${error.message}`);
  }
};

// =============================================================================
// MEDICAL HISTORY MANAGEMENT
// =============================================================================

/**
 * Add medical history entry
 * @param {string|number} patientId - Patient ID
 * @param {Object} historyData - Medical history entry
 * @returns {Promise<Object>} - Updated patient with new history
 */
export const addMedicalHistory = async (patientId, historyData) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    if (!historyData || typeof historyData !== 'object') {
      throw new Error('Valid medical history data is required');
    }
    
    return await post(`/patients/${patientId}/medical-history`, historyData);
  } catch (error) {
    throw new Error(`Failed to add medical history: ${error.message}`);
  }
};

/**
 * Update medical history entry
 * @param {string|number} patientId - Patient ID
 * @param {string|number} historyId - Medical history entry ID
 * @param {Object} updateData - Updated medical history data
 * @returns {Promise<Object>} - Updated patient
 */
export const updateMedicalHistory = async (patientId, historyId, updateData) => {
  try {
    if (!patientId || !historyId) {
      throw new Error('Patient ID and history ID are required');
    }
    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Valid update data is required');
    }
    
    return await put(`/patients/${patientId}/medical-history/${historyId}`, updateData);
  } catch (error) {
    throw new Error(`Failed to update medical history: ${error.message}`);
  }
};

/**
 * Delete medical history entry
 * @param {string|number} patientId - Patient ID
 * @param {string|number} historyId - Medical history entry ID
 * @returns {Promise<Object>} - Updated patient
 */
export const deleteMedicalHistory = async (patientId, historyId) => {
  try {
    if (!patientId || !historyId) {
      throw new Error('Patient ID and history ID are required');
    }
    
    return await del(`/patients/${patientId}/medical-history/${historyId}`);
  } catch (error) {
    throw new Error(`Failed to delete medical history: ${error.message}`);
  }
};

// =============================================================================
// SEARCH AND FILTER FUNCTIONS
// =============================================================================

/**
 * Search patients by name, email, or contact
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} - Search results
 */
export const searchPatients = async (searchTerm, filters = {}) => {
  try {
    const params = {
      search: searchTerm,
      ...filters
    };
    return await getAllPatients(params);
  } catch (error) {
    throw new Error(`Failed to search patients: ${error.message}`);
  }
};

/**
 * Get patients by gender
 * @param {string} gender - Gender filter
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - List of patients by gender
 */
export const getPatientsByGender = async (gender, params = {}) => {
  try {
    if (!gender) {
      throw new Error('Gender is required');
    }
    
    const queryParams = {
      gender,
      ...params
    };
    
    return await getAllPatients(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch patients by gender: ${error.message}`);
  }
};

/**
 * Get patients by age range
 * @param {number} minAge - Minimum age
 * @param {number} maxAge - Maximum age
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - List of patients in age range
 */
export const getPatientsByAgeRange = async (minAge, maxAge, params = {}) => {
  try {
    if (minAge === undefined || maxAge === undefined) {
      throw new Error('Both minimum and maximum age are required');
    }
    
    const queryParams = {
      minAge,
      maxAge,
      ...params
    };
    
    return await getAllPatients(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch patients by age range: ${error.message}`);
  }
};

/**
 * Get patients with specific medical condition
 * @param {string} condition - Medical condition
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} - List of patients with condition
 */
export const getPatientsByCondition = async (condition, params = {}) => {
  try {
    if (!condition) {
      throw new Error('Medical condition is required');
    }
    
    const queryParams = {
      condition,
      ...params
    };
    
    return await getAllPatients(queryParams);
  } catch (error) {
    throw new Error(`Failed to fetch patients by condition: ${error.message}`);
  }
};

// =============================================================================
// EMERGENCY CONTACT MANAGEMENT
// =============================================================================

/**
 * Update emergency contact
 * @param {string|number} patientId - Patient ID
 * @param {Object} emergencyContactData - Emergency contact information
 * @returns {Promise<Object>} - Updated patient
 */
export const updateEmergencyContact = async (patientId, emergencyContactData) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    if (!emergencyContactData || typeof emergencyContactData !== 'object') {
      throw new Error('Valid emergency contact data is required');
    }
    
    return await apiRequest(`/patients/${patientId}/emergency-contact`, {
      method: 'PATCH',
      body: JSON.stringify(emergencyContactData)
    });
  } catch (error) {
    throw new Error(`Failed to update emergency contact: ${error.message}`);
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate age from date of birth
 * @param {string|Date} dateOfBirth - Date of birth
 * @returns {number} - Age in years
 */
export const calculateAge = (dateOfBirth) => {
  try {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return 0;
  }
};

/**
 * Validate patient data before submission
 * @param {Object} patientData - Patient data to validate
 * @returns {Object} - Validation result
 */
export const validatePatientData = (patientData) => {
  const errors = [];
  const requiredFields = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    dateOfBirth: 'Date of birth',
    gender: 'Gender'
  };

  // Check required fields
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!patientData[field] || (typeof patientData[field] === 'string' && !patientData[field].trim())) {
      errors.push(`${label} is required`);
    }
  });

  // Validate email format
  if (patientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
    errors.push('Please enter a valid email address');
  }

  // Validate date of birth
  if (patientData.dateOfBirth) {
    const birthDate = new Date(patientData.dateOfBirth);
    const today = new Date();
    
    if (isNaN(birthDate.getTime())) {
      errors.push('Please enter a valid date of birth');
    } else if (birthDate > today) {
      errors.push('Date of birth cannot be in the future');
    } else if (calculateAge(birthDate) > 150) {
      errors.push('Please enter a valid date of birth');
    }
  }

  // Validate gender
  if (patientData.gender) {
    const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
    if (!validGenders.includes(patientData.gender)) {
      errors.push('Please select a valid gender');
    }
  }

  // Validate contact number if provided
  if (patientData.contactNumber && patientData.contactNumber.length < 10) {
    errors.push('Please enter a valid contact number (at least 10 digits)');
  }

  // Validate emergency contact if provided
  if (patientData.emergencyContact) {
    const { name, phoneNumber } = patientData.emergencyContact;
    if (name && !phoneNumber) {
      errors.push('Emergency contact phone number is required when name is provided');
    }
    if (phoneNumber && phoneNumber.length < 10) {
      errors.push('Emergency contact phone number must be at least 10 digits');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format patient data for display
 * @param {Object} patient - Patient object
 * @returns {Object} - Formatted patient data
 */
export const formatPatientData = (patient) => {
  if (!patient) return null;

  const age = calculateAge(patient.dateOfBirth);
  
  return {
    ...patient,
    fullName: `${patient.firstName} ${patient.lastName}`,
    displayName: `${patient.firstName} ${patient.lastName}`,
    age,
    ageDisplay: `${age} years old`,
    genderDisplay: patient.gender?.charAt(0).toUpperCase() + patient.gender?.slice(1).replace('_', ' '),
    dateOfBirthDisplay: new Date(patient.dateOfBirth).toLocaleDateString(),
    hasEmergencyContact: !!(patient.emergencyContact?.name && patient.emergencyContact?.phoneNumber),
    medicalConditions: patient.medicalHistory?.map(h => h.condition) || [],
    latestCondition: patient.medicalHistory?.[patient.medicalHistory.length - 1]?.condition || null
  };
};

/**
 * Validate medical history entry
 * @param {Object} historyData - Medical history data
 * @returns {Object} - Validation result
 */
export const validateMedicalHistory = (historyData) => {
  const errors = [];
  
  if (!historyData.condition || !historyData.condition.trim()) {
    errors.push('Medical condition is required');
  }
  
  if (historyData.diagnosedDate) {
    const diagnosedDate = new Date(historyData.diagnosedDate);
    const today = new Date();
    
    if (isNaN(diagnosedDate.getTime())) {
      errors.push('Please enter a valid diagnosed date');
    } else if (diagnosedDate > today) {
      errors.push('Diagnosed date cannot be in the future');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// =============================================================================
// BULK OPERATIONS
// =============================================================================

/**
 * Bulk update multiple patients
 * @param {Array} patientUpdates - Array of patient update objects
 * @returns {Promise<Object>} - Bulk update results
 */
export const bulkUpdatePatients = async (patientUpdates) => {
  try {
    if (!Array.isArray(patientUpdates) || patientUpdates.length === 0) {
      throw new Error('Valid patient updates array is required');
    }

    return await post('/patients/bulk-update', { updates: patientUpdates });
  } catch (error) {
    throw new Error(`Failed to bulk update patients: ${error.message}`);
  }
};

/**
 * Import patients from CSV/Excel data
 * @param {Array} patientsData - Array of patient data objects
 * @returns {Promise<Object>} - Import results
 */
export const importPatients = async (patientsData) => {
  try {
    if (!Array.isArray(patientsData) || patientsData.length === 0) {
      throw new Error('Valid patients data array is required');
    }

    // Validate each patient record
    const validationResults = patientsData.map((patient, index) => ({
      index,
      ...validatePatientData(patient)
    }));

    const invalidRecords = validationResults.filter(result => !result.isValid);
    
    if (invalidRecords.length > 0) {
      throw new Error(`Invalid records found: ${invalidRecords.map(r => `Row ${r.index + 1}: ${r.errors.join(', ')}`).join('; ')}`);
    }

    return await post('/patients/import', { patients: patientsData });
  } catch (error) {
    throw new Error(`Failed to import patients: ${error.message}`);
  }
};

/**
 * Export patients data
 * @param {Object} filters - Export filters
 * @param {string} format - Export format ('csv', 'excel', 'pdf')
 * @returns {Promise<Blob>} - Export file
 */
export const exportPatients = async (filters = {}, format = 'csv') => {
  try {
    const params = new URLSearchParams({
      ...filters,
      format
    }).toString();
    
    const response = await apiRequest(`/patients/export?${params}`, {
      method: 'GET'
    });
    
    return response.blob();
  } catch (error) {
    throw new Error(`Failed to export patients: ${error.message}`);
  }
};

// =============================================================================
// STATISTICS AND ANALYTICS
// =============================================================================

/**
 * Get patient statistics
 * @param {Object} filters - Statistics filters
 * @returns {Promise<Object>} - Patient statistics
 */
export const getPatientStatistics = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/patients/statistics?${queryString}` : '/patients/statistics';
    return await get(endpoint);
  } catch (error) {
    throw new Error(`Failed to fetch patient statistics: ${error.message}`);
  }
};

/**
 * Get patient demographics
 * @returns {Promise<Object>} - Patient demographics data
 */
export const getPatientDemographics = async () => {
  try {
    return await get('/patients/demographics');
  } catch (error) {
    throw new Error(`Failed to fetch patient demographics: ${error.message}`);
  }
};

// Default export with all functions
export default {
  // Basic CRUD
  getAllPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
  
  // Medical history
  addMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
  
  // Emergency contact
  updateEmergencyContact,
  
  // Search and filter
  searchPatients,
  getPatientsByGender,
  getPatientsByAgeRange,
  getPatientsByCondition,
  
  // Utilities
  calculateAge,
  validatePatientData,
  validateMedicalHistory,
  formatPatientData,
  
  // Bulk operations
  bulkUpdatePatients,
  importPatients,
  exportPatients,
  
  // Analytics
  getPatientStatistics,
  getPatientDemographics
};