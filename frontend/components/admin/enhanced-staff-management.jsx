"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus } from "lucide-react"

// Import custom components
import { AddDoctorDialog } from "./AddDoctorDialog"
import { DoctorSearch } from "./DoctorSearch"
import { DoctorFilters } from "./DoctorFilters"
import { DoctorTabsContent } from "./DoctorTabsContent"
import { addDoctor, getAllDoctors } from "@/lib/api/doctors"

export function EnhancedDoctorManagement() {
  const [showAddDoctorDialog, setShowAddDoctorDialog] = useState(false)
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
      console.log(response);
      
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
      const response = await addDoctor({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        department: formData.department,
        experience: parseInt(formData.experience) || 0,
        consultationFee: parseInt(formData.consultationFee) || 500
      });
     

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add doctor')
      }

      const result = await response.json()
      setDoctorData([...doctorData, result.data])
      alert('Doctor added successfully!')
    } catch (err) {
      console.error('Error adding doctor:', err)
      alert(`Error adding doctor: ${err.message}`)
    }
  }

  const handleEditDoctor = (doctor) => {
    console.log("Edit doctor:", doctor)
    // TODO: Implement edit functionality with a separate edit dialog
    alert(`Edit functionality for Dr. ${doctor.userId?.firstName} ${doctor.userId?.lastName} will be implemented`)
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
      const response = await fetch(`/api/doctors/${doctorToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete doctor')
      }

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

      <AddDoctorDialog
        open={showAddDoctorDialog}
        onOpenChange={setShowAddDoctorDialog}
        onSave={handleAddDoctor}
      />
    </Card>
  )
}