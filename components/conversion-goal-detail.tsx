"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ChevronDown,
  Edit,
  ExternalLink,
  Filter,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Smartphone,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ConversionGoal } from "@/lib/types"
import { campaigns } from "@/lib/sample-data"

// Sample data for broadcasts and segments
const broadcasts = [
  {
    id: "brd1",
    name: "Welcome Series: Email 1",
    type: "email",
    status: "active",
    sent: 5240,
    opened: 3144,
    clicked: 1572,
    converted: 314,
    lastSent: "2023-06-15",
  },
  {
    id: "brd2",
    name: "Feature Announcement",
    type: "email",
    status: "active",
    sent: 12500,
    opened: 6250,
    clicked: 2500,
    converted: 625,
    lastSent: "2023-06-10",
  },
  {
    id: "brd3",
    name: "Upgrade Reminder",
    type: "push",
    status: "active",
    sent: 8750,
    opened: 3500,
    clicked: 1750,
    converted: 350,
    lastSent: "2023-06-05",
  },
  {
    id: "brd4",
    name: "Re-engagement Offer",
    type: "sms",
    status: "draft",
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    lastSent: "-",
  },
]

const segments = [
  {
    id: "seg1",
    name: "Trial Users (Days 1-14)",
    audience: 3250,
    description: "Users currently in trial period",
    updated: "2023-06-12",
  },
  {
    id: "seg2",
    name: "Basic Plan Users (>30 days)",
    audience: 8500,
    description: "Users on basic plan for more than 30 days",
    updated: "2023-06-10",
  },
  {
    id: "seg3",
    name: "At-risk Customers",
    audience: 1200,
    description: "Customers showing signs of potential churn",
    updated: "2023-06-08",
  },
]

interface ConversionGoalDetailProps {
  goal: ConversionGoal
}

