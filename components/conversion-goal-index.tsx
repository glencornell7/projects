"use client"

import { useState, useMemo } from "react"
import {
  BarChart3,
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ConversionGoalCard from "./conversion-goal-card"
import { TrendChart } from "./trend-chart"
import { useData } from "@/lib/data-context"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AddTacticForm } from "./add-tactic-form"

interface ConversionGoalIndexProps {
  onGoalSelect: (goalId: string) => void
  onCreateGoal: () => void
  onSwitchView: () => void
  onViewJourneyMap: () => void
}

export default function ConversionGoalIndex({
  onGoalSelect,
  onCreateGoal,
  onSwitchView,
  onViewJourneyMap,
}: ConversionGoalIndexProps) {
  const { goals, getCampaignsForGoal } = useData()

  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [sortBy, setSortBy] = useState<"name" | "value" | "conversions" | "trend">("conversions")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "acquisition",
    "activation",
    "engagement",
    "monetization",
    "retention",
    "expansion",
  ])
  const [selectedMetricTypes, setSelectedMetricTypes] = useState<string[]>(["outcome", "aha", "standard"])
  const [isAddTacticOpen, setIsAddTacticOpen] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(undefined)

  const handleSort = (column: "name" | "value" | "conversions" | "trend") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const filteredGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        const matchesSearch =
          goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          goal.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategories.includes(goal.category)
        const matchesMetricType =
          (goal.metricType === "outcome" && selectedMetricTypes.includes("outcome")) ||
          (goal.metricType === "aha" && selectedMetricTypes.includes("aha")) ||
          (!goal.metricType && selectedMetricTypes.includes("standard"))

        return matchesSearch && matchesCategory && matchesMetricType
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else if (sortBy === "value") {
          return sortOrder === "asc" ? a.value - b.value : b.value - a.value
        } else if (sortBy === "trend") {
          return sortOrder === "asc" ? a.trend - b.trend : b.trend - a.trend
        } else {
          // Default sort by conversions
          return sortOrder === "asc" ? a.conversions - b.conversions : b.conversions - a.conversions
        }
      })
  }, [goals, searchQuery, sortBy, sortOrder, selectedCategories, selectedMetricTypes])

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

  const openAddTacticPanel = (goalId?: string) => {
    setSelectedGoalId(goalId)
    setIsAddTacticOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Metrics</h1>
          <p className="text-gray-500">Track and analyze key metrics across the customer lifecycle</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSwitchView} className="border-gray-300 hover:bg-gray-50">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard View
          </Button>
          <Button variant="outline" onClick={onViewJourneyMap} className="border-gray-300 hover:bg-gray-50">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Lifecycle Map
          </Button>
          <Button onClick={onCreateGoal} className="bg-[#7265dc] hover:bg-[#5d4fc7]">
            <Plus className="h-4 w-4 mr-2" />
            New Metric
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search metrics..."
                className="pl-8 border-gray-300 focus-visible:ring-[#7265dc]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 border-gray-300 hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Lifecycle Stage</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.includes("acquisition")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, "acquisition"])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== "acquisition"))
                      }
                    }}
                  >
                    Acquisition
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.includes("activation")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, "activation"])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== "activation"))
                      }
                    }}
                  >
                    Activation
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.includes("engagement")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, "engagement"])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== "engagement"))
                      }
                    }}
                  >
                    Engagement
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.includes("monetization")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, "monetization"])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== "monetization"))
                      }
                    }}
                  >
                    Monetization
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.includes("retention")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, "retention"])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== "retention"))
                      }
                    }}
                  >
                    Retention
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.includes("expansion")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, "expansion"])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== "expansion"))
                      }
                    }}
                  >
                    Expansion
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 border-gray-300 hover:bg-gray-50">
                    <Sparkles className="h-4 w-4" />
                    Metric Type
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Metric Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={selectedMetricTypes.includes("outcome")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMetricTypes([...selectedMetricTypes, "outcome"])
                      } else {
                        setSelectedMetricTypes(selectedMetricTypes.filter((t) => t !== "outcome"))
                      }
                    }}
                  >
                    Outcome Metrics
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedMetricTypes.includes("aha")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMetricTypes([...selectedMetricTypes, "aha"])
                      } else {
                        setSelectedMetricTypes(selectedMetricTypes.filter((t) => t !== "aha"))
                      }
                    }}
                  >
                    Aha Moment Metrics
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedMetricTypes.includes("standard")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMetricTypes([...selectedMetricTypes, "standard"])
                      } else {
                        setSelectedMetricTypes(selectedMetricTypes.filter((t) => t !== "standard"))
                      }
                    }}
                  >
                    Standard Metrics
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="border rounded-md flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-none ${viewMode === "list" ? "bg-gray-100" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-none ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="p-4">
          <TabsList className="mb-4 bg-gray-100 p-1">
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
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoals.map((goal) => (
                  <ConversionGoalCard
                    key={goal.id}
                    goal={goal}
                    onSelect={onGoalSelect}
                    onAddTactic={() => openAddTacticPanel(goal.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-[300px] cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center">
                          Name
                          {sortBy === "name" && (
                            <ChevronDown
                              className={`ml-1 h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Lifecycle Stage</TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort("conversions")}>
                        <div className="flex items-center justify-end">
                          Count
                          {sortBy === "conversions" && (
                            <ChevronDown
                              className={`ml-1 h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort("value")}>
                        <div className="flex items-center justify-end">
                          Value
                          {sortBy === "value" && (
                            <ChevronDown
                              className={`ml-1 h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort("trend")}>
                        <div className="flex items-center justify-end">
                          Trend
                          {sortBy === "trend" && (
                            <ChevronDown
                              className={`ml-1 h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Tactics</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGoals.map((goal) => {
                      const relatedCampaigns = getCampaignsForGoal(goal.id)
                      const chartColors = getCategoryColors(goal.category)

                      return (
                        <TableRow
                          key={goal.id}
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => onGoalSelect(goal.id)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {goal.metricType && (
                                <div className="flex-shrink-0">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                            goal.metricType === "outcome" ? "bg-blue-50" : "bg-purple-50"
                                          }`}
                                        >
                                          {goal.metricType === "outcome" ? (
                                            <Star className="h-3.5 w-3.5 text-blue-600" />
                                          ) : (
                                            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{goal.metricType === "outcome" ? "Outcome Metric" : "Aha Moment Metric"}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{goal.name}</div>
                                <div className="text-xs text-gray-500 max-w-xs truncate">{goal.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`font-normal ${getLifecycleStageBadgeClass(goal.category)}`}>
                              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-medium text-gray-900">{goal.conversions.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Target: {goal.target.toLocaleString()}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-medium text-gray-900">${goal.value.toLocaleString()}</div>
                            <div className={`text-xs ${goal.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {goal.trend >= 0 ? "+" : ""}
                              {goal.trend}%
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
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
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="inline-flex items-center justify-end">
                                    <BarChart3 className="h-4 w-4 mr-1 text-gray-500" />
                                    <span>{relatedCampaigns.length}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent align="end" className="w-80 p-0 overflow-hidden rounded-lg">
                                  <div className="bg-gray-50 px-4 py-2 border-b">
                                    <p className="font-medium">Associated Tactics</p>
                                  </div>
                                  <div className="p-4 max-h-[300px] overflow-auto">
                                    {relatedCampaigns.length > 0 ? (
                                      <div className="space-y-3">
                                        {relatedCampaigns.map((campaign) => (
                                          <div key={campaign.id} className="flex items-start gap-3">
                                            <span
                                              className={`inline-block w-2 h-2 rounded-full mt-1.5 ${
                                                campaign.status === "active"
                                                  ? "bg-green-500"
                                                  : campaign.status === "paused"
                                                    ? "bg-amber-500"
                                                    : "bg-gray-400"
                                              }`}
                                            ></span>
                                            <div className="flex-1">
                                              <div className="font-medium text-sm">{campaign.name}</div>
                                              <div className="text-xs text-gray-500 mt-0.5">
                                                {campaign.channel.charAt(0).toUpperCase() + campaign.channel.slice(1)} •{" "}
                                                {campaign.audience}
                                              </div>
                                            </div>
                                            <div className="text-right text-xs">
                                              <div className="font-medium">{campaign.conversions.toLocaleString()}</div>
                                              <div className="text-gray-500">${campaign.value.toLocaleString()}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-500 text-center py-4">
                                        No tactics associated with this metric
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation()
                                openAddTacticPanel(goal.id)
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Tactic
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {["acquisition", "activation", "engagement", "monetization", "retention", "expansion"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              {/* Similar content as "all" tab, but filtered by category */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGoals
                    .filter((goal) => goal.category === category)
                    .map((goal) => (
                      <ConversionGoalCard
                        key={goal.id}
                        goal={goal}
                        onSelect={onGoalSelect}
                        onAddTactic={() => openAddTacticPanel(goal.id)}
                      />
                    ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-[300px] cursor-pointer" onClick={() => handleSort("name")}>
                          <div className="flex items-center">
                            Name
                            {sortBy === "name" && (
                              <ChevronDown
                                className={`ml-1 h-4 w-4 transition-transform ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Lifecycle Stage</TableHead>
                        <TableHead className="text-right cursor-pointer" onClick={() => handleSort("conversions")}>
                          <div className="flex items-center justify-end">
                            Count
                            {sortBy === "conversions" && (
                              <ChevronDown
                                className={`ml-1 h-4 w-4 transition-transform ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer" onClick={() => handleSort("value")}>
                          <div className="flex items-center justify-end">
                            Value
                            {sortBy === "value" && (
                              <ChevronDown
                                className={`ml-1 h-4 w-4 transition-transform ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right cursor-pointer" onClick={() => handleSort("trend")}>
                          <div className="flex items-center justify-end">
                            Trend
                            {sortBy === "trend" && (
                              <ChevronDown
                                className={`ml-1 h-4 w-4 transition-transform ${
                                  sortOrder === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Tactics</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGoals
                        .filter((goal) => goal.category === category)
                        .map((goal) => {
                          const relatedCampaigns = getCampaignsForGoal(goal.id)
                          const chartColors = getCategoryColors(goal.category)

                          return (
                            <TableRow
                              key={goal.id}
                              className="cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => onGoalSelect(goal.id)}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {goal.metricType && (
                                    <div className="flex-shrink-0">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div
                                              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                                goal.metricType === "outcome" ? "bg-blue-50" : "bg-purple-50"
                                              }`}
                                            >
                                              {goal.metricType === "outcome" ? (
                                                <Star className="h-3.5 w-3.5 text-blue-600" />
                                              ) : (
                                                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                                              )}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              {goal.metricType === "outcome" ? "Outcome Metric" : "Aha Moment Metric"}
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-900">{goal.name}</div>
                                    <div className="text-xs text-gray-500 max-w-xs truncate">{goal.description}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`font-normal ${getLifecycleStageBadgeClass(goal.category)}`}>
                                  {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-medium text-gray-900">{goal.conversions.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">Target: {goal.target.toLocaleString()}</div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-medium text-gray-900">${goal.value.toLocaleString()}</div>
                                <div className={`text-xs ${goal.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {goal.trend >= 0 ? "+" : ""}
                                  {goal.trend}%
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
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
                              </TableCell>
                              <TableCell className="text-right">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="inline-flex items-center justify-end">
                                        <BarChart3 className="h-4 w-4 mr-1 text-gray-500" />
                                        <span>{relatedCampaigns.length}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent align="end" className="w-80 p-0 overflow-hidden rounded-lg">
                                      <div className="bg-gray-50 px-4 py-2 border-b">
                                        <p className="font-medium">Associated Tactics</p>
                                      </div>
                                      <div className="p-4 max-h-[300px] overflow-auto">
                                        {relatedCampaigns.length > 0 ? (
                                          <div className="space-y-3">
                                            {relatedCampaigns.map((campaign) => (
                                              <div key={campaign.id} className="flex items-start gap-3">
                                                <span
                                                  className={`inline-block w-2 h-2 rounded-full mt-1.5 ${
                                                    campaign.status === "active"
                                                      ? "bg-green-500"
                                                      : campaign.status === "paused"
                                                        ? "bg-amber-500"
                                                        : "bg-gray-400"
                                                  }`}
                                                ></span>
                                                <div className="flex-1">
                                                  <div className="font-medium text-sm">{campaign.name}</div>
                                                  <div className="text-xs text-gray-500 mt-0.5">
                                                    {campaign.channel.charAt(0).toUpperCase() +
                                                      campaign.channel.slice(1)}{" "}
                                                    • {campaign.audience}
                                                  </div>
                                                </div>
                                                <div className="text-right text-xs">
                                                  <div className="font-medium">
                                                    {campaign.conversions.toLocaleString()}
                                                  </div>
                                                  <div className="text-gray-500">
                                                    ${campaign.value.toLocaleString()}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="text-sm text-gray-500 text-center py-4">
                                            No tactics associated with this metric
                                          </div>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openAddTacticPanel(goal.id)
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Tactic
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Add Tactic Side Panel */}
      <Sheet open={isAddTacticOpen} onOpenChange={setIsAddTacticOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg p-0 border-l">
          <div className="flex flex-col h-full">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">Add New Tactic</h2>
              <p className="text-gray-500 mt-1">Create a new tactic to drive this metric</p>
            </div>
            <AddTacticForm goalId={selectedGoalId} onClose={() => setIsAddTacticOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
