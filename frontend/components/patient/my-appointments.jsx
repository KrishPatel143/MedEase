"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Using basic table structure instead of shadcn table components
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  RefreshCw,
  CreditCard
} from "lucide-react";

// Import API functions
import { 
  getAppointmentsByPatient, 
  updateAppointmentStatus,
  formatAppointmentData,
} from '@/lib/api/appointments';
import { getProfile } from '@/lib/api';
import { processPayment } from '@/lib/api/finance';
import Link from 'next/link';

export default function MyAppointments() {
  const [patientId, setPatientId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  // Generate random transaction ID
  const generateTransactionId = () => {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Get user profile and patient ID
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const authdata = await getProfile();
        if (authdata && authdata.id) {
          setPatientId(authdata.id);
          setIsAuthenticated(true);
        } else {
          setError('Please log in to view your appointments');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Authentication failed. Please log in again.');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientId();
  }, []);

  // Load appointments when patient ID is available
  useEffect(() => {
    if (patientId && isAuthenticated) {
      loadAppointments();
    }
  }, [patientId, isAuthenticated]);

  const loadAppointments = async () => {
    if (!patientId) {
      setError('Please log in to view your appointments');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await getAppointmentsByPatient(patientId, {
        page: 1,
        limit: 50,
        sort: '-appointmentDate' // Sort by date descending
      });

      if (response.data) {
        // Format appointments for display
        const formattedAppointments = response.data.map(appointment => 
          formatAppointmentData(appointment)
        );
        setAppointments(formattedAppointments);
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
      if (err.message.includes('401') || err.message.includes('Authentication')) {
        setError('Authentication failed. Please log in again.');
        setIsAuthenticated(false);
      } else {
        setError('Failed to load appointments. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    setCancellingId(appointmentId);
    setError('');
    setSuccess('');

    try {
      await updateAppointmentStatus(appointmentId, 'cancelled');
      
      // Update the local state
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, status: 'cancelled', canCancel: false }
            : appointment
        )
      );

      setSuccess('Appointment cancelled successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      if (err.message.includes('not found')) {
        setError('Appointment not found');
      } else if (err.message.includes('cannot be cancelled')) {
        setError('This appointment cannot be cancelled (less than 2 hours before appointment time)');
      } else {
        setError('Failed to cancel appointment. Please try again.');
      }
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayment = async (appointmentId) => {
    setPayingId(appointmentId);
    setError('');
    setSuccess('');

    try {
      const paymentData = {
        appointmentId: appointmentId,
        paymentMethod: 'card',
        transactionId: generateTransactionId()
      };

      await processPayment(paymentData);
      
      // Update the local state to reflect payment completion
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, paymentStatus: 'paid' }
            : appointment
        )
      );

      setSuccess('Payment processed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error processing payment:', err);
      if (err.message.includes('not found')) {
        setError('Appointment not found');
      } else if (err.message.includes('already paid')) {
        setError('This appointment has already been paid for');
      } else {
        setError('Failed to process payment. Please try again.');
      }
    } finally {
      setPayingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      upcoming: 'bg-blue-500 hover:bg-blue-600',
      completed: 'bg-green-500 hover:bg-green-600',
      cancelled: 'bg-gray-500 hover:bg-gray-600',
      rescheduled: 'bg-yellow-500 hover:bg-yellow-600',
      'no-show': 'bg-red-500 hover:bg-red-600'
    };

    const labels = {
      upcoming: 'Upcoming',
      completed: 'Completed',
      cancelled: 'Cancelled',
      rescheduled: 'Rescheduled',
      'no-show': 'No Show'
    };

    return (
      <Badge className={colors[status] || 'bg-gray-500'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    if (!paymentStatus) return null;

    const colors = {
      pending: 'bg-orange-500 hover:bg-orange-600',
      paid: 'bg-green-500 hover:bg-green-600',
      refunded: 'bg-blue-500 hover:bg-blue-600',
      failed: 'bg-red-500 hover:bg-red-600'
    };

    const labels = {
      pending: 'Payment Pending',
      paid: 'Paid',
      refunded: 'Refunded',
      failed: 'Payment Failed'
    };

    return (
      <Badge variant="outline" className={`ml-2 ${colors[paymentStatus] || 'bg-gray-500'}`}>
        {labels[paymentStatus] || paymentStatus}
      </Badge>
    );
  };

  const getDepartmentIcon = (department) => {
    const icons = {
      'Cardiology': '🫀',
      'Neurology': '🧠',
      'Orthopedics': '🦴',
      'Pediatrics': '👶',
      'Emergency': '🚨',
      'General': '🏥',
      'Ophthalmology': '👁️',
      'Dental': '🦷'
    };
    return icons[department] || '🏥';
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <Card className="col-span-3">
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to view your appointments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Appointments
            </CardTitle>
            <CardDescription>
              View and manage your upcoming and past appointments
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAppointments}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-4">You haven't booked any appointments yet.</p>
            <Button>Book Your First Appointment</Button>
          </div>
        ) : (
          /* Appointments Table */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">Date & Time</th>
                  <th className="text-left p-4 font-medium text-gray-900">Department</th>
                  <th className="text-left p-4 font-medium text-gray-900">Doctor</th>
                  <th className="text-left p-4 font-medium text-gray-900">Reason</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-right p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {appointment.formattedDate}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{appointment.formattedTime}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {getDepartmentIcon(appointment.department)}
                        </span>
                        {appointment.department}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {appointment.doctorName}
                        </span>
                        {appointment.doctor?.specialization && (
                          <span className="text-sm text-gray-500">
                            {appointment.doctor.specialization}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className="capitalize">{appointment.reason}</span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(appointment.status)}
                        {getPaymentBadge(appointment.paymentStatus)}
                      </div>
                    </td>
                    
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Cancel button - only show for upcoming appointments that can be cancelled */}
                        {appointment.status === 'upcoming' && appointment.canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment._id)}
                            disabled={cancellingId === appointment._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {cancellingId === appointment._id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </>
                            )}
                          </Button>
                        )}
                        
                        {/* Pay button - only show for appointments with pending payment */}
                        {appointment.paymentStatus === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePayment(appointment._id)}
                            disabled={payingId === appointment._id}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            {payingId === appointment._id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-1" />
                                Pay
                              </>
                            )}
                          </Button>
                        )}
                        
                        <Link href={`/appointments/${appointment._id}`}  >
                          <Button key="view" variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}