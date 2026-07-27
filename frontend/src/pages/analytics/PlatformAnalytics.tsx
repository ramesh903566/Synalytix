import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, Activity, Users, Target } from 'lucide-react';
import { UNIVERSAL_MOCK_DATA, MOCK_APPS } from '../../data/mockData';
import { PlatformType } from '../../types/analytics';

export default function PlatformAnalytics() {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();

  const data = UNIVERSAL_MOCK_DATA[platform as PlatformType];
  const appInfo = MOCK_APPS.find(app => app.id === platform);

  if (!data || !appInfo) {
    return (
      <div className="p-8 text-center text-[#666]">
        Platform data not found or not connected.
        <br />
        <button onClick={() => navigate('/app/analytics')} className="mt-4 text-black font-bold underline">Go back</button>
      </div>
    );
  }

  const { aggregatedMetrics, aiInsights, accounts } = data;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate('/app/analytics')} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1A1A1A] flex items-center gap-2">
            {appInfo.iconUrl && <img src={appInfo.iconUrl} alt={appInfo.name} className="w-5 h-5 rounded object-cover" />}
            {appInfo.name} Analytics
          </h1>
          <p className="text-[#666] text-sm font-light">Aggregated summary for all connected {appInfo.name} accounts</p>
        </div>
      </header>

      {/* Level 1: Overall Summary */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">Overall Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Health Score', value: `${aiInsights?.healthScore}/100`, icon: <Activity className="w-4 h-4 text-[#666]" /> },
            { label: 'Total Views', value: aggregatedMetrics.views >= 1000 ? `${(aggregatedMetrics.views/1000).toFixed(1)}K` : aggregatedMetrics.views, icon: <TrendingUp className="w-4 h-4 text-[#666]" /> },
            { label: 'Total Engagement', value: aggregatedMetrics.engagements >= 1000 ? `${(aggregatedMetrics.engagements/1000).toFixed(1)}K` : aggregatedMetrics.engagements, icon: <Users className="w-4 h-4 text-[#666]" /> },
            { label: 'Total Followers', value: aggregatedMetrics.followers || 0, icon: <Target className="w-4 h-4 text-[#666]" /> },
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
      </section>

      {/* Level 2: AI Insights */}
      {aiInsights && (
        <section className="bg-white border border-[#EFEFEF] rounded-2xl p-6">
          <h3 className="text-xs font-semibold mb-5 flex items-center gap-2 uppercase tracking-widest text-[#1A1A1A]">
            <Sparkles className="w-3 h-3 text-orange-500" />
            AI Insights & Recommendations
          </h3>
          <p className="text-sm text-[#1A1A1A] font-medium mb-6 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            {aiInsights.summary}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiInsights.recommendations.map((rec, i) => (
              <div key={i} className="p-5 bg-orange-50 border border-orange-100 rounded-xl flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-xs font-bold text-orange-900">{rec.title}</p>
                <p className="text-[11px] text-orange-700 leading-relaxed">
                  {rec.description} <strong>Impact: {rec.impact}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Level 3: Multi Account Summary */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">Connected Accounts</h2>
        <div className="bg-white border border-[#EFEFEF] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#EFEFEF] bg-neutral-50 text-xs font-semibold text-[#666] uppercase tracking-wider">
            <div className="col-span-4">Account</div>
            <div className="col-span-2 text-right">Followers</div>
            <div className="col-span-2 text-right">Engagement</div>
            <div className="col-span-2 text-right">Health</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <div className="divide-y divide-[#EFEFEF]">
            {accounts.map(acc => (
              <Link 
                key={acc.id} 
                to={`/app/analytics/${platform}/${acc.id}`}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-neutral-50 transition-colors cursor-pointer group"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <img src={acc.profileImageUrl || `https://ui-avatars.com/api/?name=${acc.name}`} alt={acc.name} className="w-10 h-10 rounded-full border border-neutral-200" />
                  <div className="overflow-hidden">
                    <div className="font-bold text-[#1A1A1A] group-hover:underline truncate">{acc.name}</div>
                    <div className="text-xs text-[#999] truncate">{acc.handle}</div>
                  </div>
                </div>
                <div className="col-span-2 text-right font-medium text-[#1A1A1A]">
                  {(acc.overview.followers || 0).toLocaleString()}
                </div>
                <div className="col-span-2 text-right font-medium text-[#1A1A1A]">
                  {(acc.overview.engagements || 0).toLocaleString()}
                </div>
                <div className="col-span-2 text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold ${
                    (acc.aiInsights?.healthScore || 0) >= 80 ? 'bg-green-100 text-green-800' : 
                    (acc.aiInsights?.healthScore || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {acc.aiInsights?.healthScore}/100
                  </span>
                </div>
                <div className="col-span-2 text-right text-[10px] text-[#999]">
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
