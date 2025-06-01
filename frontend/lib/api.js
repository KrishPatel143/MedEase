// lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Utility function for making API requests with authentication
 * @param {string} endpoint - API endpoint path (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - JSON response from the API
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Remove invalid token
      removeAuthToken();
      
      // If you're using any state management like Redux, dispatch logout action here
      // e.g. store.dispatch(logoutUser());
      
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      throw new Error('Authentication expired. Please log in again.');
    }
    
    // Handle 403 Forbidden - insufficient permissions
    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action.');
    }
    
    // Parse response as JSON, handling both success and error responses
    const data = await response.json();
    
    // If the response status is not in the 200-299 range, throw an error
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    // Enhance error with additional information
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Re-throw the error for the calling function to handle
    throw error;
  }
};

/**
 * Gets the authentication token from local storage
 * @returns {string|null} - The authentication token or null if not found
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('medease_token');
  }
  return null;
};

/**
 * Sets the authentication token in local storage
 * @param {string} token - The authentication token to store
 */
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('medease_token', token);
  }
};

/**
 * Removes the authentication token from local storage
 */
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('medease_token');
    localStorage.removeItem('medease_user'); // Also remove user data
  }
};

/**
 * Gets the current user data from local storage
 * @returns {Object|null} - The user object or null if not found
 */
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('medease_user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

/**
 * Sets the current user data in local storage
 * @param {Object} user - The user object to store
 */
export const setCurrentUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('medease_user', JSON.stringify(user));
  }
};

/**
 * Checks if user is authenticated
 * @returns {boolean} - True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Gets the current user's role
 * @returns {string|null} - The user's role or null if not authenticated
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * Checks if user has a specific role
 * @param {string} role - The role to check for
 * @returns {boolean} - True if user has the specified role
 */
export const hasRole = (role) => {
  return getUserRole() === role;
};

/**
 * Checks if user has any of the specified roles
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} - True if user has any of the specified roles
 */
export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

// =============================================================================
// AUTH API FUNCTIONS
// =============================================================================

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} - Login response
 */
export const login = async (credentials) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Store token and user data
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.user) {
      setCurrentUser(response.user);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - Registration data
 * @returns {Promise<Object>} - Registration response
 */
export const register = async (userData) => {
  try {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    // Store token and user data if registration includes auto-login
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.user) {
      setCurrentUser(response.user);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Optional: Call logout endpoint if your backend requires it
    // await apiRequest('/api/auth/logout', { method: 'POST' });
    
    // Clear local storage
    removeAuthToken();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    // Even if logout fails, clear local data
    removeAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

/**
 * Get user profile
 * @returns {Promise<Object>} - User profile data
 */
export const getProfile = async () => {
  return await apiRequest('/auth/profile');
};

/**
 * Update user profile
 * @param {Object} profileData - Profile update data
 * @returns {Promise<Object>} - Updated profile data
 */
export const updateProfile = async (profileData) => {
  const response = await apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  
  // Update stored user data
  if (response.user) {
    setCurrentUser(response.user);
  }
  
  return response;
};

/**
 * Change password
 * @param {Object} passwordData - Password change data
 * @returns {Promise<Object>} - Response
 */
export const changePassword = async (passwordData) => {
  return await apiRequest('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData)
  });
};

// =============================================================================
// COMMON API FUNCTIONS
// =============================================================================

/**
 * Generic GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} - Response data
 */
export const get = async (endpoint) => {
  return await apiRequest(endpoint, { method: 'GET' });
};

/**
 * Generic POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @returns {Promise<Object>} - Response data
 */
export const post = async (endpoint, data) => {
  return await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * Generic patch request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @returns {Promise<Object>} - Response data
 */
export const patch = async (endpoint, data) => {
  return await apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

/**
 * Generic PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @returns {Promise<Object>} - Response data
 */
export const put = async (endpoint, data) => {
  return await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

/**
 * Generic DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} - Response data
 */
export const del = async (endpoint) => {
  return await apiRequest(endpoint, { method: 'DELETE' });
};

/**
 * Upload file
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - File data
 * @returns {Promise<Object>} - Response data
 */
export const uploadFile = async (endpoint, formData) => {
  const token = getAuthToken();
  
  const headers = {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    // Don't set Content-Type for FormData - let browser set it with boundary
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData
  });
  
  if (response.status === 401) {
    removeAuthToken();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    throw new Error('Authentication expired. Please log in again.');
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Upload failed');
  }
  
  return data;
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format API errors for display
 * @param {Error} error - The error object
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is a network error
 * @param {Error} error - The error object
 * @returns {boolean} - True if it's a network error
 */
export const isNetworkError = (error) => {
  return error.message && error.message.includes('Network error');
};

/**
 * Check if error is an authentication error
 * @param {Error} error - The error object
 * @returns {boolean} - True if it's an auth error
 */
export const isAuthError = (error) => {
  return error.message && error.message.includes('Authentication expired');
};

export default {
  // Core functions
  apiRequest,
  get,
  post,
  put,
  del,
  uploadFile,
  
  // Auth functions
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  
  // Token management
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  
  // User management
  getCurrentUser,
  setCurrentUser,
  isAuthenticated,
  getUserRole,
  hasRole,
  hasAnyRole,
  
  // Utilities
  formatErrorMessage,
  isNetworkError,
  isAuthError
};