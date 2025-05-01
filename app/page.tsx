import ViewSelector from "@/components/view-selector"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer.io | Conversion Goals",
  description: "Organize your messaging by business outcomes, not just lifecycle stages",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ViewSelector />
    </main>
  )
}
