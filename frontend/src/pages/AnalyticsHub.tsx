import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Activity, BarChart2 } from 'lucide-react';
import { MOCK_CROSS_PLATFORM_INSIGHTS, MOCK_APPS } from '../data/mockData';

export default function AnalyticsHub() {
  const navigate = useNavigate();
  const insights = MOCK_CROSS_PLATFORM_INSIGHTS;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight mb-2 text-[#1A1A1A]">Cross-Platform Intelligence</h1>
        <p className="text-[#666] text-sm font-light">Aggregated insights across all connected services</p>
      </header>

      {/* AI Banner - Cross Platform */}
      <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6">
        <h3 className="text-xs font-semibold mb-5 flex items-center gap-2 uppercase tracking-widest text-[#1A1A1A]">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Universal AI Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {insights.crossPlatformRecommendations.map((rec, i) => (
            <div key={i} className="p-5 bg-neutral-50 border border-neutral-100 rounded-xl flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-[12px] text-[#1A1A1A] font-medium leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Level 0: KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Health', value: `${insights.overallHealthScore}/100`, icon: <Activity className="w-4 h-4 text-[#666]" /> },
          { label: 'Total Views', value: insights.totalViews >= 1000 ? `${(insights.totalViews/1000).toFixed(1)}K` : insights.totalViews, icon: <BarChart2 className="w-4 h-4 text-[#666]" /> },
          { label: 'Total Engagement', value: insights.totalEngagements >= 1000 ? `${(insights.totalEngagements/1000).toFixed(1)}K` : insights.totalEngagements, icon: <TrendingUp className="w-4 h-4 text-[#666]" /> },
          { label: 'Total Audience', value: insights.totalFollowers >= 1000 ? `${(insights.totalFollowers/1000).toFixed(1)}K` : insights.totalFollowers, icon: <Sparkles className="w-4 h-4 text-[#666]" /> },
        ].map(m => (
          <div key={m.label} className="p-5 rounded-xl border border-[#EFEFEF] bg-white">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs text-[#666] font-medium">{m.label}</div>
              {m.icon}
            </div>
            <div className="text-2xl font-bold text-[#1A1A1A]">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Connected Platforms List */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_APPS.map(app => {
            const data = insights.platforms[app.id as keyof typeof insights.platforms];
            if (!data) return null; // Only show connected platforms with data in this view

            return (
              <div 
                key={app.id} 
                onClick={() => navigate(`/app/analytics/${app.id}`)}
                className="p-5 border border-[#EFEFEF] rounded-xl bg-white hover:border-neutral-300 hover:shadow-sm cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden">
                    {app.iconUrl ? <img src={app.iconUrl} alt={app.name} className="w-6 h-6 object-cover rounded" /> : <div className="w-6 h-6 bg-neutral-300 rounded" />}
                  </div>
                  <div>
                    <div className="font-bold text-[#1A1A1A] group-hover:text-black">{app.name}</div>
                    <div className="text-[10px] text-[#999]">{data.accounts.length} connected account(s)</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-neutral-50 p-2 rounded">
                    <span className="block text-[#999] mb-0.5 text-[10px]">Health</span>
                    <span className="font-semibold text-[#1A1A1A]">{data.aiInsights?.healthScore}/100</span>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded">
                    <span className="block text-[#999] mb-0.5 text-[10px]">Engagement</span>
                    <span className="font-semibold text-[#1A1A1A]">{data.aggregatedMetrics.engagements}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
