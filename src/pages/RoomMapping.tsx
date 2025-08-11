import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import kipuApi from "@/api/kipu";
import { useToast } from "@/hooks/use-toast";

interface RoomMapping {
  id: number;
  building_name: string;
  room_name: string;
  bed_name: string;
  mapped_building?: string;
  mapped_wing?: string;
  mapped_zone?: string;
  mapped_room?: string;
  mapped_bed?: string;
  created_at?: string;
  status?: string;
}

interface MappingFormValues {
  building_name: string;
  room_name: string;
  bed_name: string;
  mapped_building: string;
  mapped_wing: string;
  mapped_zone: string;
  mapped_room: string;
  mapped_bed: string;
}

interface AddMappingFormValues extends MappingFormValues {
  building_name: string;
  room_name: string;
  bed_name: string;
}

const mappingSchema = Yup.object().shape({
  building_name: Yup.string().required("Kipu Building is required"),
  room_name: Yup.string().required("Kipu Room is required"),
  bed_name: Yup.string().required("Kipu Bed is required"),
  mapped_building: Yup.string().required("VMS Building is required"),
  mapped_wing: Yup.string().required("VMS Wing is required"),
  mapped_zone: Yup.string().required("VMS Zone is required"),
  mapped_room: Yup.string().required("VMS Room is required"),
  mapped_bed: Yup.string().required("VMS Bed is required"),
});

const addMappingSchema = Yup.object().shape({
  building_name: Yup.string().required("Kipu Building is required"),
  room_name: Yup.string().required("Kipu Room is required"),
  bed_name: Yup.string().required("Kipu Bed is required"),
  mapped_building: Yup.string().required("VMS Building is required"),
  mapped_wing: Yup.string().required("VMS Wing is required"),
  mapped_zone: Yup.string().required("VMS Zone is required"),
  mapped_room: Yup.string().required("VMS Room is required"),
  mapped_bed: Yup.string().required("VMS Bed is required"),
});

