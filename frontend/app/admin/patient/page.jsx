import { EnhancedPatientManagement } from "@/components/admin/EnhancedPatientManagement"
import Header from "@/components/Header"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EnhancedPatientManagement   />
    </div>
  )
}