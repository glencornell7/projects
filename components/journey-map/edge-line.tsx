interface EdgeLineProps {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  label?: string
}

export default function EdgeLine({ sourceX, sourceY, targetX, targetY, label }: EdgeLineProps) {
  // Calculate control points for a curved line
  const dx = targetX - sourceX
  const dy = targetY - sourceY

  // Create a curved path
  const controlX1 = sourceX + dx * 0.4
  const controlY1 = sourceY
  const controlX2 = sourceX + dx * 0.6
  const controlY2 = targetY

  // Path for the curved line
  const path = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`

  // Calculate position for the label
  const labelX = sourceX + dx * 0.5
  const labelY = sourceY + dy * 0.5 - 10

  // Calculate angle for the arrow
  const angle = Math.atan2(targetY - controlY2, targetX - controlX2)

  // Arrow points
  const arrowSize = 8
  const arrowX = targetX - 5
  const arrowY = targetY

  const arrowPoints = [
    [arrowX, arrowY],
    [arrowX - arrowSize * Math.cos(angle - Math.PI / 6), arrowY - arrowSize * Math.sin(angle - Math.PI / 6)],
    [arrowX - arrowSize * Math.cos(angle + Math.PI / 6), arrowY - arrowSize * Math.sin(angle + Math.PI / 6)],
  ]
    .map((point) => point.join(","))
    .join(" ")

  return (
    <>
      <path d={path} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="none" markerEnd="url(#arrowhead)" />

      <polygon points={arrowPoints} fill="#94a3b8" />

      {label && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect x="-40" y="-10" width="80" height="20" rx="4" fill="white" stroke="#e2e8f0" />
          <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#64748b">
            {label}
          </text>
        </g>
      )}
    </>
  )
}
