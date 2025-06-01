import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Save, Upload, Download, FileText, FilePlus } from "lucide-react"

export function MedicalRecords() {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Medical Records</CardTitle>
          <CardDescription>Create and manage patient medical records</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search patient records..." className="w-[250px] pl-8" />
          </div>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="space-y-4">
          <TabsList>
            <TabsTrigger value="create">Create Record</TabsTrigger>
            <TabsTrigger value="view">View Records</TabsTrigger>
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select>
                    <SelectTrigger id="patient">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith (P-1001)</SelectItem>
                      <SelectItem value="maria-garcia">Maria Garcia (P-1002)</SelectItem>
                      <SelectItem value="robert-johnson">Robert Johnson (P-1003)</SelectItem>
                      <SelectItem value="lisa-wong">Lisa Wong (P-1004)</SelectItem>
                      <SelectItem value="david-brown">David Brown (P-1005)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="record-type">Record Type</Label>
                  <Select>
                    <SelectTrigger id="record-type">
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit-note">Visit Note</SelectItem>
                      <SelectItem value="lab-result">Lab Result</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="procedure">Procedure Note</SelectItem>
                      <SelectItem value="imaging">Imaging Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter record title" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select>
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                      <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                      <SelectItem value="dr-wilson">Dr. James Wilson</SelectItem>
                      <SelectItem value="dr-rodriguez">Dr. Emily Rodriguez</SelectItem>
                      <SelectItem value="dr-kim">Dr. David Kim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Enter record content" className="min-h-[200px]" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Record
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="view">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Record Type</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>04/15/2023</TableCell>
                  <TableCell className="font-medium">John Smith</TableCell>
                  <TableCell>Visit Note</TableCell>
                  <TableCell>Dr. Sarah Johnson</TableCell>
                  <TableCell>Cardiology</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>04/10/2023</TableCell>
                  <TableCell className="font-medium">Maria Garcia</TableCell>
                  <TableCell>Lab Result</TableCell>
                  <TableCell>Dr. Michael Chen</TableCell>
                  <TableCell>Orthopedics</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>04/05/2023</TableCell>
                  <TableCell className="font-medium">Robert Johnson</TableCell>
                  <TableCell>Prescription</TableCell>
                  <TableCell>Dr. Emily Rodriguez</TableCell>
                  <TableCell>Emergency</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>03/28/2023</TableCell>
                  <TableCell className="font-medium">Lisa Wong</TableCell>
                  <TableCell>Imaging Report</TableCell>
                  <TableCell>Dr. James Wilson</TableCell>
                  <TableCell>Neurology</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>03/20/2023</TableCell>
                  <TableCell className="font-medium">David Brown</TableCell>
                  <TableCell>Procedure Note</TableCell>
                  <TableCell>Dr. David Kim</TableCell>
                  <TableCell>Pediatrics</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="upload">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="upload-patient">Patient</Label>
                  <Select>
                    <SelectTrigger id="upload-patient">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith (P-1001)</SelectItem>
                      <SelectItem value="maria-garcia">Maria Garcia (P-1002)</SelectItem>
                      <SelectItem value="robert-johnson">Robert Johnson (P-1003)</SelectItem>
                      <SelectItem value="lisa-wong">Lisa Wong (P-1004)</SelectItem>
                      <SelectItem value="david-brown">David Brown (P-1005)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select>
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lab-report">Lab Report</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="consent">Consent Form</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-title">Document Title</Label>
                <Input id="document-title" placeholder="Enter document title" />
              </div>

              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, DICOM</p>
                <Button variant="outline" className="mt-4">
                  Browse Files
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

