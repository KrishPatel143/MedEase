'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Filter, FileText, Printer } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 12000, expenses: 8000 },
  { month: "Feb", revenue: 15000, expenses: 9000 },
  { month: "Mar", revenue: 18000, expenses: 10000 },
  { month: "Apr", revenue: 20000, expenses: 11000 },
  { month: "May", revenue: 22000, expenses: 12000 },
  { month: "Jun", revenue: 25000, expenses: 13000 },
  { month: "Jul", revenue: 28000, expenses: 14000 },
  { month: "Aug", revenue: 30000, expenses: 15000 },
  { month: "Sep", revenue: 32000, expenses: 16000 },
  { month: "Oct", revenue: 35000, expenses: 17000 },
  { month: "Nov", revenue: 38000, expenses: 18000 },
  { month: "Dec", revenue: 40000, expenses: 19000 },
]

const departmentRevenueData = [
  { name: "Cardiology", value: 85000 },
  { name: "Neurology", value: 65000 },
  { name: "Orthopedics", value: 75000 },
  { name: "Pediatrics", value: 45000 },
  { name: "Emergency", value: 55000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function EnhancedFinances() {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Finances</CardTitle>
          <CardDescription>Billing reports and expense tracking</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select defaultValue="2023">
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="departments">Department Revenue</TabsTrigger>
            <TabsTrigger value="billing">Billing Status</TabsTrigger>
            <TabsTrigger value="insurance">Insurance Claims</TabsTrigger>
          </TabsList>
         
          <TabsContent value="billing">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoices
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV-001</TableCell>
                  <TableCell>John Smith</TableCell>
                  <TableCell>Cardiology Consultation</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell>Apr 15, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Paid</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-002</TableCell>
                  <TableCell>Maria Garcia</TableCell>
                  <TableCell>Orthopedic Surgery</TableCell>
                  <TableCell>$3,500.00</TableCell>
                  <TableCell>Apr 10, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-003</TableCell>
                  <TableCell>Robert Johnson</TableCell>
                  <TableCell>Emergency Care</TableCell>
                  <TableCell>$850.00</TableCell>
                  <TableCell>Apr 05, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Paid</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-004</TableCell>
                  <TableCell>Lisa Wong</TableCell>
                  <TableCell>Neurology Consultation</TableCell>
                  <TableCell>$300.00</TableCell>
                  <TableCell>Mar 28, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-red-500">Overdue</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV-005</TableCell>
                  <TableCell>David Brown</TableCell>
                  <TableCell>Pediatric Check-up</TableCell>
                  <TableCell>$150.00</TableCell>
                  <TableCell>Mar 20, 2023</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Paid</Badge>
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
          <TabsContent value="insurance">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Submit Claims
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">CLM-001</TableCell>
                  <TableCell>John Smith</TableCell>
                  <TableCell>Blue Cross</TableCell>
                  <TableCell>Cardiology</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Approved</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CLM-002</TableCell>
                  <TableCell>Maria Garcia</TableCell>
                  <TableCell>Aetna</TableCell>
                  <TableCell>Orthopedics</TableCell>
                  <TableCell>$3,500.00</TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500">Pending</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CLM-003</TableCell>
                  <TableCell>Robert Johnson</TableCell>
                  <TableCell>Medicare</TableCell>
                  <TableCell>Emergency</TableCell>
                  <TableCell>$850.00</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Approved</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">CLM-004</TableCell>
                  <TableCell>Lisa Wong</TableCell>
                  <TableCell>Cigna</TableCell>
                  <TableCell>Neurology</TableCell>
                  <TableCell>$300.00</TableCell>
                  <TableCell>
                    <Badge className="bg-red-500">Denied</Badge>
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
          <TabsContent value="departments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentRevenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentRevenueData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="value" fill="#8884d8">
                      {departmentRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Profit Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Cardiology</TableCell>
                    <TableCell>$85,000</TableCell>
                    <TableCell>$45,000</TableCell>
                    <TableCell>$40,000</TableCell>
                    <TableCell>47.1%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Neurology</TableCell>
                    <TableCell>$65,000</TableCell>
                    <TableCell>$35,000</TableCell>
                    <TableCell>$30,000</TableCell>
                    <TableCell>46.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Orthopedics</TableCell>
                    <TableCell>$75,000</TableCell>
                    <TableCell>$40,000</TableCell>
                    <TableCell>$35,000</TableCell>
                    <TableCell>46.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pediatrics</TableCell>
                    <TableCell>$45,000</TableCell>
                    <TableCell>$25,000</TableCell>
                    <TableCell>$20,000</TableCell>
                    <TableCell>44.4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Emergency</TableCell>
                    <TableCell>$55,000</TableCell>
                    <TableCell>$30,000</TableCell>
                    <TableCell>$25,000</TableCell>
                    <TableCell>45.5%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

