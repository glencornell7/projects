"use client"

import { HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Glossary() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="ml-2 text-gray-400 hover:text-gray-600">
          <HelpCircle className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Customer Lifecycle Metrics Glossary</DialogTitle>
          <DialogDescription className="text-gray-500">
            Key terms and definitions for understanding your customer lifecycle metrics
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Metric</h3>
            <p className="text-gray-600 mb-2">
              A base-level, countable unit that directly tracks an event or behavior in the product or system. Metrics
              are used to build segments, track raw behavior, and power dashboards.
            </p>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-medium mb-1">A metric must be:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-3">
                <li>A count or sum of something happening (e.g., "Project Created," "Files Uploaded")</li>
                <li>Tied to event-based tracking</li>
                <li>Scoped by time window (e.g., "in last 7 days")</li>
              </ul>
              <p className="font-medium mb-1">A metric must NOT be:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>A rate, percentage, or average (e.g., "conversion rate," "retention %")</li>
                <li>A monetary efficiency metric (e.g., "Revenue per Signup")</li>
                <li>A composite formula made from other metrics</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Lifecycle Stages</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-700">Acquisition</h4>
                <p className="text-gray-600">
                  Metrics related to gaining new users or customers, typically focused on marketing and top-of-funnel
                  activities.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-green-700">Activation</h4>
                <p className="text-gray-600">
                  Metrics tracking how new users experience value for the first time and complete initial setup.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-indigo-700">Engagement</h4>
                <p className="text-gray-600">
                  Metrics measuring ongoing product usage, feature adoption, and user interaction.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-pink-700">Monetization</h4>
                <p className="text-gray-600">
                  Metrics tracking revenue generation, conversion to paid plans, and customer spending.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-700">Retention</h4>
                <p className="text-gray-600">
                  Metrics focused on keeping existing customers and reducing churn over time.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-amber-700">Expansion</h4>
                <p className="text-gray-600">
                  Metrics tracking additional revenue from existing customers through upsells, cross-sells, and
                  increased usage.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Metric Types</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-violet-700">Outcome Metric</h4>
                <p className="text-gray-600">
                  A metric that directly measures a business outcome or goal, such as revenue, active users, or
                  subscriptions.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-emerald-700">Aha Moment</h4>
                <p className="text-gray-600">
                  A metric that captures when users experience the core value of your product for the first time,
                  indicating successful activation or engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
