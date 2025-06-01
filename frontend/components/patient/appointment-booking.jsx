"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export function AppointmentBooking() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>Select a department, doctor, date, and time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="department" className="space-y-4">
          <TabsList>
            <TabsTrigger value="department">By Department</TabsTrigger>
            <TabsTrigger value="doctor">By Doctor</TabsTrigger>
          </TabsList>
          <TabsContent value="department" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Select Department</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">🫀 Cardiology</SelectItem>
                      <SelectItem value="neurology">🧠 Neurology</SelectItem>
                      <SelectItem value="orthopedics">🦴 Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">👶 Pediatrics</SelectItem>
                      <SelectItem value="dental">🦷 Dental</SelectItem>
                      <SelectItem value="ophthalmology">👁️ Ophthalmology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Select Doctor</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                      <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                      <SelectItem value="dr-wilson">Dr. James Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Reason for Visit</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Select Date</label>
                <Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md p-2" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Available Time Slots</label>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
                <Button variant="outline" className="justify-start">
                  09:00 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  09:30 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  10:00 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  10:30 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  11:00 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  11:30 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  01:00 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  01:30 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  02:00 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  02:30 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  03:00 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  03:30 PM
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="doctor" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Select Doctor</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-johnson">Dr. Sarah Johnson - Cardiology</SelectItem>
                      <SelectItem value="dr-chen">Dr. Michael Chen - Orthopedics</SelectItem>
                      <SelectItem value="dr-wilson">Dr. James Wilson - Neurology</SelectItem>
                      <SelectItem value="dr-rodriguez">Dr. Emily Rodriguez - Emergency</SelectItem>
                      <SelectItem value="dr-kim">Dr. David Kim - Pediatrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Reason for Visit</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Select Date</label>
                <Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md p-2" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Available Time Slots</label>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
                <Button variant="outline" className="justify-start">
                  09:00 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  09:30 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  10:00 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  10:30 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  11:00 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  11:30 AM
                </Button>
                <Button variant="outline" className="justify-start">
                  01:00 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  01:30 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  02:00 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  02:30 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  03:00 PM
                </Button>
                <Button variant="outline" className="justify-start">
                  03:30 PM
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Book Appointment</Button>
      </CardFooter>
    </Card>
  )
}

