import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { ExportCSVModal } from "@/components/modals/ExportCSVModal"
import { DateRangeModal } from "@/components/modals/DateRangeModal"
import { Search, Filter, RefreshCw, Server, Globe, Download, Calendar } from "lucide-react"
import { format } from "date-fns"

// Mock data
const vmsSyncActivity = [
  {
    id: 1,
    endpoint: "/api/patients",
    method: "POST",
    patientId: "P001234",
    timestamp: new Date("2024-01-15T14:28:15"),
    httpStatus: 201,
    responseTime: 245,
    retryCount: 0,
    status: "success" as const
  },
  {
    id: 2,
    endpoint: "/api/patients/P001235",
    method: "PUT",
    patientId: "P001235",
    timestamp: new Date("2024-01-15T14:25:32"),
    httpStatus: 200,
    responseTime: 189,
    retryCount: 0,
    status: "success" as const
  },
  {
    id: 3,
    endpoint: "/api/patients/P001236/discharge",
    method: "POST",
    patientId: "P001236",
    timestamp: new Date("2024-01-15T14:20:18"),
    httpStatus: 500,
    responseTime: 5000,
    retryCount: 3,
    status: "error" as const
  },
  {
    id: 4,
    endpoint: "/api/patients",
    method: "POST",
    patientId: "P001237",
    timestamp: new Date("2024-01-15T14:15:44"),
    httpStatus: 202,
    responseTime: 167,
    retryCount: 1,
    status: "pending" as const
  },
]

const endpointStats = {
  totalCalls: 1247,
  successRate: 98.2,
  avgResponseTime: 210,
  errorCount: 23
}

export default function VMSSync() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showTestModal, setShowTestModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle')

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleDateRangeSelect = (from: Date | undefined, to: Date | undefined) => {
    console.log("Date range selected:", from, to)
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setTestProgress(0)
    setTestResult('idle')

    // Simulate connection test
    for (let i = 0; i <= 100; i += 20) {
      setTestProgress(i)
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    // Simulate success/failure
    setTestResult(Math.random() > 0.3 ? 'success' : 'error')
    setIsTestingConnection(false)
  }
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  const filteredActivity = vmsSyncActivity.filter(activity => {
    const matchesSearch = searchTerm === "" || 
      activity.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter
    const matchesMethod = methodFilter === "all" || activity.method === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  const getHttpStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return <Badge variant="outline" className="text-success border-success/20 bg-success/10">{status}</Badge>
    } else if (status >= 400 && status < 500) {
      return <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10">{status}</Badge>
    } else if (status >= 500) {
      return <Badge variant="destructive">{status}</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const getMethodBadge = (method: string) => {
    const colors: Record<string, "outline" | "default" | "destructive" | "secondary"> = {
      GET: "outline",
      POST: "outline",
      PUT: "outline",
      DELETE: "destructive"
    }
    return <Badge variant={colors[method] || "outline"}>{method}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VMS Sync Activity</h1>
          <p className="text-muted-foreground">Monitor API calls to the VMS system</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" onClick={() => setShowDateModal(true)} className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button> */}
          {/* <Button 
            variant="outline" 
            onClick={handleRefresh} 
            className="gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button> */}
          {/* <Button variant="outline" onClick={() => setShowExportModal(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button> */}
          <Button variant="medical" onClick={() => setShowTestModal(true)} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Test Connection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total API Calls</p>
                <p className="text-2xl font-bold">{endpointStats.totalCalls.toLocaleString()}</p>
              </div>
              <Server className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-success">{endpointStats.successRate}%</p>
              </div>
              <Globe className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{endpointStats.avgResponseTime}ms</p>
              </div>
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors (24h)</p>
                <p className="text-2xl font-bold text-destructive">{endpointStats.errorCount}</p>
              </div>
              <Server className="h-8 w-8 text-destructive" />
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
                  placeholder="Search by patient ID or endpoint..."
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
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* API Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>HTTP Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retries</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-mono text-sm">{activity.endpoint}</TableCell>
                  <TableCell>{getMethodBadge(activity.method)}</TableCell>
                  <TableCell className="font-medium">{activity.patientId}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {format(activity.timestamp, "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(activity.timestamp, "HH:mm:ss")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getHttpStatusBadge(activity.httpStatus)}</TableCell>
                  <TableCell>
                    <span className={activity.responseTime > 1000 ? "text-warning" : "text-muted-foreground"}>
                      {activity.responseTime}ms
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={activity.status}>
                      {activity.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {activity.retryCount > 0 ? (
                      <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10">
                        {activity.retryCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* API Endpoints Summary */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Endpoint Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">/api/patients</span>
                  <Badge variant="outline">POST</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  845 calls • 98.9% success • 195ms avg
                </div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">/api/patients/:id</span>
                  <Badge variant="outline">PUT</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  312 calls • 97.1% success • 210ms avg
                </div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">/api/patients/:id/discharge</span>
                  <Badge variant="outline">POST</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  90 calls • 95.6% success • 285ms avg
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* <ExportCSVModal 
        open={showExportModal} 
        onOpenChange={setShowExportModal}
        dataType="VMS Sync Activity"
        availableColumns={["id", "timestamp", "endpoint", "patientId", "httpStatus", "responseTime", "retryCount"]}
      />

      <DateRangeModal 
        open={showDateModal} 
        onOpenChange={setShowDateModal}
        onDateRangeSelect={handleDateRangeSelect}
      /> */}
    </div>
  )
}