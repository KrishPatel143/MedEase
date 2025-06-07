import { EnhancedDoctorManagement } from "@/components/admin/enhanced-staff-management"
import Header from "@/components/Header"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EnhancedDoctorManagement/>
    </div>
  )
}