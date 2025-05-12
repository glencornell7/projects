"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ConversionGoal } from "@/lib/types"

interface EditMetricFormProps {
  goal: ConversionGoal
  onClose: () => void
}

export function EditMetricForm({ goal, onClose }: EditMetricFormProps) {
  const [formData, setFormData] = useState({
    name: goal.name,
    description: goal.description,
    category: goal.category,
    metricType: goal.metricType || "outcome",
    value: goal.value,
    target: goal.target,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the changes here
    console.log("Saving metric changes:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6">
        <div className="py-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-gray-700">
              Metric Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">Lifecycle Stage</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
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
                <SelectItem value="engagement" className="focus:bg-gray-100 focus:text-gray-900">
                  Engagement
                </SelectItem>
                <SelectItem value="monetization" className="focus:bg-gray-100 focus:text-gray-900">
                  Monetization
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
            <Label className="text-gray-700">Metric Type</Label>
            <RadioGroup
              value={formData.metricType as string}
              onValueChange={(value) => handleChange("metricType", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outcome" id="outcome" className="border-gray-300 text-blue-600" />
                <Label htmlFor="outcome" className="text-gray-700 cursor-pointer">
                  Outcome Metric
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aha" id="aha" className="border-gray-300 text-blue-600" />
                <Label htmlFor="aha" className="text-gray-700 cursor-pointer">
                  Aha Moment Metric
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="value" className="text-gray-700">
              Value Per Conversion ($)
            </Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => handleChange("value", Number(e.target.value))}
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
              value={formData.target}
              onChange={(e) => handleChange("target", Number(e.target.value))}
              className="bg-white border-gray-200 text-gray-900 focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 p-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
          Save Changes
        </Button>
      </div>
    </form>
  )
}
