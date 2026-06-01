import type { SimBatch } from "@/lib/types"
import { formatCurrency, formatNumber } from "@/lib/calc"
import { Badge } from "@/components/ui/badge"

interface Props {
  batches: SimBatch[]
}

export function StockTable({ batches }: Props) {
  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="grid gap-3 lg:hidden">
        {batches.map((b, i) => (
          <div key={`${b.iccidStart}-${b.iccidFr}-${i}`} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Batch Info</span>
              <Badge variant="outline" className="border-brand-peach bg-secondary text-[10px] font-medium text-foreground">
                {b.simProfile || "-"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">ICCID From</span>
                <span className="font-mono text-xs truncate">{b.iccidFr || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">ICCID To</span>
                <span className="font-mono text-xs truncate">{b.iccidTo || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">Auth Date</span>
                <span>{b.authDate ? new Date(b.authDate).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).split(' ').join('-') : "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">Status</span>
                <span className="truncate">{b.status || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase">Qty / Face Value</span>
                <span className="font-semibold">{formatNumber(b.qty)} × {formatCurrency(b.faceValue)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase text-right">Reimbursement</span>
                <span className="font-bold text-accent text-right">{formatCurrency(b.reimbursement)}</span>
              </div>
            </div>
          </div>
        ))}
        {batches.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No SIM stock found for this retailer.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
              {batches.map((b, i) => (
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
              {batches.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No SIM stock found for this retailer.
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
