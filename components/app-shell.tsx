"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronLeft, LogOut, Home, Search, Barcode, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { clearStoredUser } from "@/lib/auth"
import { getSidebarCollapsed, setSidebarCollapsed } from "@/lib/store"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/search", label: "Search by Retailer or ICCID", icon: Search },
  { href: "/sim-scan", label: "SIM Scan", icon: Barcode },
]

interface Props {
  title: string
  children: React.ReactNode
  onSignOut?: () => void
}

export function AppShell({ title, children, onSignOut }: Props) {
  const [collapsed, setCollapsed] = useState(getSidebarCollapsed())
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isExpanded = mounted ? !collapsed : !getSidebarCollapsed()

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = getSidebarCollapsed()
    setCollapsed(saved)
  }, [])

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    setSidebarCollapsed(next)
  }

  function signOut() {
    if (onSignOut) {
      onSignOut()
      return
    }
    clearStoredUser()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Mobile header with menu button */}
        <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <img 
              src="https://cms-assets.ldsvcplatform.com/IT/s3fs-public/2023-09/MicrosoftTeams-image%20%2813%29.png" 
              alt="Logo" 
              className="h-6 w-auto"
            />
            <h2 className="text-sm font-bold text-sidebar-foreground">Italy SIM Return</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 top-12 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-12 z-50 border-r border-sidebar-border bg-sidebar transition-all duration-300 flex flex-col lg:sticky lg:top-0 lg:z-auto lg:h-screen ${
            isExpanded ? "w-64" : "w-20"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          {/* Header */}
          <div className="border-b border-sidebar-border p-4 flex items-center justify-between hidden lg:flex">
            {isExpanded ? (
              <div className="flex items-center gap-3">
                <img 
                  src="https://cms-assets.ldsvcplatform.com/IT/s3fs-public/2023-09/MicrosoftTeams-image%20%2813%29.png" 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
                <div>
                  <p className="text-xs uppercase tracking-widest text-sidebar-foreground/70">SIM Dashboard</p>
                  <h2 className="text-sm font-bold text-sidebar-foreground">Italy SIM Return</h2>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <img 
                  src="https://cms-assets.ldsvcplatform.com/IT/s3fs-public/2023-09/MicrosoftTeams-image%20%2813%29.png" 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 lg:space-y-2 lg:p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 lg:py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  } ${isExpanded ? "" : "justify-center"}`}
                  title={!isExpanded ? item.label : ""}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  {isExpanded && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-3 lg:p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className={`w-full justify-center border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-xs lg:text-sm ${!isExpanded ? "px-0" : ""}`}
            >
              <LogOut className="size-4 flex-shrink-0" />
              {isExpanded && <span className="ml-2">Sign out</span>}
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="border-b border-border bg-card px-4 py-3 lg:px-6 lg:py-4">
            <h1 className="text-base lg:text-lg font-semibold text-foreground">{title}</h1>
          </div>
          <main className="flex-1 min-w-0 p-4 lg:p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
