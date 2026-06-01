import type { SimBatch } from "@/lib/types"
import { formatCurrency, formatNumber } from "@/lib/calc"
import { Badge } from "@/components/ui/badge"

interface Props {
  batches: SimBatch[]
}

export function StockTable({ batches }: Props) {
  return (
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
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No SIM stock found for this retailer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
