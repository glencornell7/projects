"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { ArrowUpRight, BarChart3, Edit, Plus, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendChart } from "./trend-chart"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AddTacticForm } from "./add-tactic-form"
import { useData } from "@/lib/data-context"

interface ConversionGoalDetailProps {
  goalId: string
  onBack: () => void
}

export default function ConversionGoalDetail({ goalId, onBack }: ConversionGoalDetailProps) {
  const { getGoalById, getCampaignsForGoal } = useData()
  const [isAddTacticOpen, setIsAddTacticOpen] = useState(false)

  const goal = getGoalById(goalId)

  if (!goal) {
    notFound()
  }

  const { name, description, category, value, conversions, target, trend, metricType, trendData } = goal
  const progress = Math.min(Math.round((conversions / target) * 100), 100)
  const relatedCampaigns = getCampaignsForGoal(goalId)
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
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
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
              <Badge
                variant="outline"
                className={`
                  ${metricType === "outcome" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                  ${metricType === "aha" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                `}
              >
                {metricType === "outcome" ? <Star className="h-3 w-3 mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                {metricType === "outcome" ? "Outcome Metric" : "Aha Moment Metric"}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
            <Edit className="h-4 w-4 mr-2" />
            Edit Metric
          </Button>
          <Button onClick={() => setIsAddTacticOpen(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Tactic
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Value Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${value.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <span className={`text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
              <ArrowUpRight className={`h-4 w-4 ml-1 ${trend >= 0 ? "text-green-600" : "text-red-600"}`} />
              <span className="text-gray-500 text-sm ml-1">vs. last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversions.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-500 text-sm">Target: {target.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">{progress}% complete</span>
            </div>
            <Progress
              value={progress}
              className="h-2 mt-2 bg-gray-200"
              indicatorClassName={`
                ${category === "acquisition" ? "bg-blue-500" : ""}
                ${category === "activation" ? "bg-green-500" : ""}
                ${category === "engagement" ? "bg-indigo-500" : ""}
                ${category === "monetization" ? "bg-pink-500" : ""}
                ${category === "retention" ? "bg-purple-500" : ""}
                ${category === "expansion" ? "bg-amber-500" : ""}
              `}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Associated Tactics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatedCampaigns.length}</div>
            <div className="flex items-center mt-1">
              <span className="text-gray-500 text-sm">
                {activeCampaigns.length} active, {relatedCampaigns.length - activeCampaigns.length} inactive
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white border rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Trend</h2>
          {trendData ? (
            <div className="h-64">
              <TrendChart
                data={trendData}
                height={250}
                width={800}
                lineColor={chartColors.line}
                fillColor={chartColors.fill}
                showAxis={true}
                className="w-full"
              />
            </div>
          ) : (
            <div className="h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
              <p className="text-gray-500">No trend data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <Tabs defaultValue="tactics" className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger
                value="tactics"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                Tactics
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="attribution"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                Attribution
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tactics" className="p-6 pt-4">
            {relatedCampaigns.length > 0 ? (
              <div className="space-y-4">
                {relatedCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 md:p-6 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              campaign.status === "active"
                                ? "bg-green-500"
                                : campaign.status === "paused"
                                  ? "bg-amber-500"
                                  : "bg-gray-400"
                            }`}
                          ></span>
                          <Badge
                            variant="outline"
                            className={`
                              ${campaign.channel === "email" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                              ${campaign.channel === "sms" ? "bg-green-50 text-green-700 border-green-200" : ""}
                              ${campaign.channel === "push" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                              ${campaign.channel === "in-app" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                            `}
                          >
                            {campaign.channel.charAt(0).toUpperCase() + campaign.channel.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">{campaign.audience}</span>
                        </div>
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        {campaign.description && <p className="text-gray-500 mt-1">{campaign.description}</p>}
                      </div>
                      <div className="bg-gray-50 p-4 md:p-6 md:w-64 flex flex-row md:flex-col justify-between border-t md:border-t-0 md:border-l">
                        <div>
                          <p className="text-sm text-gray-500">Conversions</p>
                          <p className="text-xl font-semibold">{campaign.conversions.toLocaleString()}</p>
                        </div>
                        <div className="mt-0 md:mt-4">
                          <p className="text-sm text-gray-500">Value</p>
                          <p className="text-xl font-semibold">${campaign.value.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <div className="flex justify-center mt-6">
                  <Button onClick={() => setIsAddTacticOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Tactic
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tactics yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Add tactics like campaigns, broadcasts, or newsletters to drive this metric.
                </p>
                <Button onClick={() => setIsAddTacticOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Tactic
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="p-6 pt-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">History view coming soon</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Track changes to this metric over time, including value adjustments and target modifications.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="attribution" className="p-6 pt-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Attribution view coming soon</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                See which tactics and channels are contributing most to this metric's performance.
              </p>
            </div>
          </TabsContent>
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
            <AddTacticForm goalId={goalId} onClose={() => setIsAddTacticOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
