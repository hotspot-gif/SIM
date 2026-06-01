"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { getStoredUser, type UserProfile } from "@/lib/auth"
import { fetcher } from "@/lib/fetcher"
import { AppShell } from "@/components/app-shell"
import { DashboardOverview as OverviewCards } from "@/components/dashboard-overview"
import type { DashboardOverview } from "@/lib/types"

export default function SummaryPage() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) setUser(stored)
  }, [])

  const query = new URLSearchParams()
  if (user?.allowedBranches.length === 1) query.set("branch", user.allowedBranches[0])
  if (user?.allowedZones.length === 1) query.set("zone", user.allowedZones[0])

  const { data: overview } = useSWR<DashboardOverview | null>(user ? `/api/summary?${query.toString()}` : null, fetcher, {
    revalidateOnFocus: false,
  })

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
    <AppShell title="Summary">
      <div className="space-y-6">
        <OverviewCards overview={overview ?? null} user={user} />
      </div>
    </AppShell>
  )
}
