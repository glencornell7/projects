import { Mail, MoreHorizontal, Phone, Smartphone } from "lucide-react"
import type { BroadcastNodeData } from "../journey-types"

interface BroadcastNodeProps {
  data: any
}

export default function BroadcastNode({ data }: BroadcastNodeProps) {
  const broadcastData = data as BroadcastNodeData

  const getTypeIcon = () => {
    switch (broadcastData.type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <Phone className="h-4 w-4" />
      case "push":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const openRate = broadcastData.sent > 0 ? Math.round((broadcastData.opened / broadcastData.sent) * 100) : 0
  const clickRate = broadcastData.opened > 0 ? Math.round((broadcastData.clicked / broadcastData.opened) * 100) : 0

  return (
    <div className="w-[250px] bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-1 rounded-md bg-pink-100 text-pink-700 mr-2">{getTypeIcon()}</div>
          <span className="font-medium text-gray-900 truncate max-w-[160px]">{broadcastData.name}</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <div className="text-xs text-gray-500">Type</div>
            <div className="font-medium text-gray-900 capitalize">{broadcastData.type}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Sent</div>
            <div className="font-medium text-gray-900">{broadcastData.sent.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-gray-500">Open Rate</div>
            <div className="font-medium text-gray-900">{openRate}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Click Rate</div>
            <div className="font-medium text-gray-900">{clickRate}%</div>
          </div>
        </div>
      </div>
      <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button className="text-xs text-blue-600 hover:text-blue-700">View Broadcast</button>
      </div>
    </div>
  )
}
