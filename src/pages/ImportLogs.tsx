import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExportCSVModal } from "@/components/modals/ExportCSVModal"
import { DateRangeModal } from "@/components/modals/DateRangeModal"
import { Search, Filter, Download, Eye, Calendar, RefreshCw } from "lucide-react"
import { format } from "date-fns"

// Mock data
const importLogs = [
  {
    id: 1,
    timestamp: new Date("2024-01-15T14:30:00"),
    status: "success" as const,
    patientsProcessed: 1247,
    source: "Polling",
    duration: "2m 34s",
    errors: []
  },
  {
    id: 2,
    timestamp: new Date("2024-01-15T12:30:00"),
    status: "success" as const,
    patientsProcessed: 1239,
    source: "Webhook",
    duration: "1m 12s",
    errors: []
  },
  {
    id: 3,
    timestamp: new Date("2024-01-15T10:30:00"),
    status: "error" as const,
    patientsProcessed: 0,
    source: "Polling",
    duration: "0m 45s",
    errors: ["Connection timeout", "Invalid API response"]
  },
  {
    id: 4,
    timestamp: new Date("2024-01-15T08:30:00"),
    status: "success" as const,
    patientsProcessed: 1235,
    source: "Manual",
    duration: "3m 01s",
    errors: []
  },
]

export default function ImportLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [selectedLog, setSelectedLog] = useState<typeof importLogs[0] | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleDateRangeSelect = (from: Date | undefined, to: Date | undefined) => {
    console.log("Date range selected:", from, to)
  }

  const filteredLogs = importLogs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.id.toString().includes(searchTerm) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesSource = sourceFilter === "all" || log.source.toLowerCase() === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Import Logs</h1>
          <p className="text-muted-foreground">Monitor import run history and troubleshoot issues</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" onClick={() => setShowDateModal(true)} className="gap-2">
            <Calendar className="h-4 w-4" />
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
                  placeholder="Search logs..."
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
                {/* <SelectItem value="error">Error</SelectItem> */}
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="polling">Polling</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Import Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Import Run History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Duration</TableHead>
                {/* <TableHead>Errors</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">#{log.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {format(log.timestamp, "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(log.timestamp, "HH:mm:ss")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={log.status}>
                      {log.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{log.patientsProcessed.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.source}</Badge>
                  </TableCell>
                  <TableCell>{log.duration}</TableCell>
                  {/* <TableCell>
                    {log.errors.length > 0 ? (
                      <div className="space-y-1">
                        {log.errors.map((error, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {error}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-success">
                        No errors
                      </Badge>
                    )}
                  </TableCell> */}
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Import Log Details</DialogTitle>
                        </DialogHeader>
                        {selectedLog && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Import ID</label>
                                <p className="text-sm text-muted-foreground">#{selectedLog.id}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <div className="mt-1">
                                  <StatusBadge status={selectedLog.status}>
                                    {selectedLog.status}
                                  </StatusBadge>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Started</label>
                                <p className="text-sm text-muted-foreground">
                                  {format(selectedLog.timestamp, "PPpp")}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Duration</label>
                                <p className="text-sm text-muted-foreground">{selectedLog.duration}</p>
                              </div>
                            </div>
                            {selectedLog.errors.length > 0 && (
                              <div>
                                <label className="text-sm font-medium">Errors</label>
                                <div className="mt-2 space-y-2">
                                  {selectedLog.errors.map((error, index) => (
                                    <div key={index} className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                      <p className="text-sm text-destructive">{error}</p>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExportCSVModal 
        open={showExportModal} 
        onOpenChange={setShowExportModal}
        dataType="Import Logs"
        availableColumns={["id", "timestamp", "status", "patientsProcessed", "source", "duration", "errors"]}
      />

      <DateRangeModal 
        open={showDateModal} 
        onOpenChange={setShowDateModal}
        onDateRangeSelect={handleDateRangeSelect}
      />
    </div>
  )
}