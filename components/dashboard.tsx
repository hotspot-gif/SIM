"use client"

import { useState } from "react"
import useSWR from "swr"
import { SignalHigh, SlidersHorizontal, Store, MapPin, Mail, Phone, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { fetcher } from "@/lib/fetcher"
import type { FilterOptions, RetailerDetail } from "@/lib/types"
import { FilterPanel, type Filters } from "./filter-panel"
import { RetailerSearch } from "./retailer-search"
import { IccidValidator } from "./iccid-validator"
import { SummaryCards } from "./summary-cards"
import { StockTable } from "./stock-table"
import { ReportPanel } from "./report-panel"

const EMPTY_FILTERS: Filters = { branch: "", zone: "", city: "", postCode: "" }

export function Dashboard() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const { data: options } = useSWR<FilterOptions>("/api/filters", fetcher)
  const { data: detail, isLoading: detailLoading } = useSWR<RetailerDetail>(
    selectedId ? `/api/retailer?id=${encodeURIComponent(selectedId)}` : null,
    fetcher,
  )

  function handleFilterChange(next: Filters) {
    setFilters(next)
  }

  function openRetailer(id: string) {
    setSelectedId(id)
    setMobileFiltersOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <SignalHigh className="size-5" />
            </span>
            <div className="leading-tight">
              <h1 className="text-base font-bold lg:text-lg">SIM Stock Collection</h1>
              <p className="text-[11px] text-sidebar-foreground/60 lg:text-xs">
                Italy Field Operations - Defective Stock Identification
              </p>
            </div>
          </div>
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 lg:hidden"
              >
                <SlidersHorizontal className="mr-1.5 size-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] border-sidebar-border bg-sidebar p-4">
              <SheetHeader className="px-0">
                <SheetTitle className="text-sidebar-foreground">Filters</SheetTitle>
              </SheetHeader>
              <FilterPanel options={options} filters={filters} onChange={handleFilterChange} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] flex-col lg:grid lg:grid-cols-[260px_1fr]">
        {/* Left sidebar - desktop */}
        <aside className="hidden border-r border-sidebar-border bg-sidebar p-5 lg:block">
          <div className="sticky top-[76px]">
            <FilterPanel options={options} filters={filters} onChange={handleFilterChange} />
          </div>
        </aside>

        {/* Main + Right */}
        <main className="flex flex-col gap-5 p-4 lg:p-6 xl:grid xl:grid-cols-[1fr_360px] xl:items-start">
          {/* Center column */}
          <div className="flex flex-col gap-5">
            <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
              <RetailerSearch filters={filters} selectedId={selectedId} onSelect={openRetailer} />
            </section>

            <IccidValidator onOpenRetailer={openRetailer} />

            {/* Retailer detail */}
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

            {/* Report panel on small screens shows below */}
            <div className="xl:hidden">
              <ReportPanel detail={detail ?? null} />
            </div>
          </div>

          {/* Right column - report (desktop) */}
          <div className="hidden xl:block xl:sticky xl:top-[92px]">
            <ReportPanel detail={detail ?? null} />
          </div>
        </main>
      </div>
    </div>
  )
}
