"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { clearStoredUser } from "@/lib/auth"

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/summary", label: "Summary" },
  { href: "/search", label: "Search SIM" },
  { href: "/serial-scan", label: "Serial Scan" },
  { href: "/sim-scan", label: "ICCID Scan" },
]

interface Props {
  title: string
  children: React.ReactNode
  onSignOut?: () => void
}

export function AppShell({ title, children, onSignOut }: Props) {
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
      <div className="flex min-h-screen flex-col">
        <div className="border-b border-border bg-card px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">View</p>
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              <nav className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 min-w-0 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
