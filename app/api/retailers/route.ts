import { type NextRequest, NextResponse } from "next/server"
import { searchRetailers } from "@/lib/data"

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const results = searchRetailers({
    q: sp.get("q") ?? undefined,
    branch: sp.get("branch") ?? undefined,
    zone: sp.get("zone") ?? undefined,
    city: sp.get("city") ?? undefined,
    postCode: sp.get("postCode") ?? undefined,
  })
  return NextResponse.json({ results })
}
