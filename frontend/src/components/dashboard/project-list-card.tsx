import * as React from "react"
import { cn } from "../../lib/utils"
import { Plus } from "lucide-react"
import { Badge } from "../ui/badge"

export interface ProjectTask {
  id: string
  title: string
  status: string
  statusVariant?: "default" | "primary" | "success" | "warning" | "danger" | "info"
  priority?: "low" | "medium" | "high"
  date?: string
}

export interface ProjectListCardProps {
  title: string
  tasks: ProjectTask[]
  onViewAll?: () => void
  onAddNew?: () => void
  className?: string
}

const priorityDot: Record<string, string> = {
  high: "bg-error",
  medium: "bg-warning",
  low: "bg-success",
}

export function ProjectListCard({ title, tasks, onViewAll, onAddNew, className }: ProjectListCardProps) {
  return (
    <div className={cn("rounded-[var(--radius-card)] border border-border bg-bg-elevated shadow-level-1", className)}>
      <div className="flex items-center justify-between p-5 border-b border-border-light">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <div className="flex items-center gap-2">
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="w-7 h-7 rounded-[var(--radius-chip)] bg-brand-light text-brand flex items-center justify-center hover:bg-brand-muted transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          {onViewAll && (
            <button onClick={onViewAll} className="text-xs font-medium text-brand hover:text-brand-hover transition-colors">
              View all
            </button>
          )}
        </div>
      </div>
      <div className="divide-y divide-border-light">
        {tasks.length === 0 && (
          <div className="p-8 text-center text-xs text-text-muted">No tasks yet.</div>
        )}
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-bg-canvas transition-colors">
            {task.priority && (
              <div className={cn("w-2 h-2 rounded-full shrink-0", priorityDot[task.priority] || "bg-border-strong")} />
            )}
            <span className="flex-1 text-sm text-text-primary font-medium truncate">{task.title}</span>
            <Badge variant={task.statusVariant || "default"} className="text-[10px] shrink-0">
              {task.status}
            </Badge>
            {task.date && <span className="text-[11px] text-text-muted shrink-0 ml-1">{task.date}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
