"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, LayoutDashboard, Target } from "lucide-react"

export default function ViewSelector() {
  const router = useRouter()
  const [selectedView, setSelectedView] = useState<string | null>(null)

  const handleViewSelect = (view: string) => {
    setSelectedView(view)
    setTimeout(() => {
      router.push(`/${view}`)
    }, 300)
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer.io Outcomes</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Organize your messaging by business outcomes, not just lifecycle stages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card
          className={`border-2 transition-all ${
            selectedView === "goals"
              ? "border-blue-500 shadow-lg scale-[1.02]"
              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
          }`}
          onClick={() => handleViewSelect("goals")}
        >
          <CardHeader>
            <Target className="h-10 w-10 text-blue-500 mb-2" />
            <CardTitle>Index View</CardTitle>
            <CardDescription>Organize metrics by lifecycle stages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Define and track metrics that align with your business objectives. Organize campaigns and messaging around
              these metrics across different lifecycle stages.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Index
            </Button>
          </CardFooter>
        </Card>

        <Card
          className={`border-2 transition-all ${
            selectedView === "dashboard"
              ? "border-blue-500 shadow-lg scale-[1.02]"
              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
          }`}
          onClick={() => handleViewSelect("dashboard")}
        >
          <CardHeader>
            <LayoutDashboard className="h-10 w-10 text-blue-500 mb-2" />
            <CardTitle>Dashboard View</CardTitle>
            <CardDescription>Track performance of your metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Monitor the performance of your metrics with detailed analytics. See which campaigns are driving the most
              valuable outcomes across your customer lifecycle.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Dashboard
            </Button>
          </CardFooter>
        </Card>

        <Card
          className={`border-2 transition-all ${
            selectedView === "journey-map"
              ? "border-blue-500 shadow-lg scale-[1.02]"
              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
          }`}
          onClick={() => handleViewSelect("journey-map")}
        >
          <CardHeader>
            <BarChart2 className="h-10 w-10 text-blue-500 mb-2" />
            <CardTitle>Lifecycle Map</CardTitle>
            <CardDescription>Visualize customer lifecycle and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              See how users move through your customer lifecycle and identify opportunities to improve metrics with
              interactive visualizations.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Lifecycle Map
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
