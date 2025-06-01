"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Clock, User, Calendar as CalendarIcon, AlertCircle } from "lucide-react";

// Import API functions
import { 
  getDepartments, 
  getDoctorsByDepartment, 
  getAllDoctors 
} from '@/lib/api/doctors';
import { 
  checkAvailability, 
  addAppointment 
} from '@/lib/api/appointments';
import { getCurrentUser, getProfile, getUserRole } from '@/lib/api';

export default function EnhancedAppointmentBooking() {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('department');
  
  // Data states
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  
  // Loading states
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Error and success states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes of [0, 30]) {
        if (hour === 12 && minutes === 0) continue; // Skip lunch break
        if (hour === 12 && minutes === 30) continue;
        
        const time24 = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const time12 = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
        slots.push({
          value: time24,
          label: time12,
          available: true
        });
      }
    }
    return slots;
  };

  // Load departments on component mount
  useEffect(() => {
    const loadDepartments = async () => {
      setIsLoadingDepartments(true);
      try {
        const response = await getDepartments();
        setDepartments(response.data || []);
      } catch (err) {
        console.error('Error loading departments:', err);
        setError('Failed to load departments. Please refresh the page.');
      } finally {
        setIsLoadingDepartments(false);
      }
    };
    
    loadDepartments();
    setTimeSlots(generateTimeSlots());
  }, []);

  // Load all doctors when "By Doctor" tab is selected


  // Load doctors by department
  useEffect(() => {
    if (selectedDepartment && activeTab === 'department') {
      const loadDoctorsByDepartment = async () => {
        setIsLoadingDoctors(true);
        try {
          const response = await getDoctorsByDepartment(selectedDepartment);
          setFilteredDoctors(response.data || []);
        } catch (err) {
          console.error('Error loading doctors by department:', err);
          setError('Failed to load doctors for this department. Please try again.');
        } finally {
          setIsLoadingDoctors(false);
        }
      };
      
      loadDoctorsByDepartment();
    }
  }, [selectedDepartment, activeTab]);

  // Check availability when doctor, date, or time changes
  useEffect(() => {
    if (selectedDoctor && date && selectedTime) {
      checkDoctorAvailability();
    }
  }, [selectedDoctor, date, selectedTime]);

  const checkDoctorAvailability = async () => {
    setIsCheckingAvailability(true);
    try {
      const appointmentDateTime = new Date(date);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const response = await checkAvailability({
        doctorId: selectedDoctor,
        date: appointmentDateTime.toISOString()
      });
      
      if (!response.data.available) {
        setError('Doctor is not available at the selected time. Please choose a different time slot.');
      } else {
        setError('');
      }
    } catch (err) {
      console.error('Error checking availability:', err);
      setError('Failed to check doctor availability. Please try again.');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleSubmit = async () => {
    // Validatio
    if (!selectedDoctor) {
      setError('Please select a doctor');
      return;
    }
    if (!selectedReason) {
      setError('Please select a reason for visit');
      return;
    }
    if (!date || !selectedTime) {
      setError('Please select date and time');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const appointmentDateTime = new Date(date);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Get selected doctor's department
      const selectedDoctorData = activeTab === 'department' 
        ? filteredDoctors.find(d => d._id === selectedDoctor)
        : doctors.find(d => d._id === selectedDoctor);
      const authdata = await getProfile();
      console.log(authdata);
      
      const appointmentData = {
        patient: authdata.id, // TODO: Replace with actual patient ID from auth context
        doctor: selectedDoctorData.userId,
        department: selectedDepartment || selectedDoctorData?.department,
        appointmentDate: appointmentDateTime.toISOString(),
        reason: selectedReason,
        notes: notes.trim(),
      };
      
      const response = await addAppointment(appointmentData);
      
      if (response.data) {
        setSuccess('Appointment booked successfully! You will receive a confirmation email shortly.');
        
        // Reset form
        setSelectedTime('');
        setSelectedDoctor('');
        setSelectedDepartment('');
        setSelectedReason('');
        setNotes('');
        setDate(new Date());
        
        // Clear the form after a delay
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      }
      
    } catch (err) {
      console.error('Error booking appointment:', err);
      if (err.message.includes('Doctor is not available')) {
        setError('Doctor is not available at the selected time. Please choose a different time slot.');
      } else if (err.message.includes('Doctor not found')) {
        setError('Selected doctor is not available. Please choose a different doctor.');
      } else if (err.message.includes('Patient not found')) {
        setError('Please log in to book an appointment.');
      } else {
        setError('Failed to book appointment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeSlotClick = (timeValue) => {
    setSelectedTime(timeValue);
  };

  const isFormValid = () => {
    return selectedDoctor && 
           selectedReason && 
           date && 
           selectedTime;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Book an Appointment
        </CardTitle>
        <CardDescription>
          Select a department, doctor, date, and time for your appointment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}



        {/* Appointment Selection */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="department">By Department</TabsTrigger>
            <TabsTrigger value="doctor">By Doctor</TabsTrigger>
          </TabsList> */}
          
          <TabsContent value="department" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {/* Department Selection */}
                <div>
                  <Label>Select Department *</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose department" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingDepartments ? (
                        <div className="p-2 text-center">
                          <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                          Loading departments...
                        </div>
                      ) : (
                        departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Doctor Selection */}
                <div>
                  <Label>Select Doctor *</Label>
                  <Select 
                    value={selectedDoctor} 
                    onValueChange={setSelectedDoctor}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !selectedDepartment 
                          ? "Select department first" 
                          : "Choose doctor"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingDoctors ? (
                        <div className="p-2 text-center">
                          <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                          Loading doctors...
                        </div>
                      ) : (
                        filteredDoctors.map((doctor) => (
                          <SelectItem key={doctor._id} value={doctor._id}>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Dr. {doctor.firstName} {doctor.lastName}
                              <span className="text-sm text-gray-500">
                                ({doctor.specialization})
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason Selection */}
                <div>
                  <Label>Reason for Visit *</Label>
                  <Select value={selectedReason} onValueChange={setSelectedReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">🩺 Consultation</SelectItem>
                      <SelectItem value="Follow-up">🔄 Follow-up</SelectItem>
                      <SelectItem value="Procedure">⚕️ Procedure</SelectItem>
                      <SelectItem value="Emergency">🚨 Emergency</SelectItem>
                      <SelectItem value="Routine Check-up">📋 Routine Check-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Calendar */}
              <div>
                <Label>Select Date *</Label>
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={setDate}
                  disabled={(date) => date < new Date()} 
                  className="border rounded-md p-3"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="doctor" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {/* Direct Doctor Selection */}
                <div>
                  <Label>Select Doctor *</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingDoctors ? (
                        <div className="p-2 text-center">
                          <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                          Loading doctors...
                        </div>
                      ) : (
                        doctors.map((doctor) => (
                          <SelectItem key={doctor._id} value={doctor._id}>
                            <div className="flex flex-col">
                              <span>Dr. {doctor.firstName} {doctor.lastName}</span>
                              <span className="text-sm text-gray-500">
                                {doctor.department} - {doctor.specialization}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reason Selection */}
                <div>
                  <Label>Reason for Visit *</Label>
                  <Select value={selectedReason} onValueChange={setSelectedReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">🩺 Consultation</SelectItem>
                      <SelectItem value="Follow-up">🔄 Follow-up</SelectItem>
                      <SelectItem value="Procedure">⚕️ Procedure</SelectItem>
                      <SelectItem value="Emergency">🚨 Emergency</SelectItem>
                      <SelectItem value="Routine Check-up">📋 Routine Check-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Calendar */}
              <div>
                <Label>Select Date *</Label>
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={setDate}
                  disabled={(date) => date < new Date()} 
                  className="border rounded-md p-3"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Time Slots */}
        {selectedDoctor && date && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" />
              <Label>Available Time Slots *</Label>
              {isCheckingAvailability && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.value}
                  variant={selectedTime === slot.value ? "default" : "outline"}
                  className="justify-center text-sm"
                  onClick={() => handleTimeSlotClick(slot.value)}
                  disabled={!slot.available || isCheckingAvailability}
                >
                  {slot.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information or special requirements..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            setSelectedTime('');
            setSelectedDoctor('');
            setSelectedDepartment('');
            setSelectedReason('');
            setPatientName('');
            setPatientEmail('');
            setPatientPhone('');
            setNotes('');
            setError('');
            setSuccess('');
          }}
        >
          Clear Form
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Booking...
            </>
          ) : (
            'Book Appointment'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}