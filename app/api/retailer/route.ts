import { type NextRequest, NextResponse } from "next/server"
import { getRetailerDetail } from "@/lib/data"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "Missing retailer id" }, { status: 400 })
  }
  const detail = getRetailerDetail(id)
  if (!detail) {
    return NextResponse.json({ error: "Retailer not found" }, { status: 404 })
  }
  return NextResponse.json(detail)
}
