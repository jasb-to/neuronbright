import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 font-['Poppins']">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-md">
          <CardHeader className="text-center pb-10">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Payment Cancelled</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-center space-y-6">
              <p>
                Your payment process was cancelled. If this was a mistake, you can try again or contact our support team
                for assistance.
              </p>

              <div className="space-x-4">
                <Button asChild className="bg-[#dc6b27] hover:bg-[#c05e22] text-black">
                  <Link href="/#pricing">Try Again</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Return to Homepage</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
