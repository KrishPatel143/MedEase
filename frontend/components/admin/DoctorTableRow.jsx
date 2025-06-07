import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, UserCog } from "lucide-react"

export function DoctorTableRow({ doctor, onEdit, onManage, onDelete }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "on_leave":
        return <Badge variant="outline">On Leave</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const doctorName = doctor.userId 
    ? `Dr. ${doctor.userId.firstName} ${doctor.userId.lastName}`
    : "N/A"

  return (
    <TableRow>
      <TableCell className="font-medium">{doctorName}</TableCell>
      <TableCell>{doctor.specialization}</TableCell>
      <TableCell>{doctor.department}</TableCell>
      <TableCell>{doctor.experience} years</TableCell>
      <TableCell>£{doctor.consultationFee}</TableCell>
      <TableCell>{getStatusBadge(doctor.status)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(doctor)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-100"
            onClick={() => onDelete(doctor)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}