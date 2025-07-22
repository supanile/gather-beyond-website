"use client";

import * as React from "react";
import { BarChart3, Home, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/Header/Darkmode";

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
} from "@/components/ui/sidebar";

// Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
      <SidebarHeader className="p-6 border-b border-sidebar-border/50">
        <div className="flex items-center space-x-3">
          <div className="relative"></div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300">
              Admin Dashboard
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
                              ? "bg-purple-50 dark:bg-purple-900/20 text-sidebar-foreground border border-purple-200/40 dark:border-purple-400/30 shadow-lg shadow-purple-500/10"
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
                              ? "bg-purple-600 dark:bg-purple-500 shadow-lg shadow-purple-500/25"
                              : "bg-sidebar-accent/30 group-hover:bg-sidebar-accent/60"
                          }
                        `}
                        >
                          <item.icon
                            className={`
                            w-4 h-4 transition-all duration-300
                            ${
                              isActive
                                ? "text-white"
                                : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                            }
                          `}
                          />

                          {/* Subtle glow effect when active */}
                          {isActive && (
                            <div className="absolute inset-0 bg-purple-600 dark:bg-purple-500 rounded-lg blur opacity-20 -z-10"></div>
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

interface AdminLayoutProps {
  children: React.ReactNode;
  currentTime: Date;
}

export function AdminLayout({ children, currentTime }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <header className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="p-2.5 rounded-xl hover:bg-accent/50 transition-colors duration-200 group">
                  <Menu className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                </SidebarTrigger>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-1 bg-purple-600 dark:bg-purple-500 rounded-full"></div>
                  <div>
                    <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center space-x-2">
                      <span>
                        {currentTime.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="w-1 h-1 bg-muted-foreground/50 rounded-full"></span>
                      <span>
                        {currentTime.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ModeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}