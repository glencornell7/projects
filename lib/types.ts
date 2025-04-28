export interface ConversionGoal {
  id: string
  name: string
  description: string
  category: "acquisition" | "activation" | "retention" | "expansion"
  value: number
  conversions: number
  target: number
  campaigns: number
  trend: number
  trendData?: number[] // Array of historical conversion counts
}

export interface Campaign {
  id: string
  name: string
  description?: string
  status: "active" | "draft" | "paused"
  channel: "email" | "sms" | "push" | "in-app"
  audience: string
  created: string
  modified: string
  goalIds: string[]
  conversions: number
  value: number
  metrics: {
    sent: number
    opened: number
    clicked: number
  }
}
