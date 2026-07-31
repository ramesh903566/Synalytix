import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export interface TeamMember {
  id: string
  name: string
  role: string
  avatarUrl?: string
  status?: "online" | "offline" | "busy"
}

export interface TeamListCardProps {
  title: string
  members: TeamMember[]
  onViewAll?: () => void
  onMemberClick?: (id: string) => void
  className?: string
}

const statusColors: Record<string, string> = {
  online: "bg-success",
  offline: "bg-border-strong",
  busy: "bg-warning",
}

export function TeamListCard({ title, members, onViewAll, onMemberClick, className }: TeamListCardProps) {
  return (
    <div className={cn("rounded-[var(--radius-card)] border border-border bg-bg-elevated shadow-level-1", className)}>
      <div className="flex items-center justify-between p-5 border-b border-border-light">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-medium text-brand hover:text-brand-hover transition-colors">
            See all
          </button>
        )}
      </div>
      <div className="divide-y divide-border-light">
        {members.length === 0 && (
          <div className="p-8 text-center text-xs text-text-muted">No team members.</div>
        )}
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => onMemberClick?.(member.id)}
            className={cn(
              "flex items-center gap-3 px-5 py-3.5 transition-colors",
              onMemberClick && "cursor-pointer hover:bg-bg-canvas"
            )}
          >
            <div className="relative">
              <Avatar className="w-9 h-9">
                {member.avatarUrl ? (
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                ) : (
                  <AvatarFallback className="text-xs">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              {member.status && (
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-elevated",
                  statusColors[member.status]
                )} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{member.name}</p>
              <p className="text-xs text-text-muted truncate">{member.role}</p>
            </div>
            {onMemberClick && <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}
