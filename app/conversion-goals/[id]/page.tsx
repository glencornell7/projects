import { notFound } from "next/navigation"
import ConversionGoalDetail from "@/components/conversion-goal-detail"
import { conversionGoals } from "@/lib/sample-data"
import type { Metadata } from "next"

interface ConversionGoalPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ConversionGoalPageProps): Promise<Metadata> {
  const goal = conversionGoals.find((g) => g.id === params.id)

  if (!goal) {
    return {
      title: "Goal Not Found | Customer.io",
    }
  }

  return {
    title: `${goal.name} | Conversion Goals | Customer.io`,
    description: goal.description,
  }
}

export default function ConversionGoalPage({ params }: ConversionGoalPageProps) {
  const goal = conversionGoals.find((g) => g.id === params.id)

  if (!goal) {
    notFound()
  }

  return <ConversionGoalDetail goal={goal} />
}
