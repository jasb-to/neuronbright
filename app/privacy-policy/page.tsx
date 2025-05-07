import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#dc6b27] text-black py-6">
        <div className="container px-4 mx-auto">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-[#dc6b27] font-bold text-xl">NB</span>
              </div>
              <span className="font-bold text-xl">Neuron Bright</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p>Last Updated: May 7, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to Neuron Bright ("we," "our," or "us"). We are committed to protecting your privacy and personal
              data. This Privacy Policy explains how we collect, use, and share information about you when you use our
              website, products, and services (collectively, the "Services").
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect information in the following ways:</p>
            <ul>
              <li>
                <strong>Information you provide to us:</strong> This includes your name, email address, website URL,
                payment information, and any other information you provide when using our Services.
              </li>
              <li>
                <strong>Information we collect automatically:</strong> When you use our Services, we automatically
                collect certain information, including your IP address, device information, browser type, and cookies.
              </li>
              <li>
                <strong>Information from third parties:</strong> We may receive information about you from third
                parties, such as analytics providers and payment processors.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>To provide and improve our Services</li>
              <li>To process payments and manage your account</li>
              <li>To communicate with you about our Services</li>
              <li>To analyze website traffic and optimize user experience</li>
              <li>To protect our Services and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who help us deliver our Services</li>
              <li>Payment processors to complete transactions</li>
              <li>Analytics providers to help us improve our Services</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
            <ul>
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to delete your data</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against
              unauthorized or unlawful processing, accidental loss, destruction, or damage.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to provide you with our Services and as needed to
              comply with our legal obligations.
            </p>

            <h2>8. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than the country in which you
              reside. These countries may have data protection laws that are different from the laws of your country.
            </p>

            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:info@neuronbright.com">info@neuronbright.com</a>.
            </p>
          </div>

          <div className="mt-12">
            <Button asChild className="bg-[#dc6b27] hover:bg-[#c05e22] text-black">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
