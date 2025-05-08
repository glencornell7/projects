"use client"

import { useState } from "react"
import { ChevronDown, Filter, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import JourneyCanvas from "./journey-canvas-enhanced"
import FunnelView from "./funnel-view"
import { sampleJourneyData } from "./sample-journey-data"
import { campaigns } from "@/lib/sample-data"
import type { TimeRange, JourneyStage } from "./journey-types"

export default function JourneyMapEmbed() {
  const [zoom, setZoom] = useState(0.7)
  const [searchQuery, setSearchQuery] = useState("")
  const [showPaths, setShowPaths] = useState(true)
  const [showAssociatedContent, setShowAssociatedContent] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>("90days")
  const [minNodeSize, setMinNodeSize] = useState(60)
  const [selectedNode, setSelectedNode] = useState<JourneyStage | null>(null)
  const [isNodeDetailsOpen, setIsNodeDetailsOpen] = useState(false)
  const [activeView, setActiveView] = useState("interactive")
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNodeClick = (node: JourneyStage) => {
    setSelectedNode(node)
    setIsNodeDetailsOpen(true)
  }

  const handleViewChange = (view: string) => {
    if (view !== activeView) {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveView(view)
        setTimeout(() => {
          setIsAnimating(false)
        }, 100)
      }, 300)
    }
  }

  // Find associated campaigns for the selected node
  const getAssociatedCampaigns = (nodeId: string) => {
    // For conversion nodes, find campaigns that contribute to this goal
    if (nodeId.includes("conversion")) {
      const goalId = nodeId.replace("conversion-", "")
      return campaigns.filter((campaign) => campaign.goalIds.includes(goalId))
    }
    return []
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Customer Lifecycle Map</h3>
          <p className="text-sm text-gray-500">
            Visualize how users move through your conversion funnel and identify opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="embed-show-paths" className="text-sm text-gray-700">
              Paths
            </Label>
            <Switch
              id="embed-show-paths"
              checked={showPaths}
              onCheckedChange={setShowPaths}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Label htmlFor="embed-show-associated" className="text-sm text-gray-700">
              Content
            </Label>
            <Switch
              id="embed-show-associated"
              checked={showAssociatedContent}
              onCheckedChange={setShowAssociatedContent}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => handleViewChange(activeView === "interactive" ? "funnel" : "interactive")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            {activeView === "interactive" ? "Lifecycle View" : "Interactive View"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Time Range
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
              <DropdownMenuLabel>Select Time Range</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="focus:bg-gray-100" onClick={() => setTimeRange("7days")}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-100" onClick={() => setTimeRange("30days")}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-100" onClick={() => setTimeRange("90days")}>
                Last 90 days
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-100" onClick={() => setTimeRange("quarter")}>
                Last quarter
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-100" onClick={() => setTimeRange("year")}>
                Last year
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-100" onClick={() => setTimeRange("all")}>
                All time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 relative">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        >
          {activeView === "interactive" ? (
            <JourneyCanvas
              journeyData={sampleJourneyData}
              zoom={zoom}
              showPaths={showPaths}
              showAssociatedContent={showAssociatedContent}
              timeRange={timeRange}
              minNodeSize={minNodeSize}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <FunnelView journeyData={sampleJourneyData} timeRange={timeRange} onStageClick={handleNodeClick} />
          )}
        </div>
      </div>

      {/* Node Details Dialog */}
      <Dialog open={isNodeDetailsOpen} onOpenChange={setIsNodeDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedNode && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNode.name}</DialogTitle>
                <DialogDescription>{selectedNode.description}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-500 text-sm mb-1">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedNode.count.toLocaleString()}</p>
                  </div>
                  {selectedNode.value && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <p className="text-gray-500 text-sm mb-1">Value Generated</p>
                      <p className="text-2xl font-semibold text-gray-900">${selectedNode.value.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Associated Campaigns</h3>
                  {selectedNode.type === "conversion" && (
                    <div className="space-y-2">
                      {getAssociatedCampaigns(selectedNode.id).length > 0 ? (
                        getAssociatedCampaigns(selectedNode.id).map((campaign) => (
                          <div
                            key={campaign.id}
                            className="p-3 bg-white border border-gray-200 rounded-md flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{campaign.name}</p>
                              <p className="text-sm text-gray-500">{campaign.audience}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-900">{campaign.conversions} conversions</p>
                              <p className="text-xs text-gray-500">${campaign.value.toLocaleString()} value</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No campaigns associated with this conversion.</p>
                      )}
                    </div>
                  )}

                  <h3 className="text-lg font-medium text-gray-900 mt-4">Conversion Paths</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-white border border-gray-200 rounded-md">
                      <p className="font-medium text-gray-900">Top Previous Stages</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Website Visit</span>
                          <span className="text-sm text-gray-900">42%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Free Trial</span>
                          <span className="text-sm text-gray-900">38%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Feature Activation</span>
                          <span className="text-sm text-gray-900">20%</span>
                        </div>
                      </div>
                    </div>
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
