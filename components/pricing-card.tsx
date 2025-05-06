"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import { createCheckoutSession, type PricingTier } from "@/app/actions/stripe-actions"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
  tier: PricingTier
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  highlighted = false,
  tier,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleCheckout = async () => {
    setLoading(true)

    try {
      // In a real app, you would collect the email address first
      // For now, using a placeholder email
      const email = "customer@example.com"

      // Get the current URL to use as a return URL
      const returnUrl = window.location.origin

      const result = await createCheckoutSession(tier, email, returnUrl)

      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        console.error("Checkout failed:", result.error)
        alert("Failed to create checkout session. Please try again.")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`overflow-hidden ${highlighted ? "ring-2 ring-[#dc6b27] shadow-lg scale-105" : "border"}`}>
      <CardHeader className={`pb-8 pt-6 text-center ${highlighted ? "bg-[#dc6b27]/10" : ""}`}>
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="mt-2 mb-1">
          <span className="text-4xl font-bold">{price}</span>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-[#dc6b27] mr-2 shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pb-6">
        <Button
          className={`w-full ${
            highlighted ? "bg-[#dc6b27] hover:bg-[#c05e22] text-black" : "bg-gray-900 hover:bg-black text-white"
          } font-bold py-2 rounded-xl`}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Buy Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
