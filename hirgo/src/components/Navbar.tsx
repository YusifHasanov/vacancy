"use client"

import { Menu, User, LogOut, LayoutDashboard, UserCircle } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useRoleCheck } from "@/components/RoleBasedContent"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/useUser"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store"
import Image from "next/image"

export function Navbar() {
  // Don't render navbar when on dashboard routes
  const pathname = usePathname()
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  // Get user related functions and state
  const { user, logout, isLoading } = useUser()
  const { canPostJobs, canApplyToJobs, isAuthenticated } = useRoleCheck()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    // Reset isScrolled state when the route changes
    setIsScrolled(false)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // ... existing code ...
  const menuItems = [
    { name: "Ana Səhifə", icon: "🏠", path: "/" },
    { name: "Vakansiyalar", icon: "💼", path: "/vacancies" },
    ...(isAuthenticated ? canPostJobs ? [{ name: "Namizədlər", icon: "👥", path: "/dashboard/applicants" }] : [] : []),
    ...(isAuthenticated ? canApplyToJobs ? [{ name: "CV Yarat", icon: "👤", path: "/profile/cvmaker" }] : [] : []),
    { name: "Haqqımızda", icon: "ℹ️", path: "/about-us" },
  ]

  const isMainPage = pathname === "/"
  const shouldUseTransparentBg = !isScrolled && isMainPage

  const handleLogout = () => {
    logout()
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${shouldUseTransparentBg
          ? "bg-gradient-to-tr from-blue-600 via-indigo-700 to-purple-800"
          : "bg-background/80 backdrop-blur-sm border-b"
        }`}
    >
      <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-8">
        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <div className="bg-gradient-to-br from-primary to-primary-foreground p-6 text-white">
              <h2 className="text-2xl font-bold">Menu</h2>
              <p className="text-sm opacity-80">Daha çox şey et</p>
            </div>
            <nav className="p-4">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-4">
                  <Link
                    href={item.path}
                    className="flex items-center rounded-md py-2 text-lg font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-2 text-2xl">{item.icon}</span>
                    {item.name}
                  </Link>
                  {index < menuItems.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </nav>

            {isAuthenticated && (
              <>
                <Separator className="my-2" />
                <div className="p-4">
                  {canPostJobs && (
                    <Link
                      href="/dashboard"
                      className="flex items-center rounded-md py-2 text-lg font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-2 text-2xl">📊</span>
                      Dashboard
                    </Link>
                  )}

                  {canApplyToJobs && (
                    <Link
                      href="/profile"
                      className="flex items-center rounded-md py-2 text-lg font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-2 text-2xl">👤</span>
                      Profile
                    </Link>
                  )}

                  <button
                    className="flex w-full items-center rounded-md py-2 text-lg font-semibold transition-colors hover:bg-accent hover:text-accent-foreground text-left"
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                  >
                    <span className="mr-2 text-2xl">🚪</span>
                    Logout
                  </button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Left section with Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-xl font-semibold whitespace-nowrap ${shouldUseTransparentBg ? "text-white" : "text-foreground"}`}
          >
            <Image src="/logo_fit2job.png" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        {/* Center section with Navigation */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="hidden gap-6 md:flex">
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <NavigationMenuLink
                  href={item.path}
                  className={`text-sm font-semibold p-3
                    ${shouldUseTransparentBg
                      ? "text-white hover:text-black hover:bg-white rounded-xl"
                      : `text-muted-foreground hover:bg-accent ${pathname !== item.path ? "hover:text-accent-foreground" : ""} rounded-xl`
                    }
                    ${pathname === item.path && pathname !== "/" ? "bg-gradient-to-tr from-blue-600 via-indigo-700 to-purple-800 text-white" : ""}
                  `}
                >
                  {item.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {!isAuthenticated ? (
          <Button
            variant={isScrolled ? "ghost" : "outline"}
            size="sm"
            className={`text-sm font-medium ${isScrolled ? "" : "hover:text-white hover:bg-white/20"} ${shouldUseTransparentBg ? "" : "hover:text-black hover:bg-gray-50"}`}
            onClick={() => router.push("/login")}
          >
            Daxil ol
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${shouldUseTransparentBg ? "text-white hover:bg-white/20" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={"https://github.com/shadcn.png"} alt={"User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.email ? user.email.split('@')[0] : "Username"}</p>
                  <p className="text-sm text-muted-foreground">{user.email || "email@gmail.com"}</p>
                </div>
              </div>
              <DropdownMenuSeparator />

              {canPostJobs && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex w-full cursor-pointer items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canApplyToJobs && (
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex w-full cursor-pointer items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

