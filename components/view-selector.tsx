"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ViewSelectorProps {
  onViewChange: (view: "dashboard" | "index" | "journey") => void
}

export default function ViewSelector({ onViewChange }: ViewSelectorProps) {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">Choose a View</h1>
      <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
        Explore different approaches to organizing and visualizing your customer journey and business outcomes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card
          className="border hover:border-blue-500 transition-all cursor-pointer shadow-sm"
          onClick={() => onViewChange("dashboard")}
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
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard View</h3>
            <p className="text-gray-600">Visualize conversion goals with cards and metrics in a dashboard layout</p>
          </CardContent>
        </Card>

        <Card
          className="border hover:border-blue-500 transition-all cursor-pointer shadow-sm"
          onClick={() => onViewChange("index")}
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
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Index View</h3>
            <p className="text-gray-600">Browse conversion goals in a structured table with detailed information</p>
          </CardContent>
        </Card>

        <Card
          className="border hover:border-blue-500 transition-all cursor-pointer shadow-sm"
          onClick={() => onViewChange("journey")}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-48 w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 p-4">
                <div className="flex items-center justify-center h-full">
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-16 h-16 bg-white border border-gray-200 rounded-md"></div>
                    <div className="absolute top-8 left-24 w-16 h-16 bg-white border border-gray-200 rounded-md"></div>
                    <div className="absolute top-24 left-12 w-16 h-16 bg-white border border-gray-200 rounded-md"></div>
                    <div className="absolute top-16 left-40 w-16 h-16 bg-white border border-gray-200 rounded-md"></div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 150">
                      <path d="M16 8 L32 32" stroke="#94a3b8" strokeWidth="1" fill="none" />
                      <path d="M32 32 L24 56" stroke="#94a3b8" strokeWidth="1" fill="none" />
                      <path d="M32 32 L48 48" stroke="#94a3b8" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Journey Map</h3>
            <p className="text-gray-600">Visualize customer paths and conversion flows in an interactive journey map</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
