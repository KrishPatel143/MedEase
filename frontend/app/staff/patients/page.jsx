import { PatientManagement } from "@/components/admin/PatientManagement"
import Header from "@/components/Header"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PatientManagement   />
    </div>
  )
}