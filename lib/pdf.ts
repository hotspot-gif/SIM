import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { RetailerDetail } from "./types"
import { formatCurrency, formatNumber } from "./calc"

const NAVY: [number, number, number] = [33, 38, 78]
const BLUE: [number, number, number] = [36, 91, 193]
const PEACH: [number, number, number] = [255, 247, 242]

export type ReportLanguage = "en" | "it"

export const COLLECTION_NOTE_EN = "The credit will be applied to the originally submitted retailer's POS account within 30 days from the collection date. The credited amount will be provided as SIM Activation Balance."
export const COLLECTION_NOTE_IT = "Il credito verrà applicato al conto POS del rivenditore originariamente presentato entro 30 giorni dalla data di raccolta. L'importo accreditato verrà fornito come Saldo di Attivazione SIM."

const TRANSLATIONS = {
  en: {
    reportTitle: "SIM Stock Collection Report",
    subtitle: "Defective / Old Stock - Italy Field Operations",
    generated: "Generated",
    reportId: "Report ID",
    retailerDetails: "Retailer Details",
    retailerId: "Retailer ID",
    territory: "Territory / Zone",
    city: "City",
    postCode: "Post Code",
    email: "Email",
    phone: "Phone",
    collectedStock: "Collected SIM Stock",
    qty: "QTY",
    faceValue: "FACE VALUE",
    disc: "DISC %",
    reimbursement: "REIMBURSEMENT",
    totalQty: "Total Qty Collected",
    totalFaceValue: "Total Face Value",
    totalDiscount: "Total Discount",
    totalReimbursement: "Total Reimbursement Amount",
    importantNote: "Important Note",
    note: COLLECTION_NOTE_EN,
    emailSubject: "SIM Stock Collection Report",
    emailGreeting: "Dear",
    emailBody: "Please find attached the SIM stock collection report for the defective/old stock collected from your store.",
    emailRegards: "Kind regards,",
    emailTeam: "Field Operations Team",
  },
  it: {
    reportTitle: "Rapporto Raccolta Stock SIM",
    subtitle: "Stock Difettoso / Vecchio - Italy Field Operations",
    generated: "Generato il",
    reportId: "ID Rapporto",
    retailerDetails: "Dettagli Rivenditore",
    retailerId: "ID Rivenditore",
    territory: "Territorio / Zona",
    city: "Città",
    postCode: "Codice Postale",
    email: "Email",
    phone: "Telefono",
    collectedStock: "Stock SIM Raccolto",
    qty: "QTA",
    faceValue: "VALORE NOMINALE",
    disc: "SCONTO %",
    reimbursement: "RIMBORSO",
    totalQty: "Qta Totale Raccolta",
    totalFaceValue: "Valore Nominale Totale",
    totalDiscount: "Sconto Totale",
    totalReimbursement: "Importo Totale Rimborso",
    importantNote: "Nota Importante",
    note: COLLECTION_NOTE_IT,
    emailSubject: "Rapporto Raccolta Stock SIM",
    emailGreeting: "Gentile",
    emailBody: "In allegato il rapporto di raccolta stock SIM per lo stock difettoso/vecchio raccolto presso il vostro punto vendita.",
    emailRegards: "Cordiali saluti,",
    emailTeam: "Team Field Operations",
  },
}

export function buildReportDoc(detail: RetailerDetail, lang: ReportLanguage = "en"): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const t = TRANSLATIONS[lang]
  const pageWidth = doc.internal.pageSize.getWidth()
  const { retailer, batches, summary } = detail
  const generatedAt = new Date()

  // Header band
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pageWidth, 88, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text(t.reportTitle, 40, 40)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(255, 200, 178)
  doc.text(t.subtitle, 40, 60)
  doc.setTextColor(220, 224, 240)
  doc.text(`${t.generated}: ${generatedAt.toLocaleString(lang === "it" ? "it-IT" : "en-GB")}`, pageWidth - 40, 40, {
    align: "right",
  })
  doc.text(`${t.reportId}: ${retailer.retailerId}-${generatedAt.getTime().toString().slice(-6)}`, pageWidth - 40, 56, {
    align: "right",
  })

  // Retailer info
  let y = 116
  doc.setTextColor(...NAVY)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text(t.retailerDetails, 40, y)
  y += 8
  doc.setDrawColor(...PEACH)

  const info: [string, string][] = [
    [t.retailerId, retailer.retailerId],
    [t.territory, retailer.territory || "-"],
    [t.city, retailer.city || "-"],
    [t.postCode, retailer.postCode || "-"],
    [t.email, retailer.email || "-"],
    [t.phone, retailer.phone || "-"],
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
  doc.text(t.collectedStock, 40, y)

  autoTable(doc, {
    startY: y + 8,
    head: [["#", "ICCID FROM", "ICCID TO", t.qty, t.faceValue, t.disc, t.reimbursement]],
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
      [t.totalQty, formatNumber(summary.totalQty)],
      [t.totalFaceValue, formatCurrency(summary.totalFaceValue)],
      [t.totalDiscount, `${formatNumber(summary.totalDiscount)} %`],
      [t.totalReimbursement, formatCurrency(summary.netReimbursement)],
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
  doc.text(t.importantNote, 52, y + 18)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  const noteLines = doc.splitTextToSize(t.note, pageWidth - 104)
  doc.text(noteLines, 52, y + 32)

  return doc
}

export function downloadReport(detail: RetailerDetail, lang: ReportLanguage = "en"): string {
  const doc = buildReportDoc(detail, lang)
  const fileName = `collection-report-${detail.retailer.retailerId}.pdf`
  doc.save(fileName)
  return fileName
}

export function buildMailtoLink(detail: RetailerDetail, lang: ReportLanguage = "en"): string {
  const { retailer, summary } = detail
  const t = TRANSLATIONS[lang]
  const subject = `${t.emailSubject} - ${retailer.retailerId}`
  const body = [
    `${t.emailGreeting} ${retailer.retailerId},`,
    "",
    t.emailBody,
    "",
    `${t.totalQty}: ${formatNumber(summary.totalQty)}`,
    `${t.totalReimbursement}: ${formatCurrency(summary.netReimbursement)}`,
    "",
    t.note,
    "",
    t.emailRegards,
    t.emailTeam,
  ].join("\n")
  return `mailto:${retailer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
