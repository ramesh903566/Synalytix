import { Eye, Users, Activity, TrendingUp, Zap } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import { MOCK_APPS, MOCK_POSTS, IG_OVERVIEW, IG_AUDIENCE } from "../data/mockData"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"

import { StatCard } from "../components/dashboard/stat-card"
import { AreaChartCard } from "../components/dashboard/area-chart-card"
import { DonutChartCard } from "../components/dashboard/donut-chart-card"
import { ProjectListCard } from "../components/dashboard/project-list-card"
import { PromoCard } from "../components/dashboard/promo-card"
import { TeamListCard } from "../components/dashboard/team-list-card"
import { Badge } from "../components/ui/badge"
import { CHART_PALETTE } from "../lib/theme"

export default function Dashboard() {
  const { connectedApps, scheduledPosts, savedDrafts, plannerTasks } = useAppContext()
  const navigate = useNavigate()

  const pendingTasks = plannerTasks.filter((t) => t.status !== "done").length
  const doneTasks = plannerTasks.filter((t) => t.status === "done").length

  // ─── KPI Stats ───
  const overviewStats = [
    { label: "Total Views (30d)", value: IG_OVERVIEW.allContent.views, trend: { value: 12.4, direction: "up" as const }, icon: Eye },
    { label: "Net New Followers", value: IG_OVERVIEW.allContent.netFollowers, trend: { value: 4.1, direction: "up" as const }, icon: Users },
    { label: "Total Interactions", value: IG_OVERVIEW.allContent.interactions, trend: { value: 8.2, direction: "up" as const }, icon: Activity },
    { label: "Accounts Reached", value: IG_OVERVIEW.allContent.accountsReached, trend: { value: 3.5, direction: "up" as const }, icon: TrendingUp },
  ]

  // ─── Content interaction donut data ───
  const interactionDonut = [
    { name: "Reels", value: 2500, color: CHART_PALETTE[0] },
    { name: "Stories", value: 639, color: CHART_PALETTE[1] },
    { name: "Posts", value: 200, color: CHART_PALETTE[2] },
    { name: "Live", value: 0, color: CHART_PALETTE[3] },
  ]

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
    const appInfo = MOCK_APPS.find((a) => a.id === appId)
    return {
      id: appId,
      name: appInfo?.name || appId,
      role: "Connected & syncing",
      avatarUrl: appInfo?.iconUrl,
      status: "online" as const,
    }
  })

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
          subtitle="Apr 23 – May 22"
          data={IG_OVERVIEW.viewsHistory}
          dataKey="val"
          className="lg:col-span-2"
          height={220}
        />
        <DonutChartCard
          title="Interactions by Type"
          data={interactionDonut}
          centerValue={`${((2500 + 639 + 200) / 1000).toFixed(1)}K`}
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
          <StatCard
            label="Planner Tasks"
            value={pendingTasks}
            trend={{ value: doneTasks, direction: "up" }}
            icon={TrendingUp}
          />
        </div>
      </section>

      {/* ─── Section: Recent Posts + Sidebar Widgets ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2 rounded-[var(--radius-card)] border border-border bg-bg-elevated shadow-level-1">
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <h3 className="text-sm font-semibold text-text-primary">Recent Posts</h3>
            <button onClick={() => navigate("/app/analytics")} className="text-xs font-medium text-brand hover:text-brand-hover transition-colors">
              See all
            </button>
          </div>
          <div className="divide-y divide-border-light">
            {MOCK_POSTS.slice(0, 4).map((post) => {
              const appInfo = MOCK_APPS.find((a) => a.id === post.app)
              return (
                <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-canvas transition-colors group cursor-pointer">
                  <div className="w-9 h-9 rounded-[var(--radius-avatar)] overflow-hidden border border-border shrink-0">
                    <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand transition-colors">{post.content}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                      {post.views ? <span>{post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views} views</span> : null}
                      <span>{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}K` : post.likes} likes</span>
                      <span>{post.comments} comments</span>
                      <span className="text-text-muted/50">·</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Network Health + Age Demographics */}
        <div className="space-y-6">
          <TeamListCard
            title="Network Health"
            members={networkMembers}
            onViewAll={() => navigate("/app/apps")}
          />

          {/* Age Demographics Card */}
          <div className="rounded-[var(--radius-card)] border border-border bg-bg-elevated shadow-level-1 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Top Age Groups</h3>
            {IG_AUDIENCE.age.slice(0, 4).map((a) => (
              <div key={a.range} className="mb-3">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>{a.range}</span>
                  <span className="font-semibold text-text-primary">{a.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-sunken rounded-[var(--radius-pill)] overflow-hidden">
                  <div className="bg-brand h-full rounded-[var(--radius-pill)]" style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="text-center mt-4 pt-3 border-t border-border-light">
              <div className="text-xl font-bold text-text-primary">{IG_AUDIENCE.followers}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Total Followers</div>
              <Badge variant="success" className="mt-1.5 text-[10px]">+{IG_AUDIENCE.followerGrowth}% growth</Badge>
            </div>
          </div>
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
        description={`Your NAM HORI 🐮 reel hit 16.9K views — your best performing content in 30 days. 73.8% of your audience is 18–24 age group. Post a similar outdoor/lifestyle reel this Thursday between 6–9 PM IST.`}
        ctaLabel="View Insights"
        onCtaClick={() => navigate("/app/analytics")}
      />
    </motion.div>
  )
}
