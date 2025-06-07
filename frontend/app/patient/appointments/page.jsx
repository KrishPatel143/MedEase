import Header from "@/components/Header" // Import the universal header
import MyAppointments from "@/components/patient/my-appointments"

export default function PatientAppointmentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex w-full flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600">View and manage all your scheduled appointments with healthcare providers.</p>
          </div>

          {/* Appointments Component */}
          <MyAppointments />
        </div>
      </main>
    </div>
  )
}