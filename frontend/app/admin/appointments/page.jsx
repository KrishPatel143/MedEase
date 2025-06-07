import EnhancedAppointments from "@/components/admin/enhanced-appointments"
import Header from "@/components/Header"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EnhancedAppointments/>
    </div>
  )
}