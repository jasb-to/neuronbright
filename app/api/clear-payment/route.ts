import { clearPayment } from "@/app/services/payment-service"
import { NextResponse } from "next/server"

export async function GET() {
  await clearPayment()
  return NextResponse.json({ success: true, message: "Payment cleared successfully" })
}
