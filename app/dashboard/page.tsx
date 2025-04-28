"use client"

import { conversionGoals } from "@/lib/sample-data-enhanced"
import OutcomesContainer from "@/components/outcomes-container"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto pt-4">
        <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Navigation
        </Button>
      </div>
      <OutcomesContainer
        goals={conversionGoals}
        onSwitchView={() => router.push("/goals")}
        onViewJourneyMap={() => router.push("/journey-map")}
      />
    </main>
  )
}
