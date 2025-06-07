
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PatientTableRow } from "./PatientTableRow"

export function PatientTable({ patientData, onEdit, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Emergency Contact</TableHead>
          <TableHead>Medical History</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patientData.map((patient) => (
          <PatientTableRow
            key={patient._id}
            patient={patient}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  )
}