import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conversions | Customer.io",
  description: "Browse conversions in a structured table with detailed information",
}

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
