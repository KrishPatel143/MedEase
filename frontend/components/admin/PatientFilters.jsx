import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

export function PatientFilters({ genderFilter, ageRangeFilter, onGenderFilterChange, onAgeRangeFilterChange, onFilterClick }) {
  return (
    <div className="flex items-center gap-2">
      <Select value={genderFilter} onValueChange={onGenderFilterChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
        </SelectContent>
      </Select>
      <Select value={ageRangeFilter} onValueChange={onAgeRangeFilterChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Age Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ages</SelectItem>
          <SelectItem value="0-18">0-18 years</SelectItem>
          <SelectItem value="19-35">19-35 years</SelectItem>
          <SelectItem value="36-55">36-55 years</SelectItem>
          <SelectItem value="56+">56+ years</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={onFilterClick}>
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  )
}
