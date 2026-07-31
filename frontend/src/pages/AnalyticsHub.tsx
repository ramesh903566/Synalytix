import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { Sparkles, TrendingUp, Activity, BarChart2 } from "lucide-react"
import { MOCK_CROSS_PLATFORM_INSIGHTS, MOCK_APPS } from "../data/mockData"
import { StatCard } from "../components/dashboard/stat-card"

export default function AnalyticsHub() {
  const navigate = useNavigate()
  const insights = MOCK_CROSS_PLATFORM_INSIGHTS

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* AI Recommendations Banner */}
      <div className="rounded-[var(--radius-card)] border border-border bg-bg-elevated p-6 shadow-level-1">
        <h3 className="text-xs font-semibold mb-5 flex items-center gap-2 uppercase tracking-wider text-text-muted">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          Universal AI Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.crossPlatformRecommendations.map((rec, i) => (
            <div key={i} className="p-4 bg-bg-canvas border border-border-light rounded-[var(--radius-card-inner)] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-[var(--radius-card-inner)] bg-brand-light flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-brand" />
              </div>
              <p className="text-xs text-text-primary font-medium leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Overall Health" value={`${insights.overallHealthScore}/100`} icon={Activity} />
        <StatCard label="Total Views" value={insights.totalViews} icon={BarChart2} />
        <StatCard label="Total Engagement" value={insights.totalEngagements} icon={TrendingUp} />
        <StatCard label="Total Audience" value={insights.totalFollowers} icon={Sparkles} />
      </div>

      {/* Platform Cards */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary mb-4">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_APPS.map((app) => {
            const data = insights.platforms[app.id as keyof typeof insights.platforms]
            if (!data) return null

            return (
              <div
                key={app.id}
                onClick={() => navigate(`/app/analytics/${app.id}`)}
                className="p-5 border border-border rounded-[var(--radius-card)] bg-bg-elevated hover:border-border-strong hover:shadow-level-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-[var(--radius-card-inner)] bg-bg-sunken flex items-center justify-center overflow-hidden">
                    {app.iconUrl ? (
                      <img src={app.iconUrl} alt={app.name} className="w-6 h-6 object-cover rounded-[var(--radius-badge)]" />
                    ) : (
                      <div className="w-6 h-6 bg-border-strong rounded-[var(--radius-badge)]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary group-hover:text-brand transition-colors">{app.name}</div>
                    <div className="text-[11px] text-text-muted">{data.accounts.length} connected account(s)</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-bg-canvas p-2.5 rounded-[var(--radius-chip)]">
                    <span className="block text-text-muted mb-0.5 text-[10px]">Health</span>
                    <span className="font-semibold text-text-primary">{data.aiInsights?.healthScore}/100</span>
                  </div>
                  <div className="bg-bg-canvas p-2.5 rounded-[var(--radius-chip)]">
                    <span className="block text-text-muted mb-0.5 text-[10px]">Engagement</span>
                    <span className="font-semibold text-text-primary">{data.aggregatedMetrics.engagements}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </motion.div>
  )
}
