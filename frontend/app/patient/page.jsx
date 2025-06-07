import Header from "@/components/Header" // Import the universal header
import EnhancedAppointmentBooking from "@/components/patient/enhanced-appointment-booking"

export default function PatientDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EnhancedAppointmentBooking />

    </div>
  )
} 