import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, AlertCircle, CreditCard } from "lucide-react"

export function Notifications() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Recent alerts and updates</CardDescription>
        </div>
        <Button variant="outline" size="icon" className="ml-auto">
          <Bell className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 rounded-lg border p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">Staff Approval Required</p>
              <Badge variant="outline">New</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Dr. Lisa Wong has requested access to patient records</p>
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" variant="outline">
                Approve
              </Button>
              <Button size="sm" variant="outline">
                Deny
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-lg border p-3">
          <CreditCard className="mt-0.5 h-5 w-5 text-red-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Billing Alert</p>
            <p className="text-sm text-muted-foreground">5 insurance claims are pending review</p>
            <Button size="sm" variant="outline" className="mt-1">
              Review Claims
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-lg border p-3">
          <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">System Update Complete</p>
            <p className="text-sm text-muted-foreground">Electronic Health Records system has been updated to v4.2</p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-lg border p-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Inventory Alert</p>
            <p className="text-sm text-muted-foreground">Medical supplies in Cardiology department are running low</p>
            <Button size="sm" variant="outline" className="mt-1">
              Order Supplies
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

