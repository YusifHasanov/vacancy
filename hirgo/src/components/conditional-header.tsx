"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { DashboardSidebar } from "./dashboard/DashboardSidebar"
import { ReactNode } from "react"

interface ConditionalHeaderProps {
  children: ReactNode;
}

export function ConditionalHeader({ children }: ConditionalHeaderProps) {
  const pathname = usePathname()
  const isDashboardRoute = pathname?.startsWith("/dashboard")

  if (isDashboardRoute) {
    return (
      <div className="flex min-h-screen">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <div className="flex-1">
              <h1 className="font-semibold">Dashboard</h1>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </>
  )
}

