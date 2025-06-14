'use client'
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header" // Import the universal header
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar, Clock, User, Phone, Mail, AlertCircle, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAllDoctorsAppointments, updateAppointmentStatus } from '@/lib/api/appointments';
import Link from 'next/link';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [updating, setUpdating] = useState({});
  const [stats, setStats] = useState({
    upcoming: 0,
    today: 0,
    completed: 0,
    cancelled: 0
  });

  // Fetch appointments from your API with proper query parameters
  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Build query parameters object for the API
      const params = {};
      
      // Add filters only if they're not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      // Add pagination
      params.page = currentPage.toString();
      params.limit = '10';
      
      // Add date filter with proper formatting
      if (dateFilter !== 'all') {
        const today = new Date();
        let filterDate;
        
        switch (dateFilter) {
          case 'today':
            filterDate = today;
            break;
          case 'tomorrow':
            filterDate = new Date(today);
            filterDate.setDate(filterDate.getDate() + 1);
            break;
          case 'week':
            // For this week, let's use today (you can enhance this later)
            filterDate = today;
            break;
          case 'month':
            // For this month, let's use today (you can enhance this later)
            filterDate = today;
            break;
          default:
            filterDate = null;
        }
        
        if (filterDate) {
          // Format date as YYYY-MM-DD for backend
          params.date = filterDate.toISOString().split('T')[0];
        }
      }

      // Call the doctor appointments API with parameters
      const response = await getAllDoctorsAppointments(params);
      
      console.log('API Response:', response);

      // Process the appointments data
      const processedAppointments = response.data.map(appointment => ({
        ...appointment,
        appointmentDate: new Date(appointment.appointmentDate)
      }));

      setAppointments(processedAppointments);
      setTotalPages(response.pages || 1);
      setTotalAppointments(response.total || 0);
      
      // Calculate stats from current page data
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayAppointments = processedAppointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      });
      
      setStats({
        upcoming: processedAppointments.filter(a => a.status === 'upcoming').length,
        today: todayAppointments.length,
        completed: processedAppointments.filter(a => a.status === 'completed').length,
        cancelled: processedAppointments.filter(a => a.status === 'cancelled').length
      });
      
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatuse = async (appointmentId, newStatus) => {
    setUpdating(prev => ({ ...prev, [appointmentId]: true }));
    
    try {
      const response = await updateAppointmentStatus(appointmentId, newStatus);

      // Update local state immediately for better UX
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: newStatus, updatedAt: new Date() }
            : apt
        )
      );
      
      // Refresh appointments to get updated data after a short delay
      setTimeout(() => {
        fetchAppointments();
      }, 500);
      
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError(err.message || 'Failed to update appointment status');
    } finally {
      setUpdating(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  // Fetch appointments when page or filters change
  useEffect(() => {
    fetchAppointments();
  }, [currentPage, statusFilter, dateFilter]);

  // Search functionality with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        // Filter appointments locally based on search term
        const filtered = appointments.filter(appointment => {
          const searchLower = searchTerm.toLowerCase();
          const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
          const doctorName = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`.toLowerCase();
          const reason = appointment.reason.toLowerCase();
          const department = appointment.department.toLowerCase();
          
          return patientName.includes(searchLower) || 
                 doctorName.includes(searchLower) || 
                 reason.includes(searchLower) ||
                 department.includes(searchLower);
        });
        // For now, we'll filter locally. If you want server-side search, 
        // you'll need to add search parameter to the backend API
      } else {
        // If no search term, fetch fresh data
        if (currentPage === 1) {
          fetchAppointments();
        } else {
          setCurrentPage(1);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'upcoming': { color: 'bg-blue-500', text: 'Scheduled' },
      'check-in': { color: 'bg-amber-500', text: 'Checked In' },
      'check-out': { color: 'bg-green-500', text: 'With Doctor' },
      'completed': { color: 'bg-gray-500', text: 'Completed' },
      'cancelled': { color: 'bg-red-500', text: 'Cancelled' },
      'rescheduled': { color: 'bg-purple-500', text: 'Rescheduled' },
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
    const isUpdating = updating[appointment._id];
    
    switch (appointment.status) {
      case 'upcoming':
        buttons.push(
          <Button 
            key="checkin"
            variant="outline" 
            size="sm"
            onClick={() => updateAppointmentStatuse(appointment._id, 'check-in')}
            disabled={isUpdating}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
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
            onClick={() => updateAppointmentStatuse(appointment._id, 'check-out')}
            disabled={isUpdating}
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
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
            onClick={() => updateAppointmentStatuse(appointment._id, 'completed')}
            disabled={isUpdating}
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
            Complete
          </Button>
        );
        break;
      case 'completed':
      case 'cancelled':
        // Only show view for completed/cancelled appointments
        break;
      default:
        break;
    }

    // Always add view button
    buttons.push(
      <Link href={`/appointments/${appointment._id}`}  >
      <Button key="view" variant="outline" size="sm">
        View Details
      </Button>
        </Link>
    );

    // Add cancel button for upcoming appointments only
    if (appointment.status === 'upcoming') {
      buttons.push(
        <Button 
          key="cancel"
          variant="outline" 
          size="sm"
          onClick={() => updateAppointmentStatuse(appointment._id, 'cancelled')}
          disabled={isUpdating}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
          Cancel
        </Button>
      );
    }

    return buttons;
  };

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      // Force immediate search on Enter key
      if (currentPage === 1) {
        fetchAppointments();
      } else {
        setCurrentPage(1);
      }
    }
  };

  // Filter appointments based on search term (client-side filtering)
  const filteredAppointments = searchTerm.trim() 
    ? appointments.filter(appointment => {
        const searchLower = searchTerm.toLowerCase();
        const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
        const doctorName = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`.toLowerCase();
        const reason = appointment.reason.toLowerCase();
        const department = appointment.department.toLowerCase();
        const email = appointment.patient.email.toLowerCase();
        
        return patientName.includes(searchLower) || 
               doctorName.includes(searchLower) || 
               reason.includes(searchLower) ||
               department.includes(searchLower) ||
               email.includes(searchLower);
      })
    : appointments;

  if (loading && appointments.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex w-full flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Card className="col-span-3">
            <CardContent className="flex items-center justify-center h-96">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading appointments...</span>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex w-full flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>My Appointments</span>
              </CardTitle>
              <CardDescription>
                Manage your patient appointments ({totalAppointments} total)
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={fetchAppointments}
                disabled={loading}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {error}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setError('')}
                    className="ml-2 text-red-600 underline p-0 h-auto"
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
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

            {/* Enhanced Filters */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by patient name, email, or appointment details..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearch}
                />
              </div>
              
              {/* Filter Row */}
              <div className="flex flex-wrap gap-3 items-center">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Scheduled</SelectItem>
                    <SelectItem value="check-in">Checked In</SelectItem>
                    <SelectItem value="check-out">With Doctor</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="px-4"
                >
                  Clear All
                </Button>
                
                {/* Active Filters Display */}
                <div className="flex flex-wrap gap-2 ml-auto">
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Status: {statusFilter}
                    </Badge>
                  )}
                  {dateFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Date: {dateFilter}
                    </Badge>
                  )}
                </div>
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
                            {loading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading appointments...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <AlertCircle className="h-8 w-8 text-gray-400" />
                                <span>No appointments found matching your criteria</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={clearFilters}
                                  className="mt-2"
                                >
                                  Clear filters to see all appointments
                                </Button>
                              </div>
                            )}
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
                                {appointment.patient.phoneNumber && (
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{appointment.patient.phoneNumber}</span>
                                  </div>
                                )}
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
                                <span className="font-medium">£{appointment.amount || 0}</span>
                                <span className={`text-xs ${
                                  appointment.paymentStatus === 'paid' ? 'text-green-600' : 
                                  appointment.paymentStatus === 'failed' ? 'text-red-600' : 
                                  'text-amber-600'
                                }`}>
                                  {appointment.paymentStatus}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2 flex-wrap">
                                {getActionButtons(appointment)}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing page {currentPage} of {totalPages} ({totalAppointments} total appointments)
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1 || loading}
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                      >
                        Previous
                      </Button>
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else {
                            const start = Math.max(1, currentPage - 2);
                            const end = Math.min(totalPages, start + 4);
                            page = start + i;
                            if (page > end) return null;
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={page === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              disabled={loading}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages || loading}
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                )}
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
                    {Array.from({ length: 35 }, (_, i) => (
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
      </main>
    </div>
  );
};

export default AppointmentManagement;