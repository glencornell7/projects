"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ConversionGoalDetail from "@/components/conversion-goal-detail"
import { DataProvider } from "@/lib/data-context"
import { Toaster } from "@/components/ui/toaster"

export default function ConversionGoalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const goalId = params.id as string

  return (
    <DataProvider>
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto pt-4">
          <Link href="/goals">
            <Button variant="ghost" className="mb-4 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Metrics
            </Button>
          </Link>
        </div>
        <ConversionGoalDetail goalId={goalId} onBack={() => router.push("/goals")} />
        <Toaster />
      </main>
    </DataProvider>
  )
}
