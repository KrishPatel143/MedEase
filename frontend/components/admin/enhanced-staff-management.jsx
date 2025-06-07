"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus } from "lucide-react"

// Import custom components
import { AddDoctorDialog } from "./AddDoctorDialog"
import { EditDoctorDialog } from "./EditDoctorDialog"
import { DoctorSearch } from "./DoctorSearch"
import { DoctorFilters } from "./DoctorFilters"
import { DoctorTabsContent } from "./DoctorTabsContent"
import { addDoctor, getAllDoctors, deleteDoctor, updateDoctor } from "@/lib/api/doctors"

export function EnhancedDoctorManagement() {
  const [showAddDoctorDialog, setShowAddDoctorDialog] = useState(false)
  const [showEditDoctorDialog, setShowEditDoctorDialog] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [doctorData, setDoctorData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await getAllDoctors();
      console.log('Fetched doctors:', response);
      
      if (response.data == null) {
        throw new Error('Failed to fetch doctors')
      }
      
      setDoctorData(response.data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  // Filter doctors based on search term, status, and department
  const filteredDoctorData = doctorData.filter(doctor => {
    const matchesSearch = doctor.userId ? 
      (doctor.userId.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doctor.userId.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doctor.userId.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doctor.department?.toLowerCase().includes(searchTerm.toLowerCase())) : false
    
    const matchesStatus = statusFilter === "all" || doctor.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || doctor.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleAddDoctor = async (formData) => {
    try {
      // Basic field validation
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'specialization', 'department'];
      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Password validation
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }

      // Experience validation
      const experience = parseInt(formData.experience) || 0;
      if (experience < 0) {
        alert('Experience cannot be negative');
        return;
      }

      // Consultation fee validation
      const consultationFee = parseInt(formData.consultationFee) || 500;
      if (consultationFee < 0) {
        alert('Consultation fee cannot be negative');
        return;
      }

      // Validate availability times
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      for (const day of daysOfWeek) {
        const dayAvail = formData.availability[day];
        if (dayAvail.isAvailable) {
          const startMinutes = parseInt(dayAvail.start.split(':')[0]) * 60 + parseInt(dayAvail.start.split(':')[1]);
          const endMinutes = parseInt(dayAvail.end.split(':')[0]) * 60 + parseInt(dayAvail.end.split(':')[1]);
          
          if (endMinutes <= startMinutes) {
            alert(`Invalid time range for ${day.charAt(0).toUpperCase() + day.slice(1)}: End time must be after start time`);
            return;
          }
        }
      }

      // Filter valid qualifications
      const validQualifications = formData.qualifications.filter(qual => 
        qual.degree && qual.degree.trim() && 
        qual.institution && qual.institution.trim()
      );

      // Prepare data for API call
      const doctorData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        specialization: formData.specialization.trim(),
        department: formData.department,
        experience,
        consultationFee,
        qualifications: validQualifications,
        availability: formData.availability
      };

      console.log('Sending doctor data:', doctorData);

      const response = await addDoctor(doctorData);

      if (response.success || response.data) {
        // Update the local state with the new doctor
        setDoctorData(prevData => [...prevData, response.data]);
        
        alert('Doctor added successfully with complete profile!');
        
        // Refresh the doctors list to ensure consistency
        await fetchDoctors();
      } else {
        throw new Error(response.message || 'Failed to add doctor');
      }

    } catch (err) {
      console.error('Error adding doctor:', err);
      
      let errorMessage = 'Failed to add doctor';
      
      if (err.message.includes('Email already in use')) {
        errorMessage = 'This email is already registered. Please use a different email address.';
      } else if (err.message.includes('required fields')) {
        errorMessage = err.message;
      } else if (err.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message.includes('Invalid department')) {
        errorMessage = 'Please select a valid department.';
      } else if (err.message.includes('Invalid time range')) {
        errorMessage = err.message;
      } else if (err.message.includes('Password must be')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Error adding doctor: ${errorMessage}`);
    }
  }

  const handleEditDoctor = (doctor) => {
    console.log('Editing doctor:', doctor);
    setSelectedDoctor(doctor)
    setShowEditDoctorDialog(true)
  }

  const handleUpdateDoctor = async (updateData) => {
    try {
      if (!selectedDoctor) {
        alert('No doctor selected for update');
        return;
      }

      // Frontend validation
      const requiredFields = ['firstName', 'lastName', 'email', 'specialization', 'department'];
      const missingFields = requiredFields.filter(field => !updateData[field]?.toString().trim());
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Phone number validation (if provided)
      if (updateData.phoneNumber && updateData.phoneNumber.trim() && updateData.phoneNumber.trim().length < 10) {
        alert('Phone number must be at least 10 digits');
        return;
      }

      // Experience validation
      if (updateData.experience < 0) {
        alert('Experience cannot be negative');
        return;
      }

      // Consultation fee validation
      if (updateData.consultationFee < 0) {
        alert('Consultation fee cannot be negative');
        return;
      }

      // Validate availability times
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      for (const day of daysOfWeek) {
        const dayAvail = updateData.availability[day];
        if (dayAvail.isAvailable) {
          const startMinutes = parseInt(dayAvail.start.split(':')[0]) * 60 + parseInt(dayAvail.start.split(':')[1]);
          const endMinutes = parseInt(dayAvail.end.split(':')[0]) * 60 + parseInt(dayAvail.end.split(':')[1]);
          
          if (endMinutes <= startMinutes) {
            alert(`Invalid time range for ${day.charAt(0).toUpperCase() + day.slice(1)}: End time must be after start time`);
            return;
          }
        }
      }

      console.log('Updating doctor with data:', updateData);

      const response = await updateDoctor(selectedDoctor._id, updateData);

      if (response.success || response.data) {
        // Update the local state with the updated doctor
        setDoctorData(prevData => 
          prevData.map(doctor => 
            doctor._id === selectedDoctor._id ? response.data : doctor
          )
        );
        
        alert('Doctor updated successfully!');
        
        // Close the dialog
        setShowEditDoctorDialog(false);
        setSelectedDoctor(null);
        
        // Refresh the doctors list to ensure consistency
        await fetchDoctors();
      } else {
        throw new Error(response.message || 'Failed to update doctor');
      }

    } catch (err) {
      console.error('Error updating doctor:', err);
      
      let errorMessage = 'Failed to update doctor';
      
      if (err.message.includes('Email already in use')) {
        errorMessage = 'This email is already registered to another user. Please use a different email address.';
      } else if (err.message.includes('required fields')) {
        errorMessage = err.message;
      } else if (err.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message.includes('Invalid department')) {
        errorMessage = 'Please select a valid department.';
      } else if (err.message.includes('Invalid time range')) {
        errorMessage = err.message;
      } else if (err.message.includes('Phone number must be')) {
        errorMessage = 'Phone number must be at least 10 digits.';
      } else if (err.message.includes('Doctor not found')) {
        errorMessage = 'Doctor not found. The record may have been deleted.';
        // Refresh the list to remove deleted doctors
        await fetchDoctors();
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Error updating doctor: ${errorMessage}`);
    }
  }

  const handleManageDoctor = (doctor) => {
    console.log("Manage doctor:", doctor)
    // TODO: Implement manage functionality (availability, permissions, etc.)
    alert(`Manage functionality for Dr. ${doctor.userId?.firstName} ${doctor.userId?.lastName} will be implemented`)
  }

  const handleDeleteDoctor = async (doctorToDelete) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctorToDelete.userId?.firstName} ${doctorToDelete.userId?.lastName}?`)) {
      return
    }

    try {
      const response = await deleteDoctor(doctorToDelete._id)
      
      // Update the local state to remove the deleted doctor
      setDoctorData(doctorData.filter(doctor => doctor._id !== doctorToDelete._id))
      alert('Doctor deleted successfully!')
    } catch (err) {
      console.error('Error deleting doctor:', err)
      alert(`Error deleting doctor: ${err.message}`)
    }
  }

  const handleFilterClick = () => {
    console.log("Additional filters clicked")
    // TODO: Implement additional filter functionality
  }

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading doctors...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-3">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={fetchDoctors}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Doctor Management</CardTitle>
          <CardDescription>Add, remove, and manage doctors</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DoctorSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <Button onClick={() => setShowAddDoctorDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Doctors ({filteredDoctorData.length})</TabsTrigger>
              <TabsTrigger value="cardiology">Cardiology</TabsTrigger>
              <TabsTrigger value="neurology">Neurology</TabsTrigger>
              <TabsTrigger value="orthopedics">Orthopedics</TabsTrigger>
              <TabsTrigger value="pediatrics">Pediatrics</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>
            <DoctorFilters
              statusFilter={statusFilter}
              departmentFilter={departmentFilter}
              onStatusFilterChange={setStatusFilter}
              onDepartmentFilterChange={setDepartmentFilter}
              onFilterClick={handleFilterClick}
            />
          </div>

          <DoctorTabsContent
            doctorData={filteredDoctorData}
            onEdit={handleEditDoctor}
            onManage={handleManageDoctor}
            onDelete={handleDeleteDoctor}
          />
        </Tabs>
      </CardContent>

      {/* Add Doctor Dialog */}
      <AddDoctorDialog
        open={showAddDoctorDialog}
        onOpenChange={setShowAddDoctorDialog}
        onSave={handleAddDoctor}
      />

      {/* Edit Doctor Dialog */}
      <EditDoctorDialog
        open={showEditDoctorDialog}
        onOpenChange={setShowEditDoctorDialog}
        onSave={handleUpdateDoctor}
        doctor={selectedDoctor}
      />
    </Card>
  )
}