'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/Header";
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Download, 
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  ArrowLeft,
  Building2,
  DollarSign,
  Receipt
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAppointmentById } from '@/lib/api/appointments';
import Link from 'next/link';

const AppointmentDetailsPage = () => {
  const params = useParams();
  const appointmentId = params?.id;
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) {
        setError('No appointment ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const response = await getAppointmentById(appointmentId);
        console.log('Appointment details:', response);
        
        if (response.data) {
          setAppointment(response.data);
        } else {
          throw new Error('No appointment data received');
        }
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError(err.message || 'Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      'upcoming': { color: 'bg-blue-500 text-white', text: 'Scheduled' },
      'check-in': { color: 'bg-amber-500 text-white', text: 'Checked In' },
      'check-out': { color: 'bg-green-500 text-white', text: 'With Doctor' },
      'completed': { color: 'bg-gray-500 text-white', text: 'Completed' },
      'cancelled': { color: 'bg-red-500 text-white', text: 'Cancelled' },
      'rescheduled': { color: 'bg-purple-500 text-white', text: 'Rescheduled' },
      'no-show': { color: 'bg-orange-500 text-white', text: 'No Show' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-500 text-white', text: status };
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  // Get payment status badge styling
  const getPaymentBadge = (paymentStatus) => {
    const statusConfig = {
      'paid': { color: 'bg-green-500 text-white', icon: CheckCircle },
      'pending': { color: 'bg-yellow-500 text-white', icon: Clock },
      'failed': { color: 'bg-red-500 text-white', icon: XCircle },
      'refunded': { color: 'bg-gray-500 text-white', icon: AlertCircle }
    };

    const config = statusConfig[paymentStatus] || { color: 'bg-gray-500 text-white', icon: AlertCircle };
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {paymentStatus?.charAt(0).toUpperCase() + paymentStatus?.slice(1)}
      </Badge>
    );
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  // Download invoice function
  const downloadInvoice = async () => {
    if (!appointment || appointment.paymentStatus !== 'paid') {
      return;
    }

    setDownloadingInvoice(true);
    
    try {
      // Create a simple invoice HTML content
      const invoiceContent = generateInvoiceHTML(appointment);
      
      // Create a blob and download
      const blob = new Blob([invoiceContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${appointment._id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  // Generate invoice HTML
  const generateInvoiceHTML = (appointment) => {
    const { date, time } = formatDateTime(appointment.appointmentDate);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice - ${appointment._id}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin: 20px 0; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            .table th { background-color: #f5f5f5; }
            .total { font-weight: bold; font-size: 18px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>MedEase Hospital</h1>
            <h2>Medical Invoice</h2>
        </div>
        
        <div class="invoice-details">
            <p><strong>Invoice ID:</strong> ${appointment._id}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Patient:</strong> ${appointment.patient?.firstName} ${appointment.patient?.lastName}</p>
            <p><strong>Doctor:</strong> ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}</p>
            <p><strong>Department:</strong> ${appointment.department}</p>
            <p><strong>Appointment Date:</strong> ${date}</p>
            <p><strong>Appointment Time:</strong> ${time}</p>
        </div>
        
        <table class="table">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Medical Consultation</td>
                    <td>${appointment.reason}</td>
                    <td>₹${appointment.amount}</td>
                </tr>
            </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 20px;">
            <p class="total">Total Amount: ₹${appointment.amount}</p>
            <p><strong>Payment Status:</strong> ${appointment.paymentStatus?.toUpperCase()}</p>
            <p><strong>Payment Method:</strong> ${appointment.paymentMethod?.toUpperCase() || 'N/A'}</p>
            ${appointment.paymentDate ? `<p><strong>Payment Date:</strong> ${new Date(appointment.paymentDate).toLocaleDateString()}</p>` : ''}
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Thank you for choosing MedEase Hospital</p>
            <p>For any queries, please contact us at support@medease.com</p>
        </div>
    </body>
    </html>
    `;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading appointment details...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Appointment</h2>
                <p className="text-gray-600 mb-4">{error}</p>

              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // No appointment found
  if (!appointment) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Appointment Not Found</h2>
                <p className="text-gray-600 mb-4">The requested appointment could not be found.</p>

              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const { date, time } = formatDateTime(appointment.appointmentDate);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex w-full flex-col gap-6 p-4 md:p-6">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
              <p className="text-gray-600">View your appointment information</p>
            </div>
          </div>
          
          {/* Download Invoice Button */}
          {appointment.paymentStatus === 'paid' && (
            <Button 
              onClick={downloadInvoice}
              disabled={downloadingInvoice}
              className="bg-green-600 hover:bg-green-700"
            >
              {downloadingInvoice ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloadingInvoice ? 'Generating...' : 'Download Invoice'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Appointment Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Appointment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Appointment Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{time}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Reason for Visit</p>
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{appointment.reason}</span>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-900">{appointment.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Doctor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Doctor Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                    </h3>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{appointment.department}</span>
                      </div>
                      {appointment.doctor?.specialization && (
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{appointment.doctor.specialization}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-green-600" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-gray-900">{appointment.patient?.firstName} {appointment.patient?.lastName}</p>
                  </div>
                  
                  {appointment.patient?.email && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{appointment.patient.email}</span>
                      </div>
                    </div>
                  )}
                  
                  {appointment.patient?.phoneNumber && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{appointment.patient.phoneNumber}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Payment & Actions */}
          <div className="space-y-6">
            
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span>Payment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold text-gray-900">₹{appointment.amount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    {getPaymentBadge(appointment.paymentStatus)}
                  </div>
                  
                  {appointment.paymentMethod && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Method</span>
                      <span className="text-gray-900 capitalize">{appointment.paymentMethod}</span>
                    </div>
                  )}
                  
                  {appointment.paymentDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Paid On</span>
                      <span className="text-gray-900">
                        {new Date(appointment.paymentDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {appointment.paymentStatus === 'paid' && (
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={downloadInvoice}
                      disabled={downloadingInvoice}
                      variant="outline" 
                      className="w-full"
                    >
                      {downloadingInvoice ? (
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Receipt className="w-4 h-4 mr-2" />
                      )}
                      {downloadingInvoice ? 'Generating...' : 'Download Invoice'}
                    </Button>
                  </div>
                )}
                
                {appointment.paymentStatus === 'pending' && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Payment is pending. Please complete the payment to confirm your appointment.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Appointment ID */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span>Reference</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Appointment ID</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{appointment._id}</p>
                </div>
                
                {appointment.createdAt && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium text-gray-500">Booked On</p>
                    <p className="text-sm text-gray-900">
                      {new Date(appointment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentDetailsPage;