"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Mail, MessageSquare, Phone, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/lib/data-context"
import { useToast } from "@/components/ui/use-toast"

interface AddTacticFormProps {
  goalId?: string
  onClose: () => void
  onSuccess?: () => void
}

export function AddTacticForm({ goalId, onClose, onSuccess }: AddTacticFormProps) {
  const { goals, addCampaign } = useData()
  const { toast } = useToast()

  const [tacticType, setTacticType] = useState("campaign")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [channel, setChannel] = useState("email")
  const [audience, setAudience] = useState("")
  const [selectedGoals, setSelectedGoals] = useState<string[]>(goalId ? [goalId] : [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGoalToggle = (id: string) => {
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the tactic",
        variant: "destructive",
      })
      return
    }

    if (selectedGoals.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one metric to associate with this tactic",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Add the new campaign to our data
      const newCampaign = addCampaign({
        name,
        description: description || undefined,
        status: "active",
        channel: channel as "email" | "sms" | "push" | "in-app",
        audience: audience || "All Users",
        goalIds: selectedGoals,
        conversions: 0,
        value: 0,
        metrics: {
          sent: 0,
          opened: 0,
          clicked: 0,
        },
      })

      toast({
        title: "Success",
        description: `${tacticType.charAt(0).toUpperCase() + tacticType.slice(1)} "${name}" has been created`,
      })

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess()
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tactic. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6">
        <div className="py-6 space-y-6">
          <Tabs value={tacticType} onValueChange={setTacticType} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="campaign" className="data-[state=active]:bg-blue-50">
                Campaign
              </TabsTrigger>
              <TabsTrigger value="broadcast" className="data-[state=active]:bg-blue-50">
                Broadcast
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="data-[state=active]:bg-blue-50">
                Newsletter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaign" className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-700">
                  Campaign Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Onboarding Welcome Series"
                  className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="broadcast" className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="broadcast-name" className="text-gray-700">
                  Broadcast Name
                </Label>
                <Input
                  id="broadcast-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Product Launch Announcement"
                  className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="newsletter" className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="newsletter-name" className="text-gray-700">
                  Newsletter Name
                </Label>
                <Input
                  id="newsletter-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Monthly Product Updates"
                  className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this tactic"
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">Channel</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col items-center justify-center h-20 p-2 ${
                  channel === "email" ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 text-gray-700"
                }`}
                onClick={() => setChannel("email")}
              >
                <Mail className="h-6 w-6 mb-1" />
                <span>Email</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col items-center justify-center h-20 p-2 ${
                  channel === "sms" ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 text-gray-700"
                }`}
                onClick={() => setChannel("sms")}
              >
                <Phone className="h-6 w-6 mb-1" />
                <span>SMS</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col items-center justify-center h-20 p-2 ${
                  channel === "push" ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 text-gray-700"
                }`}
                onClick={() => setChannel("push")}
              >
                <Smartphone className="h-6 w-6 mb-1" />
                <span>Push</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`flex flex-col items-center justify-center h-20 p-2 ${
                  channel === "in-app" ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 text-gray-700"
                }`}
                onClick={() => setChannel("in-app")}
              >
                <MessageSquare className="h-6 w-6 mb-1" />
                <span>In-App</span>
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="space-y-3">
            <Label className="text-gray-700">Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus:ring-blue-500">
                <SelectValue placeholder="Select an audience" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="All Users" className="focus:bg-gray-100 focus:text-gray-900">
                  All Users
                </SelectItem>
                <SelectItem value="New Users" className="focus:bg-gray-100 focus:text-gray-900">
                  New Users
                </SelectItem>
                <SelectItem value="Active Users" className="focus:bg-gray-100 focus:text-gray-900">
                  Active Users
                </SelectItem>
                <SelectItem value="At-Risk Users" className="focus:bg-gray-100 focus:text-gray-900">
                  At-Risk Users
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">Contributing to Outcome Metrics</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`
                    flex items-center justify-between p-3 rounded-md border cursor-pointer
                    ${
                      selectedGoals.includes(goal.id)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }
                  `}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`
                        ${goal.category === "acquisition" ? "bg-blue-100 text-blue-800" : ""}
                        ${goal.category === "activation" ? "bg-green-100 text-green-800" : ""}
                        ${goal.category === "engagement" ? "bg-indigo-100 text-indigo-800" : ""}
                        ${goal.category === "monetization" ? "bg-pink-100 text-pink-800" : ""}
                        ${goal.category === "retention" ? "bg-purple-100 text-purple-800" : ""}
                        ${goal.category === "expansion" ? "bg-amber-100 text-amber-800" : ""}
                      `}
                    >
                      {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                    </Badge>
                    <span className="font-medium text-gray-900">{goal.name}</span>
                  </div>
                  {selectedGoals.includes(goal.id) && <Check className="h-4 w-4 text-blue-600" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 p-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Tactic"}
        </Button>
      </div>
    </form>
  )
}
