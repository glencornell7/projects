"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, Users, DollarSign, Percent } from "lucide-react"
import type { JourneyData } from "./journey-types"

interface AnimatedFunnelProps {
  journeyData: JourneyData
  timeRange: string
}

// Define the funnel stages with their corresponding journey stage types
const funnelStages = [
  { id: "awareness", label: "Awareness", types: ["visit"], color: "#f3f4f6", textColor: "#374151" },
  { id: "acquisition", label: "Acquisition", types: ["signup"], color: "#dbeafe", textColor: "#1e40af" },
  { id: "activation", label: "Activation", types: ["trial"], color: "#e0e7ff", textColor: "#4338ca" },
  { id: "conversion", label: "Conversion", types: ["conversion"], color: "#dcfce7", textColor: "#166534" },
  { id: "retention", label: "Retention", types: ["retention"], color: "#f3e8ff", textColor: "#6b21a8" },
  { id: "expansion", label: "Expansion", types: ["upgrade"], color: "#fef3c7", textColor: "#92400e" },
]

export default function AnimatedFunnel({ journeyData, timeRange }: AnimatedFunnelProps) {
  const [funnelData, setFunnelData] = useState<
    Array<{
      id: string
      label: string
      count: number
      value: number
      color: string
      textColor: string
    }>
  >([])
  const [maxCount, setMaxCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Process journey data into funnel stages
  useEffect(() => {
    // In a real implementation, this would fetch data for the selected time range
    // For now, we'll just simulate different data volumes based on the time range
    const timeMultiplier =
      {
        "7days": 0.1,
        "30days": 0.3,
        "90days": 1,
        quarter: 1.2,
        year: 3,
        all: 5,
      }[timeRange] || 1

    const processedData = funnelStages.map((funnelStage) => {
      // Find all journey stages that belong to this funnel stage
      const matchingStages = journeyData.stages.filter((stage) => funnelStage.types.includes(stage.type))

      // Calculate total count and value for this funnel stage
      const totalCount = matchingStages.reduce((sum, stage) => sum + stage.count, 0)
      const totalValue = matchingStages.reduce((sum, stage) => sum + (stage.value || 0), 0)

      return {
        id: funnelStage.id,
        label: funnelStage.label,
        count: Math.round(totalCount * timeMultiplier),
        value: Math.round(totalValue * timeMultiplier),
        color: funnelStage.color,
        textColor: funnelStage.textColor,
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
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Customer Lifecycle Funnel</h2>

        <div className="relative">
          <AnimatePresence>
            {funnelData.map((stage, index) => {
              // Calculate width percentage based on the maximum count
              const widthPercentage = stage.count > 0 ? Math.max(20, (stage.count / maxCount) * 100) : 0
              const conversionRate = getConversionRate(index)

              return (
                <div key={stage.id} className="relative mb-12">
                  {/* Funnel stage */}
                  <motion.div
                    initial={{ width: 0, opacity: 0, y: 20 }}
                    animate={{
                      width: `${widthPercentage}%`,
                      opacity: isVisible ? 1 : 0,
                      y: isVisible ? 0 : 20,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: "easeOut",
                    }}
                    className="mx-auto rounded-md p-6 cursor-pointer shadow-md hover:shadow-lg"
                    style={{
                      backgroundColor: stage.color,
                      borderLeft: `4px solid ${stage.textColor}`,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg" style={{ color: stage.textColor }}>
                          {stage.label}
                        </h3>
                        <div className="flex items-center mt-2">
                          <Users className="h-4 w-4 text-gray-600 mr-1" />
                          <p className="text-gray-800 font-medium">{stage.count.toLocaleString()} users</p>
                        </div>
                        {stage.value > 0 && (
                          <div className="flex items-center mt-1">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <p className="text-green-600 font-medium">${stage.value.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                      {index > 0 && (
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 text-blue-600 mr-1" />
                          <p className="text-blue-600 font-medium">{conversionRate}% conversion</p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Conversion arrow */}
                  {index < funnelData.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isVisible ? 1 : 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.2 + 0.4,
                      }}
                      className="flex justify-center my-2"
                    >
                      <ArrowDown className="h-6 w-6 text-gray-400" />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
