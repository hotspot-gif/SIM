import { AppShell } from "@/components/app-shell"
import { SimScanner } from "@/components/sim-scanner"

export default function SimScanPage() {
  return (
    <AppShell title="ICCID Scan">
      <div className="space-y-4 lg:space-y-6 max-w-4xl mx-auto">
        <div className="rounded-2xl lg:rounded-3xl border border-border bg-card p-3 lg:p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">ICCID Scan</p>
          <h1 className="mt-2 text-xl lg:text-2xl font-semibold text-foreground">ICCID Barcode Scanner</h1>
          <p className="mt-2 text-xs lg:text-sm text-muted-foreground">Scan ICCID codes with your mobile camera.</p>
        </div>
        <SimScanner />
      </div>
    </AppShell>
  )
}
