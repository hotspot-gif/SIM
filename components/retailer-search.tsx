"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Search, Store, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { fetcher } from "@/lib/fetcher"
import type { RetailerSummary } from "@/lib/types"
import type { Filters } from "./filter-panel"
import { formatNumber } from "@/lib/calc"
import { cn } from "@/lib/utils"

interface Props {
  filters: Filters
  selectedId: string | null
  onSelect: (retailerId: string) => void
}

function useDebounced<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function RetailerSearch({ filters, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState("")
  const debounced = useDebounced(query)

  const params = new URLSearchParams()
  if (debounced) params.set("q", debounced)
  if (filters.branch) params.set("branch", filters.branch)
  if (filters.zone) params.set("zone", filters.zone)
  if (filters.city) params.set("city", filters.city)
  if (filters.postCode) params.set("postCode", filters.postCode)

  const { data, isLoading } = useSWR<{ results: RetailerSummary[] }>(
    `/api/retailers?${params.toString()}`,
    fetcher,
    { keepPreviousData: true },
  )

  const results = data?.results ?? []

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Retailer ID, city, post code or email"
          className="h-11 pl-9 text-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>{results.length} retailer{results.length === 1 ? "" : "s"}</span>
        {(filters.branch || filters.zone || filters.city || filters.postCode) && (
          <span className="text-accent">Filtered</span>
        )}
      </div>

      <div className="flex max-h-[260px] flex-col gap-1.5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-360px)]">
        {results.map((r) => {
          const active = r.retailerId === selectedId
          return (
            <button
              key={r.retailerId}
              onClick={() => onSelect(r.retailerId)}
              className={cn(
                "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                active
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:border-accent/40 hover:bg-secondary",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                  <Store className="size-3.5 shrink-0 text-accent" />
                  <span className="truncate">{r.retailerId}</span>
                </span>
                <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  {formatNumber(r.totalQty)} qty
                </span>
              </div>
              <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                {r.city || "Unknown"} {r.postCode && `- ${r.postCode}`}
              </span>
            </button>
          )
        })}
        {!isLoading && results.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No retailers match your search.
          </p>
        )}
      </div>
    </div>
  )
}
