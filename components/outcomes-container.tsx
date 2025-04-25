"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronDown, Filter, MapPin, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import ConversionGoalCard from "@/components/conversion-goal-card"
import CampaignList from "@/components/campaign-list"
import OutcomeMetrics from "@/components/outcome-metrics"
import ConversionGoalIndex from "@/components/conversion-goal-index"
import ViewSelector from "@/components/view-selector"
import { conversionGoals, campaigns } from "@/lib/sample-data"
import ConversionGoalSheet from "@/components/conversion-goal-sheet"
import JourneyMapView from "@/components/journey-map/journey-map-view"

export default function OutcomesContainer() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("goals")
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"selector" | "dashboard" | "index" | "journey">("selector")

  const totalValue = conversionGoals.reduce((sum, goal) => sum + goal.value, 0)
  const totalConversions = conversionGoals.reduce((sum, goal) => sum + goal.conversions, 0)

  const handleGoalSelect = (goalId: string) => {
    router.push(`/conversion-goals/${goalId}`)
  }

  const filteredCampaigns = selectedGoal
    ? campaigns.filter((campaign) => campaign.goalIds.includes(selectedGoal))
    : campaigns

  const selectedGoalData = selectedGoal ? conversionGoals.find((goal) => goal.id === selectedGoal) : null

  const handleViewChange = (view: "dashboard" | "index" | "journey") => {
    setViewMode(view)
  }

  if (viewMode === "selector") {
    return <ViewSelector onViewChange={handleViewChange} />
  }

  if (viewMode === "index") {
    return (
      <div>
        <ConversionGoalIndex
          goals={conversionGoals}
          onGoalSelect={handleGoalSelect}
          onCreateGoal={() => setIsCreatorOpen(true)}
          onSwitchView={() => setViewMode("dashboard")}
          onViewJourneyMap={() => setViewMode("journey")}
        />
        <ConversionGoalSheet open={isCreatorOpen} onOpenChange={setIsCreatorOpen} />
      </div>
    )
  }

  if (viewMode === "journey") {
    return <JourneyMapView onSwitchView={() => setViewMode("dashboard")} />
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Outcomes Dashboard</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setViewMode("journey")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Journey Map
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setViewMode("index")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Switch to Index
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setIsCreatorOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Conversion Goal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500">Total Value Generated</CardDescription>
            <CardTitle className="text-3xl text-gray-900">${totalValue.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-green-600">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span className="text-sm">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500">Total Conversions</CardDescription>
            <CardTitle className="text-3xl text-gray-900">{totalConversions.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-green-600">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span className="text-sm">+8.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500">Active Campaigns</CardDescription>
            <CardTitle className="text-3xl text-gray-900">{campaigns.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-gray-500">
              <span className="text-sm">Across {conversionGoals.length} conversion goals</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-gray-900">
                  {selectedGoal ? selectedGoalData?.name || "Selected Goal" : "Conversion Goals"}
                </CardTitle>
                {selectedGoal && (
                  <CardDescription className="text-gray-500">Campaigns contributing to this outcome</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                {selectedGoal && (
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setSelectedGoal(null)}
                  >
                    Back to All Goals
                  </Button>
                )}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-gray-100">
                    <TabsTrigger
                      value="goals"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Goals
                    </TabsTrigger>
                    <TabsTrigger
                      value="campaigns"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Campaigns
                    </TabsTrigger>
                    <TabsTrigger
                      value="metrics"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Metrics
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem className="focus:bg-gray-100">Highest Value</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-gray-100">Most Conversions</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-gray-100">Recently Created</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-gray-100">Alphabetical</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activeTab === "goals" && (
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {conversionGoals.map((goal) => (
                    <ConversionGoalCard key={goal.id} goal={goal} onSelect={handleGoalSelect} />
                  ))}
                </div>
              </ScrollArea>
            )}
            {activeTab === "campaigns" && <CampaignList campaigns={filteredCampaigns} goalId={selectedGoal} />}
            {activeTab === "metrics" && <OutcomeMetrics goalId={selectedGoal} goals={conversionGoals} />}
          </CardContent>
        </Card>
      </div>
      <ConversionGoalSheet open={isCreatorOpen} onOpenChange={setIsCreatorOpen} />
    </div>
  )
}
