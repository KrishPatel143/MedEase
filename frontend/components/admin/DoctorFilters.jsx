import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

export function DoctorFilters({ statusFilter, departmentFilter, onStatusFilterChange, onDepartmentFilterChange, onFilterClick }) {
  return (
    <div className="flex items-center gap-2">
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="on_leave">On Leave</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="Cardiology">Cardiology</SelectItem>
          <SelectItem value="Neurology">Neurology</SelectItem>
          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
          <SelectItem value="Emergency">Emergency</SelectItem>
          <SelectItem value="General">General</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={onFilterClick}>
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  )
}