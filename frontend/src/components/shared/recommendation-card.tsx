import * as React from "react"
import { Card, CardContent } from "../ui/card"
import { Sparkles } from "lucide-react"

export interface RecommendationCardProps {
  content: string
  icon?: React.ReactNode
}

export function RecommendationCard({ content, icon }: RecommendationCardProps) {
  return (
    <Card className="bg-zinc-50 hover:bg-zinc-100 transition-colors border-zinc-200">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="w-8 h-8 rounded-md bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-violet-600">
          {icon || <Sparkles className="w-4 h-4" />}
        </div>
        <p className="text-sm text-zinc-900 font-medium leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  )
}
