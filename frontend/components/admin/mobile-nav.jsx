import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Users, Calendar, CreditCard, Settings, LifeBuoy, LogOut } from "lucide-react"

export function MobileNav() {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
      <div className="flex flex-col gap-4 p-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">MedEase</span>
        </Link>
        <div className="space-y-1">
          <Button variant="secondary" className="w-full justify-start">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Staff Management
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Appointments
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Finances
          </Button>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-semibold tracking-tight">Settings</div>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            General
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <LifeBuoy className="mr-2 h-4 w-4" />
            Support
          </Button>
        </div>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}

