import { motion } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, Activity, Users, Target } from 'lucide-react';
import { UNIVERSAL_MOCK_DATA, MOCK_APPS } from '../../data/mockData';
import { PlatformType } from '../../types/analytics';
import { StatCard } from '../../components/dashboard/stat-card';

export default function PlatformAnalytics() {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();

  const data = UNIVERSAL_MOCK_DATA[platform as PlatformType];
  const appInfo = MOCK_APPS.find(app => app.id === platform);

  if (!data || !appInfo) {
    return (
      <div className="p-8 text-center text-text-muted">
        Platform data not found or not connected.
        <br />
        <button onClick={() => navigate('/app/analytics')} className="mt-4 text-brand font-bold hover:underline">Go back</button>
      </div>
    );
  }

  const { aggregatedMetrics, aiInsights, accounts } = data;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate('/app/analytics')} className="w-8 h-8 rounded-[var(--radius-card-inner)] bg-bg-sunken flex items-center justify-center hover:bg-border transition-colors">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary flex items-center gap-2">
            {appInfo.iconUrl && <img src={appInfo.iconUrl} alt={appInfo.name} className="w-5 h-5 rounded-[var(--radius-badge)] object-cover" />}
            {appInfo.name} Analytics
          </h1>
          <p className="text-text-muted text-sm">Aggregated summary for all connected {appInfo.name} accounts</p>
        </div>
      </header>

      {/* Overall Performance */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Overall Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Health Score" value={`${aiInsights?.healthScore}/100`} icon={Activity} />
          <StatCard label="Total Views" value={aggregatedMetrics.views} icon={TrendingUp} />
          <StatCard label="Total Engagement" value={aggregatedMetrics.engagements} icon={Users} />
          <StatCard label="Total Followers" value={aggregatedMetrics.followers || 0} icon={Target} />
        </div>
      </section>

      {/* AI Insights */}
      {aiInsights && (
        <section className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 shadow-level-1">
          <h3 className="text-xs font-semibold mb-5 flex items-center gap-2 uppercase tracking-wider text-text-muted">
            <Sparkles className="w-3 h-3 text-brand" />
            AI Insights & Recommendations
          </h3>
          <p className="text-sm text-text-primary font-medium mb-6 bg-bg-canvas p-4 rounded-[var(--radius-card-inner)] border border-border-light">
            {aiInsights.summary}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiInsights.recommendations.map((rec, i) => (
              <div key={i} className="p-5 bg-brand-light border border-brand-muted/30 rounded-[var(--radius-card-inner)] flex flex-col gap-2">
                <div className="w-8 h-8 rounded-[var(--radius-chip)] bg-brand-muted/30 flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-brand" />
                </div>
                <p className="text-xs font-bold text-text-primary">{rec.title}</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {rec.description} <strong>Impact: {rec.impact}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Connected Accounts Table */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Connected Accounts</h2>
        <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] overflow-hidden shadow-level-1">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-bg-sunken text-xs font-semibold text-text-muted uppercase tracking-wider">
            <div className="col-span-4">Account</div>
            <div className="col-span-2 text-right">Followers</div>
            <div className="col-span-2 text-right">Engagement</div>
            <div className="col-span-2 text-right">Health</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <div className="divide-y divide-border-light">
            {accounts.map(acc => (
              <Link 
                key={acc.id} 
                to={`/app/analytics/${platform}/${acc.id}`}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-bg-canvas transition-colors cursor-pointer group"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <img src={acc.profileImageUrl || `https://ui-avatars.com/api/?name=${acc.name}`} alt={acc.name} className="w-10 h-10 rounded-[var(--radius-avatar)] border border-border" />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-text-primary group-hover:text-brand transition-colors truncate">{acc.name}</div>
                    <div className="text-xs text-text-muted truncate">{acc.handle}</div>
                  </div>
                </div>
                <div className="col-span-2 text-right font-medium text-text-primary">
                  {(acc.overview.followers || 0).toLocaleString()}
                </div>
                <div className="col-span-2 text-right font-medium text-text-primary">
                  {(acc.overview.engagements || 0).toLocaleString()}
                </div>
                <div className="col-span-2 text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-[var(--radius-badge)] text-[10px] font-bold ${
                    (acc.aiInsights?.healthScore || 0) >= 80 ? 'bg-success-light text-success-text' : 
                    (acc.aiInsights?.healthScore || 0) >= 60 ? 'bg-warning-light text-warning-text' : 'bg-error-light text-error-text'
                  }`}>
                    {acc.aiInsights?.healthScore}/100
                  </span>
                </div>
                <div className="col-span-2 text-right text-[10px] text-text-muted">
                  Synced<br/>{acc.lastSynced}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
