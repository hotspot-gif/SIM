"use client"

import { useEffect, useState } from "react"
import { FileText, Download, Send, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RetailerDetail } from "@/lib/types"
import { buildReportDoc, buildMailtoLink, COLLECTION_NOTE } from "@/lib/pdf"
import { formatCurrency, formatNumber } from "@/lib/calc"

interface Props {
  detail: RetailerDetail | null
}

export function ReportPanel({ detail }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    setPreviewUrl(null)
    return () => {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
    }
  }, [detail?.retailer.retailerId])

  function generate() {
    if (!detail) return
    const doc = buildReportDoc(detail)
    const url = doc.output("bloburl") as unknown as string
    setPreviewUrl(url.toString())
  }

  function download() {
    if (!detail) return
    const doc = buildReportDoc(detail)
    doc.save(`collection-report-${detail.retailer.retailerId}.pdf`)
  }

  function send() {
    if (!detail) return
    download()
    window.location.href = buildMailtoLink(detail)
  }

  if (!detail) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
          <FileText className="size-6 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium text-foreground">Collection Report</p>
        <p className="max-w-[220px] text-xs text-muted-foreground">
          Select a retailer to generate a downloadable PDF collection report.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-brand-green text-white">
          <FileText className="size-4" />
        </span>
        <h2 className="text-sm font-semibold text-foreground">Collection Report</h2>
      </div>

      <div className="rounded-lg bg-secondary/60 p-3 text-xs">
        <div className="flex justify-between py-0.5">
          <span className="text-muted-foreground">Retailer</span>
          <span className="font-semibold text-foreground">{detail.retailer.retailerId}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-muted-foreground">Qty to collect</span>
          <span className="font-semibold text-foreground">{formatNumber(detail.summary.totalQty)}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-muted-foreground">Reimbursement</span>
          <span className="font-semibold text-accent">{formatCurrency(detail.summary.netReimbursement)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={generate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <FileCheck className="mr-2 size-4" />
          Generate Report PDF
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={download}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Download className="mr-2 size-4" />
            Download
          </Button>
          <Button
            onClick={send}
            variant="outline"
            disabled={!detail.retailer.email}
            className="border-brand-green text-success-foreground hover:bg-success hover:text-success-foreground"
          >
            <Send className="mr-2 size-4" />
            Send
          </Button>
        </div>
        {!detail.retailer.email && (
          <p className="text-[11px] text-muted-foreground">No email on file for this retailer.</p>
        )}
      </div>

      {previewUrl ? (
        <div className="min-h-[280px] flex-1 overflow-hidden rounded-lg border border-border">
          <iframe title="PDF preview" src={previewUrl} className="size-full min-h-[280px]" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-center">
          <FileText className="size-5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Click &quot;Generate Report PDF&quot; to preview the document here.
          </p>
        </div>
      )}

      <p className="rounded-md bg-warning/20 p-2.5 text-[11px] leading-relaxed text-foreground">
        <span className="font-semibold">Note: </span>
        {COLLECTION_NOTE}
      </p>
    </div>
  )
}
