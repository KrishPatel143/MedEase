import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Pill, RefreshCw } from "lucide-react"

export function PrescriptionManagement() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>My Prescriptions</CardTitle>
        <CardDescription>Manage your prescriptions and request refills</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Prescriptions</TabsTrigger>
            <TabsTrigger value="history">Prescription History</TabsTrigger>
            <TabsTrigger value="refills">Refill Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Instructions</TableHead>
                  <TableHead>Prescribed</TableHead>
                  <TableHead>Refills</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Lisinopril</TableCell>
                  <TableCell>10mg</TableCell>
                  <TableCell>Take once daily</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Apr 15, 2023</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Pill className="mr-2 h-4 w-4" />
                        <span>Dr. Sarah Johnson</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>2 remaining</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Request Refill
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Metformin</TableCell>
                  <TableCell>500mg</TableCell>
                  <TableCell>Take twice daily with meals</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Mar 10, 2023</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Pill className="mr-2 h-4 w-4" />
                        <span>Dr. Sarah Johnson</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>1 remaining</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Request Refill
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Atorvastatin</TableCell>
                  <TableCell>20mg</TableCell>
                  <TableCell>Take once daily at bedtime</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Mar 15, 2023</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Pill className="mr-2 h-4 w-4" />
                        <span>Dr. Sarah Johnson</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>3 remaining</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Request Refill
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="history">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Prescribed</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Amoxicillin</TableCell>
                  <TableCell>500mg three times daily</TableCell>
                  <TableCell>Feb 05, 2023</TableCell>
                  <TableCell>Feb 15, 2023</TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Prednisone</TableCell>
                  <TableCell>20mg daily, tapering</TableCell>
                  <TableCell>Jan 10, 2023</TableCell>
                  <TableCell>Jan 24, 2023</TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ibuprofen</TableCell>
                  <TableCell>600mg as needed</TableCell>
                  <TableCell>Dec 15, 2022</TableCell>
                  <TableCell>Jan 15, 2023</TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="refills">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Lisinopril 10mg</TableCell>
                  <TableCell>Apr 10, 2023</TableCell>
                  <TableCell>MedEase Pharmacy</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Approved</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Metformin 500mg</TableCell>
                  <TableCell>Apr 05, 2023</TableCell>
                  <TableCell>MedEase Pharmacy</TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

