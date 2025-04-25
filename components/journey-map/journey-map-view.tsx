"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  Filter,
  Grid,
  Layers,
  Maximize,
  Minimize,
  Plus,
  Save,
  Search,
  Settings,
  Share,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { conversionGoals, campaigns } from "@/lib/sample-data"
import JourneyCanvas from "./journey-canvas"
import type { NodeData, EdgeData } from "./journey-types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function JourneyMapView() {
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeView, setActiveView] = useState("journey")
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate nodes and edges from our data
  const nodes: NodeData[] = [
    // Conversion goal nodes
    ...conversionGoals.map((goal) => ({
      id: `goal-${goal.id}`,
      type: "conversion",
      data: {
        id: goal.id,
        name: goal.name,
        description: goal.description,
        category: goal.category,
        value: goal.value,
        conversions: goal.conversions,
        target: goal.target,
      },
      position: { x: 0, y: 0 }, // Positions will be calculated in the canvas component
    })),

    // Campaign nodes
    ...campaigns.map((campaign) => ({
      id: `campaign-${campaign.id}`,
      type: "campaign",
      data: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        channel: campaign.channel,
        audience: campaign.audience,
        conversions: campaign.conversions,
      },
      position: { x: 0, y: 0 },
    })),

    // Add some segment nodes
    {
      id: "segment-1",
      type: "segment",
      data: {
        id: "seg1",
        name: "New Users",
        count: 5240,
        description: "Users who signed up in the last 30 days",
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "segment-2",
      type: "segment",
      data: {
        id: "seg2",
        name: "Trial Users",
        count: 3150,
        description: "Users currently in trial period",
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "segment-3",
      type: "segment",
      data: {
        id: "seg3",
        name: "Paying Customers",
        count: 2840,
        description: "Users with active paid subscriptions",
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "segment-4",
      type: "segment",
      data: {
        id: "seg4",
        name: "At-risk Customers",
        count: 920,
        description: "Customers showing signs of potential churn",
      },
      position: { x: 0, y: 0 },
    },

    // Add some broadcast nodes
    {
      id: "broadcast-1",
      type: "broadcast",
      data: {
        id: "brd1",
        name: "Welcome Email",
        type: "email",
        sent: 4500,
        opened: 2700,
        clicked: 1350,
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "broadcast-2",
      type: "broadcast",
      data: {
        id: "brd2",
        name: "Trial Ending Reminder",
        type: "email",
        sent: 3000,
        opened: 2100,
        clicked: 900,
      },
      position: { x: 0, y: 0 },
    },
    {
      id: "broadcast-3",
      type: "broadcast",
      data: {
        id: "brd3",
        name: "Feature Announcement",
        type: "push",
        sent: 8000,
        opened: 3200,
        clicked: 1600,
      },
      position: { x: 0, y: 0 },
    },
  ]

  // Create edges between nodes
  const edges: EdgeData[] = [
    // Connect segments to campaigns
    { id: "e1", source: "segment-1", target: "campaign-camp1", label: "Audience" },
    { id: "e2", source: "segment-2", target: "campaign-camp2", label: "Audience" },
    { id: "e3", source: "segment-3", target: "campaign-camp3", label: "Audience" },
    { id: "e4", source: "segment-4", target: "campaign-camp4", label: "Audience" },

    // Connect campaigns to conversion goals
    { id: "e5", source: "campaign-camp1", target: "goal-goal1", label: "Contributes" },
    { id: "e6", source: "campaign-camp1", target: "goal-goal4", label: "Contributes" },
    { id: "e7", source: "campaign-camp2", target: "goal-goal1", label: "Contributes" },
    { id: "e8", source: "campaign-camp3", target: "goal-goal2", label: "Contributes" },
    { id: "e9", source: "campaign-camp4", target: "goal-goal3", label: "Contributes" },
    { id: "e10", source: "campaign-camp5", target: "goal-goal5", label: "Contributes" },

    // Connect broadcasts to campaigns
    { id: "e11", source: "broadcast-1", target: "campaign-camp1", label: "Part of" },
    { id: "e12", source: "broadcast-2", target: "campaign-camp2", label: "Part of" },
    { id: "e13", source: "broadcast-3", target: "campaign-camp3", label: "Part of" },

    // Connect conversion goals to show user journey flow in a logical sequence
    { id: "e14", source: "goal-goal4", target: "goal-goal1", label: "Next step" }, // Acquisition to Activation
    { id: "e15", source: "goal-goal1", target: "goal-goal5", label: "Next step" }, // Activation to more Activation
    { id: "e16", source: "goal-goal5", target: "goal-goal3", label: "Next step" }, // Activation to Retention
    { id: "e17", source: "goal-goal3", target: "goal-goal2", label: "Next step" }, // Retention to Expansion
    { id: "e18", source: "goal-goal2", target: "goal-goal6", label: "Next step" }, // Expansion to more Expansion
  ]

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" ref={containerRef}>
      <div className="bg-white border-b border-gray-200 py-3 px-4 flex items-center">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Journey Map</h1>
        <p className="text-sm text-gray-500 ml-2">
          Click on a conversion goal to see its related campaigns, segments, and broadcasts
        </p>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search elements..."
              className="pl-9 bg-white border-gray-300 text-gray-900 focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={activeView} onValueChange={setActiveView} className="w-auto">
            <TabsList className="bg-gray-100">
              <TabsTrigger
                value="journey"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Journey View
              </TabsTrigger>
              <TabsTrigger
                value="funnel"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Funnel View
              </TabsTrigger>
            </TabsList>
          </Tabs>
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

      <div className="bg-white border-b border-gray-200 py-2 px-4">
        <h2 className="text-sm text-gray-500">
          Customer Journey Flow: Acquisition → Activation → Retention → Expansion
        </h2>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Elements</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Conversion Goals</h3>
              <div className="space-y-1">
                {conversionGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                    draggable
                  >
                    <div
                      className={`w-3 h-3 rounded-full mr-2 
                      ${goal.category === "acquisition" ? "bg-blue-500" : ""}
                      ${goal.category === "activation" ? "bg-green-500" : ""}
                      ${goal.category === "retention" ? "bg-purple-500" : ""}
                      ${goal.category === "expansion" ? "bg-amber-500" : ""}
                    `}
                    ></div>
                    <span className="truncate">{goal.name}</span>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Conversion Goal
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Supporting Elements</h3>
              <p className="text-xs text-gray-500 mb-2">These elements will appear when you expand a conversion goal</p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="campaigns">
                  <AccordionTrigger className="text-sm py-2">Campaigns</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1">
                      {campaigns.slice(0, 5).map((campaign) => (
                        <div
                          key={campaign.id}
                          className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                          draggable
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-2 
                            ${campaign.status === "active" ? "bg-green-500" : ""}
                            ${campaign.status === "draft" ? "bg-gray-400" : ""}
                            ${campaign.status === "paused" ? "bg-amber-500" : ""}
                          `}
                          ></div>
                          <span className="truncate">{campaign.name}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="segments">
                  <AccordionTrigger className="text-sm py-2">Segments</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1">
                      <div
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                        draggable
                      >
                        <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                        <span className="truncate">New Users</span>
                      </div>
                      <div
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                        draggable
                      >
                        <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                        <span className="truncate">Trial Users</span>
                      </div>
                      <div
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                        draggable
                      >
                        <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                        <span className="truncate">Paying Customers</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="broadcasts">
                  <AccordionTrigger className="text-sm py-2">Broadcasts</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1">
                      <div
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                        draggable
                      >
                        <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                        <span className="truncate">Welcome Email</span>
                      </div>
                      <div
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                        draggable
                      >
                        <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                        <span className="truncate">Trial Ending Reminder</span>
                      </div>
                      <div
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                        draggable
                      >
                        <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                        <span className="truncate">Feature Announcement</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <JourneyCanvas nodes={nodes} edges={edges} zoom={zoom} />
          </div>

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
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none border-b border-gray-200">
                    <Grid className="h-5 w-5 text-gray-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Toggle Grid</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none rounded-b-md">
                    <Layers className="h-5 w-5 text-gray-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Layers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white border border-gray-200 rounded-md shadow-sm p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
                <DropdownMenuLabel>Show/Hide Elements</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="focus:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Conversion Goals</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Campaigns</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Segments</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Broadcasts</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="focus:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Acquisition</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Activation</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Retention</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>Expansion</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Layout
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
                <DropdownMenuItem className="focus:bg-gray-100">Auto Layout</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">Horizontal Flow</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">Vertical Flow</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100">Radial Layout</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="focus:bg-gray-100">Reset Layout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-2" />
              Add Element
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
