import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Eye } from "lucide-react"
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
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
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
                <SelectItem value="error">Error</SelectItem>
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
                <TableHead>Errors</TableHead>
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
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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