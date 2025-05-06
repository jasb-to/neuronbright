"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Zap, AlertCircle, InfoIcon, LockIcon } from "lucide-react"
import { analyzeSEO } from "@/app/services/huggingface-service"
import SEOResults from "./seo-results"
import Link from "next/link"

interface SEOAnalyzerProps {
  hasPaid?: boolean
}

export default function SEOAnalyzer({ hasPaid = false }: SEOAnalyzerProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [requiresPayment, setRequiresPayment] = useState(!hasPaid)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a valid URL")
      return
    }

    // Clear previous results
    setResult(null)
    setLoading(true)
    setError(null)
    setRequiresPayment(false)

    try {
      // Pass the payment status to the analysis function
      const analysisResult = await analyzeSEO(url, hasPaid)

      if (analysisResult.requiresPayment) {
        setRequiresPayment(true)
      } else if (analysisResult.success && analysisResult.data) {
        setResult(analysisResult.data)
      } else {
        setError(analysisResult.error || "Failed to analyse the website.")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (requiresPayment) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-50 p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-[#dc6b27]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockIcon className="h-8 w-8 text-[#dc6b27]" />
          </div>
          <h3 className="text-xl font-bold mb-2">SEO Analysis Requires Payment</h3>
          <p className="text-gray-600 mb-6">
            To access our powerful SEO analysis tools, please purchase one of our plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#dc6b27] hover:bg-[#c05e22] text-black">
              <Link href="#pricing">View Pricing Plans</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {process.env.NODE_ENV !== "production" && (
        <div className="max-w-2xl mx-auto mb-4 bg-black/10 p-3 rounded-lg flex items-center">
          <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">
            <strong>Demo Mode:</strong> This is using simulated data for demonstration purposes.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourwebsite.com"
          className="flex-grow p-6 rounded-xl text-lg bg-white"
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 py-6 text-lg font-bold whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analysing...
            </>
          ) : (
            <>
              Analyse Now <Zap className="ml-2" />
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {result && <SEOResults results={result} />}
    </div>
  )
}
