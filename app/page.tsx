import OutcomesContainer from "@/components/outcomes-container"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conversion Goals | Customer.io",
  description: "Organize your messaging by business outcomes, not just lifecycle stages",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <OutcomesContainer />
    </main>
  )
}
