import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search } from "lucide-react"

export function StaffManagement() {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Add, remove, and manage staff members</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search staff..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Dr. Sarah Johnson</TableCell>
              <TableCell>Physician</TableCell>
              <TableCell>Cardiology</TableCell>
              <TableCell>
                <Badge className="bg-green-500">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Select defaultValue="edit">
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="view">View Details</SelectItem>
                    <SelectItem value="deactivate">Deactivate</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Dr. Michael Chen</TableCell>
              <TableCell>Surgeon</TableCell>
              <TableCell>Orthopedics</TableCell>
              <TableCell>
                <Badge className="bg-green-500">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Select defaultValue="edit">
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="view">View Details</SelectItem>
                    <SelectItem value="deactivate">Deactivate</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Nurse Emily Rodriguez</TableCell>
              <TableCell>Head Nurse</TableCell>
              <TableCell>Emergency</TableCell>
              <TableCell>
                <Badge className="bg-green-500">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Select defaultValue="edit">
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="view">View Details</SelectItem>
                    <SelectItem value="deactivate">Deactivate</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Dr. James Wilson</TableCell>
              <TableCell>Physician</TableCell>
              <TableCell>Neurology</TableCell>
              <TableCell>
                <Badge variant="outline">On Leave</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Select defaultValue="edit">
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="view">View Details</SelectItem>
                    <SelectItem value="activate">Activate</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Nurse David Kim</TableCell>
              <TableCell>Nurse</TableCell>
              <TableCell>Pediatrics</TableCell>
              <TableCell>
                <Badge className="bg-green-500">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Select defaultValue="edit">
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="view">View Details</SelectItem>
                    <SelectItem value="deactivate">Deactivate</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

