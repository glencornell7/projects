import JourneyMapView from "@/components/journey-map/journey-map-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Journey Map | Customer.io",
  description: "Visualize customer paths and conversion flows in an interactive journey map",
}

export default function JourneyMapPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto pt-4">
        <Link href="/">
          <Button variant="ghost" className="mb-4 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Navigation
          </Button>
        </Link>
      </div>
      <JourneyMapView />
    </main>
  )
}
