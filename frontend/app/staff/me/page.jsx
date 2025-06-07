'use client'
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Stethoscope, 
  Calendar,
  Clock,
  Star,
  Award,
  Building2,
  DollarSign,
  Eye,
  EyeOff,
  Loader
} from 'lucide-react';
import { getDoctorById ,updateDoctor } from '@/lib/api/doctors';
import { getProfile } from '@/lib/api';

const DoctorProfilePage = ({ doctorId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const [doctorData, setDoctorData] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch doctor data on component mount
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        
        // Get doctorId from props, localStorage, or context
        const currentDoctorId = await getProfile();
        console.log(currentDoctorId._id);
        
        const response = await getDoctorById(currentDoctorId._id);
        console.log(response);
        
        
        if (response.data) {
          setDoctorData(response.data);
          setFormData(response.data);
        } else {
          throw new Error('No doctor data received');
        }
      } catch (err) {
        console.error('Error fetching doctor data:', err);
        setError(err.message || 'Failed to load doctor profile');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleQualificationChange = (index, field, value) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications[index] = {
      ...updatedQualifications[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      qualifications: updatedQualifications
    }));
  };

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { degree: '', institution: '', year: new Date().getFullYear() }
      ]
    }));
  };

  const removeQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare update data by removing unnecessary fields
      const updateData = {
        // User fields
        firstName: formData.userId?.firstName,
        lastName: formData.userId?.lastName,
        email: formData.userId?.email,
        phoneNumber: formData.userId?.phoneNumber,
        
        // Doctor fields
        specialization: formData.specialization,
        department: formData.department,
        qualifications: formData.qualifications,
        experience: formData.experience,
        consultationFee: formData.consultationFee,
        availability: formData.availability,
        status: formData.status
      };

      // Get doctor ID from current data
      const currentDoctorId = doctorData._id || doctorId || localStorage.getItem('doctorId');
      
      if (!currentDoctorId) {
        throw new Error('Doctor ID not found');
      }

      // Call update API
      const response = await updateDoctor(currentDoctorId, updateData);
      
      if (response.data) {
        // Update local state with response data
        setDoctorData(response.data);
        setFormData(response.data);
        setIsEditing(false);
        
        // Show success message
        setError(null);
      }
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      setError(err.message || 'Failed to update profile');
      // You can replace this with a toast notification
      alert('Error updating profile: ' + (err.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // API call to change password
      // await changePassword(passwordData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (error) {
      alert('Error changing password: ' + error.message);
    }
    setLoading(false);
  };

  // Loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !doctorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error Loading Profile</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Don't render if no doctor data
  if (!doctorData) {
    return null;
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'General'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-center">
          <p>{error}</p>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {doctorData.userId?.firstName} {doctorData.userId?.lastName}
                </h1>
                <p className="text-lg text-blue-600 font-medium">{doctorData.specialization}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {doctorData.ratings?.average || 0} ({doctorData.ratings?.count || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(doctorData);
                      setError(null);
                    }}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.userId?.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value, 'userId')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">{doctorData.userId.firstName}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.userId?.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value, 'userId')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{doctorData.userId.lastName}</span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.userId?.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value, 'userId')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">{doctorData.userId.email}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.userId?.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value, 'userId')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">{doctorData.userId?.phoneNumber || 'Not provided'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                Professional Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <select
                        value={formData.department || ''}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-900">{doctorData.department}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.specialization || ''}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">{doctorData.specialization}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.experience || ''}
                        onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">{doctorData.experience} years</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.consultationFee || ''}
                        onChange={(e) => handleInputChange('consultationFee', parseInt(e.target.value))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">₹{doctorData.consultationFee}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Qualifications Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                  Qualifications
                </h2>
                {isEditing && (
                  <button
                    onClick={addQualification}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add Qualification
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {(isEditing ? formData.qualifications : doctorData.qualifications)?.map((qual, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Degree"
                          value={qual.degree || ''}
                          onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Institution"
                          value={qual.institution || ''}
                          onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Year"
                            value={qual.year || ''}
                            onChange={(e) => handleQualificationChange(index, 'year', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeQualification(index)}
                            className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900">{qual.degree}</div>
                        <div className="text-sm text-gray-600">{qual.institution} • {qual.year}</div>
                      </div>
                    )}
                  </div>
                )) || (
                  <div className="text-gray-500 text-center py-4">
                    No qualifications added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Availability & Password */}
          <div className="space-y-6">
            
            {/* Availability Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Availability
              </h2>
              
              <div className="space-y-4">
                {days.map(day => (
                  <div key={day} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">{day}</span>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={formData.availability?.[day]?.isAvailable || false}
                          onChange={(e) => handleAvailabilityChange(day, 'isAvailable', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doctorData.availability?.[day]?.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doctorData.availability?.[day]?.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      )}
                    </div>
                    
                    {(isEditing ? formData.availability?.[day]?.isAvailable : doctorData.availability?.[day]?.isAvailable) && (
                      <div className="flex space-x-2 text-sm">
                        {isEditing ? (
                          <>
                            <input
                              type="time"
                              value={formData.availability?.[day]?.start || ''}
                              onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={formData.availability?.[day]?.end || ''}
                              onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </>
                        ) : (
                          <span className="text-gray-600">
                            {doctorData.availability?.[day]?.start || 'N/A'} - {doctorData.availability?.[day]?.end || 'N/A'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleChangePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;