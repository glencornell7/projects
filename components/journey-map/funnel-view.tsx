"use client"

import { useState, useEffect } from "react"
import { ArrowDown, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { JourneyData, JourneyStage } from "./journey-types"

interface FunnelViewProps {
  journeyData: JourneyData
  timeRange: string
  onStageClick: (stage: JourneyStage) => void
}

// Define the funnel stages and their corresponding journey stage types
const funnelStages = [
  { id: "awareness", label: "Awareness", types: ["visit"], color: "bg-gray-100" },
  { id: "acquisition", label: "Acquisition", types: ["signup"], color: "bg-blue-100" },
  { id: "activation", label: "Activation", types: ["trial"], color: "bg-indigo-100" },
  { id: "conversion", label: "Conversion", types: ["conversion"], color: "bg-green-100" },
  { id: "retention", label: "Retention", types: ["retention"], color: "bg-purple-100" },
  { id: "expansion", label: "Expansion", types: ["upgrade"], color: "bg-amber-100" },
]

export default function FunnelView({ journeyData, timeRange, onStageClick }: FunnelViewProps) {
  const [funnelData, setFunnelData] = useState<
    Array<{ id: string; label: string; count: number; stages: JourneyStage[]; color: string }>
  >([])
  const [maxCount, setMaxCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Process journey data into funnel stages
  useEffect(() => {
    const processedData = funnelStages.map((funnelStage) => {
      // Find all journey stages that belong to this funnel stage
      const matchingStages = journeyData.stages.filter((stage) => funnelStage.types.includes(stage.type))

      // Calculate total count for this funnel stage
      const totalCount = matchingStages.reduce((sum, stage) => sum + stage.count, 0)

      return {
        id: funnelStage.id,
        label: funnelStage.label,
        count: totalCount,
        stages: matchingStages,
        color: funnelStage.color,
      }
    })

    // Find the maximum count for scaling
    const max = Math.max(...processedData.map((stage) => stage.count))
    setMaxCount(max)
    setFunnelData(processedData)

    // Trigger animation after data is processed
    setTimeout(() => setIsVisible(true), 100)
  }, [journeyData, timeRange])

  // Calculate conversion rates between stages
  const getConversionRate = (currentIndex: number) => {
    if (currentIndex === 0 || funnelData[currentIndex - 1].count === 0) return 100
    return Math.round((funnelData[currentIndex].count / funnelData[currentIndex - 1].count) * 100)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white">
      <div className="max-w-4xl w-full space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Customer Lifecycle Funnel</h2>

        <div className="space-y-6 transition-all duration-700 ease-in-out transform">
          {funnelData.map((stage, index) => {
            // Calculate width percentage based on the maximum count
            const widthPercentage = stage.count > 0 ? Math.max(20, (stage.count / maxCount) * 100) : 0
            const conversionRate = getConversionRate(index)

            return (
              <div key={stage.id} className="relative">
                {/* Funnel stage */}
                <div
                  className={`mx-auto rounded-md p-4 cursor-pointer transition-all duration-700 ease-in-out ${stage.color} border border-gray-200 shadow-sm hover:shadow-md`}
                  style={{
                    width: `${isVisible ? widthPercentage : 0}%`,
                    opacity: isVisible ? 1 : 0,
                    transform: `translateY(${isVisible ? 0 : 20}px)`,
                    transitionDelay: `${index * 150}ms`,
                  }}
                  onClick={() => stage.stages.length > 0 && onStageClick(stage.stages[0])}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{stage.label}</h3>
                      <p className="text-sm text-gray-600">{stage.count.toLocaleString()} users</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Includes {stage.stages.map((s) => s.name).join(", ")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Conversion rate arrow */}
                {index < funnelData.length - 1 && (
                  <div
                    className="flex flex-col items-center my-1 transition-opacity duration-700"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transitionDelay: `${(index + 0.5) * 150}ms`,
                    }}
                  >
                    <ArrowDown className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{conversionRate}% conversion</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
