"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ChevronDown,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Plus,
  Save,
  Search,
  Share,
  ZoomIn,
  ZoomOut,
  Link2,
  Unlink,
  BarChartIcon as ChartBar,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import JourneyCanvas from "./journey-canvas-enhanced"
import { sampleJourneyData } from "./sample-journey-data"
import { campaigns } from "@/lib/sample-data"
import type { TimeRange, JourneyStage } from "./journey-types"
import MergedFunnelView from "./merged-funnel-view"
import SankeyView from "./sankey-view"

interface JourneyMapViewProps {
  onSwitchView?: () => void
}

export default function JourneyMapView({ onSwitchView }: JourneyMapViewProps) {
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeView, setActiveView] = useState("interactive")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPaths, setShowPaths] = useState(true)
  const [showAssociatedContent, setShowAssociatedContent] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>("90days")
  const [minNodeSize, setMinNodeSize] = useState(70)
  const [selectedNode, setSelectedNode] = useState<JourneyStage | null>(null)
  const [isNodeDetailsOpen, setIsNodeDetailsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const timeRangeOptions = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "quarter", label: "Last quarter" },
    { value: "year", label: "Last year" },
    { value: "all", label: "All time" },
  ]

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
    <div className="min-h-screen bg-gray-50 flex flex-col" ref={containerRef}>
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Customer Lifecycle Map</h1>
            <p className="text-sm text-gray-500 mt-1">
              Visualize how users move through your conversion funnel and identify opportunities
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search stages..."
                className="pl-9 bg-white border-gray-300 text-gray-900 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeView} onValueChange={handleViewChange} className="w-auto">
              <TabsList className="bg-gray-100">
                <TabsTrigger
                  value="interactive"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Interactive View
                </TabsTrigger>
                <TabsTrigger
                  value="funnel"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Lifecycle View
                </TabsTrigger>
                <TabsTrigger
                  value="sankey"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Sankey View
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/goals">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <ChartBar className="h-4 w-4 mr-2" />
                Index
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Lifecycle Settings</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Time Range</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {timeRangeOptions.find((option) => option.value === timeRange)?.label}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
                  {timeRangeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className="focus:bg-gray-100"
                      onClick={() => setTimeRange(option.value as TimeRange)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {activeView === "interactive" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-paths" className="text-sm font-medium text-gray-700">
                      Show User Paths
                    </Label>
                    <Switch id="show-paths" checked={showPaths} onCheckedChange={setShowPaths} />
                  </div>
                  <p className="text-xs text-gray-500">Display lines showing how users move between stages</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-associated" className="text-sm font-medium text-gray-700">
                      Show Associated Content
                    </Label>
                    <Switch
                      id="show-associated"
                      checked={showAssociatedContent}
                      onCheckedChange={setShowAssociatedContent}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Display campaigns and broadcasts linked to conversions</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="node-size" className="text-sm font-medium text-gray-700">
                    Node Size (based on volume)
                  </Label>
                  <Slider
                    id="node-size"
                    min={50}
                    max={120}
                    step={10}
                    value={[minNodeSize]}
                    onValueChange={(value) => setMinNodeSize(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>
              </>
            )}

            {activeView === "funnel" && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Lifecycle Settings</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-acquiring" className="mr-2" defaultChecked />
                    <Label htmlFor="filter-acquiring" className="text-sm text-gray-700">
                      Acquiring
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-activating" className="mr-2" defaultChecked />
                    <Label htmlFor="filter-activating" className="text-sm text-gray-700">
                      Activating
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-starting" className="mr-2" defaultChecked />
                    <Label htmlFor="filter-starting" className="text-sm text-gray-700">
                      Starting
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-growing" className="mr-2" defaultChecked />
                    <Label htmlFor="filter-growing" className="text-sm text-gray-700">
                      Growing
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-championing" className="mr-2" defaultChecked />
                    <Label htmlFor="filter-championing" className="text-sm text-gray-700">
                      Championing
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="filter-dormant" className="mr-2" defaultChecked />
                    <Label htmlFor="filter-dormant" className="text-sm text-gray-700">
                      Dormant
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter Stages</h3>
              <div className="space-y-1">
                <div className="flex items-center">
                  <input type="checkbox" id="filter-visit" className="mr-2" defaultChecked />
                  <Label htmlFor="filter-visit" className="text-sm text-gray-700">
                    Website Visits
                  </Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="filter-signup" className="mr-2" defaultChecked />
                  <Label htmlFor="filter-signup" className="text-sm text-gray-700">
                    Sign Ups
                  </Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="filter-trial" className="mr-2" defaultChecked />
                  <Label htmlFor="filter-trial" className="text-sm text-gray-700">
                    Free Trials
                  </Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="filter-conversion" className="mr-2" defaultChecked />
                  <Label htmlFor="filter-conversion" className="text-sm text-gray-700">
                    Paid Conversions
                  </Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="filter-feature" className="mr-2" defaultChecked />
                  <Label htmlFor="filter-feature" className="text-sm text-gray-700">
                    Feature Activations
                  </Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="filter-upgrade" className="mr-2" defaultChecked />
                  <Label htmlFor="filter-upgrade" className="text-sm text-gray-700">
                    Upgrades
                  </Label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="filter-churn" className="mr-2" defaultChecked />
                  <Label htmlFor="filter-churn" className="text-sm text-gray-700">
                    Churn
                  </Label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Stage
              </Button>
            </div>
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
            ) : activeView === "funnel" ? (
              <MergedFunnelView journeyData={sampleJourneyData} timeRange={timeRange} onStageClick={handleNodeClick} />
            ) : (
              <SankeyView journeyData={sampleJourneyData} timeRange={timeRange} onStageClick={handleNodeClick} />
            )}
          </div>

          {activeView === "interactive" && (
            <div className="absolute bottom-4 right-4 flex flex-col bg-white border border-gray-200 rounded-md shadow-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none rounded-t-md border-b border-gray-200"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-5 w-5 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Zoom In</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none border-b border-gray-200"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-5 w-5 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Zoom Out</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none border-b border-gray-200"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize className="h-5 w-5 text-gray-700" />
                      ) : (
                        <Maximize className="h-5 w-5 text-gray-700" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none border-b border-gray-200"
                      onClick={() => setShowPaths(!showPaths)}
                    >
                      {showPaths ? (
                        <Eye className="h-5 w-5 text-gray-700" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-700" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{showPaths ? "Hide Paths" : "Show Paths"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none rounded-b-md"
                      onClick={() => setShowAssociatedContent(!showAssociatedContent)}
                    >
                      {showAssociatedContent ? (
                        <Link2 className="h-5 w-5 text-gray-700" />
                      ) : (
                        <Unlink className="h-5 w-5 text-gray-700" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{showAssociatedContent ? "Hide Associated Content" : "Show Associated Content"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
                    <div className="p-3 bg-white border border-gray-200 rounded-md">
                      <p className="font-medium text-gray-900">Top Next Stages</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Feature Activation</span>
                          <span className="text-sm text-gray-900">45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Upgrade</span>
                          <span className="text-sm text-gray-900">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">Churn</span>
                          <span className="text-sm text-gray-900">25%</span>
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
