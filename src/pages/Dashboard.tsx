import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/ui/stats-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { 
  Users, 
  Database, 
  RefreshCw, 
  AlertTriangle,
  Clock,
  ArrowUpRight
} from "lucide-react"

// Mock data
const dashboardStats = {
  lastImport: "2024-01-15 14:30:00",
  status: "success" as const,
  patientCount: 1247,
  admissions: 23,
  discharges: 18,
  mappingMismatches: 3
}

const recentWebhooks = [
  { id: 1, timestamp: "2024-01-15 14:28:15", status: "success" as const, type: "Patient Admission" },
  { id: 2, timestamp: "2024-01-15 14:25:32", status: "success" as const, type: "Patient Update" },
  { id: 3, timestamp: "2024-01-15 14:20:18", status: "error" as const, type: "Patient Discharge" },
  { id: 4, timestamp: "2024-01-15 14:15:44", status: "success" as const, type: "Room Assignment" },
  { id: 5, timestamp: "2024-01-15 14:12:09", status: "pending" as const, type: "Patient Transfer" },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your import daemon status and recent activity</p>
        </div>
        <Button variant="medical" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Trigger Import
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Patients"
          value={dashboardStats.patientCount.toLocaleString()}
          description="Total patients in system"
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Admissions (24h)"
          value={dashboardStats.admissions}
          description="New admissions today"
          icon={ArrowUpRight}
          trend={{ value: 12.1, isPositive: true }}
        />
        <StatsCard
          title="Discharges (24h)"
          value={dashboardStats.discharges}
          description="Patients discharged today"
          icon={ArrowUpRight}
          trend={{ value: -3.4, isPositive: false }}
        />
        <StatsCard
          title="Mapping Issues"
          value={dashboardStats.mappingMismatches}
          description="Requires attention"
          icon={AlertTriangle}
          className="border-warning/20"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Last Import Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Last Import Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={dashboardStats.status}>
                {dashboardStats.status === "success" ? "Successful" : "Failed"}
              </StatusBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-sm font-medium">{dashboardStats.lastImport}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Patients Processed</span>
              <span className="text-sm font-medium">{dashboardStats.patientCount}</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                View Full Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Webhook Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Webhook Events
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWebhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{webhook.type}</p>
                    <p className="text-xs text-muted-foreground">{webhook.timestamp}</p>
                  </div>
                  <StatusBadge status={webhook.status} showIcon={false}>
                    {webhook.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start gap-2">
              <Database className="h-4 w-4" />
              Manual Import
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <AlertTriangle className="h-4 w-4" />
              Review Errors
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync Room Mappings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}