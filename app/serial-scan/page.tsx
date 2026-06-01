import Link from "next/link"
import { SimScanner } from "@/components/sim-scanner"
import { ArrowLeft } from "lucide-react"

export default function SerialScanPage() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Serial Scan</p>
            <h1 className="text-2xl font-semibold text-foreground">Retailer SIM Serial Scan</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition hover:bg-secondary">
            <ArrowLeft className="size-4" /> Back to dashboard
          </Link>
        </div>
        <SimScanner />
      </div>
    </div>
  )
}
