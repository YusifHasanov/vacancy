"use client"

import type * as React from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./DashboardSidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b backdrop-blur-xl px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="font-semibold">Company Vacancy Dashboard</h1>
            </div>
          </header>
          <main className={`flex-1 p-4 lg:p-6 w-full ${className}`}>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

