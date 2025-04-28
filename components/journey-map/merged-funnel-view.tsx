"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Info,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Users,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { JourneyData, JourneyStage } from "./journey-types"

interface MergedFunnelViewProps {
  journeyData: JourneyData
  timeRange: string
  onStageClick?: (stage: JourneyStage) => void
}

// Define the lifecycle stages with more detailed data
const lifecycleStages = [
  {
    id: "acquiring",
    label: "Acquiring",
    count: 902,
    growth: 9,
    direction: "up",
    color: "#e0e7ff",
    description: "Users who have shown interest but haven't signed up",
    healthDistribution: { healthy: 70, churnRisk: 20, opportunity: 10 },
    type: "visit",
  },
  {
    id: "activating",
    label: "Activating",
    count: 3142,
    growth: 24,
    direction: "up",
    color: "#ddd6fe",
    description: "Users who have signed up but haven't completed onboarding",
    healthDistribution: { healthy: 60, churnRisk: 30, opportunity: 10 },
    type: "signup",
  },
  {
    id: "starting",
    label: "Starting",
    count: 22492,
    growth: 11,
    direction: "up",
    color: "#c4b5fd",
    description: "Users who have completed onboarding and are using basic features",
    healthDistribution: { healthy: 75, churnRisk: 15, opportunity: 10 },
    type: "trial",
  },
  {
    id: "growing",
    label: "Growing",
    count: 11376,
    growth: 3,
    direction: "up",
    color: "#a78bfa",
    description: "Users who are actively using the product and expanding usage",
    healthDistribution: { healthy: 80, churnRisk: 5, opportunity: 15 },
    type: "feature",
  },
  {
    id: "championing",
    label: "Championing",
    count: 4501,
    growth: 2,
    direction: "up",
    color: "#8b5cf6",
    description: "Power users who are advocates for your product",
    healthDistribution: { healthy: 90, churnRisk: 0, opportunity: 10 },
    type: "conversion",
  },
  {
    id: "dormant",
    label: "Dormant",
    count: 761,
    growth: 5,
    direction: "down",
    color: "#7c3aed",
    description: "Users who have stopped using the product",
    healthDistribution: { healthy: 0, churnRisk: 90, opportunity: 10 },
    type: "churn",
  },
]

// Define conversion data between stages
const conversionData = [
  {
    id: "acquiring-activating",
    from: "acquiring",
    to: "activating",
    rate: 28.9,
    count: 261,
    name: "Website Signup",
    description: "Users who signed up from the website",
    campaigns: [
      { name: "Homepage CTA", type: "web", performance: "48% click rate" },
      { name: "Blog Sidebar Form", type: "web", performance: "12% conversion" },
    ],
  },
  {
    id: "activating-starting",
    from: "activating",
    to: "starting",
    rate: 71.6,
    count: 2250,
    name: "Onboarding Completion",
    description: "Users who completed the onboarding process",
    campaigns: [
      { name: "Welcome Email Series", type: "email", performance: "62% open rate" },
      { name: "Product Tour", type: "in-app", performance: "78% completion" },
    ],
  },
  {
    id: "starting-growing",
    from: "starting",
    to: "growing",
    rate: 50.6,
    count: 11380,
    name: "Feature Adoption",
    description: "Users who adopted key features",
    campaigns: [
      { name: "Feature Spotlight", type: "in-app", performance: "42% engagement" },
      { name: "Tips & Tricks Email", type: "email", performance: "38% click rate" },
    ],
  },
  {
    id: "growing-championing",
    from: "growing",
    to: "championing",
    rate: 39.6,
    count: 4501,
    name: "Premium Conversion",
    description: "Users who upgraded to premium plans",
    campaigns: [
      { name: "Upgrade Promotion", type: "email", performance: "8.2% conversion" },
      { name: "In-app Upgrade Banner", type: "in-app", performance: "5.4% conversion" },
    ],
  },
  {
    id: "growing-dormant",
    from: "growing",
    to: "dormant",
    rate: 6.7,
    count: 761,
    name: "User Churn",
    description: "Users who became inactive",
    campaigns: [
      { name: "Re-engagement Campaign", type: "email", performance: "22% open rate" },
      { name: "Win-back Offer", type: "email", performance: "3.8% conversion" },
    ],
  },
]

