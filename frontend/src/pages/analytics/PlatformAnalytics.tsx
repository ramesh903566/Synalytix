import { motion } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, Activity, Users, Target } from 'lucide-react';
import { APP_REGISTRY } from '../../lib/appRegistry';
import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../../lib/api';
import { StatCard } from '../../components/dashboard/stat-card';

export default function PlatformAnalytics() {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();

  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await getDashboardSummary();
      if (!res.success || !res.data) return null;
      return res.data as Record<string, any>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const appInfo = APP_REGISTRY.find(app => app.id === platform);
  const platformData = summary?.[platform as string];

  if (!appInfo) {
    return (
      <div className="p-8 text-center text-text-muted">
        Platform not found.
        <br />
        <button onClick={() => navigate('/app/analytics')} className="mt-4 text-brand font-bold hover:underline">Go back</button>
      </div>
    );
  }

  if (!platformData || platformData.error) {
    return (
      <div className="p-8 text-center text-text-muted">
        {platformData?.error || 'Platform not connected or no data available.'}
        <br />
        <button onClick={() => navigate('/app/apps')} className="mt-4 text-brand font-bold hover:underline">Connect {appInfo.name}</button>
      </div>
    );
  }

  // Extract real metrics from platform data
  const followers = platformData.followers_count ?? platformData.public_followers ?? 0;
  const username = platformData.username ?? platformData.login ?? '';
  const mediaCount = platformData.media_count ?? platformData.public_repos ?? 0;

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
          <p className="text-text-muted text-sm">@{username} • Connected account</p>
        </div>
      </header>

      {/* Overall Performance */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Overall Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Followers" value={followers.toLocaleString()} icon={Users} />
          <StatCard label="Total Items" value={mediaCount} icon={TrendingUp} />
          <StatCard label="Status" value="Connected" icon={Activity} />
          <StatCard label="Platform" value={appInfo.name} icon={Target} />
        </div>
      </section>

      {/* Connected Account */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Connected Account</h2>
        <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] overflow-hidden shadow-level-1">
          <Link
            to={`/app/analytics/${platform}/account_1`}
            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-bg-canvas transition-colors cursor-pointer group"
          >
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-avatar)] bg-bg-sunken flex items-center justify-center border border-border">
                <span className="text-sm font-bold text-text-muted">{username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-text-primary group-hover:text-brand transition-colors truncate">@{username}</div>
                <div className="text-xs text-text-muted truncate">{appInfo.name}</div>
              </div>
            </div>
            <div className="col-span-2 text-right font-medium text-text-primary">
              {followers.toLocaleString()}
            </div>
            <div className="col-span-2 text-right">
              <span className="inline-flex items-center px-2 py-1 rounded-[var(--radius-badge)] text-[10px] font-bold bg-success-light text-success-text">
                Active
              </span>
            </div>
            <div className="col-span-2 text-right text-[10px] text-text-muted">
              Synced just now
            </div>
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
