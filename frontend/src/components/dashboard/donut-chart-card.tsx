import * as React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { ChartCard } from "./chart-card"
import { CHART_PALETTE, borderColors } from "../../lib/theme"

export interface DonutChartCardProps {
  title: string
  subtitle?: string
  data: { name: string; value: number; color?: string }[]
  action?: React.ReactNode
  className?: string
  height?: number
  innerRadius?: number
  outerRadius?: number
  centerLabel?: string
  centerValue?: string | number
}

export function DonutChartCard({
  title,
  subtitle,
  data,
  action,
  className,
  height = 220,
  innerRadius = 55,
  outerRadius = 80,
  centerLabel,
  centerValue,
}: DonutChartCardProps) {
  return (
    <ChartCard title={title} subtitle={subtitle} action={action} className={className} minHeight={height}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <ResponsiveContainer width={outerRadius * 2 + 20} height={outerRadius * 2 + 20}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color || CHART_PALETTE[i % CHART_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${borderColors.default}`,
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
                  padding: "8px 12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {centerValue && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-text-primary">{centerValue}</span>
              {centerLabel && <span className="text-[10px] text-text-muted font-medium">{centerLabel}</span>}
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 justify-center">
          {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color || CHART_PALETTE[i % CHART_PALETTE.length] }}
              />
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  )
}
