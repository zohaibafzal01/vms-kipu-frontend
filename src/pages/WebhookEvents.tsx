import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Filter, Eye, RefreshCw, Shield, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

// Mock data
const webhookEvents = [
  {
    id: 1,
    timestamp: new Date("2024-01-15T14:28:15"),
    status: "success" as const,
    eventType: "patient.admitted",
    signatureValid: true,
    retryCount: 0,
    associatedEventId: "evt_123",
    payload: {
      patient_id: "P001234",
      room: "101A",
      timestamp: "2024-01-15T14:28:15Z"
    }
  },
  {
    id: 2,
    timestamp: new Date("2024-01-15T14:25:32"),
    status: "success" as const,
    eventType: "patient.updated",
    signatureValid: true,
    retryCount: 0,
    associatedEventId: "evt_124",
    payload: {
      patient_id: "P001235",
      room: "102A",
      timestamp: "2024-01-15T14:25:32Z"
    }
  },
  {
    id: 3,
    timestamp: new Date("2024-01-15T14:20:18"),
    status: "error" as const,
    eventType: "patient.discharged",
    signatureValid: false,
    retryCount: 3,
    associatedEventId: null,
    payload: {
      patient_id: "P001236",
      timestamp: "2024-01-15T14:20:18Z"
    }
  },
  {
    id: 4,
    timestamp: new Date("2024-01-15T14:15:44"),
    status: "pending" as const,
    eventType: "patient.transferred",
    signatureValid: true,
    retryCount: 1,
    associatedEventId: null,
    payload: {
      patient_id: "P001237",
      from_room: "103A",
      to_room: "104A",
      timestamp: "2024-01-15T14:15:44Z"
    }
  },
]

export default function WebhookEvents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<typeof webhookEvents[0] | null>(null)

  const filteredEvents = webhookEvents.filter(event => {
    const matchesSearch = searchTerm === "" || 
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toString().includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleRetry = (eventId: number) => {
    // In real app, this would trigger a retry
    console.log("Retrying webhook event:", eventId)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Webhook Events</h1>
          <p className="text-muted-foreground">Monitor incoming webhook events and their processing status</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{webhookEvents.length}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-success">
                  {webhookEvents.filter(e => e.status === "success").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">
                  {webhookEvents.filter(e => e.status === "error").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">
                  {webhookEvents.filter(e => e.status === "pending").length}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Search by event type or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Event History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signature</TableHead>
                <TableHead>Retries</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">#{event.id}</TableCell>
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
                    <Badge variant="outline">{event.eventType}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={event.status}>
                      {event.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {event.signatureValid ? (
                      <Badge variant="outline" className="text-success border-success/20 bg-success/10">
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Invalid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {event.retryCount > 0 ? (
                      <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10">
                        {event.retryCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
                            <DialogTitle>Webhook Event Details</DialogTitle>
                          </DialogHeader>
                          {selectedEvent && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Event ID</label>
                                  <p className="text-sm text-muted-foreground">#{selectedEvent.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Timestamp</label>
                                  <p className="text-sm text-muted-foreground">
                                    {format(selectedEvent.timestamp, "PPpp")}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Event Type</label>
                                  <p><Badge variant="outline">{selectedEvent.eventType}</Badge></p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <p><StatusBadge status={selectedEvent.status}>{selectedEvent.status}</StatusBadge></p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Signature Valid</label>
                                  <p>{selectedEvent.signatureValid ? "✅ Yes" : "❌ No"}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Retry Count</label>
                                  <p className="text-sm text-muted-foreground">{selectedEvent.retryCount}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Raw Payload</label>
                                <pre className="mt-2 p-4 bg-muted rounded-md text-xs overflow-auto">
                                  {JSON.stringify(selectedEvent.payload, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {event.status === "error" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRetry(event.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}