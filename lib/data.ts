import "server-only"
import fs from "node:fs"
import path from "node:path"
import { calcReimbursement } from "./calc"
import type {
  SimBatch,
  RetailerSummary,
  RetailerDetail,
  StockSummary,
  FilterOptions,
  IccidResult,
  DashboardOverview,
} from "./types"

interface DataStore {
  batches: SimBatch[]
  retailers: Map<string, RetailerSummary>
}

let cache: DataStore | null = null

function num(v: string): number {
  if (!v) return 0
  const n = Number.parseFloat(v.replace(/[^0-9.\-]/g, ""))
  return Number.isFinite(n) ? n : 0
}

function clean(v: string | undefined): string {
  if (v === undefined || v === null) return ""
  const t = v.trim()
  return t === "NULL" ? "" : t
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    if (!line.trim()) continue
    rows.push(line.split(","))
  }
  return rows
}

function load(): DataStore {
  if (cache) return cache

  const filePath = path.join(process.cwd(), "data", "defective-batches.csv")
  const text = fs.readFileSync(filePath, "utf8")
  const rows = parseCsv(text)
  rows.shift() // header

  const batches: SimBatch[] = []
  const retailers = new Map<string, RetailerSummary>()

  for (const c of rows) {
    const totalCards = num(c[17])
    const faceValue = num(c[18])
    const discount = num(c[20])
    const stockAvailable = num(c[23])
    // Collectible quantity = stock physically still at retailer
    const qty = stockAvailable > 0 ? stockAvailable : 0
    const reimbursement = calcReimbursement(faceValue, discount, qty)

    const batch: SimBatch = {
      vendor: clean(c[0]),
      isrName: clean(c[1]),
      iccidStart: clean(c[2]),
      iccidEnd: clean(c[3]),
      logo: clean(c[4]),
      year: clean(c[5]),
      simProfile: clean(c[6]),
      batchQty: num(c[7]),
      accMgrId: clean(c[8]),
      hotspotId: clean(c[9]),
      resellerId: clean(c[10]),
      territory: clean(c[11]),
      remarks: clean(c[12]),
      retailerId: clean(c[13]),
      placeId: clean(c[14]),
      iccidFr: clean(c[15]),
      iccidTo: clean(c[16]),
      totalCards,
      faceValue,
      fvRemarks: clean(c[19]),
      discount,
      authDate: clean(c[21]),
      bundleCode: clean(c[22]),
      stockAvailable,
      city: clean(c[24]),
      postCode: clean(c[25]),
      email: clean(c[26]),
      phone: clean(c[27]),
      landline: clean(c[28]),
      status: clean(c[29]),
      qty,
      reimbursement,
    }
    if (!batch.retailerId) continue
    batches.push(batch)

    const existing = retailers.get(batch.retailerId)
    if (existing) {
      existing.batchCount += 1
      existing.totalQty += qty
    } else {
      retailers.set(batch.retailerId, {
        retailerId: batch.retailerId,
        city: batch.city,
        postCode: batch.postCode,
        email: batch.email,
        phone: batch.phone,
        territory: batch.territory,
        resellerId: batch.resellerId,
        batchCount: 1,
        totalQty: qty,
      })
    }
  }

  cache = { batches, retailers }
  return cache
}

function branchFromTerritory(territory: string): string {
  // e.g. "HS BARI ZONE 2" -> "HS BARI"
  return territory
    .replace(/\s+ZONE\s+\d+/i, "")
    .replace(/\s+SHOP\s+CLOSED/i, "")
    .trim()
}

export function getFilterOptions(): FilterOptions {
  const { batches } = load()
  const branches = new Set<string>()
  const zones = new Set<string>()
  const cities = new Set<string>()
  const citiesByZone = new Map<string, Set<string>>()

  for (const b of batches) {
    if (b.territory) {
      zones.add(b.territory)
      const branch = branchFromTerritory(b.territory)
      branches.add(branch)
      
      // Map cities by zone (territory)
      if (b.city) {
        if (!citiesByZone.has(b.territory)) {
          citiesByZone.set(b.territory, new Set<string>())
        }
        citiesByZone.get(b.territory)!.add(b.city)
      }
    }
    if (b.city) cities.add(b.city)
  }

  // Convert to object format for JSON serialization
  const citiesByZoneObj: Record<string, string[]> = {}
  for (const [zone, citiesSet] of citiesByZone.entries()) {
    citiesByZoneObj[zone] = [...citiesSet].sort()
  }

  return {
    branches: [...branches].sort(),
    zones: [...zones].sort(),
    cities: [...cities].sort(),
    citiesByZone: citiesByZoneObj,
  }
}

