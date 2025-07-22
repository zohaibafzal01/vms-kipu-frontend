import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Map,
  Webhook,
  Activity,
  Menu,
  X,
  Database,
  Bell,
  User,
  RefreshCw,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Logs Viewer", url: "/logs", icon: FileText },
  { title: "Event History", url: "/events", icon: Calendar },
  { title: "Room Mapping", url: "/mappings", icon: Map },
  { title: "Webhook Events", url: "/webhooks", icon: Webhook },
  { title: "VMS Sync", url: "/sync", icon: Activity },
];

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-md flex items-center justify-center">
              <Database className="w-4 h-4 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-semibold text-sm">Kipu Import</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between border-b border-border bg-background px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
            <div>
              <h2 className="text-lg font-semibold">Kipu Import Daemon</h2>
              <p className="text-sm text-muted-foreground">
                Healthcare Data Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                System Active
              </span>
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
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-30">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
