import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExportCSVModal } from "@/components/modals/ExportCSVModal"
import { DateRangeModal } from "@/components/modals/DateRangeModal"
import { Search, Filter, Eye, Calendar as CalendarIcon, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"

// Mock data
const eventHistory = [
  {
    id: 1,
    patientName: "John Smith",
    patientId: "P001234",
    eventType: "ADMISSION",
    status: 'COMPLETED',
    timestamp: new Date("2024-01-15T14:28:15"),
    changes: {
      room: { from: null, to: "Building A, Room 101, Bed A" },
      status: { from: "Outpatient", to: "Inpatient" }
    }
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    patientId: "P001235",
    eventType: "UPDATE",
    status: 'ACKNOWLEDGED',
    timestamp: new Date("2024-01-15T14:25:32"),
    changes: {
      room: { from: "Building A, Room 101, Bed B", to: "Building A, Room 102, Bed A" },
      status: { from: "Inpatient", to: "Inpatient" }
    }
  },
  {
    id: 3,
    patientName: "Mike Davis",
    patientId: "P001236",
    eventType: "DISCHARGE",
    status: 'COMPLETED',
    timestamp: new Date("2024-01-15T14:20:18"),
    changes: {
      room: { from: "Building B, Room 201, Bed A", to: null },
      status: { from: "Inpatient", to: "Discharged" }
    }
  },
  {
    id: 4,
    patientName: "Emily Brown",
    patientId: "P001237",
    eventType: "ADMISSION",
    status: 'COMPLETED',
    timestamp: new Date("2024-01-15T14:15:44"),
    changes: {
      room: { from: null, to: "Building A, Room 103, Bed B" },
      status: { from: "Outpatient", to: "Inpatient" }
    }
  },
]

const eventTypeColors = {
  ADMISSION: "success" as const,
  DISCHARGE: "warning" as const,
  UPDATE: "outline" as const
}

const statusTypeColors = {
  COMPLETED: "success" as const,
  ACKNOWLEDGED: "outline" as const
}

export default function EventHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<typeof eventHistory[0] | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleDateRangeSelect = (from: Date | undefined, to: Date | undefined) => {
    console.log("Date range selected:", from, to)
  }

  const filteredEvents = eventHistory.filter(event => {
    const matchesSearch = searchTerm === "" || 
      event.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEventType = eventTypeFilter === "all" || event.eventType === eventTypeFilter

    return matchesSearch && matchesEventType
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event History</h1>
          <p className="text-muted-foreground">Track patient events and data changes</p>
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
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {/* <Button variant="outline" onClick={() => setShowExportModal(true)} className="gap-2">
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
                <TableHead>Event Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                      <div className="font-medium">{event.patientId}</div>
                  </TableCell>
                  <TableCell>
                      <div className="font-medium">{event.patientName}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={eventTypeColors[event.eventType]}>
                      {event.eventType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {format(event.timestamp, "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(event.timestamp, "HH:mm:ss")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {Object.entries(event.changes).map(([key, change]) => (
                        <div key={key} className="text-xs">
                          <span className="font-medium capitalize">{key}:</span>{" "}
                          {change.from ? (
                            <>
                              <span className="text-muted-foreground">{change.from}</span> → <span className="text-primary">{change.to}</span>
                            </>
                          ) : (
                            <span className="text-success">{change.to}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusTypeColors[event.status]}>
                      {event.status}
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
                          <DialogTitle>Event Details</DialogTitle>
                        </DialogHeader>
                        {selectedEvent && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Patient Name</label>
                                <p className="text-sm text-muted-foreground">{selectedEvent.patientName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Patient ID</label>
                                <p className="text-sm text-muted-foreground">{selectedEvent.patientId}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Event Type</label>
                                <p><Badge variant={eventTypeColors[selectedEvent.eventType]}>{selectedEvent.eventType}</Badge></p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Timestamp</label>
                                <p className="text-sm text-muted-foreground">
                                  {format(selectedEvent.timestamp, "PPpp")}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Changes</label>
                              <div className="mt-2 space-y-2">
                                {Object.entries(selectedEvent.changes).map(([key, change]) => (
                                  <div key={key} className="p-3 bg-muted rounded-md">
                                    <div className="font-medium capitalize">{key}</div>
                                    <div className="mt-1 text-sm">
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">From:</span>
                                        <span>{change.from || "N/A"}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">To:</span>
                                        <span>{change.to || "N/A"}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
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
        availableColumns={["patientName", "patientId", "eventType", "timestamp", "changes"]}
      />

      <DateRangeModal 
        open={showDateModal} 
        onOpenChange={setShowDateModal}
        onDateRangeSelect={handleDateRangeSelect}
      />
    </div>
  )
}