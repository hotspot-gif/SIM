"use client"

import { useState } from "react"
import { ScanLine, ShieldCheck, ShieldAlert, Loader2, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetcher } from "@/lib/fetcher"
import type { IccidResult } from "@/lib/types"
import { formatCurrency } from "@/lib/calc"

interface Props {
  onOpenRetailer: (retailerId: string) => void
}

export function IccidValidator({ onOpenRetailer }: Props) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IccidResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function check() {
    const v = value.trim()
    if (!v) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data: IccidResult = await fetcher(`/api/iccid?value=${encodeURIComponent(v)}`)
      setResult(data)
    } catch {
      setError("Could not validate this ICCID. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-brand-purple text-white">
          <ScanLine className="size-4" />
        </span>
        <h2 className="text-sm font-semibold text-foreground">ICCID Validation</h2>
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Enter ICCID (Full or 11-digit short code)"
          inputMode="numeric"
          className="font-mono text-sm"
        />
        <Button onClick={check} disabled={loading} className="bg-primary text-primary-foreground">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Check"}
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {result && result.defective && result.batch && (
        <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="size-4" />
            <span className="text-sm font-bold">DEFECTIVE SIM</span>
          </div>
          <div className="text-[11px] font-medium text-destructive/80 mb-1">
            * This serial number is part of defective stock
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground">
            <div className="col-span-2 flex justify-between">
              <dt className="text-muted-foreground">Retailer ID</dt>
              <dd className="font-semibold">{result.batch.retailerId}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">City</dt>
              <dd>{result.batch.city || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Zone</dt>
              <dd>{result.batch.territory || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Profile</dt>
              <dd>{result.batch.simProfile || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Range From</dt>
              <dd className="font-mono">{result.batch.iccidFr}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Range To</dt>
              <dd className="font-mono">{result.batch.iccidTo}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Reimb.</dt>
              <dd className="font-semibold text-accent">{formatCurrency(result.batch.reimbursement)}</dd>
            </div>
          </dl>
          <Button
            size="sm"
            variant="outline"
            className="mt-1 h-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            onClick={() => onOpenRetailer(result.batch!.retailerId)}
          >
            Open retailer stock
            <ArrowRight className="ml-1 size-3.5" />
          </Button>
        </div>
      )}

      {result && !result.defective && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-success-foreground">
          <ShieldCheck className="size-4 text-success" />
          <span className="text-sm font-medium">Valid / Not part of defective stock</span>
        </div>
      )}
    </div>
  )
}
