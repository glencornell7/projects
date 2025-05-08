"use client"

import JourneyMapView from "@/components/journey-map/journey-map-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LifecycleMapPage() {
  const router = useRouter()

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
      <JourneyMapView onSwitchView={() => router.push("/dashboard")} />
    </main>
  )
}
