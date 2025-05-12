"use client"

import { ArrowUpRight, BarChart3, Plus, Sparkles, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ConversionGoal } from "@/lib/types"
import { TrendChart } from "./trend-chart"
import { useData } from "@/lib/data-context"

interface ConversionGoalCardProps {
  goal: ConversionGoal
  onSelect: (goalId: string) => void
  onAddTactic?: (goalId: string) => void
}

export default function ConversionGoalCard({ goal, onSelect, onAddTactic }: ConversionGoalCardProps) {
  const { id, name, description, value, conversions, target, category, trend, metricType, trendData } = goal
  const { getCampaignsForGoal } = useData()

  const progress = Math.min(Math.round((conversions / target) * 100), 100)
  const relatedCampaigns = getCampaignsForGoal(id)
  const activeCampaigns = relatedCampaigns.filter((c) => c.status === "active")

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

  const chartColors = getCategoryColors(category)

  return (
    <Card
      className="bg-white border-gray-200 hover:border-[#7265dc] transition-all cursor-pointer shadow-sm overflow-hidden"
      onClick={() => onSelect(id)}
    >
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <Badge
            className={`font-normal ${
              category === "acquisition"
                ? "bg-blue-100 text-blue-800"
                : category === "activation"
                  ? "bg-green-100 text-green-800"
                  : category === "engagement"
                    ? "bg-indigo-100 text-indigo-800"
                    : category === "monetization"
                      ? "bg-pink-100 text-pink-800"
                      : category === "retention"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Stage
          </Badge>
          {metricType && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {metricType === "outcome" ? (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-50">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-50">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{metricType === "outcome" ? "Outcome Metric" : "Aha Moment Metric"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardTitle className="text-lg text-gray-900 mt-2">{name}</CardTitle>
        <CardDescription className="text-gray-500 line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Value Generated</p>
            <p className="text-xl font-semibold text-gray-900">${value.toLocaleString()}</p>
            <div className="flex items-center mt-1">
              <span className={`text-xs ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
              <ArrowUpRight className={`h-3 w-3 ml-1 ${trend >= 0 ? "text-green-600" : "text-red-600"}`} />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Count</p>
            <p className="text-xl font-semibold text-gray-900">{conversions.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Target: {target.toLocaleString()}</p>
          </div>
        </div>

        {trendData && (
          <div className="mb-4">
            <TrendChart
              data={trendData}
              height={60}
              width={280}
              lineColor={chartColors.line}
              fillColor={chartColors.fill}
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-gray-200"
            indicatorClassName={`
            ${category === "acquisition" ? "bg-blue-500" : ""}
            ${category === "activation" ? "bg-green-500" : ""}
            ${category === "engagement" ? "bg-indigo-500" : ""}
            ${category === "monetization" ? "bg-pink-500" : ""}
            ${category === "retention" ? "bg-purple-500" : ""}
            ${category === "expansion" ? "bg-amber-500" : ""}
          `}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-200 pt-3 bg-gray-50">
        <div className="flex justify-between items-center w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-gray-500">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="text-sm">{relatedCampaigns.length} tactics</span>
                  {activeCampaigns.length > 0 && (
                    <span className="text-xs ml-1 text-green-600">({activeCampaigns.length} active)</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-64 p-0 overflow-hidden rounded-lg">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <p className="font-medium">Associated Tactics</p>
                </div>
                <div className="p-4 max-h-[200px] overflow-auto">
                  {relatedCampaigns.length > 0 ? (
                    <div className="space-y-2">
                      {relatedCampaigns.map((campaign) => (
                        <div key={campaign.id} className="flex items-start gap-2">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mt-1.5 ${
                              campaign.status === "active"
                                ? "bg-green-500"
                                : campaign.status === "paused"
                                  ? "bg-amber-500"
                                  : "bg-gray-400"
                            }`}
                          ></span>
                          <div>
                            <div className="text-sm font-medium">{campaign.name}</div>
                            <div className="text-xs text-gray-500">
                              {campaign.channel.charAt(0).toUpperCase() + campaign.channel.slice(1)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No tactics associated with this metric</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex gap-2">
            {onAddTactic && (
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddTactic(id)
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Tactic
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-[#7265dc] hover:text-[#5d4fc7] hover:bg-[#f5f3ff]"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(id)
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
