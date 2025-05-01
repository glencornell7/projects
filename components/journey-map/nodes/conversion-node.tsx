"use client"

import type React from "react"

import { BarChart3, ChevronDown, MoreHorizontal } from "lucide-react"
import type { ConversionNodeData } from "../journey-types"

interface ConversionNodeProps {
  data: any
  isExpanded: boolean
  onToggleExpand: (e: React.MouseEvent) => void
}

export default function ConversionNode({ data, isExpanded, onToggleExpand }: ConversionNodeProps) {
  const conversionData = data as ConversionNodeData
  const progress = Math.min(Math.round((conversionData.conversions / conversionData.target) * 100), 100)

  return (
    <div className="w-[300px] bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 
              ${conversionData.category === "acquisition" ? "bg-blue-500" : ""}
              ${conversionData.category === "activation" ? "bg-green-500" : ""}
              ${conversionData.category === "retention" ? "bg-purple-500" : ""}
              ${conversionData.category === "expansion" ? "bg-amber-500" : ""}
            `}
            />
            <span className="font-medium text-gray-900">{conversionData.name}</span>
          </div>
          <span className="text-xs text-gray-500 mt-1 capitalize ml-5">{conversionData.category}</span>
        </div>
        <div className="flex items-center">
          <button className="text-gray-500 hover:text-gray-700" onClick={onToggleExpand}>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
          <button className="ml-1 text-gray-500 hover:text-gray-700">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <div className="text-xs text-gray-500 mb-1">{conversionData.description}</div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <div className="text-xs text-gray-500">Conversions</div>
            <div className="font-medium text-gray-900">{conversionData.conversions.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Value</div>
            <div className="font-medium text-gray-900">${conversionData.value.toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className={`h-full rounded-full 
                ${conversionData.category === "acquisition" ? "bg-blue-500" : ""}
                ${conversionData.category === "activation" ? "bg-green-500" : ""}
                ${conversionData.category === "retention" ? "bg-purple-500" : ""}
                ${conversionData.category === "expansion" ? "bg-amber-500" : ""}
              `}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <BarChart3 className="h-3 w-3 mr-1" />
          <span>Target: {conversionData.target.toLocaleString()}</span>
        </div>
        <button className="text-xs text-blue-600 hover:text-blue-700">View Details</button>
      </div>
    </div>
  )
}
