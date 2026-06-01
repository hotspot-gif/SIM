"use client"

import { SlidersHorizontal, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { FilterOptions } from "@/lib/types"

export interface Filters {
  branch: string
  zone: string
  city: string
  postCode: string
}

interface Props {
  options?: FilterOptions
  filters: Filters
  onChange: (filters: Filters) => void
  allowedBranches?: string[]
  allowedZones?: string[]
}

const ALL = "__all__"

export function FilterPanel({ options, filters, onChange, allowedBranches, allowedZones }: Props) {
  const branches = allowedBranches && allowedBranches.length > 0 ? allowedBranches : options?.branches ?? []
  const zones = allowedZones && allowedZones.length > 0 ? allowedZones : options?.zones ?? []
  const visibleZones = filters.branch
    ? zones.filter((z) => z.startsWith(filters.branch))
    : zones

  // Filter cities by selected zone
  const visibleCities = filters.zone
    ? (options?.citiesByZone?.[filters.zone] ?? [])
    : (options?.cities ?? [])

  const hasActive = filters.branch || filters.zone || filters.city || filters.postCode

  function set<K extends keyof Filters>(key: K, value: string) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-sidebar-foreground">
          <SlidersHorizontal className="size-4" />
          Filters
        </h2>
        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={() => onChange({ branch: "", zone: "", city: "", postCode: "" })}
          >
            <X className="mr-1 size-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-sidebar-foreground/70">Branch</Label>
        <Select
          value={filters.branch || (branches.length === 1 ? branches[0] : ALL)}
          onValueChange={(v) => onChange({ ...filters, branch: v === ALL ? "" : v, zone: "" })}
        >
          <SelectTrigger className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground">
            <SelectValue placeholder="All branches" />
          </SelectTrigger>
          <SelectContent>
            {branches.length > 1 && <SelectItem value={ALL}>All branches</SelectItem>}
            {branches.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-sidebar-foreground/70">Zone</Label>
        <Select
          value={filters.zone || (visibleZones.length === 1 ? visibleZones[0] : ALL)}
          onValueChange={(v) => set("zone", v === ALL ? "" : v)}
        >
          <SelectTrigger className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground">
            <SelectValue placeholder="All zones" />
          </SelectTrigger>
          <SelectContent>
            {visibleZones.length > 1 && <SelectItem value={ALL}>All zones</SelectItem>}
            {visibleZones.map((z) => (
              <SelectItem key={z} value={z}>
                {z}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-sidebar-foreground/70">City</Label>
        <Select value={filters.city || ALL} onValueChange={(v) => set("city", v === ALL ? "" : v)}>
          <SelectTrigger className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {visibleCities.length > 1 && <SelectItem value={ALL}>All cities</SelectItem>}
            {visibleCities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-sidebar-foreground/70">Post Code</Label>
        <Input
          value={filters.postCode}
          onChange={(e) => set("postCode", e.target.value)}
          placeholder="e.g. 71034"
          inputMode="numeric"
          className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground placeholder:text-sidebar-foreground/40"
        />
      </div>
    </div>
  )
}
