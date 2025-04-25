export interface Position {
  x: number
  y: number
}

export interface JourneyStage {
  id: string
  name: string
  type: "visit" | "signup" | "trial" | "conversion" | "feature" | "upgrade" | "churn" | "retention"
  description: string
  count: number
  value?: number
  position: Position
}

export interface JourneyPath {
  id: string
  source: string
  target: string
  count: number
  conversionRate: number
}

export interface JourneyData {
  stages: JourneyStage[]
  paths: JourneyPath[]
}

export interface ConversionNodeData {
  id: string
  name: string
  description: string
  category: "acquisition" | "activation" | "retention" | "expansion"
  value: number
  conversions: number
  target: number
}

export interface CampaignNodeData {
  id: string
  name: string
  status: "active" | "draft" | "paused"
  channel: "email" | "sms" | "push" | "in-app"
  audience: string
  conversions: number
}

export interface SegmentNodeData {
  id: string
  name: string
  count: number
  description: string
}

export interface BroadcastNodeData {
  id: string
  name: string
  type: "email" | "sms" | "push" | "in-app"
  sent: number
  opened: number
  clicked: number
}

export type NodeDataType = ConversionNodeData | CampaignNodeData | SegmentNodeData | BroadcastNodeData

export interface NodeData {
  id: string
  type: "conversion" | "campaign" | "segment" | "broadcast"
  data: NodeDataType
  position: Position
}

export interface EdgeData {
  id: string
  source: string
  target: string
  label?: string
}

export type TimeRange = "all" | "year" | "quarter" | "90days" | "30days" | "7days"
