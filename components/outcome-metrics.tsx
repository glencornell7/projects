"use client"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ConversionGoal } from "@/lib/types"
import { campaigns } from "@/lib/sample-data"

interface OutcomeMetricsProps {
  goalId: string | null
  goals: ConversionGoal[]
}

export default function OutcomeMetrics({ goalId, goals }: OutcomeMetricsProps) {
  const [timeframe, setTimeframe] = useState("30days")
  const [chartType, setChartType] = useState("conversions")

  const selectedGoal = goalId ? goals.find((g) => g.id === goalId) : null
  const filteredCampaigns = goalId ? campaigns.filter((campaign) => campaign.goalIds.includes(goalId)) : campaigns

  return (
    <ScrollArea className="h-[600px]">
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-lg font-medium text-[#e7eced]">
              {selectedGoal ? `Metrics for: ${selectedGoal.name}` : "All Outcome Metrics"}
            </h3>
            <p className="text-[#849699]">
              {selectedGoal ? selectedGoal.description : "Performance metrics across all outcomes"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px] bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus:ring-[#1aa47b]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-[#0b353b] border-[#313d3f] text-[#e7eced]">
                <SelectItem value="7days" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30days" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90days" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                  Last 90 days
                </SelectItem>
                <SelectItem value="year" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                  Last 12 months
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#202c2d] border-[#313d3f] text-[#e7eced]">
            <CardHeader className="pb-2">
              <CardDescription className="text-[#849699]">Total Metrics</CardDescription>
              <CardTitle className="text-2xl text-[#e7eced]">
                {selectedGoal
                  ? selectedGoal.conversions.toLocaleString()
                  : goals.reduce((sum, goal) => sum + goal.conversions, 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-[#1aa47b]">
                <ChevronDown className="h-4 w-4 mr-1 rotate-180" />
                <span className="text-sm">+8.3% from previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#202c2d] border-[#313d3f] text-[#e7eced]">
            <CardHeader className="pb-2">
              <CardDescription className="text-[#849699]">Value Generated</CardDescription>
              <CardTitle className="text-2xl text-[#e7eced]">
                $
                {selectedGoal
                  ? selectedGoal.value.toLocaleString()
                  : goals.reduce((sum, goal) => sum + goal.value, 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-[#1aa47b]">
                <ChevronDown className="h-4 w-4 mr-1 rotate-180" />
                <span className="text-sm">+12.5% from previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#202c2d] border-[#313d3f] text-[#e7eced]">
            <CardHeader className="pb-2">
              <CardDescription className="text-[#849699]">Conversion Rate</CardDescription>
              <CardTitle className="text-2xl text-[#e7eced]">{selectedGoal ? "3.2%" : "2.8%"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-[#1aa47b]">
                <ChevronDown className="h-4 w-4 mr-1 rotate-180" />
                <span className="text-sm">+0.5% from previous period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <Tabs value={chartType} onValueChange={setChartType}>
            <TabsList className="bg-[#202c2d]">
              <TabsTrigger
                value="conversions"
                className="data-[state=active]:bg-[#313d3f] data-[state=active]:text-[#e7eced]"
              >
                Metrics
              </TabsTrigger>
              <TabsTrigger
                value="value"
                className="data-[state=active]:bg-[#313d3f] data-[state=active]:text-[#e7eced]"
              >
                Value
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="data-[state=active]:bg-[#313d3f] data-[state=active]:text-[#e7eced]"
              >
                Tactics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="conversions">
              <Card className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] mt-4">
                <CardContent className="p-6">
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-[#849699]">
                      <p>Metric Trend Chart</p>
                      <p className="text-xs mt-2">Shows metric volume over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="value">
              <Card className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] mt-4">
                <CardContent className="p-6">
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-[#849699]">
                      <p>Value Generated Chart</p>
                      <p className="text-xs mt-2">Shows monetary value generated over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="campaigns">
              <Card className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] mt-4">
                <CardContent className="p-6">
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-[#849699]">
                      <p>Tactic Performance Chart</p>
                      <p className="text-xs mt-2">Compares tactic effectiveness for this outcome</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Card className="bg-[#202c2d] border-[#313d3f] text-[#e7eced]">
          <CardHeader>
            <CardTitle className="text-lg text-[#e7eced]">Top Performing Tactics</CardTitle>
            <CardDescription className="text-[#849699]">
              Tactics with the highest metric rates for this outcome
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCampaigns.slice(0, 5).map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 text-[#849699]">{index + 1}.</div>
                    <div>
                      <p className="text-[#e7eced]">{campaign.name}</p>
                      <p className="text-xs text-[#849699]">{campaign.channel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#e7eced]">{campaign.conversions} metrics</p>
                    <p className="text-xs text-[#849699]">${campaign.value.toLocaleString()} value</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
