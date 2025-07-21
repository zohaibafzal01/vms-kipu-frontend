import { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Upload, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react"

// Mock data
const roomMappings = [
  {
    id: 1,
    kipu: { building: "Main Hospital", room: "101", bed: "A" },
    vms: { building: "Building A", wing: "East", zone: "Medical", room: "101", bed: "A" },
    status: "mapped" as const
  },
  {
    id: 2,
    kipu: { building: "Main Hospital", room: "101", bed: "B" },
    vms: { building: "Building A", wing: "East", zone: "Medical", room: "101", bed: "B" },
    status: "mapped" as const
  },
  {
    id: 3,
    kipu: { building: "West Wing", room: "205", bed: "A" },
    vms: { building: "", wing: "", zone: "", room: "", bed: "" },
    status: "unmapped" as const
  },
  {
    id: 4,
    kipu: { building: "Main Hospital", room: "102", bed: "A" },
    vms: { building: "Building A", wing: "East", zone: "Medical", room: "102", bed: "A" },
    status: "conflict" as const
  },
]

const mappingSchema = Yup.object().shape({
  vmsBuilding: Yup.string().required("VMS Building is required"),
  vmsWing: Yup.string().required("VMS Wing is required"),
  vmsZone: Yup.string().required("VMS Zone is required"),
  vmsRoom: Yup.string().required("VMS Room is required"),
  vmsBed: Yup.string().required("VMS Bed is required"),
})

const addMappingSchema = Yup.object().shape({
  kipuBuilding: Yup.string().required("Kipu Building is required"),
  kipuRoom: Yup.string().required("Kipu Room is required"),
  kipuBed: Yup.string().required("Kipu Bed is required"),
  vmsBuilding: Yup.string().required("VMS Building is required"),
  vmsWing: Yup.string().required("VMS Wing is required"),
  vmsZone: Yup.string().required("VMS Zone is required"),
  vmsRoom: Yup.string().required("VMS Room is required"),
  vmsBed: Yup.string().required("VMS Bed is required"),
})

export default function RoomMapping() {
  const [editingMapping, setEditingMapping] = useState<typeof roomMappings[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEditMapping = (mapping: typeof roomMappings[0]) => {
    setEditingMapping(mapping)
    setIsDialogOpen(true)
  }

  const handleAddMapping = () => {
    setEditingMapping(null)
    setIsDialogOpen(true)
  }

  const handleSaveMapping = (values: any, id: number | null) => {
    if (id !== null) {
      console.log("Updating mapping with id", id, "with values", values)
    } else {
      console.log("Adding new mapping with values", values)
    }
    setIsDialogOpen(false)
    setEditingMapping(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "mapped":
        return <Badge variant="outline" className="text-success border-success/20 bg-success/10"><CheckCircle className="w-3 h-3 mr-1" />Mapped</Badge>
      case "unmapped":
        return <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10"><AlertTriangle className="w-3 h-3 mr-1" />Unmapped</Badge>
      case "conflict":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Conflict</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Mapping</h1>
          <p className="text-muted-foreground">Manage mappings between Kipu and VMS room structures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Excel
          </Button>
          <Button variant="medical" className="gap-2" onClick={handleAddMapping}>
            <Plus className="h-4 w-4" />
            Add Mapping
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold text-success">
                  {roomMappings.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mapped</p>
                <p className="text-2xl font-bold text-success">
                  {roomMappings.filter(m => m.status === "mapped").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unmapped</p>
                <p className="text-2xl font-bold text-warning">
                  {roomMappings.filter(m => m.status === "unmapped").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conflicts</p>
                <p className="text-2xl font-bold text-destructive">
                  {roomMappings.filter(m => m.status === "conflict").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Mappings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Room Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kipu Location</TableHead>
                <TableHead>VMS Mapping</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomMappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{mapping.kipu.building}</div>
                      <div className="text-sm text-muted-foreground">
                        Room {mapping.kipu.room}, Bed {mapping.kipu.bed}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {mapping.status === "unmapped" ? (
                      <span className="text-muted-foreground italic">Not mapped</span>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-sm">
                          {mapping.vms.building} - {mapping.vms.wing}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {mapping.vms.zone} / Room {mapping.vms.room} / Bed {mapping.vms.bed}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(mapping.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditMapping(mapping)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Add Mapping Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMapping ? "Edit Room Mapping" : "Add Room Mapping"}
            </DialogTitle>
          </DialogHeader>
          {editingMapping ? (
            <Formik
              initialValues={{
                vmsBuilding: editingMapping.vms.building,
                vmsWing: editingMapping.vms.wing,
                vmsZone: editingMapping.vms.zone,
                vmsRoom: editingMapping.vms.room,
                vmsBed: editingMapping.vms.bed,
              }}
              validationSchema={mappingSchema}
              onSubmit={(values) => handleSaveMapping(values, editingMapping.id)}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-3">Kipu Location</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label>Building</Label>
                        <p className="text-muted-foreground">{editingMapping.kipu.building}</p>
                      </div>
                      <div>
                        <Label>Room</Label>
                        <p className="text-muted-foreground">{editingMapping.kipu.room}</p>
                      </div>
                      <div>
                        <Label>Bed</Label>
                        <p className="text-muted-foreground">{editingMapping.kipu.bed}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">VMS Mapping</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vmsBuilding">Building</Label>
                        <Field
                          as={Input}
                          id="vmsBuilding"
                          name="vmsBuilding"
                          placeholder="Building A"
                          className={errors.vmsBuilding && touched.vmsBuilding ? "border-destructive" : ""}
                        />
                        {errors.vmsBuilding && touched.vmsBuilding && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsBuilding}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="vmsWing">Wing</Label>
                        <Field
                          as={Input}
                          id="vmsWing"
                          name="vmsWing"
                          placeholder="East"
                          className={errors.vmsWing && touched.vmsWing ? "border-destructive" : ""}
                        />
                        {errors.vmsWing && touched.vmsWing && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsWing}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="vmsZone">Zone</Label>
                        <Field
                          as={Input}
                          id="vmsZone"
                          name="vmsZone"
                          placeholder="Medical"
                          className={errors.vmsZone && touched.vmsZone ? "border-destructive" : ""}
                        />
                        {errors.vmsZone && touched.vmsZone && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsZone}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="vmsRoom">Room</Label>
                        <Field
                          as={Input}
                          id="vmsRoom"
                          name="vmsRoom"
                          placeholder="101"
                          className={errors.vmsRoom && touched.vmsRoom ? "border-destructive" : ""}
                        />
                        {errors.vmsRoom && touched.vmsRoom && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsRoom}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="vmsBed">Bed</Label>
                        <Field
                          as={Input}
                          id="vmsBed"
                          name="vmsBed"
                          placeholder="A"
                          className={errors.vmsBed && touched.vmsBed ? "border-destructive" : ""}
                        />
                        {errors.vmsBed && touched.vmsBed && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsBed}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="medical">
                      Save Changes
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{
                kipuBuilding: "",
                kipuRoom: "",
                kipuBed: "",
                vmsBuilding: "",
                vmsWing: "",
                vmsZone: "",
                vmsRoom: "",
                vmsBed: "",
              }}
              validationSchema={addMappingSchema}
              onSubmit={(values) => handleSaveMapping(values, null)}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Kipu Location</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="kipuBuilding">Building</Label>
                        <Field
                          as={Input}
                          id="kipuBuilding"
                          name="kipuBuilding"
                          placeholder="Main Hospital"
                          className={errors.kipuBuilding && touched.kipuBuilding ? "border-destructive" : ""}
                        />
                        {errors.kipuBuilding && touched.kipuBuilding && (
                          <p className="text-sm text-destructive mt-1">{errors.kipuBuilding}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="kipuRoom">Room</Label>
                        <Field
                          as={Input}
                          id="kipuRoom"
                          name="kipuRoom"
                          placeholder="101"
                          className={errors.kipuRoom && touched.kipuRoom ? "border-destructive" : ""}
                        />
                        {errors.kipuRoom && touched.kipuRoom && (
                          <p className="text-sm text-destructive mt-1">{errors.kipuRoom}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="kipuBed">Bed</Label>
                        <Field
                          as={Input}
                          id="kipuBed"
                          name="kipuBed"
                          placeholder="A"
                          className={errors.kipuBed && touched.kipuBed ? "border-destructive" : ""}
                        />
                        {errors.kipuBed && touched.kipuBed && (
                          <p className="text-sm text-destructive mt-1">{errors.kipuBed}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">VMS Mapping</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vmsBuilding">Building</Label>
                        <Field
                          as={Input}
                          id="vmsBuilding"
                          name="vmsBuilding"
                          placeholder="Building A"
                          className={errors.vmsBuilding && touched.vmsBuilding ? "border-destructive" : ""}
                        />
                        {errors.vmsBuilding && touched.vmsBuilding && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsBuilding}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="vmsWing">Wing</Label>
                        <Field
                          as={Input}
                          id="vmsWing"
                          name="vmsWing"
                          placeholder="East"
                          className={errors.vmsWing && touched.vmsWing ? "border-destructive" : ""}
                        />
                        {errors.vmsWing && touched.vmsWing && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsWing}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="vmsZone">Zone</Label>
                        <Field
                          as={Input}
                          id="vmsZone"
                          name="vmsZone"
                          placeholder="Medical"
                          className={errors.vmsZone && touched.vmsZone ? "border-destructive" : ""}
                        />
                        {errors.vmsZone && touched.vmsZone && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsZone}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="vmsRoom">Room</Label>
                        <Field
                          as={Input}
                          id="vmsRoom"
                          name="vmsRoom"
                          placeholder="101"
                          className={errors.vmsRoom && touched.vmsRoom ? "border-destructive" : ""}
                        />
                        {errors.vmsRoom && touched.vmsRoom && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsRoom}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="vmsBed">Bed</Label>
                        <Field
                          as={Input}
                          id="vmsBed"
                          name="vmsBed"
                          placeholder="A"
                          className={errors.vmsBed && touched.vmsBed ? "border-destructive" : ""}
                        />
                        {errors.vmsBed && touched.vmsBed && (
                          <p className="text-sm text-destructive mt-1">{errors.vmsBed}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="medical">
                      Add Mapping
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}