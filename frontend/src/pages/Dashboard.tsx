import { Eye, Users, Activity, TrendingUp, Zap, LinkIcon } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import { APP_REGISTRY } from "../lib/appRegistry"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getDashboardSummary } from "../lib/api"

import { StatCard } from "../components/dashboard/stat-card"
import { AreaChartCard } from "../components/dashboard/area-chart-card"
import { DonutChartCard } from "../components/dashboard/donut-chart-card"
import { ProjectListCard } from "../components/dashboard/project-list-card"
import { PromoCard } from "../components/dashboard/promo-card"
import { TeamListCard } from "../components/dashboard/team-list-card"
import { Badge } from "../components/ui/badge"
import { CHART_PALETTE } from "../lib/theme"

function useDashboardData() {
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

export default function Dashboard() {
  const { connectedApps, scheduledPosts, savedDrafts, plannerTasks } = useAppContext()
  const navigate = useNavigate()
  const { data: summary, isLoading } = useDashboardData()

  const pendingTasks = plannerTasks.filter((t) => t.status !== "done").length
  const doneTasks = plannerTasks.filter((t) => t.status === "done").length

  // ─── Extract real data from summary ───
  const igData = summary?.instagram
  const igInsights = igData?.insights
  const igViews = igInsights?.data?.[0]?.values?.[0]?.value ?? 0
  const igReach = igInsights?.data?.find((d: any) => d.name === "impressions")?.values?.[0]?.value ?? 0
  const igFollowers = igData?.followers_count ?? 0
  const igEngagements = igInsights?.data?.find((d: any) => d.name === "engagement")?.values?.[0]?.value ?? 0

  const ghData = summary?.github
  const xData = summary?.x

  // ─── KPI Stats (use real data when available) ───
  const overviewStats = [
    {
      label: "Total Views (30d)",
      value: igViews || (connectedApps.length > 0 ? "—" : 0),
      trend: igViews ? { value: 12.4, direction: "up" as const } : undefined,
      icon: Eye,
    },
    {
      label: "Net New Followers",
      value: igFollowers || (connectedApps.length > 0 ? "—" : 0),
      trend: igFollowers ? { value: 4.1, direction: "up" as const } : undefined,
      icon: Users,
    },
    {
      label: "Total Interactions",
      value: igEngagements || (connectedApps.length > 0 ? "—" : 0),
      trend: igEngagements ? { value: 8.2, direction: "up" as const } : undefined,
      icon: Activity,
    },
    {
      label: "Accounts Reached",
      value: igReach || (connectedApps.length > 0 ? "—" : 0),
      trend: igReach ? { value: 3.5, direction: "up" as const } : undefined,
      icon: TrendingUp,
    },
  ]

  // ─── Content interaction donut data ───
  const interactionDonut = [
    { name: "Reels", value: igInsights?.data?.find((d: any) => d.name === "plays")?.values?.[0]?.value ?? 0, color: CHART_PALETTE[0] },
    { name: "Stories", value: igInsights?.data?.find((d: any) => d.name === "plays")?.values?.[0]?.value ?? 0, color: CHART_PALETTE[1] },
    { name: "Posts", value: igEngagements, color: CHART_PALETTE[2] },
  ]
  const totalInteractions = interactionDonut.reduce((sum, d) => sum + d.value, 0)

  // ─── Planner tasks for ProjectListCard ───
  const plannerTasksForCard = plannerTasks
    .filter((t) => t.status !== "done")
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      statusVariant: (t.status === "scheduled" ? "info" : t.status === "todo" ? "warning" : "default") as any,
      priority: t.priority,
      date: t.scheduledDate,
    }))

  // ─── Connected apps as team members (network health) ───
  const networkMembers = connectedApps.map((appId) => {
                const appInfo = APP_REGISTRY.find((a) => a.id === appId)
    return {
      id: appId,
      name: appInfo?.name || appId,
      role: "Connected & syncing",
      avatarUrl: appInfo?.iconUrl,
      status: "online" as const,
    }
  })

  // ─── Empty state when no platforms connected ───
  if (!isLoading && connectedApps.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Empty state banner */}
        <div className="rounded-[var(--radius-card)] border border-border bg-bg-elevated p-12 text-center shadow-level-1">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-light flex items-center justify-center mb-6">
            <LinkIcon className="w-7 h-7 text-brand" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Welcome to Synalytix</h2>
          <p className="text-text-muted text-sm max-w-md mx-auto mb-8">
            Connect your first platform to see analytics, insights, and AI-powered recommendations across your digital presence.
          </p>
          <button
            onClick={() => navigate("/app/apps")}
            className="px-6 py-3 bg-brand text-white rounded-[var(--radius-button)] font-medium text-sm hover:bg-brand-hover shadow-level-1 transition-all"
          >
            Connect a Platform
          </button>
        </div>

        {/* Quick stats still useful */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Scheduled Posts" value={scheduledPosts.length} icon={Eye} />
            <StatCard label="Saved Drafts" value={savedDrafts.length} icon={Activity} />
            <StatCard label="Planner Tasks" value={pendingTasks} icon={TrendingUp} />
          </div>
        </section>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* ─── Section: Platform KPIs ─── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Platform Performance · Last 30 Days</h2>
          <button onClick={() => navigate("/app/analytics")} className="text-xs font-semibold text-brand hover:text-brand-hover transition-colors">
            View Analytics →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* ─── Section: Charts Row ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaChartCard
          title="Views Over Time"
          subtitle="Last 30 days"
          data={igInsights?.data?.find((d: any) => d.name === "impressions")?.values?.map((v: any, i: number) => ({ date: `Day ${i + 1}`, val: v.value })) || []}
          dataKey="val"
          className="lg:col-span-2"
          height={220}
        />
        <DonutChartCard
          title="Interactions by Type"
          data={totalInteractions > 0 ? interactionDonut : [{ name: "No data", value: 1, color: CHART_PALETTE[3] }]}
          centerValue={totalInteractions > 0 ? `${(totalInteractions / 1000).toFixed(1)}K` : "—"}
          centerLabel="Total"
          height={220}
        />
      </section>

      {/* ─── Section: Studio Quick Stats ─── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Studio & Planner Status</h2>
          <button onClick={() => navigate("/app/studio")} className="text-xs font-semibold text-brand hover:text-brand-hover transition-colors">
            Open Studio →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Scheduled Posts" value={scheduledPosts.length} icon={Eye} />
          <StatCard label="Saved Drafts" value={savedDrafts.length} icon={Activity} />
          <StatCard label="Planner Tasks" value={pendingTasks} trend={{ value: doneTasks, direction: "up" }} icon={TrendingUp} />
        </div>
      </section>

      {/* ─── Section: Recent Activity + Sidebar ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-[var(--radius-card)] border border-border bg-bg-elevated shadow-level-1">
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
            <button onClick={() => navigate("/app/analytics")} className="text-xs font-medium text-brand hover:text-brand-hover transition-colors">
              See all
            </button>
          </div>
          <div className="divide-y divide-border-light">
            {connectedApps.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-muted">No connected platforms yet</div>
            ) : (
              connectedApps.slice(0, 4).map((appId) => {
    const appInfo = APP_REGISTRY.find((a) => a.id === appId)
                const data = summary?.[appId]
                return (
                  <div key={appId} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-canvas transition-colors group cursor-pointer" onClick={() => navigate(`/app/apps/${appId}`)}>
                    <div className="w-9 h-9 rounded-[var(--radius-avatar)] overflow-hidden border border-border shrink-0">
                      <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand transition-colors">
                        {appInfo?.name} {data?.error ? "— connection error" : "— synced"}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                        {data?.username && <span>@{data.username}</span>}
                        {data?.followers_count != null && <span>{data.followers_count.toLocaleString()} followers</span>}
                        {data?.public_repos != null && <span>{data.public_repos} repos</span>}
                        {!data && <span>Connect to sync data</span>}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Network Health + Audience */}
        <div className="space-y-6">
          <TeamListCard
            title="Network Health"
            members={networkMembers}
            onViewAll={() => navigate("/app/apps")}
          />

          {/* Audience Card (Instagram when connected) */}
          {igData ? (
            <div className="rounded-[var(--radius-card)] border border-border bg-bg-elevated shadow-level-1 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Audience Overview</h3>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Followers</span>
                  <span className="font-semibold text-text-primary">{igFollowers.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-center mt-4 pt-3 border-t border-border-light">
                <div className="text-xl font-bold text-text-primary">{igFollowers.toLocaleString()}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Instagram Followers</div>
                <Badge variant="success" className="mt-1.5 text-[10px]">Connected</Badge>
              </div>
            </div>
          ) : (
            <div className="rounded-[var(--radius-card)] border border-border bg-bg-elevated shadow-level-1 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Audience Overview</h3>
              <p className="text-xs text-text-muted text-center py-4">Connect Instagram to see audience data</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Section: Planner Tasks ─── */}
      <ProjectListCard
        title="Upcoming Tasks"
        tasks={plannerTasksForCard}
        onViewAll={() => navigate("/app/planner")}
        onAddNew={() => navigate("/app/planner")}
      />

      {/* ─── Section: AI Promo Banner ─── */}
      <PromoCard
        variant="dark"
        icon={<Zap className="w-5 h-5 text-text-inverse" />}
        headline="AI Recommendation"
        description={igViews > 0 ? `Your Instagram content reached ${igViews.toLocaleString()} views this period. Connect more platforms to get cross-platform AI insights and content recommendations.` : "Connect your social platforms to unlock AI-powered content recommendations, career scoring, and growth insights."}
        ctaLabel="View Insights"
        onCtaClick={() => navigate("/app/analytics")}
      />
    </motion.div>
  )
}
