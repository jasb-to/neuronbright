import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsOfService() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p>Last Updated: May 7, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to Neuron Bright. These Terms of Service ("Terms") govern your access to and use of our website,
              products, and services (collectively, the "Services"). By accessing or using our Services, you agree to be
              bound by these Terms.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our Services. By using our Services, you represent and warrant
              that you meet this requirement.
            </p>

            <h2>3. Your Account</h2>
            <p>
              To access certain features of our Services, you may need to create an account. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2>4. Payment Terms</h2>
            <p>
              Certain aspects of our Services require payment. All payments are processed securely through our payment
              processors. By providing payment information, you represent and warrant that you are authorized to use the
              payment method.
            </p>
            <p>
              All fees are exclusive of taxes, which you are responsible for paying. Fees are non-refundable except as
              required by law or as explicitly stated in these Terms.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              Our Services and all content, features, and functionality thereof, including but not limited to text,
              graphics, logos, icons, images, audio clips, and software, are owned by Neuron Bright or its licensors and
              are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
              republish, download, store, or transmit any of the material on our Services, except as follows:
            </p>
            <ul>
              <li>
                Your computer may temporarily store copies of such materials in RAM incidental to your accessing and
                viewing those materials.
              </li>
              <li>
                You may store files that are automatically cached by your Web browser for display enhancement purposes.
              </li>
              <li>
                You may print or download one copy of a reasonable number of pages of the website for your own personal,
                non-commercial use and not for further reproduction, publication, or distribution.
              </li>
            </ul>

            <h2>6. User Content</h2>
            <p>
              You retain all rights in any content you submit, post, or display on or through our Services ("User
              Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to
              use, reproduce, modify, adapt, publish, translate, distribute, and display such User Content in connection
              with providing and promoting our Services.
            </p>

            <h2>7. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our Services in any way that violates any applicable law or regulation.</li>
              <li>Use our Services to transmit any material that is defamatory, obscene, or offensive.</li>
              <li>
                Use our Services to impersonate any person or entity or misrepresent your affiliation with a person or
                entity.
              </li>
              <li>Interfere with or disrupt our Services or servers or networks connected to our Services.</li>
              <li>
                Attempt to gain unauthorized access to any portion of our Services or any other accounts, computer
                systems, or networks connected to our Services.
              </li>
            </ul>

            <h2>8. Termination</h2>
            <p>
              We may terminate or suspend your access to all or part of our Services, with or without notice, for any
              conduct that we believe violates these Terms or is harmful to the interests of Neuron Bright, our users,
              or third parties, or for any other reason at our sole discretion.
            </p>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
              BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL NEURON BRIGHT, ITS AFFILIATES, OR THEIR
              LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND,
              UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, OUR SERVICES,
              INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Neuron Bright, its affiliates, licensors, and service
              providers, and its and their respective officers, directors, employees, contractors, agents, licensors,
              suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards,
              losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your
              violation of these Terms or your use of the Services.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms and your use of the Services shall be governed by and construed in accordance with the laws of
              the United Kingdom, without giving effect to any choice or conflict of law provision or rule.
            </p>

            <h2>13. Changes to These Terms</h2>
            <p>
              We may revise and update these Terms from time to time at our sole discretion. All changes are effective
              immediately when we post them. Your continued use of the Services following the posting of revised Terms
              means that you accept and agree to the changes.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
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
