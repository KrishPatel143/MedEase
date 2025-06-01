import { TabsContent } from "@/components/ui/tabs"
import { DoctorTable } from "./DoctorTable"

export function DoctorTabsContent({ 
  doctorData, 
  onEdit, 
  onManage, 
  onDelete 
}) {
  const filterDoctorsByDepartment = (department) => {
    if (department === "all") return doctorData
    return doctorData.filter(doctor => 
      doctor.department.toLowerCase() === department.toLowerCase()
    )
  }

  return (
    <>
      <TabsContent value="all">
        <DoctorTable 
          doctorData={doctorData}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="cardiology">
        <DoctorTable 
          doctorData={filterDoctorsByDepartment("cardiology")}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="neurology">
        <DoctorTable 
          doctorData={filterDoctorsByDepartment("neurology")}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="orthopedics">
        <DoctorTable 
          doctorData={filterDoctorsByDepartment("orthopedics")}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="pediatrics">
        <DoctorTable 
          doctorData={filterDoctorsByDepartment("pediatrics")}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="emergency">
        <DoctorTable 
          doctorData={filterDoctorsByDepartment("emergency")}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={onDelete}
        />
      </TabsContent>
    </>
  )
}