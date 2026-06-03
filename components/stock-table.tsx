import { useState, useMemo } from "react"
import type { SimBatch } from "@/lib/types"
import { formatCurrency, formatNumber } from "@/lib/calc"
import { Badge } from "@/components/ui/badge"

interface Props {
  batches: SimBatch[]
}

export function StockTable({ batches }: Props) {
  const [filter, setFilter] = useState<"all" | "zero" | "aboveZero">("all")

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (filter === "zero") return b.faceValue === 0
      if (filter === "aboveZero") return b.faceValue > 0
      return true
    })
  }, [batches, filter])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">Filter Table:</span>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
            filter === "all"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border bg-background text-muted-foreground hover:bg-secondary"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("zero")}
          className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
            filter === "zero"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border bg-background text-muted-foreground hover:bg-secondary"
          }`}
        >
          €0 SIM
        </button>
        <button
          type="button"
          onClick={() => setFilter("aboveZero")}
          className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
            filter === "aboveZero"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border bg-background text-muted-foreground hover:bg-secondary"
          }`}
        >
          Preloaded / Credit SIM
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-3 py-2.5 text-left font-semibold">ICCID From</th>
                <th className="px-3 py-2.5 text-left font-semibold">ICCID To</th>
                <th className="px-3 py-2.5 text-left font-semibold">Auth Date</th>
                <th className="px-3 py-2.5 text-left font-semibold">Profile</th>
                <th className="px-3 py-2.5 text-left font-semibold">Status</th>
                <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
                <th className="px-3 py-2.5 text-right font-semibold">Face Value</th>
                <th className="px-3 py-2.5 text-right font-semibold">Disc %</th>
                <th className="px-3 py-2.5 text-right font-semibold">Reimbursement</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((b, i) => (
                <tr
                  key={`${b.iccidStart}-${b.iccidFr}-${i}`}
                  className="border-t border-border odd:bg-secondary/40 hover:bg-secondary"
                >
                  <td className="px-3 py-2.5 font-mono text-xs text-foreground">{b.iccidFr || "-"}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-foreground">{b.iccidTo || "-"}</td>
                  <td className="px-3 py-2.5 text-sm text-foreground">
                    {b.authDate ? new Date(b.authDate).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).split(' ').join('-') : "-"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="border-brand-peach bg-secondary text-[10px] font-medium text-foreground"
                      >
                        {b.simProfile || "-"}
                      </Badge>
                      {b.logo === "OLD" && (
                        <span className="text-[10px] font-semibold text-destructive">OLD</span>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-foreground">{b.status || "-"}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-foreground">{formatNumber(b.qty)}</td>
                  <td className="px-3 py-2.5 text-right text-foreground">{formatCurrency(b.faceValue)}</td>
                  <td className="px-3 py-2.5 text-right text-foreground">{b.discount}%</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-accent">
                    {formatCurrency(b.reimbursement)}
                  </td>
                </tr>
              ))}
              {filteredBatches.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No matching SIM stock found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
