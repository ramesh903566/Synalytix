import * as React from "react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

export interface AvatarGroupProps {
  avatars: { src?: string; name: string }[]
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
}

export function AvatarGroup({ avatars, max = 4, size = "md", className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          className={cn(
            sizeMap[size],
            "ring-2 ring-bg-elevated transition-transform hover:z-10 hover:scale-110"
          )}
        >
          {avatar.src ? (
            <AvatarImage src={avatar.src} alt={avatar.name} />
          ) : (
            <AvatarFallback className={sizeMap[size]}>
              {avatar.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            sizeMap[size],
            "flex items-center justify-center rounded-[var(--radius-avatar)] bg-bg-sunken border-2 border-bg-elevated text-text-muted font-semibold ring-2 ring-bg-elevated"
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
