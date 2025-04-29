import { conversionGoals } from "@/lib/sample-data-enhanced"
import ConversionGoalIndex from "@/components/conversion-goal-index"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conversions | Customer.io",
  description: "Browse conversions in a structured table with detailed information",
}

export default function GoalsPage() {
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
        onGoalSelect={(goalId) => `/conversion-goals/${goalId}`}
        onCreateGoal={() => console.log("Creating new conversion")}
        onSwitchView={() => console.log("Switch to dashboard")}
        onViewJourneyMap={() => console.log("View journey map")}
      />
    </main>
  )
}
