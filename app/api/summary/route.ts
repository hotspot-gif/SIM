import { NextRequest, NextResponse } from "next/server"
import { getOverview } from "@/lib/data"

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const overview = getOverview({
    q: sp.get("q") ?? undefined,
    branch: sp.get("branch") ?? undefined,
    zone: sp.get("zone") ?? undefined,
    city: sp.get("city") ?? undefined,
    postCode: sp.get("postCode") ?? undefined,
  })
  return NextResponse.json(overview)
}
