import { Layers, Coins, Percent, Wallet } from "lucide-react"
import type { StockSummary } from "@/lib/types"
import { formatCurrency, formatNumber } from "@/lib/calc"
import { cn } from "@/lib/utils"

interface Props {
  summary: StockSummary
}

export function SummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Total Qty",
      value: formatNumber(summary.totalQty),
      hint: `${formatNumber(summary.batchCount)} batches`,
      icon: Layers,
      accent: "bg-brand-blue",
    },
    {
      label: "Total Face Value",
      value: formatCurrency(summary.totalFaceValue),
      hint: "Sum of batch face values",
      icon: Coins,
      accent: "bg-brand-purple",
    },
    {
      label: "Total Discount",
      value: `${formatNumber(summary.totalDiscount)}%`,
      hint: "Aggregated discount",
      icon: Percent,
      accent: "bg-brand-cyan",
    },
    {
      label: "Net Reimbursement",
      value: formatCurrency(summary.netReimbursement),
      hint: "(FaceValue x Disc%) x Qty",
      icon: Wallet,
      accent: "bg-brand-green",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {c.label}
            </span>
            <span className={cn("flex size-7 items-center justify-center rounded-md text-white", c.accent)}>
              <c.icon className="size-4" />
            </span>
          </div>
          <span className="text-xl font-bold text-foreground lg:text-2xl">{c.value}</span>
          <span className="text-xs text-muted-foreground">{c.hint}</span>
        </div>
      ))}
    </div>
  )
}
