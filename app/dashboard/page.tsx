import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import OutcomesContainer from "@/components/outcomes-container"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Customer.io",
  description: "Visualize conversion goals with cards and metrics in a dashboard layout",
}

export default function DashboardPage() {
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
      <OutcomesContainer />
    </main>
  )
}
