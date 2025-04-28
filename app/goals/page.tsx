"use client"

import { conversionGoals } from "@/lib/sample-data-enhanced"
import ConversionGoalIndex from "@/components/conversion-goal-index"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GoalsPage() {
  const router = useRouter()

  const handleGoalSelect = (goalId: string) => {
    console.log(`Selected goal: ${goalId}`)
    router.push(`/conversion-goals/${goalId}`)
  }

  const handleCreateGoal = () => {
    console.log("Creating new goal")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto pt-4">
        <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Navigation
        </Button>
      </div>
      <ConversionGoalIndex
        goals={conversionGoals}
        onGoalSelect={handleGoalSelect}
        onCreateGoal={handleCreateGoal}
        onSwitchView={() => router.push("/dashboard")}
        onViewJourneyMap={() => router.push("/journey-map")}
      />
    </main>
  )
}
