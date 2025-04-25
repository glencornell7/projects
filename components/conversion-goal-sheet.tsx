"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import ConversionGoalCreator from "./conversion-goal-creator"

interface ConversionGoalSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ConversionGoalSheet({ open, onOpenChange }: ConversionGoalSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0 w-[500px] sm:max-w-[500px]">
        <ConversionGoalCreator onClose={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
