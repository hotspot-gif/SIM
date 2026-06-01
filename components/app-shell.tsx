"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronLeft, LogOut, Home, Layers, Search, Barcode, PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { clearStoredUser } from "@/lib/auth"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/search", label: "Search SIM", icon: Search },
  { href: "/sim-scan", label: "SIM Scan", icon: Barcode },
]

interface Props {
  title: string
  children: React.ReactNode
  onSignOut?: () => void
}

export function AppShell({ title, children, onSignOut }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

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
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`border-r border-border bg-card transition-all duration-300 flex flex-col ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Header */}
          <div className="border-b border-border p-4 flex items-center justify-between">
            {!collapsed && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">SIM Dashboard</p>
                <h2 className="text-sm font-bold text-foreground">Field Ops</h2>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className={`size-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : ""}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className={`w-full justify-center ${collapsed ? "px-0" : ""}`}
            >
              <LogOut className="size-4 flex-shrink-0" />
              {!collapsed && <span className="ml-2">Sign out</span>}
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0">
          <div className="border-b border-border bg-card px-6 py-4">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
          <main className="flex-1 min-w-0 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
