"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Layers, Search, Barcode, PackagePlus, LogOut } from "lucide-react"
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
    <aside className="hidden xl:flex xl:w-[260px] xl:flex-col xl:border-r xl:border-border xl:bg-sidebar xl:px-4 xl:py-5">
      <div className="flex items-center justify-between pb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">SIM Dashboard</p>
          <h2 className="text-xl font-semibold text-foreground">Field Ops</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onCollapse}>
          <LogOut className="size-4 rotate-90" />
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
                active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-8">
        <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>
    </aside>
  )
}
