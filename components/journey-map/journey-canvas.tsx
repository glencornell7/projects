"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { NodeData, EdgeData } from "./journey-types"
import ConversionNode from "./nodes/conversion-node"
import CampaignNode from "./nodes/campaign-node"
import SegmentNode from "./nodes/segment-node"
import BroadcastNode from "./nodes/broadcast-node"
import EdgeLine from "./edge-line"

interface JourneyCanvasProps {
  nodes: NodeData[]
  edges: EdgeData[]
  zoom: number
}

export default function JourneyCanvas({ nodes: initialNodes, edges, zoom }: JourneyCanvasProps) {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 3000, height: 2000 })
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Position nodes in a layout on first render
  useEffect(() => {
    // First, organize conversion goals by their category to create a logical flow
    const acquisitionGoals = initialNodes.filter((n) => n.type === "conversion" && n.data.category === "acquisition")
    const activationGoals = initialNodes.filter((n) => n.type === "conversion" && n.data.category === "activation")
    const retentionGoals = initialNodes.filter((n) => n.type === "conversion" && n.data.category === "retention")
    const expansionGoals = initialNodes.filter((n) => n.type === "conversion" && n.data.category === "expansion")

    // Combine them in the logical order of a customer journey
    const orderedConversionGoals = [...acquisitionGoals, ...activationGoals, ...retentionGoals, ...expansionGoals]

    // Position nodes in a logical layout
    const positionedNodes = initialNodes.map((node) => {
      let x = 0
      let y = 0

      if (node.type === "conversion") {
        // Find the index of this goal in our ordered list
        const goalIndex = orderedConversionGoals.findIndex((g) => g.id === node.id)

        // Position conversion goals horizontally in a line
        x = 200 + goalIndex * 350 // Wider spacing for better readability
        y = 300 // Fixed vertical position for the main journey line
      } else if (node.type === "campaign") {
        // Position campaigns below their related conversion goals
        const campaignIndex = initialNodes.filter((n) => n.type === "campaign").indexOf(node)

        // Find related conversion goals to position campaigns near them
        const relatedGoalIds = (node.data as any).goalIds || []
        const primaryGoalId = relatedGoalIds[0]?.replace("goal-", "") || ""
        const relatedGoalNode = orderedConversionGoals.find((g) => g.id.includes(primaryGoalId))

        if (relatedGoalNode) {
          // Position near the related goal
          x = relatedGoalNode.position.x || 200 + campaignIndex * 150
          y = 500 // Below the conversion goals
        } else {
          // Fallback positioning
          x = 200 + campaignIndex * 200
          y = 500
        }
      } else if (node.type === "segment") {
        // Position segments above the journey line
        const segmentIndex = initialNodes.filter((n) => n.type === "segment").indexOf(node)
        x = 200 + segmentIndex * 300
        y = 100
      } else if (node.type === "broadcast") {
        // Position broadcasts at the bottom
        const broadcastIndex = initialNodes.filter((n) => n.type === "broadcast").indexOf(node)
        x = 200 + broadcastIndex * 300
        y = 700
      }

      return {
        ...node,
        position: { x, y },
      }
    })

    setNodes(positionedNodes)
  }, [initialNodes])

  // Handle mouse events for dragging nodes
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return // Only left mouse button

    setIsDragging(true)
    setDraggedNodeId(nodeId)

    const node = nodes.find((n) => n.id === nodeId)
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

    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === draggedNodeId ? { ...node, position: { x, y } } : node)),
    )
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDraggedNodeId(null)
  }

  // Calculate edge paths
  const getEdgePath = (edge: EdgeData) => {
    const sourceNode = nodes.find((n) => n.id === edge.source)
    const targetNode = nodes.find((n) => n.id === edge.target)

    if (!sourceNode || !targetNode) return null

    // For conversion-to-conversion edges (horizontal flow)
    if (sourceNode.type === "conversion" && targetNode.type === "conversion") {
      const sourceX = sourceNode.position.x + 300 // Right side of source node
      const sourceY = sourceNode.position.y + 75 // Middle of node height
      const targetX = targetNode.position.x // Left side of target node
      const targetY = targetNode.position.y + 75 // Middle of node height

      return { sourceX, sourceY, targetX, targetY }
    }

    // For other connections
    const sourceX = sourceNode.position.x + 150 // Middle of node width
    const sourceY =
      sourceNode.type === "segment"
        ? sourceNode.position.y + 100 // Bottom of segment node
        : sourceNode.position.y + 75 // Middle of other node types

    const targetX = targetNode.position.x + 150 // Middle of node width
    const targetY =
      targetNode.type === "conversion"
        ? targetNode.position.y // Top of conversion node
        : targetNode.position.y + 75 // Middle of other node types

    return { sourceX, sourceY, targetX, targetY }
  }

  const toggleNodeExpansion = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

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
        {/* Render edges first so they appear behind nodes */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            const targetNode = nodes.find((n) => n.id === edge.target)

            if (!sourceNode || !targetNode) return null

            // Only show edges between conversion nodes by default, and edges connected to expanded nodes
            const isConversionToConversion = sourceNode.type === "conversion" && targetNode.type === "conversion"
            const isConnectedToExpandedNode = expandedNodes.has(edge.source) || expandedNodes.has(edge.target)

            if (!isConversionToConversion && !isConnectedToExpandedNode) {
              return null
            }

            const path = getEdgePath(edge)
            if (!path) return null

            return (
              <EdgeLine
                key={edge.id}
                sourceX={path.sourceX}
                sourceY={path.sourceY}
                targetX={path.targetX}
                targetY={path.targetY}
                label={edge.label}
              />
            )
          })}
        </svg>

        {/* Render nodes */}
        {nodes.map((node) => {
          const { x, y } = node.position

          // Only show conversion nodes by default, and any nodes connected to expanded conversion nodes
          const isConversionNode = node.type === "conversion"
          const isConnectedToExpandedNode = Array.from(expandedNodes).some((expandedId) => {
            return edges.some(
              (edge) =>
                (edge.source === expandedId && edge.target === node.id) ||
                (edge.target === expandedId && edge.source === node.id),
            )
          })

          if (!isConversionNode && !isConnectedToExpandedNode) {
            return null
          }

          switch (node.type) {
            case "conversion":
              return (
                <div
                  key={node.id}
                  className="absolute cursor-move"
                  style={{ left: x, top: y }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <ConversionNode
                    data={node.data}
                    isExpanded={expandedNodes.has(node.id)}
                    onToggleExpand={(e) => toggleNodeExpansion(node.id, e)}
                  />
                </div>
              )
            case "campaign":
              return (
                <div
                  key={node.id}
                  className="absolute cursor-move"
                  style={{ left: x, top: y }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <CampaignNode data={node.data} />
                </div>
              )
            case "segment":
              return (
                <div
                  key={node.id}
                  className="absolute cursor-move"
                  style={{ left: x, top: y }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <SegmentNode data={node.data} />
                </div>
              )
            case "broadcast":
              return (
                <div
                  key={node.id}
                  className="absolute cursor-move"
                  style={{ left: x, top: y }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <BroadcastNode data={node.data} />
                </div>
              )
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
