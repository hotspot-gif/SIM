import { type NextRequest, NextResponse } from "next/server"
import { validateIccid } from "@/lib/data"

export async function GET(req: NextRequest) {
  const value = req.nextUrl.searchParams.get("value")
  if (!value) {
    return NextResponse.json({ error: "Missing ICCID value" }, { status: 400 })
  }
  return NextResponse.json(validateIccid(value))
}
