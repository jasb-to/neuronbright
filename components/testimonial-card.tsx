import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatarUrl: string
}

export default function TestimonialCard({ quote, author, role, avatarUrl }: TestimonialCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <p className="text-lg italic">"{quote}"</p>
          </div>

          <div className="mt-auto flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <Image
                src={avatarUrl || "/placeholder.svg"}
                alt={author}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-bold">{author}</p>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
