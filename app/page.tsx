import OutcomesContainer from "@/components/outcomes-container"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conversion Goals | Customer.io",
  description: "Organize your messaging by business outcomes, not just lifecycle stages",
}

export default function Home() {
  // For direct access to the index view, we could redirect to a specific path
  // This is optional - just showing how we could structure the app with proper routes
  // redirect('/conversion-goals')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-[#002b36] text-white py-3 px-4 flex items-center">
        <div className="mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="white"
            />
            <path
              d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="font-medium">Production Workspace</div>
      </div>
      <OutcomesContainer />
    </main>
  )
}
