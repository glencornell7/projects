"use client"

import { conversionGoals } from "@/lib/sample-data-enhanced"
import ConversionGoalIndex from "@/components/conversion-goal-index"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GoalsPage() {
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
      <ConversionGoalIndex
        goals={conversionGoals}
        onGoalSelect={(goalId) => router.push(`/conversion-goals/${goalId}`)}
        onCreateGoal={() => console.log("Creating new conversion")}
        onSwitchView={() => router.push("/dashboard")}
        onViewJourneyMap={() => router.push("/journey-map")}
      />
    </main>
  )
}
