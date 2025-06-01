import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HospitalServices() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Hospital Services</CardTitle>
        <CardDescription>Explore our comprehensive range of medical services</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
          </TabsList>
          <TabsContent value="departments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">🫀 Cardiology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive care for heart conditions, including diagnostic tests, interventional procedures, and
                    cardiac rehabilitation.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">🧠 Neurology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Specialized care for disorders of the brain, spine, and nervous system, including stroke, epilepsy,
                    and neurodegenerative diseases.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">🦴 Orthopedics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Treatment for musculoskeletal conditions, including joint replacements, sports injuries, and spine
                    disorders.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">👶 Pediatrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive healthcare for infants, children, and adolescents, including preventive care,
                    immunizations, and treatment for illnesses.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">🦷 Dental</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Complete dental care, including preventive services, restorative procedures, orthodontics, and oral
                    surgery.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">👁️ Ophthalmology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive eye care, including routine exams, treatment for eye diseases, and surgical
                    procedures.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="specialties">
            <div className="text-center p-12 text-muted-foreground">
              Specialty services information will be displayed here
            </div>
          </TabsContent>
          <TabsContent value="facilities">
            <div className="text-center p-12 text-muted-foreground">Facility information will be displayed here</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

