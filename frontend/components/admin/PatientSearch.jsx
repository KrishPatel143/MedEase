import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function PatientSearch({ searchTerm, onSearchChange, placeholder = "Search patients..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder={placeholder}
        className="w-[200px] pl-8 md:w-[300px]" 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}
