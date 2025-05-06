import { simulatePayment } from "@/app/services/payment-service"
import { NextResponse } from "next/server"

export async function GET() {
  await simulatePayment()
  return NextResponse.json({ success: true, message: "Payment simulated successfully" })
}
