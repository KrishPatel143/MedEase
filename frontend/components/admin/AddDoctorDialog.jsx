import { useState } from "react"
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
import { CheckCircle, Clock, User, Briefcase } from "lucide-react"

export function AddDoctorDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialization: "",
    department: "",
    experience: "",
    consultationFee: "500",
    qualifications: [{ degree: "", institution: "", year: "" }],
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

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
    resetForm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      specialization: "",
      department: "",
      experience: "",
      consultationFee: "500",
      qualifications: [{ degree: "", institution: "", year: "" }],
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
            Add New Doctor
          </DialogTitle>
          <DialogDescription>
            Enter the complete details of the new doctor including availability schedule.
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
                  <Label htmlFor="first-name">First Name *</Label>
                  <Input 
                    id="first-name" 
                    placeholder="First name" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name *</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Last name" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  placeholder="Email address" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input 
                  id="password" 
                  placeholder="Password" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input 
                  id="specialization" 
                  placeholder="e.g., Cardiology, General Medicine" 
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger id="department">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input 
                    id="experience" 
                    placeholder="0" 
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation-fee">Consultation Fee (₹)</Label>
                  <Input 
                    id="consultation-fee" 
                    placeholder="500" 
                    type="number"
                    min="0"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                  />
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
                        {formData.qualifications.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeQualification(index)}
                          >
                            Remove
                          </Button>
                        )}
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
                            id={`${key}-available`}
                            checked={formData.availability[key].isAvailable}
                            onCheckedChange={(checked) => updateAvailability(key, 'isAvailable', checked)}
                          />
                          <Label htmlFor={`${key}-available`} className="w-20 font-medium">
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
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Save Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}