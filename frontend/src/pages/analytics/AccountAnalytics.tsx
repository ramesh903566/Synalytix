import { useState } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Activity, Users, Target, BarChart2 } from 'lucide-react';
import { UNIVERSAL_MOCK_DATA, MOCK_APPS } from '../../data/mockData';
import { PlatformType } from '../../types/analytics';
import { AreaChartCard } from '../../components/dashboard/area-chart-card';
import { StatCard } from '../../components/dashboard/stat-card';
import { formatNumber } from '../../lib/theme';

type ContentSort = 'views' | 'likes' | 'comments' | 'shares';
const contentSorts: ContentSort[] = ['views', 'likes', 'comments', 'shares'];

export default function AccountAnalytics() {
  const { platform, accountId } = useParams<{ platform: string, accountId: string }>();
  const navigate = useNavigate();
  const [contentSort, setContentSort] = useState<ContentSort>('views');

  const data = UNIVERSAL_MOCK_DATA[platform as PlatformType];
  const appInfo = MOCK_APPS.find(app => app.id === platform);
  
  if (!data || !appInfo) return null;

  const account = data.accounts.find(a => a.id === accountId);

  if (!account) {
    return (
      <div className="p-8 text-center text-text-muted">
        Account not found.
        <br />
        <button onClick={() => navigate(`/app/analytics/${platform}`)} className="mt-4 text-brand font-bold hover:underline">Go back to {appInfo.name}</button>
      </div>
    );
  }

  const { overview, aiInsights, growthHistory, content } = account;

  const sortedContent = [...content].sort((a, b) => {
    return ((b.metrics as any)[contentSort] || 0) - ((a.metrics as any)[contentSort] || 0);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(`/app/analytics/${platform}`)} className="w-8 h-8 rounded-[var(--radius-card-inner)] bg-bg-sunken flex items-center justify-center hover:bg-border transition-colors">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <div className="flex items-center gap-3">
          <img src={account.profileImageUrl} alt={account.name} className="w-10 h-10 rounded-[var(--radius-avatar)] border border-border" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">{account.name}</h1>
            <p className="text-text-muted text-sm">{account.handle} • {appInfo.name}</p>
          </div>
        </div>
      </header>

      {/* Account Overview */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Account Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Followers" value={overview.followers?.toLocaleString() || '0'} icon={Users} />
          <StatCard label="Total Views" value={overview.views} icon={BarChart2} />
          <StatCard label="Engagements" value={overview.engagements} icon={Activity} />
          <StatCard label="Reach" value={overview.reach ? formatNumber(overview.reach) : 'N/A'} icon={Target} />
        </div>
      </section>

      {/* Growth Chart */}
      {growthHistory.length > 0 && (
        <AreaChartCard
          title="Growth History"
          data={growthHistory}
          dataKey="value"
          xAxisKey="date"
          height={208}
          gradientId="growthGrad"
        />
      )}

      {/* Account AI Insights */}
      {aiInsights && (
        <section className="bg-brand-light border border-brand-muted/30 rounded-[var(--radius-card)] p-6">
          <h3 className="text-xs font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-brand">
            <Sparkles className="w-3 h-3 text-brand" />
            Account AI Insights
          </h3>
          <p className="text-sm text-text-primary leading-relaxed font-medium">
            {aiInsights.summary}
          </p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-text-primary">
            <div className="bg-bg-elevated/60 p-3 rounded-[var(--radius-chip)]">Health: {aiInsights.healthScore}/100</div>
            <div className="bg-bg-elevated/60 p-3 rounded-[var(--radius-chip)]">Consistency: {aiInsights.consistencyScore}/100</div>
            <div className="bg-bg-elevated/60 p-3 rounded-[var(--radius-chip)]">Trend: {aiInsights.growthTrend}</div>
            <div className="bg-bg-elevated/60 p-3 rounded-[var(--radius-chip)]">Frequency: {aiInsights.postingFrequency}</div>
          </div>
        </section>
      )}

      {/* Content Analytics List */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Recent Content</h2>
          <div className="flex gap-2 overflow-x-auto">
            {contentSorts.map(s => (
              <button key={s} onClick={() => setContentSort(s)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-[var(--radius-pill)] border text-xs font-medium transition-all ${contentSort === s ? 'bg-brand text-text-inverse border-brand' : 'bg-bg-elevated text-text-secondary border-border hover:border-border-strong'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] overflow-hidden divide-y divide-border-light shadow-level-1">
          {sortedContent.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No recent content to analyze.</div>
          ) : (
            sortedContent.map(item => {
              const displayVal = (item.metrics as any)[contentSort] || 0;
              return (
                <Link 
                  key={item.id} 
                  to={`/app/analytics/${platform}/${accountId}/${item.id}`}
                  className="flex items-center gap-4 py-4 px-4 hover:bg-bg-canvas transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-[var(--radius-card-inner)] bg-bg-sunken flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-text-muted flex-shrink-0 border border-border-light">
                    {item.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate group-hover:text-brand transition-colors">{item.title}</div>
                    <div className="flex gap-3 mt-1 text-xs font-medium text-text-muted">
                      <span>{item.publishedAt}</span>
                      {item.metrics.likes !== undefined && <span>❤️ {item.metrics.likes}</span>}
                      {item.metrics.comments !== undefined && <span>💬 {item.metrics.comments}</span>}
                      {item.metrics.shares !== undefined && <span>🔁 {item.metrics.shares}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-text-primary">
                      {formatNumber(displayVal)}
                    </div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">{contentSort}</div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </motion.div>
  );
}
