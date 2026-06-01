import { AppShell } from "@/components/app-shell"
import { SimScanner } from "@/components/sim-scanner"

export default function SerialScanPage() {
  return (
    <AppShell title="Serial Scan">
      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Serial Scan</p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">Retailer SIM Serial Scan</h1>
          <p className="mt-2 text-sm text-muted-foreground">Scan ICCID barcodes and validate retailer SIM stock.</p>
        </div>
        <SimScanner />
      </div>
    </AppShell>
  )
}
