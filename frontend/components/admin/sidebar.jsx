"use client"

import  React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Calendar, CreditCard, Settings, LifeBuoy, LogOut } from "lucide-react"



export function Sidebar({ className }) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">MedEase</h2>
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
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Settings</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              General
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LifeBuoy className="mr-2 h-4 w-4" />
              Support
            </Button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 absolute bottom-4 w-full">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

