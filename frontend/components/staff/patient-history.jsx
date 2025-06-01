import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, FilePlus, Pill, Activity, Clipboard } from "lucide-react"

export function PatientHistory() {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Patient History</CardTitle>
          <CardDescription>View and manage patient medical records</CardDescription>
        </div>
        <div className="ml-auto">
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="text-sm font-medium">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ID:</span>
                  <span className="text-sm font-medium">P-1001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DOB:</span>
                  <span className="text-sm font-medium">05/12/1985</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gender:</span>
                  <span className="text-sm font-medium">Male</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Blood Type:</span>
                  <span className="text-sm font-medium">O+</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Blood Pressure:</span>
                  <span className="text-sm font-medium">120/80 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Heart Rate:</span>
                  <span className="text-sm font-medium">72 bpm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Temperature:</span>
                  <span className="text-sm font-medium">98.6°F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Respiratory Rate:</span>
                  <span className="text-sm font-medium">16 breaths/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Weight:</span>
                  <span className="text-sm font-medium">180 lbs</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Allergies & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Penicillin</Badge>
                  <Badge variant="destructive">Shellfish</Badge>
                </div>
                <div className="mt-4">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Diabetes Type 2
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="visits">
          <TabsList className="mb-4">
            <TabsTrigger value="visits">
              <FileText className="mr-2 h-4 w-4" />
              Visits
            </TabsTrigger>
            <TabsTrigger value="medications">
              <Pill className="mr-2 h-4 w-4" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="lab-results">
              <Clipboard className="mr-2 h-4 w-4" />
              Lab Results
            </TabsTrigger>
            <TabsTrigger value="vitals">
              <Activity className="mr-2 h-4 w-4" />
              Vitals History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="visits">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>03/15/2023</TableCell>
                  <TableCell>Cardiology</TableCell>
                  <TableCell>Dr. Sarah Johnson</TableCell>
                  <TableCell>Hypertension</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>01/22/2023</TableCell>
                  <TableCell>General Medicine</TableCell>
                  <TableCell>Dr. Michael Chen</TableCell>
                  <TableCell>Influenza</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>11/05/2022</TableCell>
                  <TableCell>Orthopedics</TableCell>
                  <TableCell>Dr. James Wilson</TableCell>
                  <TableCell>Sprained Ankle</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="medications">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Lisinopril</TableCell>
                  <TableCell>10mg</TableCell>
                  <TableCell>Once daily</TableCell>
                  <TableCell>03/15/2023</TableCell>
                  <TableCell>Ongoing</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Metformin</TableCell>
                  <TableCell>500mg</TableCell>
                  <TableCell>Twice daily</TableCell>
                  <TableCell>01/10/2023</TableCell>
                  <TableCell>Ongoing</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ibuprofen</TableCell>
                  <TableCell>400mg</TableCell>
                  <TableCell>As needed</TableCell>
                  <TableCell>11/05/2022</TableCell>
                  <TableCell>11/12/2022</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="lab-results">
            <div className="text-center p-12 text-muted-foreground">Lab results will be displayed here</div>
          </TabsContent>
          <TabsContent value="vitals">
            <div className="text-center p-12 text-muted-foreground">Vitals history will be displayed here</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

