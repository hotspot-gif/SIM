"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { SignalHigh, Store, MapPin, Mail, Phone, Loader2, PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetcher } from "@/lib/fetcher"
import type { FilterOptions, RetailerDetail, DashboardOverview } from "@/lib/types"
import type { UserProfile } from "@/lib/auth"
import { AppShell } from "@/components/app-shell"
import { FilterPanel, type Filters } from "./filter-panel"
import { RetailerSearch } from "./retailer-search"
import { IccidValidator } from "./iccid-validator"
import { SummaryCards } from "./summary-cards"
import { StockTable } from "./stock-table"
import { ReportPanel } from "./report-panel"
import { DashboardOverview as OverviewCards } from "./dashboard-overview"

const EMPTY_FILTERS: Filters = { branch: "", zone: "", city: "", postCode: "" }

function branchFromTerritory(territory: string) {
  return territory.replace(/\s+ZONE\s+\d+/i, "").replace(/\s+SHOP\s+CLOSED/i, "").trim()
}

interface Props {
  user: UserProfile
  onSignOut: () => void
}

export function Dashboard({ user, onSignOut }: Props) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [showSidebars, setShowSidebars] = useState(true)

  const { data: options } = useSWR<FilterOptions>("/api/filters", fetcher)
  const { data: detail, isLoading: detailLoading, error: detailError } = useSWR<RetailerDetail>(
    selectedId ? `/api/retailer?id=${encodeURIComponent(selectedId)}` : null,
    fetcher,
  )
  const { data: overview, error: overviewError } = useSWR<DashboardOverview>(
    `/api/summary?${new URLSearchParams({
      branch: filters.branch || "",
      zone: filters.zone || "",
      city: filters.city || "",
      postCode: filters.postCode || "",
    }).toString()}`,
    fetcher,
    { keepPreviousData: true },
  )

  const allowedBranches = user.allowedBranches.length ? user.allowedBranches : options?.branches ?? []
  const allowedZones = user.allowedZones.length ? user.allowedZones : options?.zones ?? []

  const defaultFilters = useMemo<Filters>(() => {
    const next: Filters = { ...EMPTY_FILTERS }
    if (user.allowedZones.length === 1) {
      next.zone = user.allowedZones[0]
      next.branch = branchFromTerritory(user.allowedZones[0])
    } else if (user.allowedBranches.length === 1) {
      next.branch = user.allowedBranches[0]
    }
    return next
  }, [user.allowedBranches, user.allowedZones])

  useEffect(() => {
    setFilters(defaultFilters)
    setSelectedId(null)
  }, [defaultFilters])

  function handleFilterChange(next: Filters) {
    setSelectedId(null)
    setFilters(next)
  }

  function openRetailer(id: string) {
    setSelectedId(id)
    setMobileFiltersOpen(false)
  }

  return (
    <AppShell title="Dashboard" onSignOut={onSignOut}>
      <div className="mx-auto grid max-w-[1600px] gap-5 xl:grid-cols-[280px_1fr_340px]">
        <section className="col-span-full">
          <OverviewCards overview={overview ?? null} user={user} />
        </section>

        {showSidebars && (
          <div className="hidden lg:block">
            <div className="sticky top-[20px]">
              <FilterPanel
                options={options}
                filters={filters}
                onChange={handleFilterChange}
                allowedBranches={allowedBranches}
                allowedZones={allowedZones}
              />
            </div>
          </div>
        )}

        <section className="flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Retailer search</h2>
                <p className="text-sm text-muted-foreground">Search retailers within your assigned branches or zones.</p>
              </div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Scope</div>
            </div>
            <RetailerSearch filters={filters} selectedId={selectedId} onSelect={openRetailer} />
          </div>

          <IccidValidator onOpenRetailer={openRetailer} />

          {selectedId && (
            <section className="flex flex-col gap-4">
              {detailLoading && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading retailer stock...
                </div>
              )}

              {detailError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
                  <p className="text-sm font-medium text-destructive">Error loading retailer: {detailError.message}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setSelectedId(null)}
                  >
                    Go back
                  </Button>
                </div>
              )}

              {detail && (
                <>
                  <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Store className="size-5 text-accent" />
                      <h2 className="text-lg font-bold text-foreground">{detail.retailer.retailerId}</h2>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {detail.retailer.territory || "No zone"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {detail.retailer.city || "Unknown"}
                        {detail.retailer.postCode && ` - ${detail.retailer.postCode}`}
                      </span>
                      {detail.retailer.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="size-3.5" />
                          {detail.retailer.email}
                        </span>
                      )}
                      {detail.retailer.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="size-3.5" />
                          {detail.retailer.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <SummaryCards summary={detail.summary} />
                  <StockTable batches={detail.batches} />

                  {/* Mobile Report Panel */}
                  <div className="xl:hidden">
                    <ReportPanel key={`mobile-${selectedId}`} detail={detail} />
                  </div>
                </>
              )}
            </section>
          )}
        </section>

        {showSidebars && (
          <aside className="hidden xl:block xl:sticky xl:top-[20px]">
            <ReportPanel key={`desktop-${selectedId || "none"}`} detail={detail ?? null} />
          </aside>
        )}
      </div>
    </AppShell>
  )
}
