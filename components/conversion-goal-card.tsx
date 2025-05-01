"use client"

import { ArrowUpRight, BarChart3, CircleDollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ConversionGoal } from "@/lib/types"

interface ConversionGoalCardProps {
  goal: ConversionGoal
  onSelect: (goalId: string) => void
}

export default function ConversionGoalCard({ goal, onSelect }: ConversionGoalCardProps) {
  const { id, name, description, value, conversions, target, campaigns, category, trend } = goal

  const progress = Math.min(Math.round((conversions / target) * 100), 100)

  return (
    <Card
      className="bg-white border-gray-200 hover:border-blue-500 transition-all cursor-pointer shadow-sm"
      onClick={() => onSelect(id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge
            className={`font-normal ${
              category === "acquisition"
                ? "category-acquisition"
                : category === "activation"
                  ? "category-activation"
                  : category === "retention"
                    ? "category-retention"
                    : "category-expansion"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
          <CircleDollarSign
            className={`
            h-5 w-5 
            ${category === "acquisition" ? "text-blue-600" : ""}
            ${category === "activation" ? "text-green-600" : ""}
            ${category === "retention" ? "text-purple-600" : ""}
            ${category === "expansion" ? "text-amber-600" : ""}
          `}
          />
        </div>
        <CardTitle className="text-lg text-gray-900">{name}</CardTitle>
        <CardDescription className="text-gray-500 line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Value Generated</p>
            <p className="text-xl font-semibold text-gray-900">${value.toLocaleString()}</p>
            <div className="flex items-center mt-1">
              <span className={`text-xs ${trend >= 0 ? "trend-positive" : "trend-negative"}`}>
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
              <ArrowUpRight className={`h-3 w-3 ml-1 ${trend >= 0 ? "text-green-600" : "text-red-600"}`} />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Conversions</p>
            <p className="text-xl font-semibold text-gray-900">{conversions.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Target: {target.toLocaleString()}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-gray-200"
            indicatorClassName={`
            ${category === "acquisition" ? "progress-acquisition" : ""}
            ${category === "activation" ? "progress-activation" : ""}
            ${category === "retention" ? "progress-retention" : ""}
            ${category === "expansion" ? "progress-expansion" : ""}
          `}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center text-gray-500">
            <BarChart3 className="h-4 w-4 mr-1" />
            <span className="text-sm">{campaigns} campaigns</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(id)
            }}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
