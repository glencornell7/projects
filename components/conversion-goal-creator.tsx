"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface ConversionGoalCreatorProps {
  onClose: () => void
}

export default function ConversionGoalCreator({ onClose }: ConversionGoalCreatorProps) {
  const [goalType, setGoalType] = useState("event")

  return (
    <Card className="bg-[#0b353b] border-[#313d3f] text-[#e7eced]">
      <CardHeader className="border-b border-[#313d3f]">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-[#e7eced]">Create New Conversion Goal</CardTitle>
            <CardDescription className="text-[#849699]">
              Define a measurable business outcome to track and optimize
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#849699] hover:text-[#e7eced] hover:bg-[#202c2d]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name" className="text-[#e7eced]">
              Goal Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Free Trial to Paid Conversion"
              className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus-visible:ring-[#1aa47b]"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description" className="text-[#e7eced]">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this conversion goal represents for your business"
              className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus-visible:ring-[#1aa47b]"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-[#e7eced]">Category</Label>
            <Select>
              <SelectTrigger className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus:ring-[#1aa47b]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-[#0b353b] border-[#313d3f] text-[#e7eced]">
                <SelectItem value="acquisition" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                  Acquisition
                </SelectItem>
                <SelectItem value="activation" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                  Activation
                </SelectItem>
                <SelectItem value="retention" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                  Retention
                </SelectItem>
                <SelectItem value="expansion" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                  Expansion
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-[#313d3f]" />

          <div className="grid gap-3">
            <Label className="text-[#e7eced]">Conversion Type</Label>
            <RadioGroup defaultValue="event" onValueChange={setGoalType} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="event" className="border-[#313d3f] text-[#1aa47b]" />
                <Label htmlFor="event" className="text-[#e7eced] cursor-pointer">
                  Event-based conversion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="revenue" id="revenue" className="border-[#313d3f] text-[#1aa47b]" />
                <Label htmlFor="revenue" className="text-[#e7eced] cursor-pointer">
                  Revenue-based conversion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="attribute" id="attribute" className="border-[#313d3f] text-[#1aa47b]" />
                <Label htmlFor="attribute" className="text-[#e7eced] cursor-pointer">
                  Attribute change
                </Label>
              </div>
            </RadioGroup>
          </div>

          {goalType === "event" && (
            <div className="grid gap-3">
              <Label htmlFor="event" className="text-[#e7eced]">
                Conversion Event
              </Label>
              <Select>
                <SelectTrigger className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus:ring-[#1aa47b]">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b353b] border-[#313d3f] text-[#e7eced]">
                  <SelectItem value="purchased" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    purchased
                  </SelectItem>
                  <SelectItem value="subscription_started" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    subscription_started
                  </SelectItem>
                  <SelectItem value="upgraded_plan" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    upgraded_plan
                  </SelectItem>
                  <SelectItem value="completed_onboarding" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    completed_onboarding
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {goalType === "revenue" && (
            <div className="grid gap-3">
              <Label htmlFor="revenue_attribute" className="text-[#e7eced]">
                Revenue Attribute
              </Label>
              <Select>
                <SelectTrigger className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus:ring-[#1aa47b]">
                  <SelectValue placeholder="Select an attribute" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b353b] border-[#313d3f] text-[#e7eced]">
                  <SelectItem value="purchase_value" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    purchase_value
                  </SelectItem>
                  <SelectItem value="subscription_value" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    subscription_value
                  </SelectItem>
                  <SelectItem value="lifetime_value" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    lifetime_value
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {goalType === "attribute" && (
            <div className="grid gap-3">
              <Label htmlFor="attribute_name" className="text-[#e7eced]">
                Attribute Name
              </Label>
              <Select>
                <SelectTrigger className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus:ring-[#1aa47b]">
                  <SelectValue placeholder="Select an attribute" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b353b] border-[#313d3f] text-[#e7eced]">
                  <SelectItem value="plan" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    plan
                  </SelectItem>
                  <SelectItem value="status" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    status
                  </SelectItem>
                  <SelectItem value="is_active" className="focus:bg-[#202c2d] focus:text-[#e7eced]">
                    is_active
                  </SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="attribute_value" className="text-[#e7eced] mt-3">
                Target Value
              </Label>
              <Input
                id="attribute_value"
                placeholder="e.g., premium"
                className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus-visible:ring-[#1aa47b]"
              />
            </div>
          )}

          <div className="grid gap-3">
            <Label htmlFor="value" className="text-[#e7eced]">
              Value Per Conversion ($)
            </Label>
            <Input
              id="value"
              type="number"
              placeholder="e.g., 99"
              className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus-visible:ring-[#1aa47b]"
            />
            <p className="text-xs text-[#849699]">The estimated business value of each conversion</p>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="target" className="text-[#e7eced]">
              Target Conversions (Monthly)
            </Label>
            <Input
              id="target"
              type="number"
              placeholder="e.g., 100"
              className="bg-[#202c2d] border-[#313d3f] text-[#e7eced] focus-visible:ring-[#1aa47b]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-[#313d3f] flex justify-between">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-[#515f61] text-[#849699] hover:text-[#e7eced] hover:bg-[#202c2d]"
        >
          Cancel
        </Button>
        <Button className="bg-[#1aa47b] hover:bg-[#1aa47b]/90 text-white">Create Conversion Goal</Button>
      </CardFooter>
    </Card>
  )
}
