import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { Sparkles, TrendingUp, Activity, BarChart2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getDashboardSummary } from "../lib/api"
import { APP_REGISTRY } from "../lib/appRegistry"
import { StatCard } from "../components/dashboard/stat-card"
import { useAppContext } from "../context/AppContext"

function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const res = await getDashboardSummary();
      if (!res.success || !res.data) return null;
      return res.data as Record<string, any>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default function AnalyticsHub() {
  const navigate = useNavigate()
  const { connectedApps } = useAppContext()
  const { data: summary, isLoading } = useDashboardSummary()

  // Build platform data from real summary
  const platformData = connectedApps.map((appId) => {
    const appInfo = APP_REGISTRY.find((a) => a.id === appId)
    const data = summary?.[appId]
    return {
      id: appId,
      name: appInfo?.name || appId,
      iconUrl: appInfo?.iconUrl,
      connected: !data?.error,
      followers: data?.followers_count ?? data?.public_followers ?? 0,
      username: data?.username ?? data?.login ?? "",
      repos: data?.public_repos ?? 0,
    }
  }).filter(p => p.connected)

  // Aggregate metrics from connected platforms
  const totalFollowers = platformData.reduce((sum, p) => sum + p.followers, 0)
  const totalRepos = platformData.reduce((sum, p) => sum + p.repos, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Cross-platform summary */}
      <div className="rounded-[var(--radius-card)] border border-border bg-bg-elevated p-6 shadow-level-1">
        <h3 className="text-xs font-semibold mb-5 flex items-center gap-2 uppercase tracking-wider text-text-muted">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          Platform Overview
        </h3>
        {connectedApps.length === 0 ? (
          <p className="text-sm text-text-muted">No platforms connected yet. Connect your first platform to see analytics.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-bg-canvas border border-border-light rounded-[var(--radius-card-inner)] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-[var(--radius-card-inner)] bg-brand-light flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-brand" />
              </div>
              <p className="text-xs text-text-primary font-medium">Connected Platforms</p>
              <p className="text-lg font-bold text-text-primary">{platformData.length}</p>
            </div>
            <div className="p-4 bg-bg-canvas border border-border-light rounded-[var(--radius-card-inner)] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-[var(--radius-card-inner)] bg-brand-light flex items-center justify-center mb-1">
                <Activity className="w-4 h-4 text-brand" />
              </div>
              <p className="text-xs text-text-primary font-medium">Total Followers</p>
              <p className="text-lg font-bold text-text-primary">{totalFollowers.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-bg-canvas border border-border-light rounded-[var(--radius-card-inner)] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-[var(--radius-card-inner)] bg-brand-light flex items-center justify-center mb-1">
                <BarChart2 className="w-4 h-4 text-brand" />
              </div>
              <p className="text-xs text-text-primary font-medium">Public Repos</p>
              <p className="text-lg font-bold text-text-primary">{totalRepos}</p>
            </div>
          </div>
        )}
      </div>

      {/* Platform Cards */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary mb-4">Platform Analytics</h2>
        {platformData.length === 0 ? (
          <div className="text-center py-12 text-sm text-text-muted">
            Connect platforms in the Apps section to see analytics here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformData.map((platform) => (
              <div
                key={platform.id}
                onClick={() => navigate(`/app/analytics/${platform.id}`)}
                className="p-5 border border-border rounded-[var(--radius-card)] bg-bg-elevated hover:border-border-strong hover:shadow-level-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-[var(--radius-card-inner)] bg-bg-sunken flex items-center justify-center overflow-hidden">
                    {platform.iconUrl ? (
                      <img src={platform.iconUrl} alt={platform.name} className="w-6 h-6 object-cover rounded-[var(--radius-badge)]" />
                    ) : (
                      <div className="w-6 h-6 bg-border-strong rounded-[var(--radius-badge)]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary group-hover:text-brand transition-colors">{platform.name}</div>
                    <div className="text-[11px] text-text-muted">@{platform.username}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-bg-canvas p-2.5 rounded-[var(--radius-chip)]">
                    <span className="block text-text-muted mb-0.5 text-[10px]">Followers</span>
                    <span className="font-semibold text-text-primary">{platform.followers.toLocaleString()}</span>
                  </div>
                  <div className="bg-bg-canvas p-2.5 rounded-[var(--radius-chip)]">
                    <span className="block text-text-muted mb-0.5 text-[10px]">Status</span>
                    <span className="font-semibold text-success-text">Connected</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  )
}
