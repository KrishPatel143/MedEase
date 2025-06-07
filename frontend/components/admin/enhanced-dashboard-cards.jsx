import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, UserCheck, CreditCard, TrendingUp, AlertTriangle } from "lucide-react"

export function EnhancedDashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,853</div>
          <div className="flex items-center pt-1">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            <p className="text-xs text-green-500">+18 from yesterday</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
          <Calendar className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42</div>
          <div className="flex justify-between items-center pt-1">
            <p className="text-xs text-muted-foreground">8 remaining</p>
            <p className="text-xs font-medium text-amber-500">34 completed</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
          <UserCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <div className="flex justify-between items-center pt-1">
            <p className="text-xs text-muted-foreground">3 on leave</p>
            <p className="text-xs font-medium text-green-500">5 on call</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Billing Status</CardTitle>
          <CreditCard className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">£12,234</div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <p className="text-xs text-green-500">+8.2% from last month</p>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="mr-1 h-3 w-3 text-amber-500" />
              <p className="text-xs text-amber-500">5 pending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

