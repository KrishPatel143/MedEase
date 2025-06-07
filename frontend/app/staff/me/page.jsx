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
  Loader,
  TrendingUp,
  CreditCard,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { getDoctorById, updateDoctor } from '@/lib/api/doctors';
import { getProfile } from '@/lib/api';
import { getDoctorMonthlyRevenue } from '@/lib/api/finance';

const DoctorProfilePage = ({ doctorId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [doctorData, setDoctorData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
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
        
        const currentDoctorId = await getProfile();
        console.log(currentDoctorId._id);
        
        const response = await getDoctorById(currentDoctorId._id);
        console.log(response);
        
        if (response.data) {
          setDoctorData(response.data);
          setFormData(response.data);
          
          // Fetch revenue data
          await fetchRevenueData(currentDoctorId._id);
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

  // Fetch revenue data
  const fetchRevenueData = async (docId) => {
    try {
      setRevenueLoading(true);
      const response = await getDoctorMonthlyRevenue(docId);
      if (response.data) {
        setRevenueData(response.data);
      }
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      // Don't set error state for revenue - just log it
    } finally {
      setRevenueLoading(false);
    }
  };

  // Refresh revenue data
  const refreshRevenueData = async () => {
    if (doctorData?._id) {
      await fetchRevenueData(doctorData._id);
    }
  };

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
      const updateData = {
        firstName: formData.userId?.firstName,
        lastName: formData.userId?.lastName,
        email: formData.userId?.email,
        phoneNumber: formData.userId?.phoneNumber,
        specialization: formData.specialization,
        department: formData.department,
        qualifications: formData.qualifications,
        experience: formData.experience,
        consultationFee: formData.consultationFee,
        availability: formData.availability,
        status: formData.status
      };

      const currentDoctorId = doctorData._id || doctorId || localStorage.getItem('doctorId');
      
      if (!currentDoctorId) {
        throw new Error('Doctor ID not found');
      }

      const response = await updateDoctor(currentDoctorId, updateData);
      
      if (response.data) {
        setDoctorData(response.data);
        setFormData(response.data);
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      setError(err.message || 'Failed to update profile');
      alert('Error updating profile: ' + (err.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  // Loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading doctor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !doctorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <div className="flex items-center justify-center h-96">
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
      </div>
    );
  }

  if (!doctorData) {
    return null;
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'General'];

  // Revenue Analytics Components
  const RevenueOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              £{revenueData?.summary?.totalRevenue?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900">
              {revenueData?.summary?.totalAppointments || '0'}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg per Appointment</p>
            <p className="text-2xl font-bold text-gray-900">
              £{revenueData?.summary?.averagePerAppointment?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-lg font-bold text-gray-900">
              {revenueData?.period?.monthName} {revenueData?.period?.year}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <button 
          onClick={refreshRevenueData}
          disabled={revenueLoading}
          className="flex items-center mt-4 text-sm text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${revenueLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>
    </div>
  );

  const DailyBreakdown = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
        Daily Revenue Breakdown
      </h3>
      {revenueData?.dailyBreakdown?.length > 0 ? (
        <div className="grid grid-cols-7 gap-2">
          {revenueData.dailyBreakdown.map((day, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">{day._id}</div>
              <div className="text-xs text-gray-600">£{day.dailyRevenue?.toLocaleString()}</div>
              <div className="text-xs text-blue-600">{day.appointmentCount} appts</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No daily data available for this month
        </div>
      )}
    </div>
  );

  const PaymentMethodBreakdown = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-blue-600" />
        Payment Methods
      </h3>
      {revenueData?.paymentMethodBreakdown?.length > 0 ? (
        <div className="space-y-3">
          {revenueData.paymentMethodBreakdown.map((method, index) => {
            const total = revenueData.summary.totalRevenue;
            const percentage = total > 0 ? ((method.amount / total) * 100).toFixed(1) : 0;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900 capitalize">
                    {method._id || 'Cash'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    £{method.amount?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {percentage}% ({method.count} transactions)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No payment data available for this month
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-center">
          <p>{error}</p>
        </div>
      )}
      
      {/* Profile Header */}
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
          
          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Revenue Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' ? (
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
                        <span className="text-gray-900">£{doctorData.consultationFee}</span>
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

            {/* Right Column - Availability */}
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

              {/* Quick Revenue Summary Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Quick Revenue Summary
                  </h2>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details →
                  </button>
                </div>
                
                {revenueLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : revenueData ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">This Month</span>
                      <span className="text-lg font-bold text-green-600">
                        £{revenueData?.summary?.totalRevenue?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Appointments</span>
                      <span className="text-lg font-bold text-blue-600">
                        {revenueData?.summary?.totalAppointments || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Avg/Appointment</span>
                      <span className="text-lg font-bold text-purple-600">
                        £{revenueData?.summary?.averagePerAppointment?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No revenue data available
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Revenue Analytics Tab */
          <div className="space-y-6">
            {revenueLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading revenue analytics...</p>
                </div>
              </div>
            ) : revenueData ? (
              <>
                <RevenueOverview />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DailyBreakdown />
                  <PaymentMethodBreakdown />
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Revenue Data Available</h3>
                <p className="text-gray-600 mb-4">
                  Unable to load revenue analytics at this time. This could be due to:
                </p>
                <ul className="text-sm text-gray-500 space-y-1 mb-6">
                  <li>• No appointments scheduled this month</li>
                  <li>• Revenue data not yet processed</li>
                  <li>• System temporarily unavailable</li>
                </ul>
                <button
                  onClick={refreshRevenueData}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfilePage;