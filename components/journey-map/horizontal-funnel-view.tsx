"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { JourneyData } from "./journey-types"

interface HorizontalFunnelViewProps {
  journeyData: JourneyData
  timeRange: string
}

// Define the lifecycle stages
const lifecycleStages = [
  { id: "acquiring", label: "Acquiring", count: 902, growth: 9, direction: "up", color: "#e0e7ff" },
  { id: "activating", label: "Activating", count: 3142, growth: 24, direction: "up", color: "#ddd6fe" },
  { id: "starting", label: "Starting", count: 22492, growth: 11, direction: "up", color: "#c4b5fd" },
  { id: "growing", label: "Growing", count: 11376, growth: 3, direction: "up", color: "#a78bfa" },
  { id: "championing", label: "Championing", count: 4501, growth: 2, direction: "up", color: "#8b5cf6" },
  { id: "dormant", label: "Dormant", count: 761, growth: 0, direction: "none", color: "#7c3aed" },
]

// Summary metrics
const summaryMetrics = [
  { id: "people", label: "People", value: "43,174", change: "+0.7%", direction: "up" },
  { id: "accounts", label: "Accounts", value: "16,493", change: "-1.1%", direction: "down" },
  { id: "mrr", label: "MRR", value: "$1,950,400", change: "-0.4%", direction: "down" },
  { id: "nps", label: "NPS score", value: "68", change: "+1.2%", direction: "up" },
]

export default function HorizontalFunnelView({ journeyData, timeRange }: HorizontalFunnelViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [viewType, setViewType] = useState<"people" | "accounts">("people")

  // In a real implementation, we would process the journey data here
  // For now, we'll use the static data from the Figma design

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  // Find the maximum count for scaling the bars
  const maxCount = Math.max(...lifecycleStages.map((stage) => stage.count))

  return (
    <div className="w-full h-full flex flex-col bg-white p-6">
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

        <div className="grid grid-cols-6 gap-4 mb-8">
          {lifecycleStages.map((stage) => (
            <div key={stage.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm font-medium">{stage.label}</span>
                </div>
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
                <div key={stage.id} className="flex flex-col items-center" style={{ width }}>
                  {/* Bar */}
                  <div
                    className="w-full rounded-t-md transition-all duration-1000 ease-out"
                    style={{
                      height: `${isVisible ? heightPercentage : 0}%`,
                      backgroundColor: stage.color,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  ></div>

                  {/* Growth indicator */}
                  {stage.growth > 0 && (
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
                      <span>{stage.growth}%</span>
                    </div>
                  )}
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
        </div>
      </div>
    </div>
  )
}
