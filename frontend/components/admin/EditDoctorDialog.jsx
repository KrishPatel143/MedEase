import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, User, Briefcase, Clock, X } from "lucide-react"

export function EditDoctorDialog({ open, onOpenChange, onSave, doctor }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    department: "",
    experience: "",
    consultationFee: "",
    status: "active",
    qualifications: [],
    availability: {
      monday: { start: "09:00", end: "17:00", isAvailable: true },
      tuesday: { start: "09:00", end: "17:00", isAvailable: true },
      wednesday: { start: "09:00", end: "17:00", isAvailable: true },
      thursday: { start: "09:00", end: "17:00", isAvailable: true },
      friday: { start: "09:00", end: "17:00", isAvailable: true },
      saturday: { start: "09:00", end: "13:00", isAvailable: true },
      sunday: { start: "09:00", end: "13:00", isAvailable: false }
    }
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  // Populate form when doctor prop changes
  useEffect(() => {
    if (doctor) {
      setFormData({
        firstName: doctor.userId?.firstName || "",
        lastName: doctor.userId?.lastName || "",
        email: doctor.userId?.email || "",
        phoneNumber: doctor.userId?.phoneNumber || "",
        specialization: doctor.specialization || "",
        department: doctor.department || "",
        experience: doctor.experience?.toString() || "0",
        consultationFee: doctor.consultationFee?.toString() || "500",
        status: doctor.status || "active",
        qualifications: doctor.qualifications || [],
        availability: doctor.availability || {
          monday: { start: "09:00", end: "17:00", isAvailable: true },
          tuesday: { start: "09:00", end: "17:00", isAvailable: true },
          wednesday: { start: "09:00", end: "17:00", isAvailable: true },
          thursday: { start: "09:00", end: "17:00", isAvailable: true },
          friday: { start: "09:00", end: "17:00", isAvailable: true },
          saturday: { start: "09:00", end: "13:00", isAvailable: true },
          sunday: { start: "09:00", end: "13:00", isAvailable: false }
        }
      })
      setErrors({})
    }
  }, [doctor])

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.specialization.trim()) newErrors.specialization = "Specialization is required"
    if (!formData.department) newErrors.department = "Department is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone number validation
    if (formData.phoneNumber && formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    // Experience validation
    const experience = parseInt(formData.experience)
    if (isNaN(experience) || experience < 0) {
      newErrors.experience = "Experience must be a valid positive number"
    }

    // Consultation fee validation
    const consultationFee = parseInt(formData.consultationFee)
    if (isNaN(consultationFee) || consultationFee < 0) {
      newErrors.consultationFee = "Consultation fee must be a valid positive number"
    }

    // Availability validation
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    for (const day of daysOfWeek) {
      const dayAvail = formData.availability[day]
      if (dayAvail.isAvailable) {
        const startMinutes = parseInt(dayAvail.start.split(':')[0]) * 60 + parseInt(dayAvail.start.split(':')[1])
        const endMinutes = parseInt(dayAvail.end.split(':')[0]) * 60 + parseInt(dayAvail.end.split(':')[1])
        
        if (endMinutes <= startMinutes) {
          newErrors[`${day}_time`] = `End time must be after start time for ${day.charAt(0).toUpperCase() + day.slice(1)}`
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // Filter valid qualifications
      const validQualifications = formData.qualifications.filter(qual => 
        qual.degree && qual.degree.trim() && 
        qual.institution && qual.institution.trim()
      )

      const updateData = {
        // User fields
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phoneNumber: formData.phoneNumber.trim(),
        
        // Doctor fields
        specialization: formData.specialization.trim(),
        department: formData.department,
        experience: parseInt(formData.experience) || 0,
        consultationFee: parseInt(formData.consultationFee) || 500,
        status: formData.status,
        qualifications: validQualifications,
        availability: formData.availability
      }

      if (onSave) {
        await onSave(updateData)
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating doctor:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original doctor data
    if (doctor) {
      setFormData({
        firstName: doctor.userId?.firstName || "",
        lastName: doctor.userId?.lastName || "",
        email: doctor.userId?.email || "",
        phoneNumber: doctor.userId?.phoneNumber || "",
        specialization: doctor.specialization || "",
        department: doctor.department || "",
        experience: doctor.experience?.toString() || "0",
        consultationFee: doctor.consultationFee?.toString() || "500",
        status: doctor.status || "active",
        qualifications: doctor.qualifications || [],
        availability: doctor.availability || {
          monday: { start: "09:00", end: "17:00", isAvailable: true },
          tuesday: { start: "09:00", end: "17:00", isAvailable: true },
          wednesday: { start: "09:00", end: "17:00", isAvailable: true },
          thursday: { start: "09:00", end: "17:00", isAvailable: true },
          friday: { start: "09:00", end: "17:00", isAvailable: true },
          saturday: { start: "09:00", end: "13:00", isAvailable: true },
          sunday: { start: "09:00", end: "13:00", isAvailable: false }
        }
      })
    }
    setErrors({})
    onOpenChange(false)
  }

  const updateAvailability = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }))
  }

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: "", institution: "", year: "" }]
    }))
  }

  const updateQualification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) => 
        i === index ? { ...qual, [field]: value } : qual
      )
    }))
  }

  const removeQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Doctor - Dr. {doctor?.userId?.firstName} {doctor?.userId?.lastName}
          </DialogTitle>
          <DialogDescription>
            Update the doctor's information including availability schedule and qualifications.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Availability
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[400px] overflow-y-auto mt-4">
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-first-name">First Name *</Label>
                  <Input 
                    id="edit-first-name" 
                    placeholder="First name" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-last-name">Last Name *</Label>
                  <Input 
                    id="edit-last-name" 
                    placeholder="Last name" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input 
                  id="edit-email" 
                  placeholder="Email address" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input 
                  id="edit-phone" 
                  placeholder="Phone number" 
                  type="tel" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-specialization">Specialization *</Label>
                <Input 
                  id="edit-specialization" 
                  placeholder="e.g., Cardiology, General Medicine" 
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className={errors.specialization ? "border-red-500" : ""}
                />
                {errors.specialization && <p className="text-sm text-red-500">{errors.specialization}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger id="edit-department" className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-experience">Experience (years) *</Label>
                  <Input 
                    id="edit-experience" 
                    placeholder="0" 
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className={errors.experience ? "border-red-500" : ""}
                  />
                  {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-consultation-fee">Consultation Fee (£) *</Label>
                  <Input 
                    id="edit-consultation-fee" 
                    placeholder="500" 
                    type="number"
                    min="0"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                    className={errors.consultationFee ? "border-red-500" : ""}
                  />
                  {errors.consultationFee && <p className="text-sm text-red-500">{errors.consultationFee}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Qualifications</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                    Add Qualification
                  </Button>
                </div>
                {formData.qualifications.map((qualification, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Degree"
                        value={qualification.degree}
                        onChange={(e) => updateQualification(index, 'degree', e.target.value)}
                      />
                      <Input
                        placeholder="Institution"
                        value={qualification.institution}
                        onChange={(e) => updateQualification(index, 'institution', e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Year"
                          type="number"
                          value={qualification.year}
                          onChange={(e) => updateQualification(index, 'year', e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeQualification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="availability" className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Weekly Schedule</Label>
                {daysOfWeek.map(({ key, label }) => (
                  <Card key={key} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${key}-available`}
                            checked={formData.availability[key].isAvailable}
                            onCheckedChange={(checked) => updateAvailability(key, 'isAvailable', checked)}
                          />
                          <Label htmlFor={`edit-${key}-available`} className="w-20 font-medium">
                            {label}
                          </Label>
                        </div>
                        
                        {formData.availability[key].isAvailable && (
                          <div className="flex items-center space-x-2 flex-1">
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm">From:</Label>
                              <Input
                                type="time"
                                value={formData.availability[key].start}
                                onChange={(e) => updateAvailability(key, 'start', e.target.value)}
                                className="w-32"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm">To:</Label>
                              <Input
                                type="time"
                                value={formData.availability[key].end}
                                onChange={(e) => updateAvailability(key, 'end', e.target.value)}
                                className="w-32"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors[`${key}_time`] && (
                      <p className="text-sm text-red-500 mt-2">{errors[`${key}_time`]}</p>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Updating...' : 'Update Doctor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}