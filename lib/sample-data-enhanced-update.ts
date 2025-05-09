// This is a partial update to add examples for the new lifecycle stages
// These would be merged with existing data

export const additionalGoals = [
  {
    id: "goal-engagement-1",
    name: "Weekly Active Users",
    description: "Users who perform at least one action per week",
    category: "engagement",
    value: 75000,
    conversions: 12500,
    target: 15000,
    campaigns: 3,
    trend: 8,
    trendData: [8500, 9200, 10100, 10800, 11200, 11500, 11800, 12000, 12200, 12300, 12400, 12500],
    metricType: "engagement",
  },
  {
    id: "goal-monetization-1",
    name: "Trial to Paid Conversion",
    description: "Percentage of trial users who convert to paid plans",
    category: "monetization",
    value: 120000,
    conversions: 850,
    target: 1000,
    campaigns: 5,
    trend: 12,
    trendData: [650, 680, 710, 730, 750, 780, 800, 810, 820, 830, 840, 850],
    metricType: "outcome",
  },
  {
    id: "goal-engagement-2",
    name: "Feature Adoption Rate",
    description: "Percentage of users who use key features",
    category: "engagement",
    value: 45000,
    conversions: 8500,
    target: 10000,
    campaigns: 4,
    trend: 5,
    trendData: [7200, 7400, 7600, 7800, 8000, 8100, 8200, 8300, 8350, 8400, 8450, 8500],
    metricType: "engagement",
  },
]
