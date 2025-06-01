import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">MedEase</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A comprehensive medical management system for hospitals and clinics
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>    
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage staff, appointments, and finances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center text-blue-600 mb-4">🧑‍💼</div>
              <p className="text-sm text-gray-500">
                Access comprehensive analytics, staff management, and financial reports
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/admin" className="w-full">
                <Button className="w-full">Access Admin</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Staff Interface</CardTitle>
              <CardDescription>Manage patient flow and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center text-blue-600 mb-4">👩‍⚕️</div>
              <p className="text-sm text-gray-500">
                Quick patient check-in/out, appointment management, and patient history
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/staff" className="w-full">
                <Button className="w-full">Access Staff</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Patient Interface</CardTitle>
              <CardDescription>Book appointments and access services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center text-blue-600 mb-4">👨‍⚕️</div>
              <p className="text-sm text-gray-500">
                Easily book appointments, view history, and access hospital services
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/patient" className="w-full">
                <Button className="w-full">Access Patient</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

