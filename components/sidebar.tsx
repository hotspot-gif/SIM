"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Home, Layers, Search, Barcode, PackagePlus, X, LogOut, Menu, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearStoredUser } from "@/lib/auth"

interface Props {
  onCollapse: () => void
}

export function Sidebar({ onCollapse }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/summary", label: "Summary", icon: Layers },
    { href: "/search", label: "Search SIM", icon: Search },
    { href: "/serial-scan", label: "Serial Scan", icon: Barcode },
    { href: "/sim-scan", label: "ICCID Scan", icon: PackagePlus },
  ]

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) {
      setCollapsed(JSON.parse(saved))
    }
  }, [])

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
    }
  }, [collapsed, mounted])

  function handleSignOut() {
    clearStoredUser()
    window.location.href = "/"
  }

  return (
    <>
      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <h2 className="text-sm font-bold text-sidebar-foreground">Field Ops</h2>
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
        className={`fixed inset-y-0 left-0 top-12 z-50 border-r border-sidebar-border bg-sidebar transition-all duration-300 flex flex-col lg:static lg:top-auto lg:z-auto lg:h-screen hidden lg:flex ${
          collapsed ? "lg:w-[80px]" : "lg:w-[260px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between pb-6 lg:pb-8 pt-4 lg:pt-0 px-4 lg:px-0 lg:border-b lg:border-sidebar-border lg:p-5">
          <div className={collapsed ? "hidden" : ""}>
            <p className="text-xs uppercase tracking-[0.24em] text-sidebar-foreground/80">SIM Dashboard</p>
            <h2 className="text-lg lg:text-xl font-semibold text-sidebar-foreground">Field Ops</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCollapsed(!collapsed)
              localStorage.setItem("sidebar-collapsed", JSON.stringify(!collapsed))
            }}
            className="text-sidebar-foreground hover:bg-sidebar-accent hidden lg:flex"
          >
            <ChevronLeft className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <nav className="space-y-1 lg:space-y-2 px-3 lg:px-0 lg:p-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg lg:rounded-2xl px-3 py-2.5 lg:py-3 text-sm font-medium transition ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${collapsed ? "lg:justify-center" : ""}`}
              >
                <Icon className="size-4" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto space-y-2 lg:space-y-3 px-3 lg:px-0 pb-4 lg:p-5 lg:border-t lg:border-sidebar-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-xs lg:text-sm"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </div>
      </aside>
    </>
  )
