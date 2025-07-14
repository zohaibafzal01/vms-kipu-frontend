import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Bell, User, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AppHeader() {
  return (
    <header className="h-16 flex items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        <div>
          <h2 className="text-lg font-semibold">Kipu Import Daemon</h2>
          <p className="text-sm text-muted-foreground">Healthcare Data Management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">System Active</span>
        </div>

        {/* Quick actions */}
        <Button variant="ghost" size="sm">
          <RefreshCw className="h-4 w-4" />
          Trigger Import
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
            3
          </Badge>
        </div>

        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}