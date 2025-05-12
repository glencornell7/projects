"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { conversionGoals as initialGoals, campaigns as initialCampaigns } from "./sample-data-enhanced"
import type { ConversionGoal, Campaign } from "./types"

interface DataContextType {
  goals: ConversionGoal[]
  campaigns: Campaign[]
  addCampaign: (campaign: Omit<Campaign, "id" | "created" | "modified">) => Campaign
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  updateGoal: (id: string, updates: Partial<ConversionGoal>) => void
  getCampaignsForGoal: (goalId: string) => Campaign[]
  getGoalById: (id: string) => ConversionGoal | undefined
  getLifecycleStageMetrics: () => {
    name: string
    key: string
    count: number
    totalConversions: number
    totalValue: number
    progress: number
    trend: number
  }[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<ConversionGoal[]>(initialGoals)
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)

  // Add a new campaign
  const addCampaign = (campaign: Omit<Campaign, "id" | "created" | "modified">) => {
    const now = new Date().toISOString().split("T")[0]
    const newCampaign: Campaign = {
      ...campaign,
      id: `camp${campaigns.length + 1}`,
      created: now,
      modified: now,
    }

    setCampaigns((prev) => [...prev, newCampaign])
    return newCampaign
  }

  // Update an existing campaign
  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, ...updates, modified: new Date().toISOString().split("T")[0] } : campaign,
      ),
    )
  }

  // Update an existing goal
  const updateGoal = (id: string, updates: Partial<ConversionGoal>) => {
    setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)))
  }

  // Get campaigns associated with a goal
  const getCampaignsForGoal = (goalId: string) => {
    return campaigns.filter((campaign) => campaign.goalIds.includes(goalId))
  }

  // Get a goal by ID
  const getGoalById = (id: string) => {
    return goals.find((goal) => goal.id === id)
  }

  const getLifecycleStageMetrics = () => {
    // Group goals by category
    const goalsByCategory = goals.reduce(
      (acc, goal) => {
        if (!acc[goal.category]) {
          acc[goal.category] = []
        }
        acc[goal.category].push(goal)
        return acc
      },
      {} as Record<string, ConversionGoal[]>,
    )

    // Calculate metrics for each lifecycle stage
    return [
      {
        name: "Acquisition",
        key: "acquisition",
        count: goalsByCategory.acquisition?.length || 0,
        totalConversions: goalsByCategory.acquisition?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
        totalValue: goalsByCategory.acquisition?.reduce((sum, goal) => sum + goal.value, 0) || 0,
        progress: calculateAverageProgress(goalsByCategory.acquisition || []),
        trend: 5.2,
      },
      {
        name: "Activation",
        key: "activation",
        count: goalsByCategory.activation?.length || 0,
        totalConversions: goalsByCategory.activation?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
        totalValue: goalsByCategory.activation?.reduce((sum, goal) => sum + goal.value, 0) || 0,
        progress: calculateAverageProgress(goalsByCategory.activation || []),
        trend: 1.8,
      },
      {
        name: "Retention",
        key: "retention",
        count: goalsByCategory.retention?.length || 0,
        totalConversions: goalsByCategory.retention?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
        totalValue: goalsByCategory.retention?.reduce((sum, goal) => sum + goal.value, 0) || 0,
        progress: calculateAverageProgress(goalsByCategory.retention || []),
        trend: -2.5,
      },
      {
        name: "Referral",
        key: "referral",
        count: goalsByCategory.referral?.length || 0,
        totalConversions: goalsByCategory.referral?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
        totalValue: goalsByCategory.referral?.reduce((sum, goal) => sum + goal.value, 0) || 0,
        progress: calculateAverageProgress(goalsByCategory.referral || []),
        trend: 3.1,
      },
      {
        name: "Revenue",
        key: "revenue",
        count: goalsByCategory.revenue?.length || 0,
        totalConversions: goalsByCategory.revenue?.reduce((sum, goal) => sum + goal.conversions, 0) || 0,
        totalValue: goalsByCategory.revenue?.reduce((sum, goal) => sum + goal.value, 0) || 0,
        progress: calculateAverageProgress(goalsByCategory.revenue || []),
        trend: 7.9,
      },
    ]
  }

  function calculateAverageProgress(goals: ConversionGoal[]) {
    if (goals.length === 0) return 0
    return goals.reduce((sum, goal) => sum + (goal.conversions / goal.target) * 100, 0) / goals.length
  }

  return (
    <DataContext.Provider
      value={{
        goals,
        campaigns,
        addCampaign,
        updateCampaign,
        updateGoal,
        getCampaignsForGoal,
        getGoalById,
        getLifecycleStageMetrics,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
