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
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Medical Invoice - ${appointment._id}</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: 'Times New Roman', serif;
                  line-height: 1.5;
                  color: #2c3e50;
                  background-color: #ffffff;
                  padding: 40px 20px;
              }
              
              .invoice-container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  border: 2px solid #34495e;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              
              .header {
                  background-color: #34495e;
                  color: white;
                  padding: 30px 40px;
                  text-align: center;
                  border-bottom: 3px solid #2c3e50;
              }
              
              .hospital-name {
                  font-size: 28px;
                  font-weight: bold;
                  margin-bottom: 8px;
                  letter-spacing: 1px;
              }
              
              .hospital-subtitle {
                  font-size: 14px;
                  opacity: 0.9;
                  text-transform: uppercase;
                  letter-spacing: 2px;
              }
              
              .invoice-title {
                  font-size: 18px;
                  font-weight: bold;
                  margin-top: 15px;
                  padding-top: 15px;
                  border-top: 1px solid rgba(255, 255, 255, 0.3);
              }
              
              .content {
                  padding: 40px;
              }
              
              .invoice-header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 40px;
                  border-bottom: 2px solid #ecf0f1;
                  padding-bottom: 20px;
              }
              
              .invoice-info, .patient-info {
                  flex: 1;
              }
              
              .invoice-info {
                  margin-right: 40px;
              }
              
              .section-title {
                  font-size: 16px;
                  font-weight: bold;
                  color: #34495e;
                  margin-bottom: 15px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  border-bottom: 1px solid #bdc3c7;
                  padding-bottom: 5px;
              }
              
              .info-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                  padding: 3px 0;
              }
              
              .info-label {
                  font-weight: bold;
                  color: #7f8c8d;
                  min-width: 120px;
              }
              
              .info-value {
                  color: #2c3e50;
                  text-align: right;
                  flex: 1;
              }
              
              .appointment-section {
                  background-color: #f8f9fa;
                  border: 1px solid #dee2e6;
                  padding: 25px;
                  margin: 30px 0;
              }
              
              .appointment-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 20px;
                  margin-top: 15px;
              }
              
              .appointment-item {
                  border-right: 1px solid #dee2e6;
                  padding-right: 20px;
              }
              
              .appointment-item:nth-child(even) {
                  border-right: none;
                  padding-right: 0;
                  padding-left: 20px;
              }
              
              .appointment-label {
                  font-weight: bold;
                  color: #7f8c8d;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  margin-bottom: 5px;
              }
              
              .appointment-value {
                  color: #2c3e50;
                  font-size: 14px;
                  font-weight: 500;
              }
              
              .services-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 30px 0;
                  border: 1px solid #dee2e6;
              }
              
              .services-table thead {
                  background-color: #34495e;
                  color: white;
              }
              
              .services-table th {
                  padding: 15px;
                  text-align: left;
                  font-weight: bold;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  border-right: 1px solid #2c3e50;
              }
              
              .services-table th:last-child {
                  border-right: none;
                  text-align: right;
              }
              
              .services-table td {
                  padding: 15px;
                  border-bottom: 1px solid #ecf0f1;
                  border-right: 1px solid #ecf0f1;
                  color: #2c3e50;
              }
              
              .services-table td:last-child {
                  border-right: none;
                  text-align: right;
                  font-weight: bold;
                  color: #27ae60;
              }
              
              .services-table tbody tr:last-child td {
                  border-bottom: 2px solid #34495e;
              }
              
              .payment-summary {
                  background-color: #f8f9fa;
                  border: 1px solid #dee2e6;
                  padding: 25px;
                  margin-top: 30px;
              }
              
              .summary-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 8px 0;
                  border-bottom: 1px solid #ecf0f1;
              }
              
              .summary-row:last-child {
                  border-bottom: none;
              }
              
              .summary-label {
                  font-weight: 500;
                  color: #7f8c8d;
              }
              
              .summary-value {
                  font-weight: bold;
                  color: #2c3e50;
              }
              
              .total-row {
                  background-color: #34495e;
                  color: white;
                  margin: 15px -25px -25px -25px;
                  padding: 20px 25px;
                  font-size: 18px;
              }
              
              .total-row .summary-label,
              .total-row .summary-value {
                  color: white;
                  font-size: 18px;
                  font-weight: bold;
              }
              
              .payment-status {
                  display: inline-block;
                  padding: 6px 15px;
                  background-color: #27ae60;
                  color: white;
                  border-radius: 3px;
                  font-size: 12px;
                  font-weight: bold;
                  text-transform: uppercase;
                  letter-spacing: 1px;
              }
              
              .payment-status.pending {
                  background-color: #f39c12;
              }
              
              .payment-status.failed {
                  background-color: #e74c3c;
              }
              
              .footer {
                  background-color: #ecf0f1;
                  padding: 25px 40px;
                  text-align: center;
                  border-top: 2px solid #bdc3c7;
                  color: #7f8c8d;
              }
              
              .footer-title {
                  font-size: 16px;
                  font-weight: bold;
                  color: #34495e;
                  margin-bottom: 10px;
              }
              
              .footer-text {
                  font-size: 14px;
                  line-height: 1.6;
              }
              
              .contact-details {
                  margin-top: 15px;
                  padding-top: 15px;
                  border-top: 1px solid #bdc3c7;
              }
              
              .reference-section {
                  margin-top: 40px;
                  padding: 20px;
                  background-color: #f8f9fa;
                  border-left: 4px solid #34495e;
              }
              
              .reference-title {
                  font-size: 12px;
                  font-weight: bold;
                  color: #7f8c8d;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  margin-bottom: 8px;
              }
              
              .reference-value {
                  font-family: 'Courier New', monospace;
                  font-size: 11px;
                  color: #2c3e50;
                  background-color: white;
                  padding: 8px;
                  border: 1px solid #dee2e6;
                  word-break: break-all;
              }
              
              @media (max-width: 768px) {
                  body {
                      padding: 20px 10px;
                  }
                  
                  .content {
                      padding: 20px;
                  }
                  
                  .invoice-header {
                      flex-direction: column;
                      gap: 30px;
                  }
                  
                  .invoice-info {
                      margin-right: 0;
                  }
                  
                  .appointment-grid {
                      grid-template-columns: 1fr;
                  }
                  
                  .appointment-item {
                      border-right: none;
                      padding-right: 0;
                      padding-left: 0;
                      border-bottom: 1px solid #dee2e6;
                      padding-bottom: 15px;
                      margin-bottom: 15px;
                  }
                  
                  .appointment-item:last-child {
                      border-bottom: none;
                      margin-bottom: 0;
                      padding-bottom: 0;
                  }
                  
                  .services-table th,
                  .services-table td {
                      padding: 10px 8px;
                      font-size: 12px;
                  }
                  
                  .footer {
                      padding: 20px;
                  }
              }
              
              @media print {
                  body {
                      padding: 0;
                      background-color: white;
                  }
                  
                  .invoice-container {
                      box-shadow: none;
                      border: 1px solid #34495e;
                  }
                  
                  .footer {
                      background-color: #f8f9fa;
                  }
              }
          </style>
      </head>
      <body>
          <div class="invoice-container">
              <div class="header">
                  <div class="hospital-name">MEDEASE HOSPITAL</div>
                  <div class="hospital-subtitle">Healthcare Excellence Since 1995</div>
                  <div class="invoice-title">MEDICAL INVOICE</div>
              </div>
              
              <div class="content">
                  <div class="invoice-header">
                      <div class="invoice-info">
                          <div class="section-title">Invoice Details</div>
                          <div class="info-row">
                              <span class="info-label">Invoice No:</span>
                              <span class="info-value">INV-${appointment._id.slice(-8).toUpperCase()}</span>
                          </div>
                          <div class="info-row">
                              <span class="info-label">Issue Date:</span>
                              <span class="info-value">${new Date().toLocaleDateString('en-GB')}</span>
                          </div>
                          <div class="info-row">
                              <span class="info-label">Due Date:</span>
                              <span class="info-value">Immediate</span>
                          </div>
                      </div>
                      
                      <div class="patient-info">
                          <div class="section-title">Bill To</div>
                          <div class="info-row">
                              <span class="info-label">Patient:</span>
                              <span class="info-value">${appointment.patient?.firstName} ${appointment.patient?.lastName}</span>
                          </div>
                          ${appointment.patient?.email ? `
                          <div class="info-row">
                              <span class="info-label">Email:</span>
                              <span class="info-value">${appointment.patient.email}</span>
                          </div>
                          ` : ''}
                          ${appointment.patient?.phoneNumber ? `
                          <div class="info-row">
                              <span class="info-label">Phone:</span>
                              <span class="info-value">${appointment.patient.phoneNumber}</span>
                          </div>
                          ` : ''}
                      </div>
                  </div>
                  
                  <div class="appointment-section">
                      <div class="section-title">Appointment Information</div>
                      <div class="appointment-grid">
                          <div class="appointment-item">
                              <div class="appointment-label">Attending Physician</div>
                              <div class="appointment-value">Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}</div>
                          </div>
                          <div class="appointment-item">
                              <div class="appointment-label">Department</div>
                              <div class="appointment-value">${appointment.department}</div>
                          </div>
                          <div class="appointment-item">
                              <div class="appointment-label">Appointment Date</div>
                              <div class="appointment-value">${date}</div>
                          </div>
                          <div class="appointment-item">
                              <div class="appointment-label">Appointment Time</div>
                              <div class="appointment-value">${time}</div>
                          </div>
                      </div>
                  </div>
                  
                  <table class="services-table">
                      <thead>
                          <tr>
                              <th>Description</th>
                              <th>Details</th>
                              <th>Amount</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td><strong>Medical Consultation</strong></td>
                              <td>${appointment.reason}</td>
                              <td>${appointment.amount.toLocaleString('en-IN')}</td>
                          </tr>
                      </tbody>
                  </table>
                  
                  <div class="payment-summary">
                      <div class="section-title">Payment Summary</div>
                      <div class="summary-row">
                          <span class="summary-label">Subtotal:</span>
                          <span class="summary-value">${appointment.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div class="summary-row">
                          <span class="summary-label">Tax (GST):</span>
                          <span class="summary-value">£0.00</span>
                      </div>
                      <div class="summary-row">
                          <span class="summary-label">Payment Status:</span>
                          <span class="payment-status ${appointment.paymentStatus}">${appointment.paymentStatus?.toUpperCase()}</span>
                      </div>
                      ${appointment.paymentMethod ? `
                      <div class="summary-row">
                          <span class="summary-label">Payment Method:</span>
                          <span class="summary-value">${appointment.paymentMethod.toUpperCase()}</span>
                      </div>
                      ` : ''}
                      ${appointment.paymentDate ? `
                      <div class="summary-row">
                          <span class="summary-label">Payment Date:</span>
                          <span class="summary-value">${new Date(appointment.paymentDate).toLocaleDateString('en-GB')}</span>
                      </div>
                      ` : ''}
                      
                      <div class="total-row">
                          <span class="summary-label">TOTAL AMOUNT:</span>
                          <span class="summary-value">£{appointment.amount.toLocaleString('en-IN')}</span>
                      </div>
                  </div>
                  
                  <div class="reference-section">
                      <div class="reference-title">Reference Number</div>
                      <div class="reference-value">${appointment._id}</div>
                  </div>
              </div>
              
              <div class="footer">
                  <div class="footer-title">MedEase Hospital</div>
                  <div class="footer-text">
                      Thank you for choosing our healthcare services.<br>
                      Your health and well-being are our top priority.
                  </div>
                  <div class="contact-details">
                      <strong>Contact:</strong> support@medease.com | <strong>Phone:</strong> +91-XXXX-XXXXX<br>
                      <strong>Address:</strong> 123 Healthcare Avenue, Medical District, City - 400001
                  </div>
              </div>
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
                      <span className="font-semibold text-gray-900">£{appointment.amount}</span>
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