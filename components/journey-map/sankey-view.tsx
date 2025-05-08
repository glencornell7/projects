"use client"

import { useState, useEffect } from "react"
import type { JourneyData, JourneyStage } from "./journey-types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { campaigns } from "@/lib/sample-data"

interface SankeyViewProps {
  journeyData: JourneyData
  timeRange: string
  onStageClick?: (stage: JourneyStage) => void
}

interface SankeyNode {
  id: string
  name: string
  type: string
  count: number
  value?: number
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface SankeyLink {
  id: string
  source: string
  target: string
  count: number
  rate: number
  points: string
  width: number
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
}

export default function SankeyView({ journeyData, timeRange, onStageClick }: SankeyViewProps) {
  const [nodes, setNodes] = useState<SankeyNode[]>([])
  const [links, setLinks] = useState<SankeyLink[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<JourneyStage | null>(null)
  const [isNodeDetailsOpen, setIsNodeDetailsOpen] = useState(false)

  // Process journey data into Sankey format
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

    // Group stages by type to organize them in columns
    const stagesByType: Record<string, JourneyStage[]> = {}
    journeyData.stages.forEach((stage) => {
      if (!stagesByType[stage.type]) {
        stagesByType[stage.type] = []
      }
      stagesByType[stage.type].push({
        ...stage,
        count: Math.round(stage.count * timeMultiplier),
        value: stage.value ? Math.round(stage.value * timeMultiplier) : undefined,
      })
    })

    // Define column order
    const columnOrder = ["visit", "signup", "trial", "conversion", "feature", "upgrade", "retention", "churn"]

    // Calculate total height and max count for scaling
    const totalHeight = 600
    const padding = 20
    const maxCount = Math.max(...journeyData.stages.map((s) => s.count * timeMultiplier))

    // Calculate node positions and dimensions
    const sankeyNodes: SankeyNode[] = []
    const columnWidth = 150
    const columnSpacing = 200

    columnOrder.forEach((type, colIndex) => {
      if (!stagesByType[type]) return

      const stages = stagesByType[type]
      const columnHeight = totalHeight - (stages.length - 1) * padding
      let currentY = 0

      stages.forEach((stage, rowIndex) => {
        // Calculate node height proportional to count
        const height = Math.max(40, (stage.count / maxCount) * columnHeight)

        // Get color based on node type
        const color = getNodeColor(stage.type)

        sankeyNodes.push({
          id: stage.id,
          name: stage.name,
          type: stage.type,
          count: stage.count,
          value: stage.value,
          x: colIndex * columnSpacing + 50,
          y: currentY,
          width: columnWidth,
          height,
          color,
        })

        currentY += height + padding
      })
    })

    // Calculate links between nodes
    const sankeyLinks: SankeyLink[] = []

    journeyData.paths.forEach((path) => {
      const sourceNode = sankeyNodes.find((n) => n.id === path.source)
      const targetNode = sankeyNodes.find((n) => n.id === path.target)

      if (!sourceNode || !targetNode) return

      // Calculate link width proportional to count
      const maxLinkWidth = 30
      const minLinkWidth = 2
      const linkWidth = Math.max(
        minLinkWidth,
        Math.min(maxLinkWidth, ((path.count * timeMultiplier) / maxCount) * maxLinkWidth * 3),
      )

      // Calculate control points for curved path
      const sourceX = sourceNode.x + sourceNode.width
      const sourceY = sourceNode.y + sourceNode.height / 2
      const targetX = targetNode.x
      const targetY = targetNode.y + targetNode.height / 2

      // Create bezier curve path
      const points = `M${sourceX},${sourceY} C${sourceX + (targetX - sourceX) * 0.5},${sourceY} ${
        sourceX + (targetX - sourceX) * 0.5
      },${targetY} ${targetX},${targetY}`

      sankeyLinks.push({
        id: path.id,
        source: path.source,
        target: path.target,
        count: Math.round(path.count * timeMultiplier),
        rate: path.conversionRate,
        points,
        width: linkWidth,
        sourceX,
        sourceY,
        targetX,
        targetY,
      })
    })

    setNodes(sankeyNodes)
    setLinks(sankeyLinks)

    // Trigger animation after data is processed
    setTimeout(() => setIsVisible(true), 100)
  }, [journeyData, timeRange])

  // Get color based on node type
  function getNodeColor(type: string): string {
    switch (type) {
      case "visit":
        return "#f3f4f6"
      case "signup":
        return "#dbeafe"
      case "trial":
        return "#e0e7ff"
      case "conversion":
        return "#dcfce7"
      case "feature":
        return "#f3e8ff"
      case "upgrade":
        return "#fef3c7"
      case "retention":
        return "#ccfbf1"
      case "churn":
        return "#fee2e2"
      default:
        return "#f3f4f6"
    }
  }

  // Calculate tooltip position for a link
  const getLinkTooltipPosition = (link: SankeyLink) => {
    // Use the midpoint of the link for tooltip positioning
    const midX = (link.sourceX + link.targetX) / 2
    const midY = (link.sourceY + link.targetY) / 2

    return {
      x: midX - 60, // Center the tooltip (120px wide)
      y: midY - 30, // Position above the link
    }
  }

