"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  Zap,
  MessageSquare,
  CreditCard,
  Repeat,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function LifecycleStageSummary() {
  const { goals, campaigns } = useData()

  // Group goals by category
  const goalsByCategory = goals.reduce(
    (acc, goal) => {
      if (!acc[goal.category]) {
        acc[goal.category] = []
      }
      acc[goal.category].push(goal)
      return acc
    },
    {} as Record<string, typeof goals>,
  )

  // Calculate metrics for each lifecycle stage
  const stageMetrics = [
    {
      name: "Acquisition",
      key: "acquisition",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      count: goalsByCategory.acquisition?.length || 0,
      totalConversions: goalsByCategory.acquisition?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
      totalValue: goalsByCategory.acquisition?.reduce((sum, goal) => sum + goal.value, 0) || 0,
      progress: calculateAverageProgress(goalsByCategory.acquisition || []),
      trend: 5.2,
      color: "bg-blue-500",
    },
    {
      name: "Activation",
      key: "activation",
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      count: goalsByCategory.activation?.length || 0,
      totalConversions: goalsByCategory.activation?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
      totalValue: goalsByCategory.activation?.reduce((sum, goal) => sum + goal.value, 0) || 0,
      progress: calculateAverageProgress(goalsByCategory.activation || []),
      trend: 8.7,
      color: "bg-yellow-500",
    },
    {
      name: "Engagement",
      key: "engagement",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
      count: goalsByCategory.engagement?.length || 0,
      totalConversions: goalsByCategory.engagement?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
      totalValue: goalsByCategory.engagement?.reduce((sum, goal) => sum + goal.value, 0) || 0,
      progress: calculateAverageProgress(goalsByCategory.engagement || []),
      trend: -2.1,
      color: "bg-purple-500",
    },
    {
      name: "Monetization",
      key: "monetization",
      icon: <CreditCard className="h-5 w-5 text-green-500" />,
      count: goalsByCategory.monetization?.length || 0,
      totalConversions: goalsByCategory.monetization?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
      totalValue: goalsByCategory.monetization?.reduce((sum, goal) => sum + goal.value, 0) || 0,
      progress: calculateAverageProgress(goalsByCategory.monetization || []),
      trend: 12.4,
      color: "bg-green-500",
    },
    {
      name: "Retention",
      key: "retention",
      icon: <Repeat className="h-5 w-5 text-red-500" />,
      count: goalsByCategory.retention?.length || 0,
      totalConversions: goalsByCategory.retention?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
      totalValue: goalsByCategory.retention?.reduce((sum, goal) => sum + goal.value, 0) || 0,
      progress: calculateAverageProgress(goalsByCategory.retention || []),
      trend: 3.8,
      color: "bg-red-500",
    },
    {
      name: "Expansion",
      key: "expansion",
      icon: <TrendingUp className="h-5 w-5 text-indigo-500" />,
      count: goalsByCategory.expansion?.length || 0,
      totalConversions: goalsByCategory.expansion?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
      totalValue: goalsByCategory.expansion?.reduce((sum, goal) => sum + goal.value, 0) || 0,
      progress: calculateAverageProgress(goalsByCategory.expansion || []),
      trend: 7.5,
      color: "bg-indigo-500",
    },
  ]

  // Calculate total metrics across all stages
  const totalMetrics = {
    goals: goals.length,
    conversions: goals.reduce((sum, goal) => sum + goal.conversions, 0),
    value: goals.reduce((sum, goal) => sum + goal.value, 0),
    campaigns: campaigns.length,
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Lifecycle Stage Summary</h2>
        <div className="text-sm text-gray-500">
          <span className="font-medium">{totalMetrics.goals} Goals</span> ·
          <span className="font-medium ml-2">{totalMetrics.conversions.toLocaleString()} Conversions</span> ·
          <span className="font-medium ml-2">${totalMetrics.value.toLocaleString()} Value</span> ·
          <span className="font-medium ml-2">{totalMetrics.campaigns} Campaigns</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stageMetrics.map((metric) => (
          <TooltipProvider key={metric.key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {metric.icon}
                        <h3 className="font-medium text-gray-900 ml-2">{metric.name}</h3>
                      </div>
                      <div className={`flex items-center ${metric.trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {metric.trend >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-xs font-medium">{Math.abs(metric.trend)}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
                      <span>Goals: {metric.count}</span>
                      <span>{metric.totalConversions.toLocaleString()}</span>
                    </div>

                    <Progress value={metric.progress} className="h-2 mb-2" indicatorClassName={metric.color} />

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-sm font-medium">${metric.totalValue.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="p-2">
                  <p className="font-medium">{metric.name} Stage</p>
                  <p className="text-sm">Goals: {metric.count}</p>
                  <p className="text-sm">Conversions: {metric.totalConversions.toLocaleString()}</p>
                  <p className="text-sm">Value: ${metric.totalValue.toLocaleString()}</p>
                  <p className="text-sm">Progress: {metric.progress.toFixed(0)}%</p>
                  <p className="text-sm">
                    Trend: {metric.trend >= 0 ? "+" : ""}
                    {metric.trend}%
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <ArrowRight className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-500">Customer Journey Flow</span>
        </div>
        <div className="text-sm text-gray-500">
          Average conversion rate:
          <span className="font-medium ml-1">{calculateOverallConversionRate(stageMetrics).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate average progress for goals in a category
function calculateAverageProgress(goals: any[]) {
  if (goals.length === 0) return 0
  return goals.reduce((sum, goal) => sum + (goal.conversions / goal.target) * 100, 0) / goals.length
}

// Helper function to calculate overall conversion rate
function calculateOverallConversionRate(stageMetrics: any[]) {
  const totalConversions = stageMetrics.reduce((sum, metric) => sum + metric.totalConversions, 0)
  const totalGoals = stageMetrics.reduce((sum, metric) => sum + metric.count, 0)
  return totalGoals > 0 ? totalConversions / totalGoals : 0
}
