"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { ArrowLeft, Store, Search, PackagePlus, LogOut } from "lucide-react"
import { getStoredUser, type UserProfile, clearStoredUser } from "@/lib/auth"
import { fetcher } from "@/lib/fetcher"
import type { RetailerDetail } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RetailerSearch } from "@/components/retailer-search"
import { StockTable } from "@/components/stock-table"

interface Filters {
  branch: string
  zone: string
  city: string
  postCode: string
}

const EMPTY_FILTERS: Filters = { branch: "", zone: "", city: "", postCode: "" }

export default function SearchPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) setUser(stored)
  }, [])

  const filters = useMemo<Filters>(() => {
    if (!user) return EMPTY_FILTERS
    return {
      branch: user.allowedBranches.length === 1 ? user.allowedBranches[0] : "",
      zone: user.allowedZones.length === 1 ? user.allowedZones[0] : "",
      city: "",
      postCode: "",
    }
  }, [user])

  const { data: detail, isLoading } = useSWR<RetailerDetail | null>(
    selectedId ? `/api/retailer?id=${encodeURIComponent(selectedId)}` : null,
    fetcher,
    { keepPreviousData: true },
  )

  function signOut() {
    clearStoredUser()
    setUser(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-semibold text-foreground">Please sign in first</h1>
          <p className="text-sm text-muted-foreground">Retailer SIM search is available after login.</p>
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
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Retailer SIM Search</p>
            <h1 className="text-2xl font-semibold text-foreground">Search retailer SIM stock</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Search by retailer ID, city, post code or email and review SIM serial details only.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
              <ArrowLeft className="mr-2 inline-block" /> Dashboard
            </Link>
            <Link href="/summary" className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
              <Search className="mr-2 inline-block" /> Summary
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-2 size-4" /> Sign out
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <RetailerSearch filters={filters} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                Loading retailer SIM details...
              </div>
            )}
            {detail ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-secondary p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Retailer</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{detail.retailer.retailerId}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{detail.retailer.city || "Unknown city"}</p>
                </div>
                <StockTable batches={detail.batches} />
              </div>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
                <Store className="size-10 text-muted-foreground" />
                <p>Select a retailer to load SIM details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
