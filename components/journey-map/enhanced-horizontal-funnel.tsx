"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, MoreVertical, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { JourneyData } from "./journey-types"

interface EnhancedHorizontalFunnelProps {
  journeyData: JourneyData
  timeRange: string
  onStageClick?: (stageId: string) => void
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
  },
]

// Summary metrics
const summaryMetrics = [
  { id: "people", label: "People", value: "43,174", change: "+0.7%", direction: "up" },
  { id: "accounts", label: "Accounts", value: "16,493", change: "-1.1%", direction: "down" },
  { id: "mrr", label: "MRR", value: "$1,950,400", change: "-0.4%", direction: "down" },
  { id: "nps", label: "NPS score", value: "68", change: "+1.2%", direction: "up" },
]

export default function EnhancedHorizontalFunnel({
  journeyData,
  timeRange,
  onStageClick,
}: EnhancedHorizontalFunnelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [viewType, setViewType] = useState<"people" | "accounts">("people")
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  // In a real implementation, we would process the journey data here
  // For now, we'll use the static data defined above

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  // Find the maximum count for scaling the bars
  const maxCount = Math.max(...lifecycleStages.map((stage) => stage.count))

  return (
    <div className="w-full h-full flex flex-col bg-white p-6 overflow-auto">
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
            <Tabs defaultValue="people" onValueChange={(value) => setViewType(value as "people" | "accounts")}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="people">People</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
              </TabsList>
            </Tabs>
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

          {/* Bars */}
          <div className="flex h-full items-end justify-between relative z-10">
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
                  onClick={() => onStageClick && onStageClick(stage.id)}
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
      </div>

      {/* Suggested segments section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Suggested segments</h2>
          <Button variant="outline" size="sm">
            All stages
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
              $
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Ready to upgrade</h3>
              <p className="text-sm text-gray-500">
                Accounts that are ready to upgrade to a Premium plan based on their product usage and account health
              </p>
            </div>
            <div className="text-right mr-8">
              <div className="font-medium">19</div>
              <div className="text-sm text-gray-500">Accounts</div>
            </div>
            <div className="text-right mr-8">
              <div className="font-medium">Starting</div>
              <div className="text-sm text-gray-500">Stage</div>
            </div>
            <div className="text-right">
              <div className="font-medium">$4,500</div>
              <div className="text-sm text-gray-500">MRR</div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
              !
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Blocked during activation (churn risk)</h3>
              <p className="text-sm text-gray-500">
                Accounts stuck in the activating stage for more than 30 days and are at risk of churning
              </p>
            </div>
            <div className="text-right mr-8">
              <div className="font-medium">12</div>
              <div className="text-sm text-gray-500">Accounts</div>
            </div>
            <div className="text-right mr-8">
              <div className="font-medium">Activating</div>
              <div className="text-sm text-gray-500">Stage</div>
            </div>
            <div className="text-right">
              <div className="font-medium">$3,200</div>
              <div className="text-sm text-gray-500">MRR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
