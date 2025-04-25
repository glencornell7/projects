"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpDown, ChevronDown, Filter, MapPin, Plus, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ConversionGoal } from "@/lib/types"
import { campaigns } from "@/lib/sample-data"
import ConversionGoalSheet from "@/components/conversion-goal-sheet"

interface ConversionGoalIndexProps {
  goals: ConversionGoal[]
  onGoalSelect: (goalId: string) => void
  onCreateGoal: () => void
  onSwitchView: () => void
  onViewJourneyMap: () => void
}

export default function ConversionGoalIndex({
  goals,
  onGoalSelect,
  onCreateGoal,
  onSwitchView,
  onViewJourneyMap,
}: ConversionGoalIndexProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)

  const filteredGoals = goals.filter((goal) => {
    // Filter by search query
    if (
      searchQuery &&
      !goal.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (activeTab !== "all" && goal.category !== activeTab) {
      return false
    }

    return true
  })

  const handleGoalClick = (goalId: string) => {
    router.push(`/conversion-goals/${goalId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Conversion Catalog</h1>
              <p className="text-gray-500">
                {activeTab === "all"
                  ? "All conversion goals across your customer journey"
                  : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} goals for your customer journey`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={onViewJourneyMap}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Journey Map
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={onSwitchView}
              >
                <Settings className="mr-2 h-4 w-4" />
                Switch to Dashboard
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setIsCreatorOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Conversion Goal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-8">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-gray-100">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="acquisition"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                  >
                    Acquisition
                  </TabsTrigger>
                  <TabsTrigger
                    value="activation"
                    className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
                  >
                    Activation
                  </TabsTrigger>
                  <TabsTrigger
                    value="retention"
                    className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
                  >
                    Retention
                  </TabsTrigger>
                  <TabsTrigger
                    value="expansion"
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
                  >
                    Expansion
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search conversion goals..."
                  className="pl-9 bg-white border-gray-300 text-gray-900 focus-visible:ring-blue-500 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem className="focus:bg-gray-100">Highest Value</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">Most Conversions</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">Recently Created</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">Alphabetical</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-4">
            <div className="text-gray-500 text-sm mb-4">
              {filteredGoals.length} conversion goals {searchQuery ? `matching "${searchQuery}"` : ""}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-4 py-3 text-gray-500 font-medium text-sm">
                      <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Name
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-gray-500 font-medium text-sm">
                      <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Category
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-gray-500 font-medium text-sm">
                      <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Value
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-gray-500 font-medium text-sm">
                      <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Conversions
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-gray-500 font-medium text-sm">
                      <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Progress
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-gray-500 font-medium text-sm">
                      <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Campaigns
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGoals.map((goal) => {
                    const progress = Math.min(Math.round((goal.conversions / goal.target) * 100), 100)
                    const relatedCampaigns = campaigns.filter((campaign) => campaign.goalIds.includes(goal.id))

                    return (
                      <tr
                        key={goal.id}
                        className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                          activeTab === "all" ? `hover:bg-${goal.category}-50` : ""
                        }`}
                        onClick={() => handleGoalClick(goal.id)}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{goal.name}</div>
                            <div className="text-gray-500 text-sm truncate max-w-xs">{goal.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={`font-normal ${
                              goal.category === "acquisition"
                                ? "category-acquisition"
                                : goal.category === "activation"
                                  ? "category-activation"
                                  : goal.category === "retention"
                                    ? "category-retention"
                                    : "category-expansion"
                            }`}
                          >
                            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">${goal.value.toLocaleString()}</div>
                          <div className={`text-xs ${goal.trend >= 0 ? "trend-positive" : "trend-negative"}`}>
                            {goal.trend >= 0 ? "+" : ""}
                            {goal.trend}%
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{goal.conversions.toLocaleString()}</div>
                          <div className="text-gray-500 text-xs">Target: {goal.target.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-full max-w-[100px] bg-gray-200 h-2 rounded-full mr-3">
                              <div
                                className={`h-full rounded-full ${
                                  goal.category === "acquisition"
                                    ? "progress-acquisition"
                                    : goal.category === "activation"
                                      ? "progress-activation"
                                      : goal.category === "retention"
                                        ? "progress-retention"
                                        : "progress-expansion"
                                }`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-900 text-sm">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{relatedCampaigns.length}</div>
                          <div className="text-gray-500 text-xs">
                            {relatedCampaigns.filter((c) => c.status === "active").length} active
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ConversionGoalSheet open={isCreatorOpen} onOpenChange={setIsCreatorOpen} />
    </div>
  )
}
