import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/admin/header"
import { Sidebar } from "@/components/admin/sidebar"
import { EnhancedDoctorManagement } from "@/components/admin/enhanced-staff-management"
import { EnhancedFinances } from "@/components/admin/enhanced-finances"
import { EnhancedNotifications } from "@/components/admin/enhanced-notifications"
import EnhancedAppointments from "@/components/admin/enhanced-appointments"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <Sidebar />
        </aside>
        <main className="flex w-full flex-col gap-4 p-4 md:gap-8 md:p-6">
        
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staff">Staff Management</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid ">
                <EnhancedNotifications />
             
              </div>
            </TabsContent>
            <TabsContent value="staff" className="space-y-4">
              <EnhancedDoctorManagement />
            </TabsContent>
            <TabsContent value="appointments" className="space-y-4">
              <EnhancedAppointments />
            </TabsContent>
            <TabsContent value="finances" className="space-y-4">
              <EnhancedFinances />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

