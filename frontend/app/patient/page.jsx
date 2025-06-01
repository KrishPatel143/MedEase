import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HospitalServices } from "@/components/patient/hospital-services"
import EnhancedAppointmentBooking from "@/components/patient/enhanced-appointment-booking"
import MyAppointments from "@/components/patient/my-appointments"

export default function PatientDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Patient Portal</h1>
        </div>
      </header>
      <main className="flex w-full flex-col gap-4 p-4 md:gap-8 md:p-6">
        
        <Tabs defaultValue="book" className="space-y-4">
          <TabsList>
            <TabsTrigger value="book">📅 Book Appointment</TabsTrigger>
            <TabsTrigger value="my-appointments">📋 My Appointments</TabsTrigger>
          </TabsList>
          <TabsContent value="book" className="space-y-4">
            <EnhancedAppointmentBooking />
          </TabsContent>
          <TabsContent value="my-appointments" className="space-y-4">
            <MyAppointments />
          </TabsContent>
          <TabsContent value="services" className="space-y-4">
            <HospitalServices />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  )
}

