
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { calculateAge } from "@/lib/api/patients"

export function PatientTableRow({ patient, onEdit, onDelete }) {
  const getGenderBadge = (gender) => {
    switch (gender) {
      case "male":
        return <Badge className="bg-blue-500">Male</Badge>
      case "female":
        return <Badge className="bg-pink-500">Female</Badge>
      case "other":
        return <Badge variant="outline">Other</Badge>
      case "prefer_not_to_say":
        return <Badge variant="secondary">Prefer not to say</Badge>
      default:
        return <Badge>{gender}</Badge>
    }
  }

  const patientName = patient.userId 
    ? `${patient.userId.firstName} ${patient.userId.lastName}`
    : "N/A"

  const age = calculateAge(patient.dateOfBirth)
  const hasEmergencyContact = patient.emergencyContact?.name && patient.emergencyContact?.phoneNumber
  const medicalConditionsCount = patient.medicalHistory?.length || 0

  return (
    <TableRow>
      <TableCell className="font-medium">{patientName}</TableCell>
      <TableCell>{age} years</TableCell>
      <TableCell>{getGenderBadge(patient.gender)}</TableCell>
      <TableCell>{patient.contactNumber || patient.userId?.email || "N/A"}</TableCell>
      <TableCell>
        {hasEmergencyContact ? (
          <div className="text-sm">
            <div className="font-medium">{patient.emergencyContact.name}</div>
            <div className="text-muted-foreground">{patient.emergencyContact.phoneNumber}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">Not provided</span>
        )}
      </TableCell>
      <TableCell>
        {medicalConditionsCount > 0 ? (
          <Badge variant="outline">{medicalConditionsCount} condition{medicalConditionsCount !== 1 ? 's' : ''}</Badge>
        ) : (
          <span className="text-muted-foreground">None</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(patient)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-100"
            onClick={() => onDelete(patient)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}