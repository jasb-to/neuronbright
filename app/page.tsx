import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronRight } from "lucide-react"
import Header from "@/components/header"
import PricingCard from "@/components/pricing-card"
import TestimonialCard from "@/components/testimonial-card"
import SEOAnalyzer from "@/components/seo-analyzer"
import { checkUserHasPaid } from "@/app/services/payment-service"

export default async function Home() {
  // Check if the user has paid
  const hasPaid = await checkUserHasPaid()

  return (
    <main className="min-h-screen font-['Poppins']">
      {/* Hero Section */}
      <section className="bg-[#dc6b27] text-black">
        <Header />
        <div className="container px-4 py-20 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Supercharge Your SEO with AI</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Get instant, actionable SEO insights powered by cutting-edge AI technology
          </p>
          <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 text-xl font-bold">
            Start Now <ChevronRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Signup Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Rankings?</h2>
            <p className="text-lg text-gray-700">Sign up in seconds and transform your SEO strategy today.</p>
          </div>
          <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-2xl shadow-sm">
            <div className="space-y-4">
              <div>
                <Input type="text" placeholder="Your Name" className="w-full p-3 rounded-xl border-gray-300" />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" className="w-full p-3 rounded-xl border-gray-300" />
              </div>
              <Button className="w-full bg-[#dc6b27] hover:bg-[#c05e22] text-black font-bold py-3 rounded-xl">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your SEO Power-Up</h2>
            <p className="text-lg text-gray-700">Select the plan that fits your needs and budget.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Basic"
              price="£149"
              tier="basic"
              description="Perfect for small websites and beginners"
              features={[
                "Quick SEO summary",
                "3 actionable improvement tips",
                "Results delivered via email",
                "One-time analysis",
              ]}
            />

            <PricingCard
              title="Pro"
              price="£299"
              tier="pro"
              description="Ideal for growing websites and businesses"
              features={[
                "Full SEO report",
                "List of 10 AI tools",
                "Display results online",
                "Email report delivery",
                "Priority support",
              ]}
              highlighted={true}
            />

            <PricingCard
              title="Ultimate"
              price="£899"
              tier="ultimate"
              description="For serious businesses and e-commerce sites"
              features={[
                "Comprehensive SEO audit",
                "20 specialised AI tools",
                "Detailed fix instructions",
                "Full report on-site and via email",
                "Premium support",
                "Monthly progress tracking",
              ]}
            />
          </div>
        </div>
      </section>

      {/* URL Input Section */}
      <section id="analyzer" className="py-20 bg-[#dc6b27] text-black">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Analyse Your Website?</h2>
            <p className="text-xl mb-8">
              {hasPaid
                ? "Enter your URL below and let our AI do the magic"
                : "Purchase a plan to unlock our powerful SEO analysis tools"}
            </p>
          </div>
          <SEOAnalyzer hasPaid={hasPaid} />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About Neuron Bright</h2>
              <p className="text-lg text-gray-700 mb-8">We're not your average SEO company</p>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-4">
                At Neuron Bright, we've combined the power of cutting-edge AI with years of SEO expertise to create a
                tool that actually delivers results, not just promises.
              </p>
              <p className="text-lg mb-4">
                Founded by a team of SEO nerds who were tired of outdated practices, we built Neuron Bright to be the
                tool we always wished existed: smart, straightforward, and actually effective.
              </p>
              <p className="text-lg">
                Our AI doesn't just analyse your site—it thinks like Google, predicts trends, and gives you actionable
                advice that makes sense for YOUR specific business. No generic tips, no fluff, just results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-700">Don't just take our word for it</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialCard
              quote="I was skeptical about AI SEO tools, but Neuron Bright blew me away. My traffic increased by 43% in just two months!"
              author="Sarah Johnson"
              role="E-commerce Entrepreneur"
              avatarUrl="/placeholder.svg?height=80&width=80"
            />

            <TestimonialCard
              quote="Finally, an SEO tool that doesn't make me want to pull my hair out. Simple, effective, and actually fun to use!"
              author="Mark Thompson"
              role="Digital Marketing Director"
              avatarUrl="/placeholder.svg?height=80&width=80"
            />

            <TestimonialCard
              quote="The Ultimate plan was worth every penny. It's like having an entire SEO team working for you 24/7."
              author="Jessica Chen"
              role="Startup Founder"
              avatarUrl="/placeholder.svg?height=80&width=80"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-700">Everything you need to know about Neuron Bright</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium">
                  Is this just another AI tool that spits out generic advice?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Absolutely not! Our AI is trained on real-world SEO success cases and constantly updated with the
                  latest algorithm changes. We provide specific, actionable advice tailored to your website, not generic
                  tips you could find on any blog.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-medium">How quickly will I see results?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  While SEO is a marathon, not a sprint, our clients typically start seeing improvements within 2-4
                  weeks of implementing our recommendations. The full impact usually becomes clear after 2-3 months.
                  Remember, good SEO takes time, but it's worth it!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-medium">
                  Do I need technical knowledge to use Neuron Bright?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Not at all! We've designed Neuron Bright to be user-friendly for everyone from SEO newbies to experts.
                  Our reports explain everything in plain English, and our fix instructions are step-by-step. If you can
                  use email, you can use Neuron Bright.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-medium">
                  What makes your AI different from other SEO tools?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Most SEO tools just check boxes and run through standard metrics. Our AI actually understands context,
                  user intent, and the specific needs of your industry. It's like having an SEO expert who works 24/7
                  exclusively for you, constantly learning and adapting.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-medium">Can I upgrade my plan later?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  You can upgrade your plan at any time. We'll even apply a prorated discount from your current plan to
                  make the transition smooth and cost-effective. Just contact our support team, and they'll handle
                  everything.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white py-12">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Neuron Bright</h3>
              <p className="text-gray-400">AI-powered SEO solutions for modern businesses.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">hello@neuronbright.com</p>
              <p className="text-gray-400">+44 (0) 123 456 7890</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Instagram
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Neuron Bright. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
