"use client";

import * as React from "react";
import { BarChart3, Crosshair, Home, Menu, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/LandingDashboard/Header/Darkmode";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Beautiful Loading Screen Component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-950 dark:to-slate-950">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          <div
            className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Users Dashboard",
    url: "/admin/userdashboard",
    icon: BarChart3,
  },
  {
    title: "Missions Management",
    url: "/admin/missions",
    icon: Crosshair,
  },
  {
    title: "Mission Reviews",
    url: "/admin/mission-review",
    icon: FileText,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar/95 lg:backdrop-blur lg:supports-[backdrop-filter]:bg-sidebar/60 z-50">
      <SidebarHeader className="p-6 border-b border-sidebar-border/50">
        <div className="flex items-center space-x-3">
          <div className="relative"></div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Admin Panel
            </h2>
            <p className="text-xs text-sidebar-foreground/60 font-medium">
              Control Center
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-auto p-0">
                      <Link
                        href={item.url}
                        className={`
                          group relative w-full flex items-center space-x-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-out
                          ${
                            isActive
                              ? "bg-gray-50 dark:bg-gray-900/20 text-sidebar-foreground border border-gray-200/40 dark:border-gray-400/30 shadow-lg shadow-gray-500/10"
                              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-accent/50 hover:shadow-md"
                          }
                        `}
                      >
                        {/* Icon with solid background when active */}
                        <div
                          className={`
                          relative p-2 rounded-lg transition-all duration-300
                          ${
                            isActive
                              ? "bg-gray-800 dark:bg-gray-200 shadow-lg shadow-gray-500/25"
                              : "bg-sidebar-accent/30 group-hover:bg-sidebar-accent/60"
                          }
                        `}
                        >
                          <item.icon
                            className={`
                            w-4 h-4 transition-all duration-300
                            ${
                              isActive
                                ? "text-white dark:text-black"
                                : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                            }
                          `}
                          />

                          {/* Subtle glow effect when active */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gray-800 dark:bg-gray-200 rounded-lg blur opacity-20 -z-10"></div>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span
                            className={`
                            font-semibold transition-colors duration-300
                            ${
                              isActive
                                ? "text-sidebar-foreground"
                                : "group-hover:text-sidebar-foreground"
                            }
                          `}
                          >
                            {item.title}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-sidebar-foreground/50">
            <div className="font-semibold text-sidebar-foreground/70">
              © 2025 Gather Beyond
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

// Improved overlay component with better mobile handling
function SidebarOverlay() {
  const { open, setOpen } = useSidebar();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 lg:hidden touch-manipulation"
      onClick={() => setOpen(false)}
      style={{
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isClient, setIsClient] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Set client flag after component mounts
  React.useEffect(() => {
    setIsClient(true);
    setIsMounted(true);
  }, []);

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Refresh function for different pages
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Add a delay to show the spinning animation before reload
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force reload the current page
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing:", error);
      setIsRefreshing(false);
    }
  };

  // Dynamic title based on current path
  const getPageTitle = () => {
    if (pathname === "/admin/missions") return "Missions Management";
    if (pathname === "/admin/userdashboard") return "Users Dashboard";
    if (pathname === "/admin/mission-review") return "Mission Reviews";
    if (pathname === "/") return "Home";
    return "Admin Panel";
  };

  // Dynamic description based on current path
  const getDescription = () => {
    if (pathname === "/admin/missions")
      return "Create, edit, and manage missions";
    if (pathname === "/admin/userdashboard")
      return "Monitor user activity and statistics";
    if (pathname === "/admin/mission-review")
      return "Review and manage user mission submissions";
    if (pathname === "/") return "Welcome to the main dashboard";
    return "Administrative control center";
  };

  // Prevent blur effect issues during initial load
  if (!isMounted) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        <AppSidebar />
        <SidebarOverlay />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-full">
          {/* Enhanced Header */}
          <header className="bg-card shadow-sm border-b border-border flex-shrink-0 relative z-30 lg:bg-card/95 lg:backdrop-blur lg:supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
              <div className="flex items-center space-x-2 lg:space-x-4">
                <SidebarTrigger className="p-2 lg:p-3 rounded-xl hover:bg-accent/50 transition-colors duration-200 group touch-manipulation">
                  <Menu className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                </SidebarTrigger>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="h-6 lg:h-8 w-1 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
                  <div className="flex flex-col">
                    {/* แก้ไขส่วนนี้ - Title และ Description ในบรรทัดเดียวกัน */}
                    <div className="flex items-baseline space-x-2 lg:space-x-3">
                      <h1 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {getPageTitle()}
                      </h1>
                      <span className="text-xs lg:text-sm text-muted-foreground hidden sm:inline">
                        {getDescription()}
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground flex items-center space-x-1 lg:space-x-2 mt-0.5">
                      {isClient ? (
                        <>
                          <span>
                            {currentTime.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </>
                      ) : (
                        <span>Loading...</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 h-9"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <ModeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-3 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
