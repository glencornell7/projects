import { Mail, MessageSquare, MoreHorizontal, Phone, Smartphone } from "lucide-react"
import type { CampaignNodeData } from "../journey-types"

interface CampaignNodeProps {
  data: any
}

export default function CampaignNode({ data }: CampaignNodeProps) {
  const campaignData = data as CampaignNodeData

  const getChannelIcon = () => {
    switch (campaignData.channel) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <Phone className="h-4 w-4" />
      case "push":
        return <Smartphone className="h-4 w-4" />
      case "in-app":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  return (
    <div className="w-[280px] bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`p-1 rounded-md mr-2
              ${campaignData.status === "active" ? "bg-green-100 text-green-700" : ""}
              ${campaignData.status === "draft" ? "bg-gray-100 text-gray-700" : ""}
              ${campaignData.status === "paused" ? "bg-amber-100 text-amber-700" : ""}
            `}
          >
            {getChannelIcon()}
          </div>
          <span className="font-medium text-gray-900 truncate max-w-[180px]">{campaignData.name}</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="text-xs text-gray-500">Status</div>
          <div
            className={`text-xs px-2 py-0.5 rounded-full
              ${campaignData.status === "active" ? "bg-green-100 text-green-700" : ""}
              ${campaignData.status === "draft" ? "bg-gray-100 text-gray-700" : ""}
              ${campaignData.status === "paused" ? "bg-amber-100 text-amber-700" : ""}
            `}
          >
            {campaignData.status}
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-3">Audience: {campaignData.audience}</div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-gray-500">Conversions</div>
            <div className="font-medium text-gray-900">{campaignData.conversions.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Channel</div>
            <div className="font-medium text-gray-900 capitalize">{campaignData.channel}</div>
          </div>
        </div>
      </div>
      <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button className="text-xs text-blue-600 hover:text-blue-700">View Campaign</button>
      </div>
    </div>
  )
}
