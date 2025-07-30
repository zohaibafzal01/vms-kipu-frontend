import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExportCSVModal } from "@/components/modals/ExportCSVModal";
import { DateRangeModal } from "@/components/modals/DateRangeModal";
import { Search, Filter, Eye, RefreshCw, Loader2 } from "lucide-react";
import { format } from "date-fns";
import patientApi from "@/api/patient";

const statusTypeColors = {
  active: "success" as const,
  discharged: "destructive" as const,
};

const sourceTypeColors = {
  polling: "outline" as const,
  webhook: "secondary" as const,
};

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  location_name: string;
  building_name: string;
  room_name: string;
  bed_name: string;
  status: keyof typeof statusTypeColors;
  last_updated: string;
  source: keyof typeof sourceTypeColors;
  changes?: Record<string, { from: string; to: string }>;
};

export default function PatientHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<Patient | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        const res = await patientApi.getPatient(params);
        const list = res?.data ?? [];
        const pages = res?.pagination?.totalPages ?? 1;
        setPatients(list);
        setTotalPages(pages);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [page]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleDateRangeSelect = (
    from: Date | undefined,
    to: Date | undefined
  ) => {
    console.log("Date range selected:", from, to);
  };

  const filteredEvents = patients.filter((event) => {
    const fullName = `${event?.first_name ?? ""} ${event?.last_name ?? ""}`;
    return (
      searchTerm === "" ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient History</h1>
          <p className="text-muted-foreground">
            Track patient events and data changes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="ADMISSION">Admissions</SelectItem>
                <SelectItem value="DISCHARGE">Discharges</SelectItem>
                <SelectItem value="UPDATE">Updates</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Gender / Dob</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="w-full h-[300px] flex justify-center items-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                </td>
              </tr>
            ) : (
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event?.id}</TableCell>
                    <TableCell>{`${event?.first_name ?? ""} ${
                      event?.last_name ?? ""
                    }`}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          {event?.gender}
                        </div>
                        <div className="text-xs">
                          {format(new Date(event?.dob), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {[
                        event?.location_name,
                        event?.building_name,
                        event?.room_name,
                        event?.bed_name,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusTypeColors[event?.status]}>
                        {event?.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="space-y-1">
                        <div className="text-sm">
                          {format(new Date(event.last_updated), "MMM dd, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(event.last_updated), "HH:mm:ss")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sourceTypeColors[event?.source]}>
                        {event?.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Patient Details</DialogTitle>
                          </DialogHeader>
                          {selectedEvent && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Patient Name
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEvent?.first_name}{" "}
                                    {selectedEvent?.last_name}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Patient ID
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEvent?.id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Status
                                  </label>
                                  <p>
                                    <Badge
                                      variant={
                                        statusTypeColors[selectedEvent?.status]
                                      }
                                    >
                                      {selectedEvent?.status}
                                    </Badge>
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Last Updated
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {format(
                                      new Date(selectedEvent?.last_updated),
                                      "PPpp"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Gender
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEvent?.gender || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Date of Birth
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEvent?.dob || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Location
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {[
                                      selectedEvent?.location_name,
                                      selectedEvent?.building_name,
                                      selectedEvent?.room_name,
                                      selectedEvent?.bed_name,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Source
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    <Badge
                                      variant={
                                        sourceTypeColors[selectedEvent?.source]
                                      }
                                    >
                                      {selectedEvent?.source}
                                    </Badge>
                                  </p>
                                </div>
                              </div>

                              {selectedEvent?.changes && (
                                <div>
                                  <label className="text-sm font-bold">
                                    Changes
                                  </label>
                                  <div className="mt-2 space-y-2">
                                    {Object.entries(selectedEvent.changes).map(
                                      ([key, change]) => (
                                        <div
                                          key={key}
                                          className="p-3 bg-muted rounded-md"
                                        >
                                          <div className="font-medium capitalize">
                                            {key}
                                          </div>
                                          <div className="mt-1 text-sm">
                                            <div className="flex items-center gap-2">
                                              <span className="text-muted-foreground">
                                                From:
                                              </span>
                                              <span>
                                                {change.from || "N/A"}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-muted-foreground">
                                                To:
                                              </span>
                                              <span>{change.to || "N/A"}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-4 text-sm">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <ExportCSVModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        dataType="Event History"
        availableColumns={[
          "patientName",
          "patientId",
          "eventType",
          "timestamp",
          "changes",
        ]}
      />

      <DateRangeModal
        open={showDateModal}
        onOpenChange={setShowDateModal}
        onDateRangeSelect={handleDateRangeSelect}
      />
    </div>
  );
}
