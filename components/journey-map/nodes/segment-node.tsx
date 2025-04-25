import { MoreHorizontal, Users } from "lucide-react"
import type { SegmentNodeData } from "../journey-types"

interface SegmentNodeProps {
  data: any
}

export default function SegmentNode({ data }: SegmentNodeProps) {
  const segmentData = data as SegmentNodeData

  return (
    <div className="w-[250px] bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-1 rounded-md bg-indigo-100 text-indigo-700 mr-2">
            <Users className="h-4 w-4" />
          </div>
          <span className="font-medium text-gray-900 truncate max-w-[160px]">{segmentData.name}</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3">
        <div className="text-xs text-gray-500 mb-3">{segmentData.description}</div>

        <div>
          <div className="text-xs text-gray-500">Audience Size</div>
          <div className="font-medium text-gray-900">{segmentData.count.toLocaleString()} people</div>
        </div>
      </div>
      <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button className="text-xs text-blue-600 hover:text-blue-700">View Segment</button>
      </div>
    </div>
  )
}