export default function RoomMapping() {
  const { toast } = useToast();
  const [roomMappings, setRoomMappings] = useState<RoomMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [editingMapping, setEditingMapping] = useState<RoomMapping | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [mappingToDelete, setMappingToDelete] = useState<RoomMapping | null>(
    null
  );

  useEffect(() => {
    const fetchRoomMappings = async () => {
      setIsLoading(true);
      try {
        const res = await kipuApi.getRoomMapping(page, limit);

        setRoomMappings(res?.data);
        setTotalPages(res?.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch room mappings:", error);
        toast({
          title: "Error",
          description: "Failed to load room mappings. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomMappings();
  }, [page, limit]);

  const handleEditMapping = (mapping: RoomMapping) => {
    setEditingMapping(mapping);
    setIsDialogOpen(true);
  };

  const handleAddMapping = () => {
    setEditingMapping(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMapping(null);
    setIsSaving(false);
  };

  const handleDeleteClick = (mapping: RoomMapping) => {
    setMappingToDelete(mapping);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (mappingToDelete) {
      try {
        await kipuApi.deleteRoomMapping(mappingToDelete.id);

        // Refresh the data
        const res = await kipuApi.getRoomMapping(page, limit);
        setRoomMappings(res?.data);
        setTotalPages(res?.pagination?.totalPages || 1);

        setDeleteConfirmOpen(false);
        setMappingToDelete(null);

        // Show success toast
        toast({
          title: "Room mapping deleted",
          description: `Successfully deleted mapping for ${mappingToDelete.building_name} - Room ${mappingToDelete.room_name}, Bed ${mappingToDelete.bed_name}`,
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to delete mapping:", error);
        toast({
          title: "Error",
          description: "Failed to delete room mapping. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setMappingToDelete(null);
  };

  const handleSaveMapping = async (
    values: MappingFormValues | AddMappingFormValues,
    id: number | null
  ) => {
    setIsSaving(true);
    try {
      if (id !== null) {
        // Update existing mapping
        await kipuApi.updateRoomMapping(id, values);
        const editValues = values as MappingFormValues;
        toast({
          title: "Room mapping updated",
          description: `Successfully updated mapping for ${editValues.building_name} - Room ${editValues.room_name}, Bed ${editValues.bed_name}`,
          variant: "default",
        });
      } else {
        // Add new mapping
        await kipuApi.createRoomMapping(values);
        const addValues = values as AddMappingFormValues;
        toast({
          title: "Room mapping created",
          description: `Successfully mapped ${addValues.building_name} - Room ${addValues.room_name}, Bed ${addValues.bed_name}`,
          variant: "default",
        });
      }

      // Refresh the data
      const res = await kipuApi.getRoomMapping(page, limit);
      setRoomMappings(res?.data);
      setTotalPages(res?.pagination?.totalPages || 1);

      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save mapping:", error);
      toast({
        title: "Error",
        description:
          id !== null
            ? "Failed to update room mapping. Please try again."
            : "Failed to create room mapping. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "mapped":
        return (
          <Badge
            variant="outline"
            className="text-success border-success/20 bg-success/10"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Mapped
          </Badge>
        );
      case "unmapped":
        return (
          <Badge
            variant="outline"
            className="text-warning border-warning/20 bg-warning/10"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unmapped
          </Badge>
        );
      case "conflict":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Conflict
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Mapping</h1>
          <p className="text-muted-foreground">
            Manage mappings between Kipu and VMS room structures
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Excel
          </Button> */}
          <Button
            variant="medical"
            className="gap-2"
            onClick={handleAddMapping}
          >
            <Plus className="h-4 w-4" />
            Add Mapping
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      {/* <div className="grid gap-4 md:grid-cols-4">
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
      </div> */}

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
                <TableHead>Created At</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="w-full h-[300px] flex justify-center items-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                roomMappings.map((mapping) => (
                  <TableRow key={mapping?.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {mapping?.building_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Room {mapping?.room_name}, Bed {mapping?.bed_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {mapping.status === "unmapped" ? (
                        <span className="text-muted-foreground italic">
                          Not mapped
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-sm">
                            {mapping?.mapped_building} - {mapping?.mapped_wing}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Room {mapping?.mapped_room} / Bed{" "}
                            {mapping?.mapped_bed}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {mapping?.created_at
                        ? new Date(mapping?.created_at).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "-"}
                    </TableCell>
                    {/* <TableCell>{getStatusBadge(mapping?.status || "unmapped")}</TableCell> */}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMapping(mapping)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(mapping)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Mapping Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMapping ? "Edit Room Mapping" : "Add Room Mapping"}
            </DialogTitle>
          </DialogHeader>
          {editingMapping ? (
            <Formik
              initialValues={{
                building_name: editingMapping?.building_name || "",
                room_name: editingMapping?.room_name || "",
                bed_name: editingMapping?.bed_name || "",
                mapped_building: editingMapping?.mapped_building || "",
                mapped_wing: editingMapping?.mapped_wing || "",
                mapped_zone: editingMapping?.mapped_zone || "",
                mapped_room: editingMapping?.mapped_room || "",
                mapped_bed: editingMapping?.mapped_bed || "",
              }}
              validationSchema={mappingSchema}
              onSubmit={(values) =>
                handleSaveMapping(values, editingMapping.id)
              }
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-3">Kipu Location</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="building_name">Building</Label>
                        <Field
                          as={Input}
                          id="building_name"
                          name="building_name"
                          placeholder="Main Hospital"
                          className={
                            errors.building_name && touched.building_name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.building_name && touched.building_name && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.building_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="room_name">Room</Label>
                        <Field
                          as={Input}
                          id="room_name"
                          name="room_name"
                          placeholder="101"
                          className={
                            errors.room_name && touched.room_name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.room_name && touched.room_name && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.room_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="bed_name">Bed</Label>
                        <Field
                          as={Input}
                          id="bed_name"
                          name="bed_name"
                          placeholder="A"
                          className={
                            errors.bed_name && touched.bed_name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.bed_name && touched.bed_name && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.bed_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">VMS Mapping</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mapped_building">Building</Label>
                        <Field
                          as={Input}
                          id="mapped_building"
                          name="mapped_building"
                          placeholder="Building A"
                          className={
                            errors.mapped_building && touched.mapped_building
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_building && touched.mapped_building && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_building}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mapped_wing">Wing</Label>
                        <Field
                          as={Input}
                          id="mapped_wing"
                          name="mapped_wing"
                          placeholder="East"
                          className={
                            errors.mapped_wing && touched.mapped_wing
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_wing && touched.mapped_wing && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_wing}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mapped_zone">Zone</Label>
                        <Field
                          as={Input}
                          id="mapped_zone"
                          name="mapped_zone"
                          placeholder="Medical"
                          className={
                            errors.mapped_zone && touched.mapped_zone
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_zone && touched.mapped_zone && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_zone}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mapped_room">Room</Label>
                        <Field
                          as={Input}
                          id="mapped_room"
                          name="mapped_room"
                          placeholder="101"
                          className={
                            errors.mapped_room && touched.mapped_room
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_room && touched.mapped_room && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_room}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="mapped_bed">Bed</Label>
                        <Field
                          as={Input}
                          id="mapped_bed"
                          name="mapped_bed"
                          placeholder="A"
                          className={
                            errors.mapped_bed && touched.mapped_bed
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_bed && touched.mapped_bed && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_bed}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="medical" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{
                building_name: "",
                room_name: "",
                bed_name: "",
                mapped_building: "",
                mapped_wing: "",
                mapped_zone: "",
                mapped_room: "",
                mapped_bed: "",
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
                        <Label htmlFor="building_name">Building</Label>
                        <Field
                          as={Input}
                          id="building_name"
                          name="building_name"
                          placeholder="Main Hospital"
                          className={
                            errors.building_name && touched.building_name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.building_name && touched.building_name && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.building_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="room_name">Room</Label>
                        <Field
                          as={Input}
                          id="room_name"
                          name="room_name"
                          placeholder="101"
                          className={
                            errors.room_name && touched.room_name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.room_name && touched.room_name && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.room_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="bed_name">Bed</Label>
                        <Field
                          as={Input}
                          id="bed_name"
                          name="bed_name"
                          placeholder="A"
                          className={
                            errors.bed_name && touched.bed_name
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.bed_name && touched.bed_name && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.bed_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">VMS Mapping</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mapped_building">Building</Label>
                        <Field
                          as={Input}
                          id="mapped_building"
                          name="mapped_building"
                          placeholder="Building A"
                          className={
                            errors.mapped_building && touched.mapped_building
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_building && touched.mapped_building && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_building}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mapped_wing">Wing</Label>
                        <Field
                          as={Input}
                          id="mapped_wing"
                          name="mapped_wing"
                          placeholder="East"
                          className={
                            errors.mapped_wing && touched.mapped_wing
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_wing && touched.mapped_wing && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_wing}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mapped_zone">Zone</Label>
                        <Field
                          as={Input}
                          id="mapped_zone"
                          name="mapped_zone"
                          placeholder="Medical"
                          className={
                            errors.mapped_zone && touched.mapped_zone
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_zone && touched.mapped_zone && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_zone}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mapped_room">Room</Label>
                        <Field
                          as={Input}
                          id="mapped_room"
                          name="mapped_room"
                          placeholder="101"
                          className={
                            errors.mapped_room && touched.mapped_room
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_room && touched.mapped_room && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_room}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="mapped_bed">Bed</Label>
                        <Field
                          as={Input}
                          id="mapped_bed"
                          name="mapped_bed"
                          placeholder="A"
                          className={
                            errors.mapped_bed && touched.mapped_bed
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.mapped_bed && touched.mapped_bed && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.mapped_bed}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="medical" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Mapping"
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room Mapping</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this room mapping? This action
              cannot be undone.
              {mappingToDelete && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <div className="font-medium text-sm">
                    {mappingToDelete.building_name} - Room{" "}
                    {mappingToDelete.room_name}, Bed {mappingToDelete.bed_name}
                  </div>
                  {mappingToDelete.mapped_building && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Mapped to: {mappingToDelete.mapped_building} -{" "}
                      {mappingToDelete.mapped_wing}, Room{" "}
                      {mappingToDelete.mapped_room}, Bed{" "}
                      {mappingToDelete.mapped_bed}
                    </div>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
