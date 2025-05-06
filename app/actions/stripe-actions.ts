"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export type PricingTier = "basic" | "pro" | "ultimate"

const PRICING_PLANS = {
  basic: {
    price: 14900, // £149 in pence
    name: "Basic SEO Package",
    description: "Quick SEO summary + 3 improvement tips + emailed results",
  },
  pro: {
    price: 29900, // £299 in pence
    name: "Pro SEO Package",
    description: "Full SEO report + 10 AI tools + display and email",
  },
  ultimate: {
    price: 89900, // £899 in pence
    name: "Ultimate SEO Package",
    description: "Comprehensive audit + 20 AI tools + fix instructions + full report",
  },
}

export async function createCheckoutSession(tier: PricingTier, email: string, returnUrl: string) {
  try {
    const plan = PRICING_PLANS[tier]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/cancel`,
      customer_email: email || undefined,
      metadata: {
        tier,
      },
    })

    return { success: true, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: "Failed to create checkout session" }
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return { success: true, session }
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    return { success: false, error: "Failed to retrieve checkout session" }
  }
}
