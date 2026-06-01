"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Search } from "lucide-react"
import { getStoredUser, type UserProfile } from "@/lib/auth"
import { fetcher } from "@/lib/fetcher"
import type { FilterOptions, RetailerDetail } from "@/lib/types"
import { AppShell } from "@/components/app-shell"
import { RetailerSearch } from "@/components/retailer-search"
import { StockTable } from "@/components/stock-table"
import { FilterPanel, type Filters } from "@/components/filter-panel"
import { IccidValidator } from "@/components/iccid-validator"
import { ReportPanel } from "@/components/report-panel"

interface PageFilters {
  branch: string
  zone: string
  city: string
  postCode: string
}

const EMPTY_FILTERS: PageFilters = { branch: "", zone: "", city: "", postCode: "" }

export default function SearchPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [filters, setFilters] = useState<PageFilters>(EMPTY_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: options } = useSWR<FilterOptions>("/api/filters", fetcher)

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) {
      setUser(stored)
      setFilters({
        branch: stored.allowedBranches.length === 1 ? stored.allowedBranches[0] : "",
        zone: stored.allowedZones.length === 1 ? stored.allowedZones[0] : "",
        city: "",
        postCode: "",
      })
    }
  }, [])

  const { data: detail, isLoading } = useSWR<RetailerDetail | null>(
    selectedId ? `/api/retailer?id=${encodeURIComponent(selectedId)}` : null,
    fetcher,
    { keepPreviousData: true },
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-semibold text-foreground">Please sign in first</h1>
          <p className="text-sm text-muted-foreground">Retailer SIM search is available after login.</p>
        </div>
      </div>
    )
  }

  return (
    <AppShell title="Search SIM">
      <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1fr_360px] grid-cols-1">
        <div className="lg:order-last space-y-4 lg:space-y-6">
          <div className="rounded-2xl lg:rounded-3xl border border-border bg-card p-3 lg:p-4 shadow-sm">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Retailer search</p>
              <p className="text-xs lg:text-sm text-muted-foreground">Lookup retailer SIM serials and collect stock details.</p>
            </div>
            <div className="mt-4">
              <FilterPanel
                options={options}
                filters={filters}
                onChange={(next) => {
                  setFilters(next)
                  setSelectedId(null)
                }}
                allowedBranches={user.allowedBranches}
                allowedZones={user.allowedZones}
              />
            </div>
          </div>
          <div className="rounded-2xl lg:rounded-3xl border border-border bg-card p-3 lg:p-4 shadow-sm">
            <RetailerSearch filters={filters} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <div className="rounded-2xl lg:rounded-3xl border border-border bg-card p-3 lg:p-4 shadow-sm">
            <IccidValidator onOpenRetailer={setSelectedId} />
          </div>
          <div className="rounded-2xl lg:rounded-3xl border border-border bg-card p-3 lg:p-4 shadow-sm">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-12 lg:py-16 text-xs lg:text-sm text-muted-foreground">
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
                <Search className="size-10 text-muted-foreground" />
                <p>Search retailer SIM details, then generate a PDF report.</p>
              </div>
            )}
          </div>
          {detail && (
            <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
              <ReportPanel detail={detail} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
