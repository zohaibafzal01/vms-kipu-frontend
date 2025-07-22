import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Map, 
  Webhook, 
  Activity,
  LogOut,
  Settings,
  Database
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Logs Viewer", url: "/logs", icon: FileText },
  { title: "Event History", url: "/events", icon: Calendar },
  { title: "Room Mapping", url: "/mappings", icon: Map },
  { title: "Webhook Events", url: "/webhooks", icon: Webhook },
  { title: "VMS Sync", url: "/sync", icon: Activity },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  console.log("Current path:", currentPath) // Debug log
  
  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
    >
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-md flex items-center justify-center">
              <Database className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-sm">Kipu Import</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium flex items-center gap-2 px-3 py-2 rounded-md" 
                          : "hover:bg-muted/50 flex items-center gap-2 px-3 py-2 rounded-md"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span>Settings</span>}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}