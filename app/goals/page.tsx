"use client"

import ConversionGoalIndex from "@/components/conversion-goal-index"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DataProvider } from "@/lib/data-context"
import { Toaster } from "@/components/ui/toaster"

export default function GoalsPage() {
  const router = useRouter()

  return (
    <DataProvider>
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
          onGoalSelect={(goalId) => router.push(`/conversion-goals/${goalId}`)}
          onCreateGoal={() => console.log("Creating new metric")}
          onSwitchView={() => router.push("/dashboard")}
          onViewJourneyMap={() => router.push("/journey-map")}
        />
        <Toaster />
      </main>
    </DataProvider>
  )
}
