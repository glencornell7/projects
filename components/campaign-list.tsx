"use client"

import { useState } from "react"
import { ChevronDown, Edit, ExternalLink, Mail, MessageSquare, MoreHorizontal, Phone, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Campaign } from "@/lib/types"
import { conversionGoals } from "@/lib/sample-data"

interface CampaignListProps {
  campaigns: Campaign[]
  goalId: string | null
}

export default function CampaignList({ campaigns, goalId }: CampaignListProps) {
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)

  const selectedGoal = goalId ? conversionGoals.find((g) => g.id === goalId) : null

  const toggleExpand = (id: string) => {
    if (expandedCampaign === id) {
      setExpandedCampaign(null)
    } else {
      setExpandedCampaign(id)
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <Phone className="h-4 w-4" />
      case "push":
        return <Smartphone className="h-4 w-4" />
      case "in-app":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="p-6 space-y-4">
        {selectedGoal && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tactics Contributing to: {selectedGoal.name}</h3>
            <p className="text-gray-500 mb-4">{selectedGoal.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Value Generated</p>
                <p className="text-2xl font-semibold text-gray-900">${selectedGoal.value.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Metrics</p>
                <p className="text-2xl font-semibold text-gray-900">{selectedGoal.conversions.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Progress to Target</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.min(Math.round((selectedGoal.conversions / selectedGoal.target) * 100), 100)}%
                </p>
              </div>
            </div>
            <Separator className="bg-gray-200 my-6" />
          </div>
        )}

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tactics found for this outcome metric.</p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">Create New Tactic</Button>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(campaign.id)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`
                    p-2 rounded-md
                    ${campaign.status === "active" ? "status-active" : ""}
                    ${campaign.status === "draft" ? "status-draft" : ""}
                    ${campaign.status === "paused" ? "status-paused" : ""}
                  `}
                  >
                    {getChannelIcon(campaign.channel)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-transparent border-gray-200 text-gray-500">
                        {campaign.channel}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`
                        text-xs bg-transparent
                        ${campaign.status === "active" ? "border-green-500 text-green-600" : ""}
                        ${campaign.status === "draft" ? "border-gray-400 text-gray-600" : ""}
                        ${campaign.status === "paused" ? "border-amber-500 text-amber-600" : ""}
                      `}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-gray-900">{campaign.conversions} metrics</p>
                    <p className="text-gray-500 text-sm">${campaign.value.toLocaleString()} value</p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedCampaign === campaign.id ? "transform rotate-180" : ""}`}
                  />
                </div>
              </div>

              {expandedCampaign === campaign.id && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Audience</p>
                      <p className="text-gray-900">{campaign.audience}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Created</p>
                      <p className="text-gray-900">{campaign.created}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Last Modified</p>
                      <p className="text-gray-900">{campaign.modified}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-sm mb-1">Contributing to Outcome Metrics</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {campaign.goalIds.map((goalId) => {
                        const goal = conversionGoals.find((g) => g.id === goalId)
                        if (!goal) return null
                        return (
                          <Badge
                            key={goalId}
                            className={`
                              ${goal.category === "acquisition" ? "category-acquisition" : ""}
                              ${goal.category === "activation" ? "category-activation" : ""}
                              ${goal.category === "retention" ? "category-retention" : ""}
                              ${goal.category === "expansion" ? "category-expansion" : ""}
                            `}
                          >
                            {goal.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-sm mb-1">Performance</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Sent</p>
                        <p className="text-gray-900 font-medium">{campaign.metrics.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Opened</p>
                        <p className="text-gray-900 font-medium">
                          {campaign.metrics.opened.toLocaleString()} (
                          {Math.round((campaign.metrics.opened / campaign.metrics.sent) * 100)}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Clicked</p>
                        <p className="text-gray-900 font-medium">
                          {campaign.metrics.clicked.toLocaleString()} (
                          {Math.round((campaign.metrics.clicked / campaign.metrics.sent) * 100)}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Metrics</p>
                        <p className="text-gray-900 font-medium">
                          {campaign.conversions.toLocaleString()} (
                          {Math.round((campaign.conversions / campaign.metrics.sent) * 100)}%)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
                        <DropdownMenuItem className="focus:bg-gray-100">Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-100">Archive</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200" />
                        <DropdownMenuItem className="focus:bg-gray-100 text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}
