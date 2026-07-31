import * as React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartCard } from "./chart-card"
import { CHART_PALETTE, borderColors, textColors } from "../../lib/theme"

export interface BarChartCardProps {
  title: string
  subtitle?: string
  data: Record<string, any>[]
  dataKey: string
  xAxisKey?: string
  action?: React.ReactNode
  color?: string
  className?: string
  height?: number
}

export function BarChartCard({
  title,
  subtitle,
  data,
  dataKey,
  xAxisKey = "label",
  action,
  color = CHART_PALETTE[0],
  className,
  height = 200,
}: BarChartCardProps) {
  return (
    <ChartCard title={title} subtitle={subtitle} action={action} className={className} minHeight={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={borderColors.light} />
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColors.muted, fontSize: 11 }}
            dy={8}
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
            cursor={{ fill: `${borderColors.light}80` }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
