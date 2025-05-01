"use client"

import { useMemo } from "react"

interface TrendChartProps {
  data: number[]
  height?: number
  width?: number
  lineColor?: string
  fillColor?: string
  className?: string
}

export function TrendChart({
  data,
  height = 40,
  width = 100,
  lineColor = "#7265dc",
  fillColor = "rgba(114, 101, 220, 0.1)",
  className = "",
}: TrendChartProps) {
  const normalizedData = useMemo(() => {
    if (!data.length) return []

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    return data.map((value) => 1 - (value - min) / range)
  }, [data])

  const pathD = useMemo(() => {
    if (!normalizedData.length) return ""

    const segmentWidth = width / (normalizedData.length - 1)

    let path = `M 0,${normalizedData[0] * height} `

    normalizedData.forEach((point, i) => {
      if (i === 0) return
      path += `L ${i * segmentWidth},${point * height} `
    })

    // Add fill path
    path += `L ${width},${height} L 0,${height} Z`

    return path
  }, [normalizedData, height, width])

  if (!data.length) {
    return <div className={`h-${height} w-${width} ${className}`} />
  }

  return (
    <svg
      height={height}
      width={width}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path d={pathD} fill={fillColor} stroke={lineColor} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
