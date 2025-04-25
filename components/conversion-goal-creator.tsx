"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ConversionGoalCreatorProps {
  onClose: () => void
}

export default function ConversionGoalCreator({ onClose }: ConversionGoalCreatorProps) {
  const [goalType, setGoalType] = useState("event")

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Create New Conversion Goal</h2>
          <p className="text-sm text-gray-500">Define a measurable business outcome to track</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="py-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-gray-700">
              Goal Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Free Trial to Paid Conversion"
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this conversion goal represents for your business"
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">Category</Label>
            <Select>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus:ring-blue-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="acquisition" className="focus:bg-gray-100 focus:text-gray-900">
                  Acquisition
                </SelectItem>
                <SelectItem value="activation" className="focus:bg-gray-100 focus:text-gray-900">
                  Activation
                </SelectItem>
                <SelectItem value="retention" className="focus:bg-gray-100 focus:text-gray-900">
                  Retention
                </SelectItem>
                <SelectItem value="expansion" className="focus:bg-gray-100 focus:text-gray-900">
                  Expansion
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-gray-200" />

          <div className="space-y-3">
            <Label className="text-gray-700">Conversion Type</Label>
            <RadioGroup defaultValue="event" onValueChange={setGoalType} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="event" className="border-gray-300 text-blue-600" />
                <Label htmlFor="event" className="text-gray-700 cursor-pointer">
                  Event-based conversion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="revenue" id="revenue" className="border-gray-300 text-blue-600" />
                <Label htmlFor="revenue" className="text-gray-700 cursor-pointer">
                  Revenue-based conversion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="attribute" id="attribute" className="border-gray-300 text-blue-600" />
                <Label htmlFor="attribute" className="text-gray-700 cursor-pointer">
                  Attribute change
                </Label>
              </div>
            </RadioGroup>
          </div>

          {goalType === "event" && (
            <div className="space-y-3">
              <Label htmlFor="event" className="text-gray-700">
                Conversion Event
              </Label>
              <Select>
                <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus:ring-blue-500">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="purchased" className="focus:bg-gray-100 focus:text-gray-900">
                    purchased
                  </SelectItem>
                  <SelectItem value="subscription_started" className="focus:bg-gray-100 focus:text-gray-900">
                    subscription_started
                  </SelectItem>
                  <SelectItem value="upgraded_plan" className="focus:bg-gray-100 focus:text-gray-900">
                    upgraded_plan
                  </SelectItem>
                  <SelectItem value="completed_onboarding" className="focus:bg-gray-100 focus:text-gray-900">
                    completed_onboarding
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {goalType === "revenue" && (
            <div className="space-y-3">
              <Label htmlFor="revenue_attribute" className="text-gray-700">
                Revenue Attribute
              </Label>
              <Select>
                <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus:ring-blue-500">
                  <SelectValue placeholder="Select an attribute" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="purchase_value" className="focus:bg-gray-100 focus:text-gray-900">
                    purchase_value
                  </SelectItem>
                  <SelectItem value="subscription_value" className="focus:bg-gray-100 focus:text-gray-900">
                    subscription_value
                  </SelectItem>
                  <SelectItem value="lifetime_value" className="focus:bg-gray-100 focus:text-gray-900">
                    lifetime_value
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {goalType === "attribute" && (
            <div className="space-y-3">
              <Label htmlFor="attribute_name" className="text-gray-700">
                Attribute Name
              </Label>
              <Select>
                <SelectTrigger className="bg-white border-gray-200 text-gray-900 focus:ring-blue-500">
                  <SelectValue placeholder="Select an attribute" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="plan" className="focus:bg-gray-100 focus:text-gray-900">
                    plan
                  </SelectItem>
                  <SelectItem value="status" className="focus:bg-gray-100 focus:text-gray-900">
                    status
                  </SelectItem>
                  <SelectItem value="is_active" className="focus:bg-gray-100 focus:text-gray-900">
                    is_active
                  </SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="attribute_value" className="text-gray-700 mt-3">
                Target Value
              </Label>
              <Input
                id="attribute_value"
                placeholder="e.g., premium"
                className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
              />
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="value" className="text-gray-700">
              Value Per Conversion ($)
            </Label>
            <Input
              id="value"
              type="number"
              placeholder="e.g., 99"
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
            />
            <p className="text-xs text-gray-500">The estimated business value of each conversion</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="target" className="text-gray-700">
              Target Conversions (Monthly)
            </Label>
            <Input
              id="target"
              type="number"
              placeholder="e.g., 100"
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 p-6 flex justify-between">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">Create Conversion Goal</Button>
      </div>
    </div>
  )
}
