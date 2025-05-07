import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-[#dc6b27] text-black py-4">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-[#dc6b27] font-bold text-xl">NB</span>
            </div>
            <span className="font-bold text-xl">Neuron Bright</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="font-medium hover:underline">
              Features
            </Link>
            <Link href="#pricing" className="font-medium hover:underline">
              Pricing
            </Link>
            <Link href="#about" className="font-medium hover:underline">
              About
            </Link>
            <Link href="#faq" className="font-medium hover:underline">
              FAQ
            </Link>
          </nav>

          <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-2 font-bold">
            <Link href="#analyzer">Start Now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
