"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  UserPlus,
  UserCheck,
  UserMinus,
  Filter,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"

export function EnhancedPatientCheckIn() {
  const [showCheckInDialog, setShowCheckInDialog] = useState(false)

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Patient Check-In / Check-Out</CardTitle>
          <CardDescription>Manage patient flow and appointments</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search patients..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Register New Patient</DialogTitle>
                <DialogDescription>Enter the patient's information. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="First name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Last name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Email address" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Address" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Patient
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                    <UserCheck className="h-8 w-8 text-blue-500" />
                    <span className="text-sm font-medium">Check-In Patient</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Check-In Patient</DialogTitle>
                    <DialogDescription>Enter the patient ID or search by name to check in.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-id">Patient ID</Label>
                      <Input id="patient-id" placeholder="Enter patient ID" />
                    </div>
                    <div className="space-y-2">
                      <Label>Or search by name</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search patients..." className="pl-8" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointment">Appointment</Label>
                      <Select>
                        <SelectTrigger id="appointment">
                          <SelectValue placeholder="Select appointment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10am">10:00 AM - Cardiology</SelectItem>
                          <SelectItem value="11am">11:30 AM - Orthopedics</SelectItem>
                          <SelectItem value="1pm">1:00 PM - General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input id="notes" placeholder="Additional notes" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCheckInDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowCheckInDialog(false)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Check In
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                <UserMinus className="h-8 w-8 text-green-500" />
                <span className="text-sm font-medium">Check-Out Patient</span>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
                <span className="text-sm font-medium">Mark as No-Show</span>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                <Calendar className="h-8 w-8 text-purple-500" />
                <span className="text-sm font-medium">Reschedule</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="with-doctor">With Doctor</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Appointment</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">P-1001</TableCell>
                  <TableCell>John Smith</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>10:00 AM</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Cardiology</div>
                    </div>
                  </TableCell>
                  <TableCell>Dr. Sarah Johnson</TableCell>
                  <TableCell className="text-amber-500">15 min</TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500">Waiting</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Check In
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P-1002</TableCell>
                  <TableCell>Maria Garcia</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>11:30 AM</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Orthopedics</div>
                    </div>
                  </TableCell>
                  <TableCell>Dr. Michael Chen</TableCell>
                  <TableCell className="text-blue-500">5 min</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-500">Checked In</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Start Visit
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P-1003</TableCell>
                  <TableCell>Robert Johnson</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>09:15 AM</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Emergency</div>
                    </div>
                  </TableCell>
                  <TableCell>Dr. Emily Rodriguez</TableCell>
                  <TableCell className="text-green-500">25 min</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">With Doctor</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <UserMinus className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P-1004</TableCell>
                  <TableCell>Lisa Wong</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>02:00 PM</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Neurology</div>
                    </div>
                  </TableCell>
                  <TableCell>Dr. James Wilson</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge variant="outline">Scheduled</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Check In
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">P-1005</TableCell>
                  <TableCell>David Brown</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>03:30 PM</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Pediatrics</div>
                    </div>
                  </TableCell>
                  <TableCell>Dr. David Kim</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge className="bg-red-500">Completed</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="upcoming">
            <div className="text-center p-12 text-muted-foreground">Upcoming appointments will be displayed here</div>
          </TabsContent>
          <TabsContent value="recent">
            <div className="text-center p-12 text-muted-foreground">Recent appointments will be displayed here</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

