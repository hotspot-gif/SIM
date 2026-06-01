"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Layers, Search, Barcode, PackagePlus, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearStoredUser } from "@/lib/auth"

interface Props {
  onCollapse: () => void
}

export function Sidebar({ onCollapse }: Props) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/summary", label: "Summary", icon: Layers },
    { href: "/search", label: "Search SIM", icon: Search },
    { href: "/serial-scan", label: "Serial Scan", icon: Barcode },
    { href: "/sim-scan", label: "ICCID Scan", icon: PackagePlus },
  ]

  function handleSignOut() {
    clearStoredUser()
    window.location.href = "/"
  }

  return (
    <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:border-r lg:border-sidebar-border lg:bg-sidebar lg:px-4 lg:py-5">
      <div className="flex items-center justify-between pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-sidebar-foreground/80">SIM Dashboard</p>
          <h2 className="text-xl font-semibold text-sidebar-foreground">Field Ops</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onCollapse} className="text-sidebar-foreground hover:bg-sidebar-accent">
          <X className="size-4" />
        </Button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-8">
        <Button variant="outline" size="sm" className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>
    </aside>
  )
}
