export interface SimBatch {
  vendor: string
  isrName: string
  iccidStart: string
  iccidEnd: string
  logo: string
  year: string
  simProfile: string
  batchQty: number
  accMgrId: string
  hotspotId: string
  resellerId: string
  territory: string
  remarks: string
  retailerId: string
  placeId: string
  iccidFr: string
  iccidTo: string
  totalCards: number
  faceValue: number
  fvRemarks: string
  discount: number
  authDate: string
  bundleCode: string
  stockAvailable: number
  city: string
  postCode: string
  email: string
  phone: string
  landline: string
  status: string
  /** Collectible quantity used for reimbursement */
  qty: number
  /** (faceValue * discount%) * qty */
  reimbursement: number
}

export interface RetailerSummary {
  retailerId: string
  city: string
  postCode: string
  email: string
  phone: string
  territory: string
  resellerId: string
  batchCount: number
  totalQty: number
}

export interface StockSummary {
  totalQty: number
  totalFaceValue: number
  totalDiscount: number
  netReimbursement: number
  batchCount: number
  distinctFaceValues: number[]
}

export interface RetailerDetail {
  retailer: RetailerSummary
  batches: SimBatch[]
  summary: StockSummary
}

export interface FilterOptions {
  branches: string[]
  zones: string[]
  cities: string[]
  citiesByZone: Record<string, string[]>
}

export interface DashboardOverview {
  retailers: number
  pendingRetailers: number
  cities: number
  branches: number
  zones: number
  totalQty: number
  totalFaceValue: number
  totalBatches: number
}

export interface IccidResult {
  iccid: string
  defective: boolean
  batch: SimBatch | null
}
