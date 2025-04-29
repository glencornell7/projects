"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { BarChartIcon as ChartBar, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { campaigns } from "@/lib/sample-data"
import type { TimeRange, JourneyStage } from "./journey-types"
import MergedFunnelView from "./merged-funnel-view"
import { Card } from "@/components/ui/card"
import JourneyMapEmbed from "./journey-map-embed"

interface JourneyMapViewProps {
  onSwitchView?: () => void
}

export default function JourneyMapView({ onSwitchView }: JourneyMapViewProps) {
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeView, setActiveView] = useState("journey")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPaths, setShowPaths] = useState(true)
  const [showAssociatedContent, setShowAssociatedContent] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>("90days")
  const [minNodeSize, setMinNodeSize] = useState(70)
  const [selectedNode, setSelectedNode] = useState<JourneyStage | null>(null)
  const [isNodeDetailsOpen, setIsNodeDetailsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewType, setViewType] = useState<"journey" | "lifecycle">("journey")
  const [showFunnelLines, setShowFunnelLines] = useState(false)

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
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customer Journey Map</h1>
          <p className="text-gray-600 mt-1">
            Visualize how customers interact with your product and identify key conversion points
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/goals">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              <ChartBar className="mr-2 h-4 w-4" />
              Goals
            </Button>
          </Link>
        </div>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as "journey" | "lifecycle")}>
            <TabsList className="bg-gray-100">
              <TabsTrigger
                value="journey"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Journey View
              </TabsTrigger>
              <TabsTrigger
                value="lifecycle"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Lifecycle View
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="associated-content"
                checked={showAssociatedContent}
                onCheckedChange={setShowAssociatedContent}
              />
              <Label htmlFor="associated-content">Show Associated Content</Label>
            </div>

            {viewType === "lifecycle" && (
              <div className="flex items-center space-x-2">
                <Switch id="funnel-lines" checked={showFunnelLines} onCheckedChange={setShowFunnelLines} />
                <Label htmlFor="funnel-lines">Show Funnel Lines</Label>
              </div>
            )}
          </div>
        </div>

        <div className="p-0">
          {viewType === "journey" ? (
            <JourneyMapEmbed showAssociatedContent={showAssociatedContent} />
          ) : (
            <MergedFunnelView showFunnelLines={showFunnelLines} />
          )}
        </div>
      </Card>
    </div>
  )
}
