import JourneyMapView from "@/components/journey-map/journey-map-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Journey Map | Customer.io",
  description: "Visualize your customer journeys and conversion paths",
}

export default function JourneyMapPage() {
  return <JourneyMapView />
}
