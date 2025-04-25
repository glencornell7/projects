import type { JourneyData } from "./journey-types"

export const sampleJourneyData: JourneyData = {
  stages: [
    {
      id: "visit",
      name: "Website Visit",
      type: "visit",
      description: "First time visitors to the website",
      count: 100000,
      position: { x: 100, y: 300 },
    },
    {
      id: "signup",
      name: "New User Signup",
      type: "signup",
      description: "Users who create an account",
      count: 25000,
      position: { x: 300, y: 200 },
    },
    {
      id: "trial",
      name: "Started Free Trial",
      type: "trial",
      description: "Users who start a free trial",
      count: 15000,
      position: { x: 500, y: 150 },
    },
    {
      id: "direct-paid",
      name: "Direct Paid Conversion",
      type: "conversion",
      description: "Users who become paid customers without a trial",
      count: 5000,
      value: 250000,
      position: { x: 500, y: 350 },
    },
    {
      id: "trial-paid",
      name: "Trial to Paid Conversion",
      type: "conversion",
      description: "Users who convert from free trial to paid",
      count: 7500,
      value: 375000,
      position: { x: 700, y: 150 },
    },
    {
      id: "feature-activation",
      name: "Feature Activation",
      type: "feature",
      description: "Users who activate key product features",
      count: 9000,
      position: { x: 900, y: 250 },
    },
    {
      id: "basic-premium",
      name: "Basic to Premium Upgrade",
      type: "upgrade",
      description: "Users who upgrade from basic to premium plan",
      count: 3000,
      value: 150000,
      position: { x: 1100, y: 200 },
    },
    {
      id: "annual-plan",
      name: "Annual Plan Conversion",
      type: "upgrade",
      description: "Monthly subscribers who switch to annual billing",
      count: 2000,
      value: 160000,
      position: { x: 1100, y: 350 },
    },
    {
      id: "churn",
      name: "Subscription Churn",
      type: "churn",
      description: "Users who cancel their subscription",
      count: 1500,
      position: { x: 900, y: 450 },
    },
    {
      id: "retention",
      name: "Subscription Renewal",
      type: "retention",
      description: "Users who renew their subscription",
      count: 8500,
      value: 425000,
      position: { x: 1100, y: 100 },
    },
  ],
  paths: [
    // From Visit
    { id: "path-1", source: "visit", target: "signup", count: 25000, conversionRate: 25 },
    { id: "path-2", source: "visit", target: "direct-paid", count: 5000, conversionRate: 5 },

    // From Signup
    { id: "path-3", source: "signup", target: "trial", count: 15000, conversionRate: 60 },

    // From Trial
    { id: "path-4", source: "trial", target: "trial-paid", count: 7500, conversionRate: 50 },

    // From Paid (both direct and trial)
    { id: "path-5", source: "direct-paid", target: "feature-activation", count: 3000, conversionRate: 60 },
    { id: "path-6", source: "trial-paid", target: "feature-activation", count: 6000, conversionRate: 80 },

    // From Feature Activation
    { id: "path-7", source: "feature-activation", target: "basic-premium", count: 3000, conversionRate: 33.3 },
    { id: "path-8", source: "feature-activation", target: "annual-plan", count: 2000, conversionRate: 22.2 },
    { id: "path-9", source: "feature-activation", target: "retention", count: 2500, conversionRate: 27.8 },
    { id: "path-10", source: "feature-activation", target: "churn", count: 1500, conversionRate: 16.7 },

    // From Upgrades to Retention
    { id: "path-11", source: "basic-premium", target: "retention", count: 2500, conversionRate: 83.3 },
    { id: "path-12", source: "annual-plan", target: "retention", count: 1500, conversionRate: 75 },

    // Additional paths showing non-linear journeys
    { id: "path-13", source: "signup", target: "direct-paid", count: 2000, conversionRate: 8 },
    { id: "path-14", source: "trial", target: "churn", count: 7500, conversionRate: 50 },
    { id: "path-15", source: "direct-paid", target: "basic-premium", count: 1000, conversionRate: 20 },
    { id: "path-16", source: "trial-paid", target: "annual-plan", count: 1500, conversionRate: 20 },
  ],
}
