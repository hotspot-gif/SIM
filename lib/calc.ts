/**
 * Reimbursement rule (confirmed with field ops):
 *   (Face Value - (Face Value * Discount %)) x QTY
 * DISCOUNT in the dataset is stored as a percentage (e.g. 30, 50, 100).
 */
export function calcReimbursement(faceValue: number, discount: number, qty: number): number {
  const value = (faceValue - faceValue * (discount / 100)) * qty
  return Math.round(value * 100) / 100
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("it-IT").format(value || 0)
}