  // Handle node click
  const handleNodeClick = (node: SankeyNode) => {
    // Convert to JourneyStage format
    const stage: JourneyStage = {
      id: node.id,
      name: node.name,
      type: node.type as any,
      description: `${node.count.toLocaleString()} users in this stage`,
      count: node.count,
      position: { x: 0, y: 0 }, // Position doesn't matter for this view
      value: node.value,
    }

    setSelectedNode(stage)
    setIsNodeDetailsOpen(true)

    if (onStageClick) {
      onStageClick(stage)
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
    <div className="w-full h-full flex flex-col bg-white overflow-auto">
      <div className="p-6">
        <h2 className="text-xl font-medium mb-6">Customer Lifecycle Flow</h2>

        <div className="relative" style={{ height: "700px" }}>
          <svg width="100%" height="100%" style={{ overflow: "visible" }}>
            {/* Render links first so they appear behind nodes */}
            <g className="links">
              {links.map((link) => {
                const isHovered = hoveredLink === link.id || hoveredNode === link.source || hoveredNode === link.target
                const tooltipPos = getLinkTooltipPosition(link)

                return (
                  <g
                    key={link.id}
                    opacity={isHovered ? 1 : 0.6}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <path
                      d={link.points}
                      fill="none"
                      stroke={isHovered ? "#64748b" : "#94a3b8"}
                      strokeWidth={link.width}
                      strokeOpacity={0.6}
                      style={{
                        transition: "all 0.3s ease-out",
                        opacity: isVisible ? 1 : 0,
                        transform: `translateY(${isVisible ? 0 : 20}px)`,
                      }}
                    />

                    {isHovered && (
                      <g>
                        <rect
                          x={tooltipPos.x}
                          y={tooltipPos.y}
                          width="120"
                          height="60"
                          rx="4"
                          fill="white"
                          stroke="#e2e8f0"
                        />
                        <text
                          x={tooltipPos.x + 60}
                          y={tooltipPos.y + 20}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#64748b"
                        >
                          {link.count.toLocaleString()} users
                        </text>
                        <text
                          x={tooltipPos.x + 60}
                          y={tooltipPos.y + 40}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#64748b"
                        >
                          {link.rate}% conversion rate
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </g>

            {/* Render nodes */}
            <g className="nodes">
              {nodes.map((node) => {
                const isHovered = hoveredNode === node.id

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => handleNodeClick(node)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      width={node.width}
                      height={node.height}
                      fill={node.color}
                      stroke={isHovered ? "#3b82f6" : "#94a3b8"}
                      strokeWidth={isHovered ? 2 : 1}
                      rx="4"
                      style={{
                        transition: "all 0.3s ease-out",
                        opacity: isVisible ? 1 : 0,
                        transform: `translateY(${isVisible ? 0 : 20}px)`,
                      }}
                    />

                    <text
                      x={node.width / 2}
                      y={node.height / 2 - 10}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="500"
                      fill="#374151"
                      style={{
                        transition: "all 0.3s ease-out",
                        opacity: isVisible ? 1 : 0,
                      }}
                    >
                      {node.name}
                    </text>

                    <text
                      x={node.width / 2}
                      y={node.height / 2 + 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6b7280"
                      style={{
                        transition: "all 0.3s ease-out",
                        opacity: isVisible ? 1 : 0,
                      }}
                    >
                      {node.count.toLocaleString()} users
                    </text>

                    {node.value && (
                      <text
                        x={node.width / 2}
                        y={node.height / 2 + 25}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#059669"
                        style={{
                          transition: "all 0.3s ease-out",
                          opacity: isVisible ? 1 : 0,
                        }}
                      >
                        ${node.value.toLocaleString()}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium mb-3">Lifecycle Insights</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Users in Lifecycle</div>
              <div className="text-xl font-semibold">
                {nodes
                  .filter((n) => n.type === "visit")
                  .reduce((sum, node) => sum + node.count, 0)
                  .toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Conversion Rate (Visit → Paid)</div>
              <div className="text-xl font-semibold">
                {Math.round(
                  (nodes.filter((n) => n.type === "conversion").reduce((sum, node) => sum + node.count, 0) /
                    Math.max(
                      1,
                      nodes.filter((n) => n.type === "visit").reduce((sum, node) => sum + node.count, 0),
                    )) *
                    100,
                )}
                %
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Churn Rate</div>
              <div className="text-xl font-semibold">
                {Math.round(
                  (nodes.filter((n) => n.type === "churn").reduce((sum, node) => sum + node.count, 0) /
                    Math.max(
                      1,
                      nodes
                        .filter((n) => ["conversion", "feature", "upgrade"].includes(n.type))
                        .reduce((sum, node) => sum + node.count, 0),
                    )) *
                    100,
                )}
                %
              </div>
            </div>
          </div>
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
