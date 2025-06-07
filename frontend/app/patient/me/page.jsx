'use client'
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header" // Import the universal header
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  Shield,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  UserCheck
} from 'lucide-react';

// Import your API functions
import { getPatientById, updatePatient } from '@/lib/api/patients'; // Adjust path as needed
import { getProfile } from '@/lib/api';

const PatientProfilePage = ({ patientId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        
        const currentDoctorId = await getProfile();
        console.log(currentDoctorId._id);
        
        const response = await getPatientById(currentDoctorId._id);
        
        if (response.data) {
          setPatientData(response.data);
          setFormData(response.data);
        } else {
          throw new Error('No patient data received');
        }
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError(err.message || 'Failed to load patient profile');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

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

  const handleMedicalHistoryChange = (index, field, value) => {
    const updatedHistory = [...(formData.medicalHistory || [])];
    updatedHistory[index] = {
      ...updatedHistory[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      medicalHistory: updatedHistory
    }));
  };

  const addMedicalHistory = () => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: [
        ...(prev.medicalHistory || []),
        { condition: '', diagnosedDate: new Date().toISOString().split('T')[0], notes: '' }
      ]
    }));
  };

  const removeMedicalHistory = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare update data
      const updateData = {
        // User fields
        firstName: formData.userId?.firstName,
        lastName: formData.userId?.lastName,
        email: formData.userId?.email,
        
        // Patient fields
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory
      };

      // Get patient ID from current data
      const currentPatientId = patientData._id || patientId || localStorage.getItem('patientId');
      
      if (!currentPatientId) {
        throw new Error('Patient ID not found');
      }

      // Call update API
      const response = await updatePatient(currentPatientId, updateData);
      
      if (response.data) {
        // Update local state with response data
        setPatientData(response.data);
        setFormData(response.data);
        setIsEditing(false);
        
        // Show success message
        setError(null);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating patient profile:', err);
      setError(err.message || 'Failed to update profile');
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
      // API call to change password would go here
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading patient profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error Loading Profile</p>
              <p>{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if no patient data
  if (!patientData) {
    return null;
  }

  const genderOptions = ['male', 'female', 'other', 'prefer_not_to_say'];
  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-center">
          <p>{error}</p>
        </div>
      )}
      
      {/* Profile Header */}
      <div className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {patientData.userId?.firstName} {patientData.userId?.lastName}
                </h1>
                <p className="text-lg text-green-600 font-medium">Patient</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">
                    Age: {getAge(patientData.dateOfBirth)} years
                  </span>
                  <span className="text-sm text-gray-600 capitalize">
                    {patientData.gender?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(patientData);
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{patientData.userId?.lastName}</span>
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">{patientData.userId?.email}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.contactNumber || ''}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">{patientData.contactNumber || 'Not provided'}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-gray-900">
                        {patientData.dateOfBirth ? new Date(patientData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <select
                        value={formData.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        {genderOptions.map(option => (
                          <option key={option} value={option}>
                            {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-900 capitalize">
                        {patientData.gender?.replace('_', ' ') || 'Not specified'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-2" />
                  {isEditing ? (
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <span className="text-gray-900">{patientData.address || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Emergency Contact
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value, 'emergencyContact')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Emergency contact name"
                    />
                  ) : (
                    <span className="text-gray-900">{patientData.emergencyContact?.name || 'Not provided'}</span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact?.relationship || ''}
                      onChange={(e) => handleInputChange('relationship', e.target.value, 'emergencyContact')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Spouse, Parent"
                    />
                  ) : (
                    <span className="text-gray-900">{patientData.emergencyContact?.relationship || 'Not specified'}</span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.emergencyContact?.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value, 'emergencyContact')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Emergency contact number"
                    />
                  ) : (
                    <span className="text-gray-900">{patientData.emergencyContact?.phoneNumber || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Medical History Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-green-600" />
                  Medical History
                </h2>
                {isEditing && (
                  <button
                    onClick={addMedicalHistory}
                    className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-sm hover:bg-green-200 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Condition</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {(isEditing ? formData.medicalHistory : patientData.medicalHistory)?.map((history, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Condition"
                          value={history.condition || ''}
                          onChange={(e) => handleMedicalHistoryChange(index, 'condition', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={history.diagnosedDate ? new Date(history.diagnosedDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleMedicalHistoryChange(index, 'diagnosedDate', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Notes"
                            value={history.notes || ''}
                            onChange={(e) => handleMedicalHistoryChange(index, 'notes', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeMedicalHistory(index)}
                            className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900">{history.condition}</div>
                        <div className="text-sm text-gray-600">
                          Diagnosed: {history.diagnosedDate ? new Date(history.diagnosedDate).toLocaleDateString() : 'Date not specified'}
                        </div>
                        {history.notes && (
                          <div className="text-sm text-gray-500 mt-1">{history.notes}</div>
                        )}
                      </div>
                    )}
                  </div>
                )) || (
                  <div className="text-gray-500 text-center py-4">
                    No medical history recorded
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Account Status & Password */}
          <div className="space-y-6">
            
            {/* Account Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                Account Status
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medical Conditions</span>
                  <span className="text-gray-900">{patientData.medicalHistory?.length || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Emergency Contact</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patientData.emergencyContact?.name 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {patientData.emergencyContact?.name ? 'Set' : 'Not Set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            {/* <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleChangePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;