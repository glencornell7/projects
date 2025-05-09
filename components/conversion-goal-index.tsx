"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, Filter, MapPin, Plus, Search, Settings, DollarSign, AlertCircle } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ConversionGoal } from "@/lib/types"
import { campaigns } from "@/lib/sample-data-enhanced"
import ConversionGoalSheet from "@/components/conversion-goal-sheet"
import { TrendChart } from "@/components/trend-chart"
import { Glossary } from "@/components/glossary"

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
  const router = useRouter()
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)

  // State for lifecycle stage filters (multi-select)
  const [selectedStages, setSelectedStages] = useState<string[]>([])

  // State for metric type filters (multi-select)
  const [selectedMetricTypes, setSelectedMetricTypes] = useState<string[]>([])

  const filteredGoals = goals.filter((goal) => {
    // Filter by search query
    if (
      searchQuery &&
      !goal.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by lifecycle stage (if any selected)
    if (selectedStages.length > 0 && !selectedStages.includes(goal.category)) {
      return false
    }

    // Filter by metric type (if any selected)
    if (selectedMetricTypes.length > 0) {
      // If metric type filter is active but the goal has no metricType, exclude it
      if (!goal.metricType) return false

      // If the goal's metricType is not in the selected types, exclude it
      if (!selectedMetricTypes.includes(goal.metricType)) return false
    }

    return true
  })

  const handleGoalClick = (goalId: string) => {
    router.push(`/conversion-goals/${goalId}`)
  }

  // Helper function to get chart colors based on category
  const getCategoryColors = (category: string) => {
    switch (category) {
      case "acquisition":
        return { line: "#3b82f6", fill: "rgba(59, 130, 246, 0.1)" }
      case "activation":
        return { line: "#10b981", fill: "rgba(16, 185, 129, 0.1)" }
      case "engagement":
        return { line: "#6366f1", fill: "rgba(99, 102, 241, 0.1)" }
      case "monetization":
        return { line: "#ec4899", fill: "rgba(236, 72, 153, 0.1)" }
      case "retention":
        return { line: "#7265dc", fill: "rgba(114, 101, 220, 0.1)" }
      case "expansion":
        return { line: "#f59e0b", fill: "rgba(245, 158, 11, 0.1)" }
      default:
        return { line: "#7265dc", fill: "rgba(114, 101, 220, 0.1)" }
    }
  }

  // Helper function to get badge color based on lifecycle stage
  const getLifecycleStageBadgeClass = (category: string) => {
    switch (category) {
      case "acquisition":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "activation":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "engagement":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
      case "monetization":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200"
      case "retention":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "expansion":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Toggle a lifecycle stage filter
  const toggleStageFilter = (stage: string) => {
    setSelectedStages((prev) => (prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]))
  }

  // Toggle a metric type filter
  const toggleMetricTypeFilter = (type: string) => {
    setSelectedMetricTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Get the display text for lifecycle stage filter button
  const getStageFilterDisplayText = () => {
    if (selectedStages.length === 0) return "All Lifecycle Stages"
    if (selectedStages.length === 1) {
      const stage = selectedStages[0]
      return stage.charAt(0).toUpperCase() + stage.slice(1)
    }
    return `${selectedStages.length} stages selected`
  }

  // Get the display text for metric type filter button
  const getMetricTypeFilterDisplayText = () => {
    if (selectedMetricTypes.length === 0) return "All Metric Types"
    if (selectedMetricTypes.length === 1) {
      const type = selectedMetricTypes[0]
      return type === "outcome" ? "Outcome Metrics" : "Aha Moment Metrics"
    }
    return `${selectedMetricTypes.length} types selected`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Metrics</h1>
                <Glossary />
              </div>
              <p className="text-gray-500">
                {selectedStages.length === 0
                  ? "All metrics across your customer lifecycle"
                  : selectedStages.length === 1
                    ? `${selectedStages[0].charAt(0).toUpperCase() + selectedStages[0].slice(1)} stage metrics for your customer lifecycle`
                    : `${selectedStages.length} lifecycle stages selected`}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/lifecycle-map">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Lifecycle Map
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Switch to Dashboard View
                </Button>
              </Link>
              <Button className="bg-[#7265dc] hover:bg-[#5d4fc7] text-white" onClick={() => setIsCreatorOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Metric
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-8">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Lifecycle Stage Filter with Checkboxes */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {getStageFilterDisplayText()}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-medium text-sm">Lifecycle Stages</h3>
                  </div>
                  <div className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stage-acquisition"
                          checked={selectedStages.includes("acquisition")}
                          onCheckedChange={() => toggleStageFilter("acquisition")}
                        />
                        <Label htmlFor="stage-acquisition" className="text-sm font-normal cursor-pointer">
                          Acquisition
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stage-activation"
                          checked={selectedStages.includes("activation")}
                          onCheckedChange={() => toggleStageFilter("activation")}
                        />
                        <Label htmlFor="stage-activation" className="text-sm font-normal cursor-pointer">
                          Activation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stage-engagement"
                          checked={selectedStages.includes("engagement")}
                          onCheckedChange={() => toggleStageFilter("engagement")}
                        />
                        <Label htmlFor="stage-engagement" className="text-sm font-normal cursor-pointer">
                          Engagement
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stage-monetization"
                          checked={selectedStages.includes("monetization")}
                          onCheckedChange={() => toggleStageFilter("monetization")}
                        />
                        <Label htmlFor="stage-monetization" className="text-sm font-normal cursor-pointer">
                          Monetization
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stage-retention"
                          checked={selectedStages.includes("retention")}
                          onCheckedChange={() => toggleStageFilter("retention")}
                        />
                        <Label htmlFor="stage-retention" className="text-sm font-normal cursor-pointer">
                          Retention
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stage-expansion"
                          checked={selectedStages.includes("expansion")}
                          onCheckedChange={() => toggleStageFilter("expansion")}
                        />
                        <Label htmlFor="stage-expansion" className="text-sm font-normal cursor-pointer">
                          Expansion
                        </Label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Metric Type Filter with Checkboxes */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {getMetricTypeFilterDisplayText()}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="font-medium text-sm">Metric Types</h3>
                  </div>
                  <div className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="type-outcome"
                          checked={selectedMetricTypes.includes("outcome")}
                          onCheckedChange={() => toggleMetricTypeFilter("outcome")}
                        />
                        <Label htmlFor="type-outcome" className="text-sm font-normal cursor-pointer">
                          Outcome Metrics
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="type-aha"
                          checked={selectedMetricTypes.includes("aha")}
                          onCheckedChange={() => toggleMetricTypeFilter("aha")}
                        />
                        <Label htmlFor="type-aha" className="text-sm font-normal cursor-pointer">
                          Aha Moment Metrics
                        </Label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search metrics..."
                  className="pl-9 bg-white border-gray-300 text-gray-900 focus-visible:ring-[#7265dc] w-full"
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
                    Sort
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem className="focus:bg-gray-100">Highest Value</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">Most Events</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">Recently Created</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-100">Alphabetical</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-4">
            <div className="text-gray-500 text-sm mb-4">
              {filteredGoals.length} metrics {searchQuery ? `matching "${searchQuery}"` : ""}
              {selectedStages.length > 0
                ? ` in ${selectedStages.length} lifecycle ${selectedStages.length === 1 ? "stage" : "stages"}`
                : ""}
              {selectedMetricTypes.length > 0
                ? ` of ${selectedMetricTypes.length} metric ${selectedMetricTypes.length === 1 ? "type" : "types"}`
                : ""}
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
                        Lifecycle Stage
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
                        Count
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-gray-500 font-medium text-sm">
                      <div className="flex items-center cursor-pointer hover:text-gray-900">Trend (12 months)</div>
                    </th>
                    <th className="px-4 py-3 text-gray-500 font-medium text-sm">
                      <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Tactics
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGoals.map((goal) => {
                    const relatedCampaigns = campaigns.filter((campaign) => campaign.goalIds.includes(goal.id))
                    const activeCampaigns = relatedCampaigns.filter((c) => c.status === "active")
                    const chartColors = getCategoryColors(goal.category)

                    return (
                      <tr
                        key={goal.id}
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleGoalClick(goal.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {/* Only show badge if the metric has a metricType */}
                            {goal.metricType && (
                              <div className="mr-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                                        {goal.metricType === "outcome" ? (
                                          <DollarSign className="h-3.5 w-3.5 text-violet-600" />
                                        ) : (
                                          <AlertCircle className="h-3.5 w-3.5 text-emerald-600" />
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{goal.metricType === "outcome" ? "Outcome Metric" : "Aha Moment"}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{goal.name}</div>
                              <div className="text-gray-500 text-sm truncate max-w-xs">{goal.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`font-normal ${getLifecycleStageBadgeClass(goal.category)}`}>
                            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">${goal.value.toLocaleString()}</div>
                          <div className={`text-xs ${goal.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {goal.trend >= 0 ? "+" : ""}
                            {goal.trend}%
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{goal.conversions.toLocaleString()}</div>
                          <div className="text-gray-500 text-xs">Target: {goal.target.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-3">
                          {goal.trendData ? (
                            <TrendChart
                              data={goal.trendData}
                              height={40}
                              width={120}
                              lineColor={chartColors.line}
                              fillColor={chartColors.fill}
                              className="mx-auto"
                            />
                          ) : (
                            <div className="h-10 w-30 bg-gray-100 rounded animate-pulse"></div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <div className="font-medium text-gray-900">{relatedCampaigns.length}</div>
                                  <div className="text-gray-500 text-xs">{activeCampaigns.length} active</div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left" align="start" className="w-64 p-0">
                                <div className="p-3 border-b border-gray-100">
                                  <h3 className="font-medium text-sm">Associated Tactics</h3>
                                </div>
                                <div className="p-3 max-h-[300px] overflow-auto">
                                  {relatedCampaigns.length > 0 ? (
                                    <div className="space-y-2">
                                      {relatedCampaigns.map((campaign) => (
                                        <div key={campaign.id} className="flex items-start space-x-2">
                                          <div
                                            className={`w-2 h-2 mt-1.5 rounded-full ${
                                              campaign.status === "active"
                                                ? "bg-green-500"
                                                : campaign.status === "paused"
                                                  ? "bg-amber-500"
                                                  : "bg-gray-400"
                                            }`}
                                          />
                                          <div>
                                            <div className="text-sm font-medium">{campaign.name}</div>
                                            <div className="text-xs text-gray-500">
                                              {campaign.channel.charAt(0).toUpperCase() + campaign.channel.slice(1)} •{" "}
                                              {campaign.audience}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-500">No tactics associated with this metric</div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