export interface RetailerQuery {
  q?: string
  branch?: string
  zone?: string
  city?: string
  postCode?: string
}

export interface DashboardOverviewQuery extends RetailerQuery {}

export function getOverview(query: DashboardOverviewQuery): DashboardOverview {
  const { batches, retailers } = load()
  const filteredRetailers = Array.from(retailers.values()).filter((r) => {
    if (query.zone && r.territory !== query.zone) return false
    if (query.branch && branchFromTerritory(r.territory) !== query.branch) return false
    if (query.city && r.city !== query.city) return false
    if (query.postCode && r.postCode !== query.postCode) return false
    return true
  })

  const filteredBatches = batches.filter((b) => {
    if (query.zone && b.territory !== query.zone) return false
    if (query.branch && branchFromTerritory(b.territory) !== query.branch) return false
    if (query.city && b.city !== query.city) return false
    if (query.postCode && b.postCode !== query.postCode) return false
    return true
  })

  const cities = new Set<string>()
  const branches = new Set<string>()
  const zones = new Set<string>()

  let totalQty = 0
  let totalFaceValue = 0

  for (const batch of filteredBatches) {
    if (batch.city) cities.add(batch.city)
    if (batch.territory) zones.add(batch.territory)
    branches.add(branchFromTerritory(batch.territory))
    totalQty += batch.qty
    totalFaceValue += batch.faceValue * batch.qty
  }

  return {
    retailers: filteredRetailers.length,
    pendingRetailers: filteredRetailers.filter((r) => r.totalQty > 0).length,
    cities: cities.size,
    branches: branches.size,
    zones: zones.size,
    totalQty,
    totalFaceValue: Math.round(totalFaceValue * 100) / 100,
    totalBatches: filteredBatches.length,
  }
}

export function searchRetailers(query: RetailerQuery, limit = 50): RetailerSummary[] {
  const { retailers } = load()
  const q = query.q?.trim().toLowerCase()
  const results: RetailerSummary[] = []
  for (const r of retailers.values()) {
    if (query.zone && r.territory !== query.zone) continue
    if (query.branch && branchFromTerritory(r.territory) !== query.branch) continue
    if (query.city && r.city !== query.city) continue
    if (query.postCode && r.postCode !== query.postCode) continue
    if (q) {
      const hay = `${r.retailerId} ${r.city} ${r.postCode} ${r.email}`.toLowerCase()
      if (!hay.includes(q)) continue
    }
    results.push(r)
    if (results.length >= limit && !q) break
  }
  results.sort((a, b) => b.totalQty - a.totalQty)
  return results.slice(0, limit)
}

export function getRetailerDetail(retailerId: string): RetailerDetail | null {
  const { batches, retailers } = load()
  const retailer = retailers.get(retailerId)
  if (!retailer) return null
  const list = batches.filter((b) => b.retailerId === retailerId)

  // Prevent duplicate counting of batches (unique by batch range + iccidFr)
  const seen = new Set<string>()
  const unique: SimBatch[] = []
  for (const b of list) {
    const key = `${b.iccidStart}-${b.iccidEnd}-${b.iccidFr}-${b.iccidTo}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(b)
  }

  const summary: StockSummary = unique.reduce<StockSummary>(
    (acc, b) => {
      acc.totalQty += b.qty
      acc.totalFaceValue += b.faceValue
      acc.totalDiscount += b.discount
      acc.netReimbursement += b.reimbursement
      acc.batchCount += 1
      return acc
    },
    { totalQty: 0, totalFaceValue: 0, totalDiscount: 0, netReimbursement: 0, batchCount: 0 },
  )
  summary.netReimbursement = Math.round(summary.netReimbursement * 100) / 100

  return { retailer, batches: unique, summary }
}

export function validateIccid(raw: string): IccidResult {
  const iccid = raw.trim().replace(/\s/g, "")
  const result: IccidResult = { iccid, defective: false, batch: null }
  if (!/^\d+$/.test(iccid)) return result

  const { batches } = load()
  let target: bigint
  try {
    target = BigInt(iccid)
  } catch {
    return result
  }

  for (const b of batches) {
    if (!/^\d+$/.test(b.iccidStart) || !/^\d+$/.test(b.iccidEnd)) continue
    const start = BigInt(b.iccidStart)
    const end = BigInt(b.iccidEnd)
    if (target >= start && target <= end) {
      // All batches in this dataset are defective/old stock
      result.defective = true
      result.batch = b
      return result
    }
  }
  return result
}
