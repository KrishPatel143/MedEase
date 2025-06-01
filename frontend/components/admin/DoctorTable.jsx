import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DoctorTableRow } from "./DoctorTableRow"

export function DoctorTable({ doctorData, onEdit, onManage, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctorData.map((doctor) => (
          <DoctorTableRow
            key={doctor._id}
            doctor={doctor}
            onEdit={onEdit}
            onManage={onManage}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  )
}