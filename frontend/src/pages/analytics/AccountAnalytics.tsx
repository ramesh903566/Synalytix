import { useState } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Activity, Users, Target, BarChart2 } from 'lucide-react';
import { APP_REGISTRY } from '../../lib/appRegistry';
import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '../../lib/api';
import { StatCard } from '../../components/dashboard/stat-card';

export default function AccountAnalytics() {
  const { platform, accountId } = useParams<{ platform: string, accountId: string }>();
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

  if (!appInfo || !platformData || platformData.error) {
    return (
      <div className="p-8 text-center text-text-muted">
        Account not found or not connected.
        <br />
        <button onClick={() => navigate('/app/apps')} className="mt-4 text-brand font-bold hover:underline">Connect {appInfo?.name || 'platform'}</button>
      </div>
    );
  }

  const followers = platformData.followers_count ?? platformData.public_followers ?? 0;
  const username = platformData.username ?? platformData.login ?? '';
  const mediaCount = platformData.media_count ?? platformData.public_repos ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(`/app/analytics/${platform}`)} className="w-8 h-8 rounded-[var(--radius-card-inner)] bg-bg-sunken flex items-center justify-center hover:bg-border transition-colors">
          <ArrowLeft className="w-4 h-4 text-text-secondary" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-avatar)] bg-bg-sunken flex items-center justify-center border border-border">
            <span className="text-sm font-bold text-text-muted">{username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">@{username}</h1>
            <p className="text-text-muted text-sm">{appInfo.name} Account</p>
          </div>
        </div>
      </header>

      {/* Account Overview */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Account Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Followers" value={followers.toLocaleString()} icon={Users} />
          <StatCard label="Total Items" value={mediaCount} icon={BarChart2} />
          <StatCard label="Status" value="Active" icon={Activity} />
          <StatCard label="Health" value="Good" icon={Target} />
        </div>
      </section>

      {/* Content list placeholder */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Recent Content</h2>
        <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-8 text-center text-sm text-text-muted">
          Content analytics will appear here once data is synced from {appInfo.name}.
        </div>
      </section>
    </motion.div>
  );
}
