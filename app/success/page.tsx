"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { getCheckoutSession } from "@/app/actions/stripe-actions"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionData = async () => {
      const sessionId = searchParams.get("session_id")

      if (!sessionId) {
        setError("No session ID found. Invalid payment session.")
        setLoading(false)
        return
      }

      try {
        const result = await getCheckoutSession(sessionId)

        if (result.success && result.session) {
          setSessionData(result.session)
        } else {
          setError(result.error || "Failed to retrieve payment information.")
        }
      } catch (error) {
        console.error("Error fetching session data:", error)
        setError("An unexpected error occurred. Please contact support.")
      } finally {
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [searchParams])

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 font-['Poppins']">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-md">
          <CardHeader className="text-center pb-10">
            {loading ? (
              <CardTitle className="text-2xl font-bold">Processing your payment...</CardTitle>
            ) : error ? (
              <CardTitle className="text-2xl font-bold text-red-600">Payment Error</CardTitle>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">Payment Successful!</CardTitle>
                <CardDescription className="text-lg mt-2">Thank you for your purchase</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center">
                <div className="w-10 h-10 border-4 border-[#dc6b27] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center space-y-4">
                <p className="text-red-600">{error}</p>
                <Button asChild>
                  <Link href="/" className="mt-4">
                    Return to Homepage
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-medium">Order Details:</p>
                  <div className="flex justify-between">
                    <span>Plan</span>
                    <span className="font-medium">{sessionData?.metadata?.tier || "SEO Package"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span className="font-medium">
                      {sessionData?.amount_total ? `£${(sessionData.amount_total / 100).toFixed(2)}` : "Paid"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className="font-medium text-green-600">Completed</span>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p>
                    We've sent the payment confirmation and details to your email. You can now continue to analyze your
                    website!
                  </p>
                  <div className="space-x-4">
                    <Button asChild className="bg-[#dc6b27] hover:bg-[#c05e22] text-black">
                      <Link href="/#analyzer">Analyze My Website</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/">Return to Homepage</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
