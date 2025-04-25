"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { JourneyData, JourneyStage, TimeRange } from "./journey-types"
import { campaigns } from "@/lib/sample-data"

interface JourneyCanvasProps {
  journeyData: JourneyData
  zoom: number
  showPaths: boolean
  showAssociatedContent: boolean
  timeRange: TimeRange
  minNodeSize: number
  onNodeClick?: (node: JourneyStage) => void
}

export default function JourneyCanvas({
  journeyData,
  zoom,
  showPaths,
  showAssociatedContent,
  timeRange,
  minNodeSize,
  onNodeClick,
}: JourneyCanvasProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [stages, setStages] = useState<JourneyStage[]>(journeyData.stages)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 3000, height: 2000 })

  // Apply time range filter to the data
  useEffect(() => {
    // In a real implementation, this would fetch data for the selected time range
    // For now, we'll just simulate different data volumes based on the time range
    const timeMultiplier = {
      "7days": 0.1,
      "30days": 0.3,
      "90days": 1,
      quarter: 1.2,
      year: 3,
      all: 5,
    }[timeRange]

    const filteredStages = journeyData.stages.map((stage) => ({
      ...stage,
      count: Math.round(stage.count * timeMultiplier),
      value: stage.value ? Math.round(stage.value * timeMultiplier) : undefined,
    }))

    setStages(filteredStages)
  }, [timeRange, journeyData.stages])

  // Handle mouse events for dragging nodes
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return // Only left mouse button

    setIsDragging(true)
    setDraggedNodeId(nodeId)

    const node = stages.find((n) => n.id === nodeId)
    if (node) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedNodeId || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - canvasRect.left - offset.x) / zoom
    const y = (e.clientY - canvasRect.top - offset.y) / zoom

    setStages((prevStages) =>
      prevStages.map((stage) => (stage.id === draggedNodeId ? { ...stage, position: { x, y } } : stage)),
    )
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDraggedNodeId(null)
  }

  const handleNodeClick = (e: React.MouseEvent, node: JourneyStage) => {
    e.stopPropagation()
    if (onNodeClick) {
      onNodeClick(node)
    }
  }

  // Calculate node size based on count
  const getNodeSize = (count: number) => {
    const maxCount = Math.max(...stages.map((s) => s.count))
    const minSize = minNodeSize
    const maxSize = 180

    return minSize + (count / maxCount) * (maxSize - minSize)
  }

  // Get color based on node type
  const getNodeColor = (type: string) => {
    switch (type) {
      case "visit":
        return { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-700" }
      case "signup":
        return { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700" }
      case "trial":
        return { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-700" }
      case "conversion":
        return { bg: "bg-green-100", border: "border-green-300", text: "text-green-700" }
      case "feature":
        return { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-700" }
      case "upgrade":
        return { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-700" }
      case "churn":
        return { bg: "bg-red-100", border: "border-red-300", text: "text-red-700" }
      case "retention":
        return { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-700" }
      case "campaign":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600" }
      case "broadcast":
        return { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600" }
      case "segment":
        return { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-600" }
      default:
        return { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-700" }
    }
  }

  // Calculate path for curved lines between nodes
  const getPathData = (source: JourneyStage, target: JourneyStage, count: number) => {
    const sourceX = source.position.x + getNodeSize(source.count) / 2
    const sourceY = source.position.y + getNodeSize(source.count) / 2
    const targetX = target.position.x + getNodeSize(target.count) / 2
    const targetY = target.position.y + getNodeSize(target.count) / 2

    // Calculate control points for a curved line
    const dx = targetX - sourceX
    const dy = targetY - sourceY
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Make the curve more pronounced for longer distances
    const curveFactor = Math.min(0.2, 50 / distance)

    // Create control points perpendicular to the direct line
    const mx = sourceX + dx * 0.5
    const my = sourceY + dy * 0.5

    // Calculate perpendicular offset
    const perpX = -dy * curveFactor
    const perpY = dx * curveFactor

    // Control point
    const controlX = mx + perpX
    const controlY = my + perpY

    // Calculate path width based on count
    const maxCount = Math.max(...journeyData.paths.map((p) => p.count))
    const minWidth = 1
    const maxWidth = 10
    const pathWidth = minWidth + (count / maxCount) * (maxWidth - minWidth)

    return {
      sourceX,
      sourceY,
      targetX,
      targetY,
      controlX,
      controlY,
      pathWidth,
    }
  }

  // Generate associated content nodes (campaigns, broadcasts, segments)
  const getAssociatedContentNodes = () => {
    if (!showAssociatedContent) return []

    const associatedNodes: JourneyStage[] = []

    // For each conversion stage, add associated campaigns
    stages
      .filter((stage) => stage.type === "conversion")
      .forEach((stage) => {
        // Find campaigns that contribute to this conversion
        const relatedCampaigns = campaigns.slice(0, 3) // Just use first 3 campaigns for demo

        relatedCampaigns.forEach((campaign, index) => {
          associatedNodes.push({
            id: `campaign-${campaign.id}-for-${stage.id}`,
            name: campaign.name,
            type: "campaign",
            description: `${campaign.channel} campaign for ${stage.name}`,
            count: campaign.conversions,
            // Position the campaign nodes in a semi-circle below the conversion node
            position: {
              x: stage.position.x + Math.cos(((index - 1) * Math.PI) / 3) * 200,
              y: stage.position.y + 150 + Math.sin(((index - 1) * Math.PI) / 3) * 100,
            },
          })
        })
      })

    return associatedNodes
  }

  // Get all nodes to render (main stages + associated content if enabled)
  const allNodes = [...stages, ...(showAssociatedContent ? getAssociatedContentNodes() : [])]

  return (
    <div
      ref={canvasRef}
      className="w-full h-full overflow-auto bg-gray-50 relative"
      style={{
        backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute top-0 left-0 transform-gpu"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Render paths first so they appear behind nodes */}
        {showPaths && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
                fill="#94a3b8"
              >
                <polygon points="0 0, 10 3.5, 0 7" />
              </marker>
            </defs>

            {journeyData.paths.map((path) => {
              const source = stages.find((s) => s.id === path.source)
              const target = stages.find((s) => s.id === path.target)

              if (!source || !target) return null

              const pathData = getPathData(source, target, path.count)
              const isHovered = hoveredPath === path.id || hoveredNode === path.source || hoveredNode === path.target

              return (
                <g key={path.id} opacity={isHovered ? 1 : 0.6}>
                  <path
                    d={`M ${pathData.sourceX} ${pathData.sourceY} Q ${pathData.controlX} ${pathData.controlY}, ${pathData.targetX} ${pathData.targetY}`}
                    fill="none"
                    stroke={isHovered ? "#64748b" : "#94a3b8"}
                    strokeWidth={pathData.pathWidth}
                    strokeDasharray="none"
                    markerEnd="url(#arrowhead)"
                    onMouseEnter={() => setHoveredPath(path.id)}
                    onMouseLeave={() => setHoveredPath(null)}
                  />

                  {isHovered && (
                    <g transform={`translate(${pathData.controlX}, ${pathData.controlY})`}>
                      <rect x="-50" y="-25" width="100" height="50" rx="4" fill="white" stroke="#e2e8f0" />
                      <text x="0" y="-5" textAnchor="middle" fontSize="12" fill="#64748b">
                        {path.count.toLocaleString()} users
                      </text>
                      <text x="0" y="15" textAnchor="middle" fontSize="12" fill="#64748b">
                        {path.conversionRate}% conversion
                      </text>
                    </g>
                  )}
                </g>
              )
            })}

            {/* Render connections between conversion nodes and their associated content */}
            {showAssociatedContent &&
              allNodes
                .filter((node) => node.type === "campaign")
                .map((campaignNode) => {
                  // Extract the conversion node ID from the campaign node ID
                  const conversionNodeId = campaignNode.id.split("-for-")[1]
                  const conversionNode = stages.find((s) => s.id === conversionNodeId)

                  if (!conversionNode) return null

                  const sourceX = conversionNode.position.x + getNodeSize(conversionNode.count) / 2
                  const sourceY = conversionNode.position.y + getNodeSize(conversionNode.count) / 2
                  const targetX = campaignNode.position.x + getNodeSize(campaignNode.count) / 2
                  const targetY = campaignNode.position.y + getNodeSize(campaignNode.count) / 2

                  return (
                    <g key={`link-${campaignNode.id}`} opacity={0.4}>
                      <path
                        d={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth={1}
                        strokeDasharray="5,5"
                      />
                    </g>
                  )
                })}
          </svg>
        )}

        {/* Render nodes */}
        {allNodes.map((node) => {
          const { x, y } = node.position
          const nodeSize = getNodeSize(node.count)
          const colors = getNodeColor(node.type)
          const isHovered = hoveredNode === node.id

          return (
            <div
              key={node.id}
              className={`absolute cursor-pointer rounded-lg border-2 ${colors.bg} ${colors.border} ${
                isHovered ? "shadow-lg ring-2 ring-blue-300" : "shadow"
              } transition-shadow duration-200`}
              style={{
                left: x,
                top: y,
                width: nodeSize,
                height: nodeSize,
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={(e) => handleNodeClick(e, node)}
            >
              <div className="flex flex-col items-center justify-center h-full p-3 text-center">
                <div className={`font-medium ${colors.text} text-sm`}>{node.name}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{node.description}</div>
                <div className="text-xs text-gray-500 mt-1">{node.count.toLocaleString()} users</div>
                {node.value && (
                  <div className="text-xs text-green-600 font-medium mt-1">${node.value.toLocaleString()}</div>
                )}
                {node.type === "conversion" && (
                  <div className="text-xs text-blue-600 mt-2 underline">Click for details</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
