import { useState } from "react";
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
import {
  Search,
  Filter,
  Eye,
  Calendar as CalendarIcon,
  Download,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

// Mock data
const patientHistory = [
  {
    id: "8c2b5a2e-7d8f-4a9a-9f00-92c64f56d2af",
    first_name: "Alice",
    last_name: "Johnson",
    gender: "Female",
    dob: "1985-04-12",
    location_name: "Ward A",
    building_name: "Main Hospital",
    room_name: "101",
    bed_name: "A1",
    status: "active",
    last_updated: "2025-07-29T10:45:00Z",
    source: "polling",
    changes: {
      status: { from: "pending", to: "active" },
      room_name: { from: "100", to: "101" },
    },
  },
  {
    id: "cc74c0e7-2f4e-4a65-91fc-3210b1e7aeaa",
    first_name: "Brian",
    last_name: "Lee",
    gender: "Male",
    dob: "1990-11-03",
    location_name: "Ward B",
    building_name: "Annex",
    room_name: "202",
    bed_name: "B2",
    status: "discharged",
    last_updated: "2025-07-27T09:30:00Z",
    source: "webhook",
    changes: {
      status: { from: "active", to: "discharged" },
    },
  },
  {
    id: "af6eb453-1f61-4ef3-9096-9c2f2b5bb540",
    first_name: "Chloe",
    last_name: "Smith",
    gender: "Female",
    dob: "2001-06-21",
    location_name: "Ward C",
    building_name: "Pediatric Center",
    room_name: "303",
    bed_name: "C3",
    status: "active",
    last_updated: "2025-07-28T15:12:00Z",
    source: "polling",
    changes: {
      bed_name: { from: "C2", to: "C3" },
    },
  },
  {
    id: "d3b314c9-019d-4c99-84b7-17fffc02b5f4",
    first_name: "Daniel",
    last_name: "Kumar",
    gender: "Male",
    dob: "1978-09-15",
    location_name: "ICU",
    building_name: "Critical Care",
    room_name: "ICU-2",
    bed_name: "IC2-B",
    status: "active",
    last_updated: "2025-07-29T07:00:00Z",
    source: "webhook",
    changes: {
      location_name: { from: "Ward D", to: "ICU" },
    },
  },
];
const statusTypeColors = {
  active: "success" as const,
  discharged: "destructive" as const,
};

const sourceTypeColors = {
  polling: "outline" as const,
  webhook: "secondary" as const,
};

export default function PatientHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<
    (typeof patientHistory)[0] | null
  >(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const filteredEvents = patientHistory.filter((event) => {
    const fullName = `${event.first_name} ${event.last_name}`;
    const matchesSearch =
      searchTerm === "" ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase());

    // If you want to filter by eventType, you need to add eventType to your mock data or skip this filter
    // For now, we'll skip eventType filtering since it's not present in the mock data
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient History</h1>
          <p className="text-muted-foreground">
            Track patient events and data changes
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" onClick={() => setShowDateModal(true)} className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Date Range
          </Button> */}
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
          {/* <Button variant="outline" onClick={() => setShowExportModal(t
          rue)} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button> */}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="ADMISSION">Admissions</SelectItem>
                <SelectItem value="DISCHARGE">Discharges</SelectItem>
                <SelectItem value="UPDATE">Updates</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Event History Table */}
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
                <TableHead>Other</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="font-medium">{event?.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{`${event?.first_name} ${event?.last_name}`}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {event?.gender}
                      </div>
                      <div className="text-xs">
                        {format(event?.dob, "MMM dd, yyyy")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {[
                        event?.location_name,
                        event?.building_name,
                        event?.room_name,
                        event?.bed_name,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusTypeColors[event?.status]}>
                      {event?.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {event?.last_updated}
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
                                <div className="mt-2 space-y-2 ">
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
                                            <span>{change.from || "N/A"}</span>
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
          </Table>
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
