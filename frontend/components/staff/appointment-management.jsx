
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar, Clock, User, Phone, Mail, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    upcoming: 0,
    today: 0,
    completed: 0,
    cancelled: 0
  });

  // Simulated API calls (replace with actual API endpoints)
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data that matches your backend structure
      const mockAppointments = [
        {
          _id: '1',
          appointmentDate: new Date('2025-05-25T09:00:00'),
          patient: { firstName: 'John', lastName: 'Smith', email: 'john@email.com', phoneNumber: '+1234567890' },
          doctor: { firstName: 'Dr. Sarah', lastName: 'Johnson', department: 'Cardiology' },
          reason: 'Follow-up',
          status: 'upcoming',
          paymentStatus: 'pending',
          amount: 150,
          department: 'Cardiology'
        },
        {
          _id: '2',
          appointmentDate: new Date('2025-05-25T09:30:00'),
          patient: { firstName: 'Maria', lastName: 'Garcia', email: 'maria@email.com', phoneNumber: '+1234567891' },
          doctor: { firstName: 'Dr. Michael', lastName: 'Chen', department: 'Neurology' },
          reason: 'Consultation',
          status: 'check-in',
          paymentStatus: 'paid',
          amount: 200,
          department: 'Neurology'
        },
        {
          _id: '3',
          appointmentDate: new Date('2025-05-25T10:00:00'),
          patient: { firstName: 'Robert', lastName: 'Johnson', email: 'robert@email.com', phoneNumber: '+1234567892' },
          doctor: { firstName: 'Dr. Emily', lastName: 'Rodriguez', department: 'Orthopedics' },
          reason: 'Procedure',
          status: 'check-out',
          paymentStatus: 'paid',
          amount: 350,
          department: 'Orthopedics'
        },
        {
          _id: '4',
          appointmentDate: new Date('2025-05-25T10:30:00'),
          patient: { firstName: 'Lisa', lastName: 'Wong', email: 'lisa@email.com', phoneNumber: '+1234567893' },
          doctor: { firstName: 'Dr. James', lastName: 'Wilson', department: 'General' },
          reason: 'Routine Check-up',
          status: 'upcoming',
          paymentStatus: 'pending',
          amount: 100,
          department: 'General'
        },
        {
          _id: '5',
          appointmentDate: new Date('2025-05-25T11:00:00'),
          patient: { firstName: 'David', lastName: 'Brown', email: 'david@email.com', phoneNumber: '+1234567894' },
          doctor: { firstName: 'Dr. David', lastName: 'Kim', department: 'Pediatrics' },
          reason: 'Follow-up',
          status: 'completed',
          paymentStatus: 'paid',
          amount: 120,
          department: 'Pediatrics'
        }
      ];

      setAppointments(mockAppointments);
      setStats({
        upcoming: mockAppointments.filter(a => a.status === 'upcoming').length,
        today: mockAppointments.length,
        completed: mockAppointments.filter(a => a.status === 'completed').length,
        cancelled: mockAppointments.filter(a => a.status === 'cancelled').length
      });
      setTotalPages(1);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, statusFilter, dateFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'upcoming': { color: 'bg-blue-500', text: 'Scheduled' },
      'check-in': { color: 'bg-amber-500', text: 'Checked In' },
      'check-out': { color: 'bg-green-500', text: 'With Doctor' },
      'completed': { color: 'bg-gray-500', text: 'Completed' },
      'cancelled': { color: 'bg-red-500', text: 'Cancelled' },
      'no-show': { color: 'bg-orange-500', text: 'No Show' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', text: status };
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const getActionButtons = (appointment) => {
    const buttons = [];
    
    switch (appointment.status) {
      case 'upcoming':
        buttons.push(
          <Button 
            key="checkin"
            variant="outline" 
            size="sm"
            onClick={() => updateAppointmentStatus(appointment._id, 'check-in')}
          >
            Check In
          </Button>
        );
        break;
      case 'check-in':
        buttons.push(
          <Button 
            key="start"
            variant="outline" 
            size="sm"
            onClick={() => updateAppointmentStatus(appointment._id, 'check-out')}
          >
            Start Visit
          </Button>
        );
        break;
      case 'check-out':
        buttons.push(
          <Button 
            key="complete"
            variant="outline" 
            size="sm"
            onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
          >
            Complete
          </Button>
        );
        break;
    }

    buttons.push(
      <Button key="view" variant="outline" size="sm">
        View Details
      </Button>
    );

    return buttons;
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      appointment.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading appointments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Appointment Management</span>
          </CardTitle>
          <CardDescription>Schedule and manage patient appointments</CardDescription>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Today's Appointments</p>
                <p className="text-2xl font-bold text-blue-700">{stats.today}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-amber-700">{stats.upcoming}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Cancelled</p>
                <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by patient name, doctor, or reason..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Scheduled</SelectItem>
                <SelectItem value="check-in">Checked In</SelectItem>
                <SelectItem value="check-out">With Doctor</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Time</th>
                    <th className="text-left p-4 font-medium">Patient</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Doctor</th>
                    <th className="text-left p-4 font-medium">Department</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-muted-foreground">
                        No appointments found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{formatTime(appointment.appointmentDate)}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(appointment.appointmentDate)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {appointment.patient.firstName} {appointment.patient.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{appointment.patient.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{appointment.patient.phoneNumber}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{appointment.reason}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">
                            {appointment.doctor.firstName} {appointment.doctor.lastName}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{appointment.department}</Badge>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium">${appointment.amount}</span>
                            <span className={`text-xs ${appointment.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                              {appointment.paymentStatus}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {getActionButtons(appointment)}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="border rounded-lg p-6 bg-muted/20">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Calendar integration would show appointments in a visual calendar format
                </p>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center font-medium bg-background rounded border">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="min-h-[100px] bg-background p-2 border rounded">
                    <div className="font-medium text-sm mb-1">{(i % 28) + 1}</div>
                    {i === 24 && (
                      <div className="space-y-1">
                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {filteredAppointments.length} appointments
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentManagement;