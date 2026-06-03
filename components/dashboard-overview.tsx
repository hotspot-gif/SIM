import { Layers, Building2, MapPin, Users, Truck, DollarSign, ClipboardList, Activity } from "lucide-react"
import type { DashboardOverview } from "@/lib/types"
import type { UserProfile } from "@/lib/auth"
import { formatCurrency, formatNumber } from "@/lib/calc"

interface Props {
  overview: DashboardOverview | null
  user: UserProfile
}

const cards = (overview: DashboardOverview) => [
  {
    label: "Retailers to cover",
    value: formatNumber(overview.retailers),
    hint: "Distinct retailers in scope",
    icon: Users,
    accent: "bg-brand-blue",
  },
  {
    label: "Pending retailers",
    value: formatNumber(overview.pendingRetailers),
    hint: "Retailers with stock to collect",
    icon: Activity,
    accent: "bg-brand-cyan",
  },
  {
    label: "Distinct cities",
    value: formatNumber(overview.cities),
    hint: "Covered cities in scope",
    icon: MapPin,
    accent: "bg-brand-purple",
  },
  {
    label: "Visible branches",
    value: formatNumber(overview.branches),
    hint: "Branch groups available",
    icon: Building2,
    accent: "bg-brand-green",
  },
  {
    label: "Visible zones",
    value: formatNumber(overview.zones),
    hint: "Assigned zones in scope",
    icon: ClipboardList,
    accent: "bg-brand-orange",
  },
  {
    label: "Total quantity",
    value: formatNumber(overview.totalQty),
    hint: "SIMs currently loaded",
    icon: Layers,
    accent: "bg-brand-yellow",
  },
  {
    label: "Total value",
    value: formatCurrency(overview.totalFaceValue),
    hint: "Estimated total stock value",
    icon: DollarSign,
    accent: "bg-brand-red",
  },
  {
    label: "Total batches",
    value: formatNumber(overview.totalBatches),
    hint: "Batch lines in current scope",
    icon: Truck,
    accent: "bg-brand-teal",
  },
]

export function DashboardOverview({ overview, user }: Props) {
  if (!overview) {
    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl border border-border bg-card p-4" />
        ))}
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Account summary</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {user.displayRole} – {user.email}
        </p>
        <div className="mt-4 space-y-2 text-sm text-foreground">
          <p>
            Access scope: <span className="font-semibold">{user.allowedBranches.length} branch(es)</span>,{' '}
            <span className="font-semibold">{user.allowedZones.length} zone(s)</span>
          </p>
          {user.regionLabel && <p>Region: {user.regionLabel}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards(overview).map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{card.value}</p>
              </div>
              <span className={`flex size-8 items-center justify-center rounded-xl text-white ${card.accent}`}>
                <card.icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
