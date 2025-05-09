import ViewSelector from "@/components/view-selector"
import type { Metadata } from "next"

// Update the metadata title
export const metadata: Metadata = {
  title: "Customer.io | Index View",
  description: "Organize your messaging by business outcomes across your customer lifecycle",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ViewSelector />
    </main>
  )
}
