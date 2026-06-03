import { Layers, Coins, Wallet, Tag } from "lucide-react"
import type { StockSummary } from "@/lib/types"
import { formatCurrency, formatNumber } from "@/lib/calc"
import { cn } from "@/lib/utils"

interface Props {
  summary: StockSummary
}

const FACE_VALUE_COLORS: Record<number, string> = {
  0: "bg-slate-100 text-slate-700 border-slate-200",
  5: "bg-blue-100 text-blue-700 border-blue-200",
  10: "bg-green-100 text-green-700 border-green-200",
  15: "bg-purple-100 text-purple-700 border-purple-200",
  20: "bg-orange-100 text-orange-700 border-orange-200",
  30: "bg-red-100 text-red-700 border-red-200",
  50: "bg-indigo-100 text-indigo-700 border-indigo-200",
}

function getFaceValueColor(value: number) {
  return FACE_VALUE_COLORS[value] || "bg-brand-gray/10 text-brand-gray border-brand-gray/20"
}

function formatCurrencyShort(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function SummaryCards({ summary }: Props) {
  const cards = [
    {
      id: "qty",
      label: "Total Qty",
      value: formatNumber(summary.totalQty),
      hint: `${formatNumber(summary.batchCount)} batches`,
      icon: Layers,
      accent: "bg-brand-blue",
    },
    {
      id: "types",
      label: "SIM Types",
      value: summary.distinctFaceValues,
      hint: "Available face value types",
      icon: Tag,
      accent: "bg-brand-purple",
    },
    {
      id: "reimb",
      label: "Net Reimbursement",
      value: formatCurrency(summary.netReimbursement),
      hint: "(FaceValue x Disc%) x Qty",
      icon: Wallet,
      accent: "bg-brand-green",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.id}
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
          
          <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
            {c.id === "types" ? (
              (c.value as number[]).length > 0 ? (
                (c.value as number[]).map((val) => (
                  <span
                    key={val}
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold",
                      getFaceValueColor(val)
                    )}
                  >
                    {formatCurrencyShort(val)}
                  </span>
                ))
              ) : (
                <span className="text-xl font-bold text-foreground">€0</span>
              )
            ) : (
              <span className="text-xl font-bold text-foreground lg:text-2xl">
                {c.value as string}
              </span>
            )}
          </div>
          
          <span className="text-xs text-muted-foreground">{c.hint}</span>
        </div>
      ))}
    </div>
  )
}
