import { EnhancedFinances } from "@/components/admin/enhanced-finances"
import Header from "@/components/Header"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EnhancedFinances  />
    </div>
  )
}