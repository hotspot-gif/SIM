"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { SignalHigh, Store, MapPin, Mail, Phone, Loader2, LogOut, PackagePlus, Eye, EyeOff, Layers } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { fetcher } from "@/lib/fetcher"
import type { FilterOptions, RetailerDetail, DashboardOverview } from "@/lib/types"
import type { UserProfile } from "@/lib/auth"
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
  const { data: detail, isLoading: detailLoading } = useSWR<RetailerDetail>(
    selectedId ? `/api/retailer?id=${encodeURIComponent(selectedId)}` : null,
    fetcher,
  )
  const { data: overview } = useSWR<DashboardOverview>(
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex flex-col gap-3 px-4 py-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <SignalHigh className="size-5" />
              </span>
              <div className="leading-tight">
                <h1 className="text-base font-bold lg:text-lg">SIM Stock Collection</h1>
                <p className="text-[11px] text-sidebar-foreground/60 lg:text-xs">
                  Italy Field Operations - Defective Stock Collection
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/summary">
                <Button variant="secondary" size="sm" className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/90">
                  <Layers className="mr-2 size-4" /> Summary
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="secondary" size="sm" className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/90">
                  <Store className="mr-2 size-4" /> Search SIM
                </Button>
              </Link>
              <Link href="/serial-scan">
                <Button variant="secondary" size="sm" className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/90">
                  <PackagePlus className="mr-2 size-4" /> Scan ICCID
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebars((prev) => !prev)}
                className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
              >
                {showSidebars ? <EyeOff className="mr-2 size-4" /> : <Eye className="mr-2 size-4" />}
                {showSidebars ? "Hide panels" : "Show panels"}
              </Button>
              <Button variant="outline" size="sm" onClick={onSignOut} className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80">
                <LogOut className="mr-2 size-4" /> Sign out
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">Welcome, {user.name}</p>
              <p>{user.displayRole}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              {user.allowedZones.length === 1
                ? `Zone access: ${user.allowedZones[0]}`
                : `Branch access: ${user.allowedBranches.length} branch(es)`}
            </div>
          </div>
        </div>
      </header>

      <main className={`mx-auto flex max-w-[1600px] flex-col gap-5 p-4 lg:p-6 xl:grid xl:items-start ${showSidebars ? "xl:grid-cols-[260px_1fr]" : "xl:grid-cols-[1fr]"}`}>
        <section className="grid gap-5 xl:col-span-full">
          <OverviewCards overview={overview ?? null} user={user} />
        </section>

        {showSidebars && (
          <div className="hidden lg:block">
            <div className="sticky top-[120px]">
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
                </>
              )}
            </section>
          )}
        </section>

        {showSidebars && (
          <aside className="xl:col-span-1 xl:block xl:sticky xl:top-[92px]">
            <ReportPanel detail={detail ?? null} />
          </aside>
        )}
      </main>
    </div>
  )
}
