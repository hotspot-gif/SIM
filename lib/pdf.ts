import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { RetailerDetail } from "./types"
import { formatCurrency, formatNumber } from "./calc"

const NAVY: [number, number, number] = [33, 38, 78]
const BLUE: [number, number, number] = [36, 91, 193]
const PEACH: [number, number, number] = [255, 247, 242]

export const COLLECTION_NOTE =
  "The credit will be applied to the originally submitted retailer's POS account within 30 days from the collection date. The credited amount will be provided as SIM Activation Balance."

export function buildReportDoc(detail: RetailerDetail): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const { retailer, batches, summary } = detail
  const generatedAt = new Date()

  // Header band
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pageWidth, 88, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("SIM Stock Collection Report", 40, 40)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(255, 200, 178)
  doc.text("Defective / Old Stock - Italy Field Operations", 40, 60)
  doc.setTextColor(220, 224, 240)
  doc.text(`Generated: ${generatedAt.toLocaleString("it-IT")}`, pageWidth - 40, 40, { align: "right" })
  doc.text(`Report ID: ${retailer.retailerId}-${generatedAt.getTime().toString().slice(-6)}`, pageWidth - 40, 56, {
    align: "right",
  })

  // Retailer info
  let y = 116
  doc.setTextColor(...NAVY)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Retailer Details", 40, y)
  y += 8
  doc.setDrawColor(...PEACH)

  const info: [string, string][] = [
    ["Retailer ID", retailer.retailerId],
    ["Territory / Zone", retailer.territory || "-"],
    ["City", retailer.city || "-"],
    ["Post Code", retailer.postCode || "-"],
    ["Email", retailer.email || "-"],
    ["Phone", retailer.phone || "-"],
  ]
  autoTable(doc, {
    startY: y,
    body: info,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3, textColor: NAVY },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 120, textColor: BLUE } },
    margin: { left: 40, right: 40 },
  })

  // Stock table
  // @ts-expect-error lastAutoTable is added by the plugin
  y = doc.lastAutoTable.finalY + 20
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(...NAVY)
  doc.text("Collected SIM Stock", 40, y)

  autoTable(doc, {
    startY: y + 8,
    head: [["#", "ICCID FROM", "ICCID TO", "QTY", "FACE VALUE", "DISC %", "REIMBURSEMENT"]],
    body: batches.map((b, i) => [
      String(i + 1),
      b.iccidFr || "-",
      b.iccidTo || "-",
      formatNumber(b.qty),
      formatCurrency(b.faceValue),
      `${b.discount}%`,
      formatCurrency(b.reimbursement),
    ]),
    theme: "striped",
    headStyles: { fillColor: BLUE, textColor: [255, 255, 255], fontSize: 9 },
    styles: { fontSize: 8.5, cellPadding: 4, textColor: NAVY },
    alternateRowStyles: { fillColor: PEACH },
    columnStyles: {
      0: { cellWidth: 28 },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: 40, right: 40 },
  })

  // Summary
  // @ts-expect-error lastAutoTable is added by the plugin
  y = doc.lastAutoTable.finalY + 20
  autoTable(doc, {
    startY: y,
    body: [
      ["Total Qty Collected", formatNumber(summary.totalQty)],
      ["Total Face Value", formatCurrency(summary.totalFaceValue)],
      ["Total Discount", `${formatNumber(summary.totalDiscount)} %`],
      ["Total Reimbursement Amount", formatCurrency(summary.netReimbursement)],
    ],
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 6, textColor: NAVY },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 200, fillColor: [253, 234, 224] },
      1: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: pageWidth - 360, right: 40 },
  })

  // Mandatory note
  // @ts-expect-error lastAutoTable is added by the plugin
  y = doc.lastAutoTable.finalY + 28
  const pageHeight = doc.internal.pageSize.getHeight()
  if (y > pageHeight - 90) {
    doc.addPage()
    y = 60
  }
  doc.setFillColor(253, 234, 224)
  doc.roundedRect(40, y, pageWidth - 80, 60, 6, 6, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...NAVY)
  doc.text("Important Note", 52, y + 18)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  const noteLines = doc.splitTextToSize(COLLECTION_NOTE, pageWidth - 104)
  doc.text(noteLines, 52, y + 32)

  return doc
}

export function downloadReport(detail: RetailerDetail): string {
  const doc = buildReportDoc(detail)
  const fileName = `collection-report-${detail.retailer.retailerId}.pdf`
  doc.save(fileName)
  return fileName
}

export function buildMailtoLink(detail: RetailerDetail): string {
  const { retailer, summary } = detail
  const subject = `SIM Stock Collection Report - ${retailer.retailerId}`
  const body = [
    `Dear ${retailer.retailerId},`,
    "",
    "Please find attached the SIM stock collection report for the defective/old stock collected from your store.",
    "",
    `Total Qty Collected: ${formatNumber(summary.totalQty)}`,
    `Total Reimbursement Amount: ${formatCurrency(summary.netReimbursement)}`,
    "",
    COLLECTION_NOTE,
    "",
    "Kind regards,",
    "Field Operations Team",
  ].join("\n")
  return `mailto:${retailer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
