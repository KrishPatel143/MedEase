import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, UserCheck, UserMinus } from "lucide-react"

export function PatientCheckIn() {
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
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Check-In
          </Button>
          <Button variant="outline" className="gap-2">
            <UserMinus className="h-4 w-4" />
            Check-Out
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">P-1001</TableCell>
              <TableCell>John Smith</TableCell>
              <TableCell>10:00 AM - Cardiology</TableCell>
              <TableCell>Dr. Sarah Johnson</TableCell>
              <TableCell>
                <Badge className="bg-amber-500">Waiting</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">P-1002</TableCell>
              <TableCell>Maria Garcia</TableCell>
              <TableCell>11:30 AM - Orthopedics</TableCell>
              <TableCell>Dr. Michael Chen</TableCell>
              <TableCell>
                <Badge className="bg-blue-500">Checked In</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">P-1003</TableCell>
              <TableCell>Robert Johnson</TableCell>
              <TableCell>09:15 AM - Emergency</TableCell>
              <TableCell>Dr. Emily Rodriguez</TableCell>
              <TableCell>
                <Badge className="bg-green-500">With Doctor</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">P-1004</TableCell>
              <TableCell>Lisa Wong</TableCell>
              <TableCell>02:00 PM - Neurology</TableCell>
              <TableCell>Dr. James Wilson</TableCell>
              <TableCell>
                <Badge variant="outline">Scheduled</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">P-1005</TableCell>
              <TableCell>David Brown</TableCell>
              <TableCell>03:30 PM - Pediatrics</TableCell>
              <TableCell>Dr. David Kim</TableCell>
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
      </CardContent>
    </Card>
  )
}