export default function ConversionGoalDetail({ goal }: ConversionGoalDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)

  const progress = Math.min(Math.round((goal.conversions / goal.target) * 100), 100)
  const relatedCampaigns = campaigns.filter((campaign) => campaign.goalIds.includes(goal.id))

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

  const toggleExpand = (id: string) => {
    if (expandedCampaign === id) {
      setExpandedCampaign(null)
    } else {
      setExpandedCampaign(id)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Goals
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{goal.name}</h1>
        <Badge
          className={`ml-4 font-normal ${
            goal.category === "acquisition"
              ? "category-acquisition"
              : goal.category === "activation"
                ? "category-activation"
                : goal.category === "retention"
                  ? "category-retention"
                  : "category-expansion"
          }`}
        >
          {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
        </Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Edit className="h-4 w-4 mr-2" />
            Edit Goal
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
              <DropdownMenuItem className="focus:bg-gray-100">Duplicate Goal</DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-gray-100">Archive Goal</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="focus:bg-gray-100 text-red-600">Delete Goal</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-gray-500 mb-6">{goal.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500">Value Generated</CardDescription>
            <CardTitle className="text-2xl text-gray-900">${goal.value.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center ${goal.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              <span className="text-sm">
                {goal.trend >= 0 ? "+" : ""}
                {goal.trend}% from previous period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500">Conversions</CardDescription>
            <CardTitle className="text-2xl text-gray-900">{goal.conversions.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-gray-500 text-sm mb-1">Target: {goal.target.toLocaleString()}</div>
              <div className="flex items-center">
                <div className="w-full max-w-[100px] bg-gray-200 h-2 rounded-full mr-3">
                  <div
                    className={`h-full rounded-full ${
                      goal.category === "acquisition"
                        ? "progress-acquisition"
                        : goal.category === "activation"
                          ? "progress-activation"
                          : goal.category === "retention"
                            ? "progress-retention"
                            : "progress-expansion"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-gray-900 text-sm">{progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500">Campaigns</CardDescription>
            <CardTitle className="text-2xl text-gray-900">{relatedCampaigns.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500 text-sm">
              {relatedCampaigns.filter((c) => c.status === "active").length} active campaigns
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-500">Conversion Rate</CardDescription>
            <CardTitle className="text-2xl text-gray-900">3.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-600 text-sm">+0.5% from previous period</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-200 mb-6">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger
              value="overview"
              className="py-3 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="campaigns"
              className="py-3 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
            >
              Campaigns ({relatedCampaigns.length})
            </TabsTrigger>
            <TabsTrigger
              value="broadcasts"
              className="py-3 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
            >
              Broadcasts ({broadcasts.length})
            </TabsTrigger>
            <TabsTrigger
              value="segments"
              className="py-3 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
            >
              Segments ({segments.length})
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="py-3 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 bg-transparent"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white border-gray-200 shadow-sm mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-gray-900">Conversion Trend</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Last 30 Days
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
                        <DropdownMenuItem className="focus:bg-gray-100">Last 7 Days</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-100">Last 30 Days</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-100">Last 90 Days</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-100">Last 12 Months</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-100">Custom Range</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Conversion trend chart would appear here</p>
                      <p className="text-xs mt-1">Shows daily/weekly conversion volume over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Top Contributing Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedCampaigns.slice(0, 3).map((campaign, index) => (
                      <div key={campaign.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 text-gray-500">{index + 1}.</div>
                          <div
                            className={`p-2 rounded-md mr-2
                            ${campaign.status === "active" ? "status-active" : ""}
                            ${campaign.status === "draft" ? "status-draft" : ""}
                            ${campaign.status === "paused" ? "status-paused" : ""}
                          `}
                          >
                            {getChannelIcon(campaign.channel)}
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{campaign.name}</p>
                            <p className="text-xs text-gray-500">{campaign.audience}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">{campaign.conversions} conversions</p>
                          <p className="text-xs text-gray-500">${campaign.value.toLocaleString()} value</p>
                        </div>
                      </div>
                    ))}
                    {relatedCampaigns.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-2"
                        onClick={() => setActiveTab("campaigns")}
                      >
                        View All Campaigns
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white border-gray-200 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Goal Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Category</p>
                      <Badge
                        className={`font-normal ${
                          goal.category === "acquisition"
                            ? "category-acquisition"
                            : goal.category === "activation"
                              ? "category-activation"
                              : goal.category === "retention"
                                ? "category-retention"
                                : "category-expansion"
                        }`}
                      >
                        {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-1">Value Per Conversion</p>
                      <p className="text-gray-900 font-medium">${(goal.value / goal.conversions).toFixed(2)}</p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-1">Conversion Type</p>
                      <p className="text-gray-900 font-medium">Event-based conversion</p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-1">Conversion Event</p>
                      <p className="text-gray-900 font-medium">
                        {goal.category === "acquisition" && "signed_up"}
                        {goal.category === "activation" && "completed_onboarding"}
                        {goal.category === "retention" && "renewed_subscription"}
                        {goal.category === "expansion" && "upgraded_plan"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-1">Created</p>
                      <p className="text-gray-900 font-medium">June 1, 2023</p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-1">Last Modified</p>
                      <p className="text-gray-900 font-medium">June 15, 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Conversion Attribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 mb-4">
                    <div className="text-center text-gray-500">
                      <p>Attribution chart would appear here</p>
                      <p className="text-xs mt-1">Shows conversion sources</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email Campaigns</span>
                      <span className="text-gray-900 font-medium">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Push Notifications</span>
                      <span className="text-gray-900 font-medium">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">SMS</span>
                      <span className="text-gray-900 font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">In-App Messages</span>
                      <span className="text-gray-900 font-medium">10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Other</span>
                      <span className="text-gray-900 font-medium">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Campaigns</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Create Campaign</Button>
            </div>
          </div>

          <Card className="bg-white border-gray-200 shadow-sm">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-4">
                {relatedCampaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No campaigns found for this conversion goal.</p>
                    <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">Create New Campaign</Button>
                  </div>
                ) : (
                  relatedCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm"
                    >
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
                            <p className="text-gray-900">{campaign.conversions} conversions</p>
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
                                <p className="text-xs text-gray-500">Converted</p>
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
          </Card>
        </TabsContent>

        <TabsContent value="broadcasts" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Broadcasts</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Create Broadcast</Button>
            </div>
          </div>

          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Name</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Type</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Status</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Sent</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Opened</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Clicked</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Converted</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Last Sent</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {broadcasts.map((broadcast) => (
                      <tr key={broadcast.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{broadcast.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="p-1 rounded-md mr-2">
                              {broadcast.type === "email" && <Mail className="h-4 w-4 text-blue-600" />}
                              {broadcast.type === "push" && <Smartphone className="h-4 w-4 text-purple-600" />}
                              {broadcast.type === "sms" && <Phone className="h-4 w-4 text-green-600" />}
                            </div>
                            <span className="text-gray-900">{broadcast.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={`font-normal ${
                              broadcast.status === "active" ? "status-active" : "status-draft"
                            }`}
                          >
                            {broadcast.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-900">{broadcast.sent.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="text-gray-900">
                            {broadcast.opened.toLocaleString()}
                            {broadcast.sent > 0 && (
                              <span className="text-gray-500 text-xs ml-1">
                                ({Math.round((broadcast.opened / broadcast.sent) * 100)}%)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-900">
                            {broadcast.clicked.toLocaleString()}
                            {broadcast.sent > 0 && (
                              <span className="text-gray-500 text-xs ml-1">
                                ({Math.round((broadcast.clicked / broadcast.sent) * 100)}%)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-900">
                            {broadcast.converted.toLocaleString()}
                            {broadcast.sent > 0 && (
                              <span className="text-gray-500 text-xs ml-1">
                                ({Math.round((broadcast.converted / broadcast.sent) * 100)}%)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-900">{broadcast.lastSent}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More</span>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Audience Segments</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Create Segment</Button>
            </div>
          </div>

          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Name</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Description</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Audience Size</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Last Updated</th>
                      <th className="px-4 py-3 text-gray-500 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segments.map((segment) => (
                      <tr key={segment.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-gray-900 font-medium">{segment.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-900">{segment.description}</td>
                        <td className="px-4 py-3 text-gray-900">{segment.audience.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-900">{segment.updated}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-white border-gray-200 text-gray-900">
                                <DropdownMenuItem className="focus:bg-gray-100">Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-gray-100">Export</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-200" />
                                <DropdownMenuItem className="focus:bg-gray-100 text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white border-gray-200 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Goal Configuration</CardTitle>
                  <CardDescription className="text-gray-500">
                    Update the basic information and settings for this conversion goal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={goal.name}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        defaultValue={goal.description}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="acquisition" selected={goal.category === "acquisition"}>
                          Acquisition
                        </option>
                        <option value="activation" selected={goal.category === "activation"}>
                          Activation
                        </option>
                        <option value="retention" selected={goal.category === "retention"}>
                          Retention
                        </option>
                        <option value="expansion" selected={goal.category === "expansion"}>
                          Expansion
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value Per Conversion ($)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={(goal.value / goal.conversions).toFixed(2)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Conversions (Monthly)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={goal.target}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Conversion Tracking</CardTitle>
                  <CardDescription className="text-gray-500">
                    Configure how conversions are tracked and attributed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="event">Event-based conversion</option>
                        <option value="revenue">Revenue-based conversion</option>
                        <option value="attribute">Attribute change</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Event</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="signed_up">signed_up</option>
                        <option value="completed_onboarding">completed_onboarding</option>
                        <option value="upgraded_plan">upgraded_plan</option>
                        <option value="renewed_subscription">renewed_subscription</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attribution Window</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30" selected>
                          30 days
                        </option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Determines how long after a message is sent that a conversion can be attributed to it
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attribution Model</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="first_touch">First Touch</option>
                        <option value="last_touch" selected>
                          Last Touch
                        </option>
                        <option value="linear">Linear (Equal Credit)</option>
                        <option value="position_based">Position Based</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Determines how conversion credit is assigned when multiple messages are involved
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white border-gray-200 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Danger Zone</CardTitle>
                  <CardDescription className="text-gray-500">
                    Irreversible actions for this conversion goal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-md">
                      <h3 className="font-medium text-gray-900 mb-1">Archive Goal</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        This goal will be hidden from the dashboard but data will be preserved
                      </p>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      >
                        Archive Goal
                      </Button>
                    </div>

                    <div className="p-4 border border-red-200 rounded-md">
                      <h3 className="font-medium text-gray-900 mb-1">Delete Goal</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        This action cannot be undone. All data associated with this goal will be permanently deleted.
                      </p>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                        Delete Goal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-blue-500 pl-3 py-1">
                      <p className="text-sm text-gray-900">Goal created</p>
                      <p className="text-xs text-gray-500">June 1, 2023 • John Smith</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-3 py-1">
                      <p className="text-sm text-gray-900">Target updated from 1000 to 1200</p>
                      <p className="text-xs text-gray-500">June 10, 2023 • Sarah Johnson</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-3 py-1">
                      <p className="text-sm text-gray-900">Description updated</p>
                      <p className="text-xs text-gray-500">June 15, 2023 • John Smith</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
