import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

export function AddDoctorDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialization: "",
    department: "",
    experience: "",
    consultationFee: "500"
  })

  const handleSave = () => {
    if (onSave) {
      onSave(formData)
    }
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      specialization: "",
      department: "",
      experience: "",
      consultationFee: "500"
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form on cancel
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      specialization: "",
      department: "",
      experience: "",
      consultationFee: "500"
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogDescription>
            Enter the details of the new doctor. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input 
                id="first-name" 
                placeholder="First name" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input 
                id="last-name" 
                placeholder="Last name" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              placeholder="Email address" 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              placeholder="Password" 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input 
              id="specialization" 
              placeholder="e.g., Cardiology, General Medicine" 
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
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
        </div>
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