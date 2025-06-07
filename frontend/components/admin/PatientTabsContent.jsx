
import { TabsContent } from "@/components/ui/tabs"
import { PatientTable } from "./PatientTable"

export function PatientTabsContent({ 
  patientData, 
  onEdit, 
  onDelete 
}) {
  const filterPatientsByGender = (gender) => {
    if (gender === "all") return patientData
    return patientData.filter(patient => 
      patient.gender?.toLowerCase() === gender.toLowerCase()
    )
  }

  const getRecentPatients = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return patientData.filter(patient => 
      new Date(patient.createdAt) >= thirtyDaysAgo
    )
  }

  return (
    <>
      <TabsContent value="all">
        <PatientTable 
          patientData={patientData}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="male">
        <PatientTable 
          patientData={filterPatientsByGender("male")}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="female">
        <PatientTable 
          patientData={filterPatientsByGender("female")}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="recent">
        <PatientTable 
          patientData={getRecentPatients()}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
    </>
  )
}
