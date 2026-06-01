"use client"

import { useEffect, useMemo, useState } from "react"
import { FileText, Download, Send, FileCheck, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { RetailerDetail, SimBatch } from "@/lib/types"
import { buildReportDoc, buildMailtoLink, type ReportLanguage, COLLECTION_NOTE_EN, COLLECTION_NOTE_IT } from "@/lib/pdf"
import { calcReimbursement, formatCurrency, formatNumber } from "@/lib/calc"

interface Props {
  detail: RetailerDetail | null
}

function buildAdjustedSummary(batches: SimBatch[]) {
  return batches.reduce(
    (acc, batch) => {
      acc.totalQty += batch.qty
      acc.totalFaceValue += batch.faceValue * batch.qty
      acc.totalDiscount += batch.discount
      acc.netReimbursement += batch.reimbursement
      acc.batchCount += 1
      return acc
    },
    { totalQty: 0, totalFaceValue: 0, totalDiscount: 0, netReimbursement: 0, batchCount: 0 },
  )
}

export function ReportPanel({ detail }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [editableBatches, setEditableBatches] = useState<SimBatch[]>([])
  const [reportFilter, setReportFilter] = useState<"all" | "zero" | "aboveZero">("all")
  const [language, setLanguage] = useState<ReportLanguage>("en")

  useEffect(() => {
    if (detail) {
      setEditableBatches(detail.batches.map((b) => ({ ...b })))
    } else {
      setEditableBatches([])
    }
  }, [detail])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const filteredBatchesWithIndex = useMemo(() => {
    return editableBatches
      .map((batch, index) => ({ batch, index }))
      .filter(({ batch }) => {
        if (reportFilter === "zero") return batch.faceValue === 0
        if (reportFilter === "aboveZero") return batch.faceValue > 0
        return true
      })
  }, [editableBatches, reportFilter])

  const filteredBatches = useMemo(() => filteredBatchesWithIndex.map(({ batch }) => batch), [filteredBatchesWithIndex])

  const adjustedDetail = useMemo(() => {
    if (!detail) return null
    const summary = buildAdjustedSummary(filteredBatches)
    return { ...detail, batches: filteredBatches, summary }
  }, [detail, filteredBatches])

  const hasReportBatches = filteredBatches.length > 0

  function updateBatchValue(index: number, field: keyof Pick<SimBatch, "iccidFr" | "iccidTo" | "qty">, value: string) {
    setEditableBatches((current) => {
      const next = [...current]
      const batch = { ...next[index] }
      if (field === "qty") {
        const qty = Number(value.replace(/[^0-9]/g, ""))
        batch.qty = Number.isFinite(qty) ? qty : 0
        batch.reimbursement = calcReimbursement(batch.faceValue, batch.discount, batch.qty)
      } else {
        batch[field] = value
      }
      next[index] = batch
      return next
    })
  }

  function deleteBatch(indexToDelete: number) {
    setEditableBatches((current) => current.filter((_, idx) => idx !== indexToDelete))
  }

  function generate() {
    if (!adjustedDetail) return
    const doc = buildReportDoc(adjustedDetail, language)
    const url = doc.output("bloburl") as unknown as string
    setPreviewUrl(url.toString())
  }

  function download() {
    if (!adjustedDetail) return
    const doc = buildReportDoc(adjustedDetail, language)
    doc.save(`collection-report-${adjustedDetail.retailer.retailerId}.pdf`)
  }

  function send() {
    if (!adjustedDetail) return
    download()
    window.location.href = buildMailtoLink(adjustedDetail, language)
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
        <div className="flex flex-wrap items-center gap-2 pb-3">
          <span className="font-medium text-foreground">Include in report:</span>
          <button
            type="button"
            onClick={() => setReportFilter("all")}
            className={`rounded-full border px-3 py-1 text-[11px] ${reportFilter === "all" ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-muted-foreground"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setReportFilter("zero")}
            className={`rounded-full border px-3 py-1 text-[11px] ${reportFilter === "zero" ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-muted-foreground"}`}
          >
            €0 SIM only
          </button>
          <button
            type="button"
            onClick={() => setReportFilter("aboveZero")}
            className={`rounded-full border px-3 py-1 text-[11px] ${reportFilter === "aboveZero" ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-muted-foreground"}`}
          >
            Preload/Credit SIM
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pb-3 border-t border-border/50 pt-3">
          <span className="font-medium text-foreground">Report Language:</span>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`rounded-full border px-3 py-1 text-[11px] ${language === "en" ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-muted-foreground"}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("it")}
            className={`rounded-full border px-3 py-1 text-[11px] ${language === "it" ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-muted-foreground"}`}
          >
            Italiano
          </button>
        </div>

        <div className="flex justify-between py-0.5">
          <span className="text-muted-foreground">Retailer</span>
          <span className="font-semibold text-foreground">{detail.retailer.retailerId}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-muted-foreground">Qty to collect</span>
          <span className="font-semibold text-foreground">{formatNumber(adjustedDetail.summary.totalQty)}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-muted-foreground">Reimbursement</span>
          <span className="font-semibold text-accent">{formatCurrency(adjustedDetail.summary.netReimbursement)}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-secondary p-3">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Adjust batch details</span>
          <span className="inline-flex items-center gap-1 text-success">
            <Pencil className="size-4" /> Applied to PDF export
          </span>
        </div>
        <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-[1fr_1fr_100px_120px_40px]">
          <span>ICCID FROM</span>
          <span>ICCID TO</span>
          <span>QTY</span>
          <span>Reimbursement</span>
          <span></span>
        </div>
        <div className="mt-2 space-y-2">
          {filteredBatchesWithIndex.length > 0 ? (
            filteredBatchesWithIndex.map(({ batch, index }) => (
              <div key={`${batch.retailerId}-${index}`} className="grid gap-2 text-sm sm:grid-cols-[1fr_1fr_100px_120px_40px] items-center">
                <Input
                  value={batch.iccidFr}
                  onChange={(event) => updateBatchValue(index, "iccidFr", event.target.value)}
                  className="border-sidebar-border bg-background text-foreground"
                />
                <Input
                  value={batch.iccidTo}
                  onChange={(event) => updateBatchValue(index, "iccidTo", event.target.value)}
                  className="border-sidebar-border bg-background text-foreground"
                />
                <Input
                  type="number"
                  value={String(batch.qty)}
                  min={0}
                  onChange={(event) => updateBatchValue(index, "qty", event.target.value)}
                  className="border-sidebar-border bg-background text-foreground"
                />
                <div className="flex items-center rounded-md border border-border bg-card px-3 text-sm font-semibold text-foreground">
                  {formatCurrency(batch.reimbursement)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBatch(index)}
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title="Delete this batch"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
              No batches match the selected report filter.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={generate} disabled={!hasReportBatches} className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
          <FileCheck className="mr-2 size-4" />
          Generate Report PDF
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={download}
            disabled={!hasReportBatches}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="mr-2 size-4" />
            Download
          </Button>
          <Button
            onClick={send}
            disabled={!detail.retailer.email || !hasReportBatches}
            variant="outline"
            className="border-brand-green text-success-foreground hover:bg-success hover:text-success-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
        {language === "it" ? COLLECTION_NOTE_IT : COLLECTION_NOTE_EN}
      </p>
    </div>
  )
}
