"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Briefcase, FileEdit, LogOut, PlusCircle, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface SidebarNavItem {
  title: string
  href: string
  icon: React.ElementType
  isActive?: boolean
}

export function DashboardSidebar() {
  const pathname = usePathname()

  const navItems: SidebarNavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Vacancies",
      href: "/dashboard/vacancies",
      icon: Briefcase,
      isActive: pathname === "/dashboard/vacancies",
    },
    {
      title: "Applicants",
      href: "/dashboard/applicants",
      icon: FileEdit,
      isActive: pathname === "/dashboard/applicants",
    },
    {
      title: "Create New Vacancy",
      href: "/dashboard/vacancies/new",
      icon: PlusCircle,
      isActive: pathname === "/dashboard/vacancies/new",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Briefcase className="h-6 w-6" />
            <span className="text-xl">JobPortal</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex flex-col gap-2 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/dashboard/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout">
                <button className="w-full flex items-center">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