// Summary metrics
const summaryMetrics = [
  { id: "people", label: "People", value: "43,174", change: "+0.7%", direction: "up" },
  { id: "accounts", label: "Accounts", value: "16,493", change: "-1.1%", direction: "down" },
  { id: "mrr", label: "MRR", value: "$1,950,400", change: "-0.4%", direction: "down" },
  { id: "nps", label: "NPS score", value: "68", change: "+1.2%", direction: "up" },
]

export default function MergedFunnelView({ journeyData, timeRange, onStageClick }: MergedFunnelViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [viewType, setViewType] = useState<"people" | "accounts">("people")
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [selectedStage, setSelectedStage] = useState<any | null>(null)
  const [selectedConversion, setSelectedConversion] = useState<any | null>(null)
  const [isStageDetailsOpen, setIsStageDetailsOpen] = useState(false)
  const [isConversionDetailsOpen, setIsConversionDetailsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFunnelLines, setShowFunnelLines] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // In a real implementation, we would process the journey data here
  // For now, we'll use the static data defined above

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)

    // Setup fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handleStageClick = (stage: any) => {
    setSelectedStage(stage)
    setIsStageDetailsOpen(true)

    // Convert to JourneyStage format and call the parent handler if provided
    if (onStageClick) {
      const journeyStage: JourneyStage = {
        id: stage.id,
        name: stage.label,
        type: stage.type as any,
        description: stage.description,
        count: stage.count,
        position: { x: 0, y: 0 }, // Position doesn't matter for this view
      }
      onStageClick(journeyStage)
    }
  }

  const handleConversionClick = (conversion: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedConversion(conversion)
    setIsConversionDetailsOpen(true)
  }

  // Find the maximum count for scaling the bars
  const maxCount = Math.max(...lifecycleStages.map((stage) => stage.count))

  // Get conversion data between two stages
  const getConversionData = (fromId: string, toId: string) => {
    return conversionData.find((data) => data.from === fromId && data.to === toId)
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col bg-white overflow-auto"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "0 0",
        transition: "transform 0.2s ease-out",
      }}
    >
      <div className="p-6 min-w-[1000px]">
        {/* Summary metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {summaryMetrics.map((metric) => (
            <Card key={metric.id} className="bg-gray-50 border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-gray-500">{metric.label}</div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-1">
                  <div className="text-2xl font-semibold">{metric.value}</div>
                  <div className="flex items-center text-sm mt-1">
                    {metric.direction === "up" ? (
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={metric.direction === "up" ? "text-green-500" : "text-red-500"}>
                      {metric.change} this week
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lifecycle stages */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Stages</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-200"></div>
                <span className="text-sm text-gray-600">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span className="text-sm text-gray-600">Churn risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm text-gray-600">Opportunity</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowFunnelLines(!showFunnelLines)}
                >
                  {showFunnelLines ? "Hide Funnel Lines" : "Show Funnel Lines"}
                </Button>
                <Tabs defaultValue="people" onValueChange={(value) => setViewType(value as "people" | "accounts")}>
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="people">People</TabsTrigger>
                    <TabsTrigger value="accounts">Accounts</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4 mb-4">
            {lifecycleStages.map((stage) => (
              <div key={stage.id} className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="text-sm font-medium">{stage.label}</span>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stage.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-sm font-medium">{stage.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Funnel visualization */}
          <div className="relative h-64 mt-8">
            {/* Background gradient for funnel shape */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-transparent rounded-lg"></div>

            {/* Funnel connections */}
            {showFunnelLines && (
              <div className="absolute inset-0 z-10">
                {conversionData.map((conversion) => {
                  const fromIndex = lifecycleStages.findIndex((stage) => stage.id === conversion.from)
                  const toIndex = lifecycleStages.findIndex((stage) => stage.id === conversion.to)

                  if (fromIndex === -1 || toIndex === -1) return null

                  const fromStage = lifecycleStages[fromIndex]
                  const toStage = lifecycleStages[toIndex]

                  // Calculate positions
                  const stageWidth = 100 / lifecycleStages.length
                  const fromX = (fromIndex + 0.5) * stageWidth
                  const toX = (toIndex + 0.5) * stageWidth

                  // Calculate heights based on count
                  const fromHeightPercentage = (fromStage.count / maxCount) * 100
                  const toHeightPercentage = (toStage.count / maxCount) * 100

                  // Connection ID for hover state
                  const connectionId = conversion.id
                  const isHovered = hoveredConnection === connectionId

                  return (
                    <div
                      key={connectionId}
                      className="absolute"
                      style={{
                        left: `${fromX}%`,
                        top: `${100 - fromHeightPercentage}%`,
                        width: `${toX - fromX}%`,
                        height: `${Math.abs(fromHeightPercentage - toHeightPercentage)}%`,
                        opacity: isHovered ? 1 : 0.7,
                        transition: "opacity 0.2s ease-out",
                      }}
                      onMouseEnter={() => setHoveredConnection(connectionId)}
                      onMouseLeave={() => setHoveredConnection(null)}
                    >
                      {/* Curved path showing the flow */}
                      <svg
                        className="absolute top-0 left-0 w-full h-full overflow-visible"
                        style={{ pointerEvents: "none" }}
                      >
                        <path
                          d={`M 0,0 C ${(toX - fromX) * 0.5}%,0 ${(toX - fromX) * 0.5}%,${Math.abs(fromHeightPercentage - toHeightPercentage)} 100%,${Math.abs(fromHeightPercentage - toHeightPercentage)}`}
                          fill="none"
                          stroke={isHovered ? "#7c3aed" : "#c4b5fd"}
                          strokeWidth={isHovered ? "3" : "2"}
                          strokeDasharray={isHovered ? "none" : "5,5"}
                        />
                      </svg>

                      {/* Clickable conversion node */}
                      <div
                        className={`absolute cursor-pointer bg-white border-2 rounded-md shadow-md transition-all duration-200 z-30 ${
                          isHovered ? "border-purple-600 scale-110" : "border-purple-300"
                        }`}
                        style={{
                          left: `${(toX - fromX) * 0.5}%`,
                          top: `${Math.abs(fromHeightPercentage - toHeightPercentage) * 0.5}px`,
                          transform: "translate(-50%, -50%)",
                          padding: isHovered ? "8px 12px" : "6px 10px",
                        }}
                        onClick={(e) => handleConversionClick(conversion, e)}
                      >
                        <div className="flex items-center gap-2">
                          <Users className={`h-4 w-4 ${isHovered ? "text-purple-600" : "text-purple-400"}`} />
                          <div>
                            <div className="font-medium text-xs">{conversion.name}</div>
                            <div className="flex items-center text-xs">
                              <span className="text-green-600 font-medium">{conversion.count.toLocaleString()}</span>
                              <span className="mx-1 text-gray-400">•</span>
                              <span className="text-gray-500">{conversion.rate}%</span>
                            </div>
                          </div>
                          <ChevronRight className={`h-4 w-4 ${isHovered ? "text-purple-600" : "text-gray-300"}`} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Bars */}
            <div className="flex h-full items-end justify-between relative z-20">
              {lifecycleStages.map((stage, index) => {
                // Calculate height percentage based on count
                const heightPercentage = (stage.count / maxCount) * 100
                // Adjust width based on number of stages
                const width = `calc(${100 / lifecycleStages.length}% - 12px)`

                return (
                  <div
                    key={stage.id}
                    className="flex flex-col items-center"
                    style={{ width }}
                    onMouseEnter={() => setHoveredStage(stage.id)}
                    onMouseLeave={() => setHoveredStage(null)}
                    onClick={() => handleStageClick(stage)}
                  >
                    {/* Bar with health distribution */}
                    <div
                      className="w-full rounded-t-md transition-all duration-1000 ease-out relative overflow-hidden cursor-pointer hover:shadow-md"
                      style={{
                        height: `${isVisible ? heightPercentage : 0}%`,
                        backgroundColor: stage.color,
                        transitionDelay: `${index * 100}ms`,
                        transform: hoveredStage === stage.id ? "translateY(-4px)" : "translateY(0)",
                      }}
                    >
                      {/* Health distribution layers */}
                      <div
                        className="absolute bottom-0 left-0 w-full bg-purple-200 transition-all duration-500"
                        style={{
                          height: `${stage.healthDistribution.healthy}%`,
                          opacity: isVisible ? 1 : 0,
                        }}
                      ></div>
                      <div
                        className="absolute bottom-0 left-0 w-full bg-purple-400 transition-all duration-500"
                        style={{
                          height: `${stage.healthDistribution.churnRisk}%`,
                          opacity: isVisible ? 1 : 0,
                        }}
                      ></div>
                      <div
                        className="absolute bottom-0 left-0 w-full bg-purple-600 transition-all duration-500"
                        style={{
                          height: `${stage.healthDistribution.opportunity}%`,
                          opacity: isVisible ? 1 : 0,
                        }}
                      ></div>

                      {/* Hover tooltip */}
                      {hoveredStage === stage.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white p-2 rounded shadow-md text-xs">
                            <div className="font-medium">{stage.label}</div>
                            <div>{stage.count.toLocaleString()} users</div>
                            <div className="mt-1">
                              <div className="flex justify-between">
                                <span>Healthy:</span>
                                <span>{stage.healthDistribution.healthy}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>At risk:</span>
                                <span>{stage.healthDistribution.churnRisk}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Opportunity:</span>
                                <span>{stage.healthDistribution.opportunity}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Growth indicator */}
                    <div
                      className="mt-2 flex items-center text-xs font-medium opacity-0 transition-opacity duration-500"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transitionDelay: `${(index + lifecycleStages.length) * 100}ms`,
                      }}
                    >
                      {stage.direction === "up" ? (
                        <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={stage.direction === "up" ? "text-green-500" : "text-red-500"}>
                        {stage.growth}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Funnel metrics */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-md font-medium mb-3">Funnel Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Overall Conversion</div>
                <div className="text-xl font-semibold">3.8%</div>
                <div className="text-xs text-gray-500">Acquiring → Championing</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Biggest Drop-off</div>
                <div className="text-xl font-semibold">60.4%</div>
                <div className="text-xs text-gray-500">Growing → Championing</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Best Performing Step</div>
                <div className="text-xl font-semibold">71.6%</div>
                <div className="text-xs text-gray-500">Activating → Starting</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col bg-white border border-gray-200 rounded-md shadow-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none rounded-t-md border-b border-gray-200"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-5 w-5 text-gray-700" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none border-b border-gray-200"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-5 w-5 text-gray-700" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none rounded-b-md"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5 text-gray-700" />
                ) : (
                  <Maximize className="h-5 w-5 text-gray-700" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Stage Details Dialog */}
      <Dialog open={isStageDetailsOpen} onOpenChange={setIsStageDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedStage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStage.label}</DialogTitle>
                <DialogDescription>{selectedStage.description}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedStage.count.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">Growth</p>
                    <p
                      className={`text-2xl font-semibold ${selectedStage.direction === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {selectedStage.direction === "up" ? "+" : "-"}
                      {selectedStage.growth}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Health Distribution</h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-200 h-2.5 rounded-full"
                          style={{ width: `${selectedStage.healthDistribution.healthy}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {selectedStage.healthDistribution.healthy}% Healthy
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-400 h-2.5 rounded-full"
                          style={{ width: `${selectedStage.healthDistribution.churnRisk}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {selectedStage.healthDistribution.churnRisk}% At Risk
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${selectedStage.healthDistribution.opportunity}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {selectedStage.healthDistribution.opportunity}% Opportunity
                      </span>
                    </div>
                  </div>

                  {/* Funnel metrics for this stage */}
                  <h3 className="text-lg font-medium text-gray-900 mt-4">Funnel Metrics</h3>
                  <div className="space-y-2">
                    {/* Previous stage conversion (if not first stage) */}
                    {lifecycleStages.findIndex((s) => s.id === selectedStage.id) > 0 && (
                      <div className="p-3 bg-white border border-gray-200 rounded-md">
                        <p className="font-medium text-gray-900">Incoming Conversion</p>
                        <div className="mt-2">
                          {conversionData
                            .filter((rate) => rate.to === selectedStage.id)
                            .map((conversion) => {
                              const fromStage = lifecycleStages.find((s) => s.id === conversion.from)
                              return (
                                <div key={`in-${conversion.from}`} className="flex justify-between items-center">
                                  <span className="text-sm text-gray-700">From {fromStage?.label}</span>
                                  <div className="flex items-center">
                                    <span className="text-sm text-green-600 font-medium mr-1">
                                      {conversion.count.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-500">({conversion.rate}%)</span>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    )}

                    {/* Next stage conversion (if not last stage) */}
                    {lifecycleStages.findIndex((s) => s.id === selectedStage.id) < lifecycleStages.length - 1 && (
                      <div className="p-3 bg-white border border-gray-200 rounded-md">
                        <p className="font-medium text-gray-900">Outgoing Conversion</p>
                        <div className="mt-2">
                          {conversionData
                            .filter((rate) => rate.from === selectedStage.id)
                            .map((conversion) => {
                              const toStage = lifecycleStages.find((s) => s.id === conversion.to)
                              return (
                                <div key={`out-${conversion.to}`} className="flex justify-between items-center">
                                  <span className="text-sm text-gray-700">To {toStage?.label}</span>
                                  <div className="flex items-center">
                                    <span className="text-sm text-green-600 font-medium mr-1">
                                      {conversion.count.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-500">({conversion.rate}%)</span>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mt-4">Related Campaigns</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-white border border-gray-200 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">Onboarding Email Sequence</p>
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">48% open rate</p>
                        <p className="text-xs text-gray-500">32% click rate</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-gray-200 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">Feature Announcement</p>
                        <p className="text-sm text-gray-500">In-app</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">72% view rate</p>
                        <p className="text-xs text-gray-500">28% engagement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Conversion Details Dialog */}
      <Dialog open={isConversionDetailsOpen} onOpenChange={setIsConversionDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedConversion && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedConversion.name}</DialogTitle>
                <DialogDescription>{selectedConversion.description}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">Conversion Count</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedConversion.count.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">Conversion Rate</p>
                    <p className="text-2xl font-semibold text-green-600">{selectedConversion.rate}%</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Stage Transition</h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: lifecycleStages.find((s) => s.id === selectedConversion.from)?.color,
                          }}
                        ></div>
                        <span className="ml-2 font-medium">
                          {lifecycleStages.find((s) => s.id === selectedConversion.from)?.label}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: lifecycleStages.find((s) => s.id === selectedConversion.to)?.color,
                          }}
                        ></div>
                        <span className="ml-2 font-medium">
                          {lifecycleStages.find((s) => s.id === selectedConversion.to)?.label}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-700 mb-1">Drop-off Rate</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: `${selectedConversion.rate}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-red-500">
                          {(100 - selectedConversion.rate).toFixed(1)}% drop-off
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mt-4">Associated Campaigns</h3>
                  <div className="space-y-2">
                    {selectedConversion.campaigns.map((campaign, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white border border-gray-200 rounded-md flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-sm text-gray-500">{campaign.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{campaign.performance}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mt-4">Optimization Suggestions</h3>
                  <div className="p-3 bg-white border border-gray-200 rounded-md">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="min-w-4 mt-0.5 mr-2">•</div>
                        <p>Improve onboarding flow to reduce friction points</p>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-4 mt-0.5 mr-2">•</div>
                        <p>Add targeted messaging for users who haven't converted</p>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-4 mt-0.5 mr-2">•</div>
                        <p>Create a re-engagement campaign for users who dropped off</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
