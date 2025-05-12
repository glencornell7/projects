"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, SlidersHorizontal } from "lucide-react"
import ConversionGoalCard from "./conversion-goal-card"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"

export default function OutcomesContainer() {
  const router = useRouter()
  const { goals } = useData()
  const [activeTab, setActiveTab] = useState("all")

  const filteredGoals = activeTab === "all" ? goals : goals.filter((goal) => goal.category === activeTab)

  const handleGoalSelect = (goalId: string) => {
    router.push(`/conversion-goals/${goalId}`)
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conversion Goals</h1>
          <p className="text-gray-500">Track and manage your key conversion metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/goals")} className="border-gray-300 hover:bg-gray-50">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            List View
          </Button>
          <Button onClick={() => console.log("Creating new metric")} className="bg-[#7265dc] hover:bg-[#5d4fc7]">
            <Plus className="h-4 w-4 mr-2" />
            New Metric
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
            All Metrics
          </TabsTrigger>
          <TabsTrigger
            value="acquisition"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            Acquisition
          </TabsTrigger>
          <TabsTrigger
            value="activation"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            Activation
          </TabsTrigger>
          <TabsTrigger
            value="engagement"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            Engagement
          </TabsTrigger>
          <TabsTrigger
            value="monetization"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            Monetization
          </TabsTrigger>
          <TabsTrigger
            value="retention"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            Retention
          </TabsTrigger>
          <TabsTrigger
            value="expansion"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            Expansion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map((goal) => (
              <ConversionGoalCard key={goal.id} goal={goal} onSelect={handleGoalSelect} />
            ))}
          </div>
        </TabsContent>

        {["acquisition", "activation", "engagement", "monetization", "retention", "expansion"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGoals.map((goal) => (
                <ConversionGoalCard key={goal.id} goal={goal} onSelect={handleGoalSelect} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
