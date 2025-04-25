"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface ViewSelectorProps {
  onViewChange: (view: "dashboard" | "index") => void
}

export default function ViewSelector({ onViewChange }: ViewSelectorProps) {
  const [selectedView, setSelectedView] = useState<"dashboard" | "index" | null>(null)

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">Choose a View</h1>
      <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
        Explore two different approaches to organizing your messaging by business outcomes. Select a view to continue.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card
          className={`border hover:border-blue-500 transition-all cursor-pointer shadow-sm ${
            selectedView === "dashboard" ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
          }`}
          onClick={() => setSelectedView("dashboard")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-48 w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 p-4">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 h-16 rounded-md"></div>
                  ))}
                </div>
                <div className="bg-white border border-gray-200 h-24 rounded-md"></div>
              </div>
              {selectedView === "dashboard" && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard View</h3>
            <p className="text-gray-600 mb-4">
              Visualize conversion goals with cards and metrics in a dashboard layout
            </p>
            {selectedView === "dashboard" ? (
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                onClick={() => onViewChange("dashboard")}
              >
                Continue to Dashboard
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full"
                onClick={() => setSelectedView("dashboard")}
              >
                Select Dashboard View
              </Button>
            )}
          </CardContent>
        </Card>

        <Card
          className={`border hover:border-blue-500 transition-all cursor-pointer shadow-sm ${
            selectedView === "index" ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
          }`}
          onClick={() => setSelectedView("index")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-48 w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 p-4">
                <div className="h-8 bg-white border border-gray-200 rounded-md mb-2"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 h-8 rounded-md"></div>
                  ))}
                </div>
              </div>
              {selectedView === "index" && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Index View</h3>
            <p className="text-gray-600 mb-4">
              Browse conversion goals in a structured table with detailed information
            </p>
            {selectedView === "index" ? (
              <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full" onClick={() => onViewChange("index")}>
                Continue to Index
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full"
                onClick={() => setSelectedView("index")}
              >
                Select Index View
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
