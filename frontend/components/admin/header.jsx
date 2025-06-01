import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Menu, Search } from "lucide-react"
import { MobileNav } from "./mobile-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <MobileNav />
        </SheetContent>
      </Sheet>
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4 md:justify-end">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-[200px] pl-8 md:w-[240px] lg:w-[320px]" />
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
      <Button variant="outline" size="icon" className="md:hidden">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <Avatar className="md:hidden">
        <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </header>
  )
}

