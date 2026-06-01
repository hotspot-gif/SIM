"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { ArrowLeft, Store, Search, PackagePlus, LogOut } from "lucide-react"
import { getStoredUser, type UserProfile, clearStoredUser } from "@/lib/auth"
import { fetcher } from "@/lib/fetcher"
import { DashboardOverview as OverviewCards } from "@/components/dashboard-overview"
import type { DashboardOverview } from "@/lib/types"
import { Button } from "@/components/ui/button"

export default function SummaryPage() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) setUser(stored)
  }, [])

  const query = user
    ? `/api/summary?branch=${encodeURIComponent(user.allowedBranches[0] || "")}&&zone=${encodeURIComponent(user.allowedZones[0] || "")}`
    : null

  const { data: overview } = useSWR<DashboardOverview | null>(query, fetcher, {
    revalidateOnFocus: false,
  })

  function signOut() {
    clearStoredUser()
    setUser(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-semibold text-foreground">Please sign in first</h1>
          <p className="text-sm text-muted-foreground">Your summary dashboard is available after login.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Summary</p>
            <h1 className="text-2xl font-semibold text-foreground">Field Operations Overview</h1>
            <p className="mt-2 text-sm text-muted-foreground">High-level metrics for your assigned branch or zone.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
              <ArrowLeft className="mr-2 inline-block" /> Dashboard
            </Link>
            <Link href="/search" className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
              <Search className="mr-2 inline-block" /> Search SIM
            </Link>
            <Link href="/serial-scan" className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
              <PackagePlus className="mr-2 inline-block" /> Scan
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-2 size-4" /> Sign out
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <OverviewCards overview={overview ?? null} user={user} />
        </div>
      </div>
    </div>
  )
}
