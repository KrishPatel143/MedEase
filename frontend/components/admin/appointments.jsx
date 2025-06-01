import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Calendar } from "lucide-react"

export function Appointments() {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>View upcoming and past appointments</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search appointments..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">John Smith</TableCell>
              <TableCell>Dr. Sarah Johnson</TableCell>
              <TableCell>Cardiology</TableCell>
              <TableCell>Today, 10:00 AM</TableCell>
              <TableCell>
                <Badge className="bg-blue-500">Upcoming</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Maria Garcia</TableCell>
              <TableCell>Dr. Michael Chen</TableCell>
              <TableCell>Orthopedics</TableCell>
              <TableCell>Today, 11:30 AM</TableCell>
              <TableCell>
                <Badge className="bg-blue-500">Upcoming</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Robert Johnson</TableCell>
              <TableCell>Dr. Emily Rodriguez</TableCell>
              <TableCell>Emergency</TableCell>
              <TableCell>Today, 09:15 AM</TableCell>
              <TableCell>
                <Badge className="bg-green-500">Completed</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Lisa Wong</TableCell>
              <TableCell>Dr. James Wilson</TableCell>
              <TableCell>Neurology</TableCell>
              <TableCell>Tomorrow, 02:00 PM</TableCell>
              <TableCell>
                <Badge className="bg-blue-500">Upcoming</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">David Brown</TableCell>
              <TableCell>Dr. David Kim</TableCell>
              <TableCell>Pediatrics</TableCell>
              <TableCell>Yesterday, 03:30 PM</TableCell>
              <TableCell>
                <Badge variant="outline">Cancelled</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

