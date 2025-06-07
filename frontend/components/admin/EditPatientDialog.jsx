
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { Card } from "@/components/ui/card"
import { CheckCircle, User, Heart, Phone, X } from "lucide-react"

export function EditPatientDialog({ open, onOpenChange, onSave, patient }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: ""
    },
    medicalHistory: []
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Populate form when patient prop changes
  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.userId?.firstName || "",
        lastName: patient.userId?.lastName || "",
        email: patient.userId?.email || "",
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : "",
        gender: patient.gender || "",
        contactNumber: patient.contactNumber || "",
        address: patient.address || "",
        emergencyContact: patient.emergencyContact || {
          name: "",
          relationship: "",
          phoneNumber: ""
        },
        medicalHistory: patient.medicalHistory || []
      })
      setErrors({})
    }
  }, [patient])

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.gender) newErrors.gender = "Gender is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      if (isNaN(birthDate.getTime()) || birthDate > today) {
        newErrors.dateOfBirth = "Please enter a valid date of birth"
      }
    }

    // Contact number validation
    if (formData.contactNumber && formData.contactNumber.length < 10) {
      newErrors.contactNumber = "Contact number must be at least 10 digits"
    }

    // Emergency contact validation
    if (formData.emergencyContact.name && !formData.emergencyContact.phoneNumber) {
      newErrors.emergencyContactPhone = "Emergency contact phone number is required when name is provided"
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
      // Filter valid medical history
      const validMedicalHistory = formData.medicalHistory.filter(history => 
        history.condition && history.condition.trim()
      )

      const updateData = {
        // User fields
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        
        // Patient fields
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
        emergencyContact: formData.emergencyContact,
        medicalHistory: validMedicalHistory
      }

      if (onSave) {
        await onSave(updateData)
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating patient:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original patient data
    if (patient) {
      setFormData({
        firstName: patient.userId?.firstName || "",
        lastName: patient.userId?.lastName || "",
        email: patient.userId?.email || "",
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : "",
        gender: patient.gender || "",
        contactNumber: patient.contactNumber || "",
        address: patient.address || "",
        emergencyContact: patient.emergencyContact || {
          name: "",
          relationship: "",
          phoneNumber: ""
        },
        medicalHistory: patient.medicalHistory || []
      })
    }
    setErrors({})
    onOpenChange(false)
  }

  const addMedicalHistory = () => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: [...prev.medicalHistory, { condition: "", diagnosedDate: "", notes: "" }]
    }))
  }

  const updateMedicalHistory = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.map((history, i) => 
        i === index ? { ...history, [field]: value } : history
      )
    }))
  }

  const removeMedicalHistory = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Patient - {patient?.userId?.firstName} {patient?.userId?.lastName}
          </DialogTitle>
          <DialogDescription>
            Update the patient's information including emergency contact and medical history.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Medical
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date-of-birth">Date of Birth *</Label>
                  <Input 
                    id="edit-date-of-birth" 
                    type="date" 
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger id="edit-gender" className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contact-number">Contact Number</Label>
                <Input 
                  id="edit-contact-number" 
                  placeholder="Phone number" 
                  type="tel" 
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className={errors.contactNumber ? "border-red-500" : ""}
                />
                {errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea 
                  id="edit-address" 
                  placeholder="Full address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-semibold">Emergency Contact</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-emergency-name">Emergency Contact Name</Label>
                    <Input 
                      id="edit-emergency-name" 
                      placeholder="Full name" 
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData, 
                        emergencyContact: {...formData.emergencyContact, name: e.target.value}
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-emergency-relationship">Relationship</Label>
                      <Input 
                        id="edit-emergency-relationship" 
                        placeholder="e.g., Father, Mother, Spouse" 
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => setFormData({
                          ...formData, 
                          emergencyContact: {...formData.emergencyContact, relationship: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-emergency-phone">Phone Number</Label>
                      <Input 
                        id="edit-emergency-phone" 
                        placeholder="Phone number" 
                        type="tel" 
                        value={formData.emergencyContact.phoneNumber}
                        onChange={(e) => setFormData({
                          ...formData, 
                          emergencyContact: {...formData.emergencyContact, phoneNumber: e.target.value}
                        })}
                        className={errors.emergencyContactPhone ? "border-red-500" : ""}
                      />
                      {errors.emergencyContactPhone && <p className="text-sm text-red-500">{errors.emergencyContactPhone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Medical History</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMedicalHistory}>
                    Add Condition
                  </Button>
                </div>
                {formData.medicalHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No medical history recorded.</p>
                ) : (
                  formData.medicalHistory.map((history, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Condition #{index + 1}</Label>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeMedicalHistory(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-sm">Condition *</Label>
                            <Input
                              placeholder="Medical condition"
                              value={history.condition}
                              onChange={(e) => updateMedicalHistory(index, 'condition', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-sm">Diagnosed Date</Label>
                            <Input
                              type="date"
                              value={history.diagnosedDate ? new Date(history.diagnosedDate).toISOString().split('T')[0] : ""}
                              onChange={(e) => updateMedicalHistory(index, 'diagnosedDate', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm">Notes</Label>
                          <Textarea
                            placeholder="Additional notes about this condition"
                            value={history.notes}
                            onChange={(e) => updateMedicalHistory(index, 'notes', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
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
            {loading ? 'Updating...' : 'Update Patient'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}