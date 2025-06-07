'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, RefreshCw } from "lucide-react"
import {
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
// Table components inline since @/components/ui/table is not available
import { getDepartmentRevenue } from '@/lib/api/finance'

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658"]

export function EnhancedFinances() {
  const [departmentData, setDepartmentData] = useState([])
  const [summary, setSummary] = useState({})
  const [period, setPeriod] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const fetchDepartmentRevenue = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        period: selectedPeriod
      })
      
      if (selectedPeriod === 'month') {
        params.append('month', selectedMonth.toString())
        params.append('year', selectedYear.toString())
      } else if (selectedPeriod === 'year') {
        params.append('year', selectedYear.toString())
      }

      console.log(params);
      
      const result = await getDepartmentRevenue(params);

      // Transform data for charts
      const chartData = result.data.departments.map(dept => ({
        name: dept.department || 'Unknown',
        value: dept.totalRevenue,
        appointments: dept.totalAppointments,
        patients: dept.uniquePatients,
        doctors: dept.uniqueDoctors,
        avgPerAppointment: dept.averagePerAppointment,
        percentage: dept.revenuePercentage
      }))

      setDepartmentData(chartData)
      setSummary(result.data.summary)
      setPeriod(result.data.period)
      
    } catch (err) {
      console.error('Error fetching department revenue:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartmentRevenue()
  }, [selectedPeriod, selectedMonth, selectedYear])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading financial data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-3">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={fetchDepartmentRevenue} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Department Finances</CardTitle>
          <CardDescription>
            Revenue analysis by department for {period.displayName}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedPeriod === 'month' && (
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={fetchDepartmentRevenue} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(summary.totalRevenue || 0)}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Appointments</p>
            <p className="text-2xl font-bold text-green-900">{summary.totalAppointments || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Active Departments</p>
            <p className="text-2xl font-bold text-purple-900">{summary.totalDepartments || 0}</p>
          </div>
        </div>

        <Tabs defaultValue="departments" className="space-y-4">  
          <TabsContent value="departments">
            {departmentData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No revenue data available for the selected period.</p>
              </div>
            ) : (
              <>
                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-[300px]">
                    <h3 className="text-lg font-semibold mb-2">Revenue Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-[300px]">
                    <h3 className="text-lg font-semibold mb-2">Revenue by Department</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentData}>
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                        />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="value" fill="#8884d8">
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Detailed Department Analysis</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Department</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Total Revenue</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Appointments</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Avg per Appointment</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Unique Patients</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Active Doctors</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">Revenue Share</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {departmentData.map((dept, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3 font-medium">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span>{dept.name}</span>
                              </div>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 font-semibold text-green-600">
                              {formatCurrency(dept.value)}
                            </td>
                            <td className="border border-gray-200 px-4 py-3">{dept.appointments}</td>
                            <td className="border border-gray-200 px-4 py-3">{formatCurrency(dept.avgPerAppointment)}</td>
                            <td className="border border-gray-200 px-4 py-3">{dept.patients}</td>
                            <td className="border border-gray-200 px-4 py-3">{dept.doctors}</td>
                            <td className="border border-gray-200 px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full" 
                                    style={{ 
                                      width: `${dept.percentage}%`,
                                      backgroundColor: COLORS[index % COLORS.length]
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{dept.percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}