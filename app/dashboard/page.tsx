"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import OutcomesContainer from "@/components/outcomes-container"
import LifecycleStageSummary from "@/components/lifecycle-stage-summary"
import { DataProvider } from "@/lib/data-context"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
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
          <LifecycleStageSummary />
        </div>
        <OutcomesContainer />
        <Toaster />
      </main>
    </DataProvider>
  )
}
