"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus } from "lucide-react"

// Import custom components
import { AddPatientDialog } from "./AddPatientDialog"
import { EditPatientDialog } from "./EditPatientDialog"
import { PatientSearch } from "./PatientSearch"
import { PatientFilters } from "./PatientFilters"
import { PatientTabsContent } from "./PatientTabsContent"
import { addPatient, getAllPatients, deletePatient, updatePatient, calculateAge } from "@/lib/api/patients"

export function PatientManagement() {
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false)
  const [showEditPatientDialog, setShowEditPatientDialog] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientData, setPatientData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [ageRangeFilter, setAgeRangeFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await getAllPatients();
      console.log('Fetched patients:', response);
      
      if (response.data == null) {
        throw new Error('Failed to fetch patients')
      }
      
      setPatientData(response.data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching patients:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  // Filter patients based on search term, gender, and age
  const filteredPatientData = patientData.filter(patient => {
    const matchesSearch = patient.userId ? 
      (patient.userId.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       patient.userId.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       patient.userId.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       patient.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase())) : false
    
    const matchesGender = genderFilter === "all" || patient.gender === genderFilter
    
    let matchesAge = true
    if (ageRangeFilter !== "all") {
      const age = calculateAge(patient.dateOfBirth)
      switch (ageRangeFilter) {
        case "0-18":
          matchesAge = age >= 0 && age <= 18
          break
        case "19-35":
          matchesAge = age >= 19 && age <= 35
          break
        case "36-55":
          matchesAge = age >= 36 && age <= 55
          break
        case "56+":
          matchesAge = age >= 56
          break
        default:
          matchesAge = true
      }
    }
    
    return matchesSearch && matchesGender && matchesAge
  })

  const handleAddPatient = async (formData) => {
    try {
      // Basic field validation
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'dateOfBirth', 'gender'];
      const missingFields = requiredFields.filter(field => !formData[field]?.toString().trim());
      
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
      if (formData.password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }

      // Date of birth validation
      const birthDate = new Date(formData.dateOfBirth);
      if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
        alert('Please enter a valid date of birth');
        return;
      }

      // Contact number validation (if provided)
      if (formData.contactNumber && formData.contactNumber.trim() && formData.contactNumber.trim().length < 10) {
        alert('Contact number must be at least 10 digits');
        return;
      }

      // Emergency contact validation
      if (formData.emergencyContact && formData.emergencyContact.name && !formData.emergencyContact.phoneNumber) {
        alert('Emergency contact phone number is required when name is provided');
        return;
      }

      // Prepare data for API call
      const patientData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber?.trim() || '',
        address: formData.address?.trim() || '',
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory || []
      };

      console.log('Sending patient data:', patientData);

      const response = await addPatient(patientData);

      if (response.success || response.data) {
        // Update the local state with the new patient
        setPatientData(prevData => [...prevData, response.data]);
        
        alert('Patient added successfully!');
        
        // Refresh the patients list to ensure consistency
        await fetchPatients();
      } else {
        throw new Error(response.message || 'Failed to add patient');
      }

    } catch (err) {
      console.error('Error adding patient:', err);
      
      let errorMessage = 'Failed to add patient';
      
      if (err.message.includes('Email already in use')) {
        errorMessage = 'This email is already registered. Please use a different email address.';
      } else if (err.message.includes('required fields')) {
        errorMessage = err.message;
      } else if (err.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message.includes('Invalid gender')) {
        errorMessage = 'Please select a valid gender.';
      } else if (err.message.includes('Invalid date of birth')) {
        errorMessage = 'Please enter a valid date of birth.';
      } else if (err.message.includes('Password must be')) {
        errorMessage = 'Password must be at least 8 characters long.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Error adding patient: ${errorMessage}`);
    }
  }

  const handleEditPatient = (patient) => {
    console.log('Editing patient:', patient);
    setSelectedPatient(patient)
    setShowEditPatientDialog(true)
  }

  const handleUpdatePatient = async (updateData) => {
    try {
      if (!selectedPatient) {
        alert('No patient selected for update');
        return;
      }

      // Frontend validation
      const requiredFields = ['firstName', 'lastName', 'email', 'dateOfBirth', 'gender'];
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

      // Date of birth validation
      const birthDate = new Date(updateData.dateOfBirth);
      if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
        alert('Please enter a valid date of birth');
        return;
      }

      // Contact number validation (if provided)
      if (updateData.contactNumber && updateData.contactNumber.trim() && updateData.contactNumber.trim().length < 10) {
        alert('Contact number must be at least 10 digits');
        return;
      }

      console.log('Updating patient with data:', updateData);

      const response = await updatePatient(selectedPatient._id, updateData);

      if (response.success || response.data) {
        // Update the local state with the updated patient
        setPatientData(prevData => 
          prevData.map(patient => 
            patient._id === selectedPatient._id ? response.data : patient
          )
        );
        
        alert('Patient updated successfully!');
        
        // Close the dialog
        setShowEditPatientDialog(false);
        setSelectedPatient(null);
        
        // Refresh the patients list to ensure consistency
        await fetchPatients();
      } else {
        throw new Error(response.message || 'Failed to update patient');
      }

    } catch (err) {
      console.error('Error updating patient:', err);
      
      let errorMessage = 'Failed to update patient';
      
      if (err.message.includes('Email already in use')) {
        errorMessage = 'This email is already registered to another user. Please use a different email address.';
      } else if (err.message.includes('required fields')) {
        errorMessage = err.message;
      } else if (err.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message.includes('Invalid gender')) {
        errorMessage = 'Please select a valid gender.';
      } else if (err.message.includes('Patient not found')) {
        errorMessage = 'Patient not found. The record may have been deleted.';
        // Refresh the list to remove deleted patients
        await fetchPatients();
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Error updating patient: ${errorMessage}`);
    }
  }

  const handleDeletePatient = async (patientToDelete) => {
    if (!confirm(`Are you sure you want to delete ${patientToDelete.userId?.firstName} ${patientToDelete.userId?.lastName}?`)) {
      return
    }

    try {
      const response = await deletePatient(patientToDelete._id)
      
      // Update the local state to remove the deleted patient
      setPatientData(patientData.filter(patient => patient._id !== patientToDelete._id))
      alert('Patient deleted successfully!')
    } catch (err) {
      console.error('Error deleting patient:', err)
      alert(`Error deleting patient: ${err.message}`)
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
            <p className="mt-4 text-muted-foreground">Loading patients...</p>
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
            <Button onClick={fetchPatients}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle> My Patient</CardTitle>
          <CardDescription>view patients</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <PatientSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <Button onClick={() => setShowAddPatientDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Patients ({filteredPatientData.length})</TabsTrigger>
              <TabsTrigger value="male">Male</TabsTrigger>
              <TabsTrigger value="female">Female</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            <PatientFilters
              genderFilter={genderFilter}
              ageRangeFilter={ageRangeFilter}
              onGenderFilterChange={setGenderFilter}
              onAgeRangeFilterChange={setAgeRangeFilter}
              onFilterClick={handleFilterClick}
            />
          </div>

          <PatientTabsContent
            patientData={filteredPatientData}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
          />
        </Tabs>
      </CardContent>

      {/* Add Patient Dialog */}
      <AddPatientDialog
        open={showAddPatientDialog}
        onOpenChange={setShowAddPatientDialog}
        onSave={handleAddPatient}
      />

      {/* Edit Patient Dialog */}
      <EditPatientDialog
        open={showEditPatientDialog}
        onOpenChange={setShowEditPatientDialog}
        onSave={handleUpdatePatient}
        patient={selectedPatient}
      />
    </Card>
  )
}
