import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The conversion goal you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Return to Dashboard</Button>
        </Link>
      </div>
    </main>
  )
}
