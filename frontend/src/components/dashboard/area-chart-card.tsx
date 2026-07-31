import * as React from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartCard } from "./chart-card"
import { CHART_PALETTE, borderColors, textColors } from "../../lib/theme"
import { cn } from "../../lib/utils"

export interface AreaChartCardProps {
  title: string
  subtitle?: string
  data: Record<string, any>[]
  dataKey: string
  xAxisKey?: string
  action?: React.ReactNode
  color?: string
  gradientId?: string
  className?: string
  height?: number
}

export function AreaChartCard({
  title,
  subtitle,
  data,
  dataKey,
  xAxisKey = "date",
  action,
  color = CHART_PALETTE[0],
  gradientId = "areaGrad",
  className,
  height = 200,
}: AreaChartCardProps) {
  return (
    <ChartCard title={title} subtitle={subtitle} action={action} className={className} minHeight={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={borderColors.light} />
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColors.muted, fontSize: 11 }}
            dy={8}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColors.muted, fontSize: 11 }}
            dx={-8}
            tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: `1px solid ${borderColors.default}`,
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
              padding: "8px 12px",
            }}
            cursor={{ stroke: borderColors.light, strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
