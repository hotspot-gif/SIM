"use client"

import { useEffect, useState, Suspense } from "react"
import useSWR from "swr"
import { ArrowLeft, ArrowRight, Search, Store } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getStoredUser, type UserProfile } from "@/lib/auth"
import { fetcher } from "@/lib/fetcher"
import type { FilterOptions, RetailerDetail } from "@/lib/types"
import { AppShell } from "@/components/app-shell"
import { RetailerSearch } from "@/components/retailer-search"
import { StockTable } from "@/components/stock-table"
import { FilterPanel, type Filters } from "@/components/filter-panel"
import { IccidValidator } from "@/components/iccid-validator"
import { ReportPanel } from "@/components/report-panel"
import { Button } from "@/components/ui/button"

interface PageFilters {
  branch: string
  zone: string
  city: string
  postCode: string
}

const EMPTY_FILTERS: PageFilters = { branch: "", zone: "", city: "", postCode: "" }

function SearchContent() {
  const searchParams = useSearchParams()
  const queryRetailerId = searchParams.get("q")
  
  const [user, setUser] = useState<UserProfile | null>(null)
  const [filters, setFilters] = useState<PageFilters>(EMPTY_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<"stock" | "report">("stock")

  const { data: options } = useSWR<FilterOptions>("/api/filters", fetcher)

  useEffect(() => {
    if (queryRetailerId) {
      setSelectedId(queryRetailerId)
    }
  }, [queryRetailerId])

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

  useEffect(() => {
    if (selectedId) {
      setView("stock")
    }
  }, [selectedId])

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
    <AppShell title="Search by Retailer or ICCID">
      <div className="mx-auto flex max-w-[800px] flex-col gap-6">
        {!selectedId ? (
          <>
            <div className="rounded-2xl lg:rounded-3xl border border-border bg-card p-4 lg:p-6 shadow-sm">
              <IccidValidator onOpenRetailer={setSelectedId} />
            </div>

            <div className="rounded-2xl lg:rounded-3xl border border-border bg-card p-4 lg:p-6 shadow-sm">
              <div className="space-y-2 mb-6">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Retailer search</p>
                <p className="text-sm text-muted-foreground">Filter retailers by branch, zone, or location.</p>
              </div>
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

            <div className="rounded-2xl lg:rounded-3xl border border-border bg-card p-4 lg:p-6 shadow-sm">
              <div className="space-y-2 mb-6">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Retailer Results</p>
                <p className="text-sm text-muted-foreground">Select a retailer to view stock details.</p>
              </div>
              <RetailerSearch filters={filters} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedId(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to Search
              </Button>
              {detail && view === "stock" && (
                <Button
                  onClick={() => setView("report")}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Next: Collection Report
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              )}
              {detail && view === "report" && (
                <Button
                  variant="outline"
                  onClick={() => setView("stock")}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Stock
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground bg-card rounded-3xl border border-border">
                <div className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                Loading retailer SIM details...
              </div>
            ) : detail ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {view === "stock" ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-accent/10">
                          <Store className="size-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Retailer</p>
                          <h2 className="text-xl font-bold text-foreground">{detail.retailer.retailerId}</h2>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">City</p>
                          <p className="font-medium">{detail.retailer.city || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Territory</p>
                          <p className="font-medium">{detail.retailer.territory || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                      <StockTable batches={detail.batches} />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        size="lg"
                        onClick={() => setView("report")}
                        className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 px-8"
                      >
                        Next: Collection Report
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <ReportPanel detail={detail} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
                <Search className="size-12 text-muted-foreground/50" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">No details found</p>
                  <p className="text-sm text-muted-foreground max-w-xs">We couldn't find any stock details for this retailer.</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedId(null)}>
                  Try another search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
