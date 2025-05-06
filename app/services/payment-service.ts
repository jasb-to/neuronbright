"use server"

import { cookies } from "next/headers"

// In a real application, this would check a database or payment provider
// For now, we'll use a simple cookie-based approach for demonstration
export async function checkUserHasPaid(): Promise<boolean> {
  const cookieStore = cookies()
  const paymentStatus = cookieStore.get("payment_status")

  return paymentStatus?.value === "paid"
}

// Set a cookie to simulate payment for demonstration
export async function simulatePayment(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.set("payment_status", "paid", {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })
}

// Clear the payment cookie for testing
export async function clearPayment(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("payment_status")
}
