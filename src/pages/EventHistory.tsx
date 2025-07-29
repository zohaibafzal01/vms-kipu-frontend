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
import kipuApi from "@/api/kipu";
import { useDebounce } from "@/lib/hooks/useDebounce";

const eventTypeColors = {
  ADMISSION: "success" as const,
  DISCHARGE: "warning" as const,
  UPDATE: "outline" as const,
};

const statusTypeColors = {
  COMPLETED: "success" as const,
  ACKNOWLEDGED: "outline" as const,
};

export default function EventHistory() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page,
          limit: 10,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (eventTypeFilter !== "all") params.event = eventTypeFilter;

        const res = await kipuApi.getEvents(params);
        setEvents(res.data);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [page, debouncedSearch, eventTypeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event History</h1>
          <p className="text-muted-foreground">
            Track patient events and data changes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient ID or event ID..."
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={eventTypeFilter}
              onValueChange={(value) => {
                setPage(1);
                setEventTypeFilter(value);
              }}
            >
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

      <Card>
        <CardHeader>
          <CardTitle>Patient Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="w-full h-[300px] flex justify-center items-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.id}</TableCell>
                    <TableCell>{event.patient_id}</TableCell>
                    <TableCell>
                      <Badge variant={eventTypeColors[event.event_type]}>
                        {event.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {format(new Date(event.timestamp), "MMM dd, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(event.timestamp), "HH:mm:ss")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{event.source}</Badge>
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
                            <DialogTitle>Event Details</DialogTitle>
                          </DialogHeader>
                          {selectedEvent && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Patient ID
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEvent.patient_id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Event Type
                                  </label>
                                  <p>
                                    <Badge
                                      variant={
                                        eventTypeColors[
                                          selectedEvent.event_type
                                        ]
                                      }
                                    >
                                      {selectedEvent.event_type}
                                    </Badge>
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Timestamp
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {format(
                                      new Date(selectedEvent.timestamp),
                                      "PPpp"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Source
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEvent.source}
                                  </p>
                                </div>
                              </div>
                              {selectedEvent?.diff_json && (
                                <div className="mt-6">
                                  <h4 className="font-semibold text-base">
                                    Changes
                                  </h4>
                                  <div className="mt-2 space-y-2">
                                    {Object.entries(
                                      selectedEvent.diff_json
                                    ).map(([key, value]: [string, any]) => (
                                      <div
                                        key={key}
                                        className="p-3 bg-muted rounded-md text-sm"
                                      >
                                        <div className="font-medium capitalize">
                                          {key}
                                        </div>
                                        <div className="mt-1">
                                          {value.old !== undefined && (
                                            <div className="text-muted-foreground">
                                              Old: {String(value.old)}
                                            </div>
                                          )}
                                          {value.new !== undefined && (
                                            <div className="text-primary">
                                              New: {String(value.new)}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
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
        availableColumns={["id", "patient_id", "event_type", "timestamp"]}
      />

      <DateRangeModal
        open={showDateModal}
        onOpenChange={setShowDateModal}
        onDateRangeSelect={() => {}}
      />
    </div>
  );
}
