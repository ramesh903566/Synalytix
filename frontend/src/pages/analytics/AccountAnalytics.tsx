import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Activity, Users, Target, BarChart2 } from 'lucide-react';
import { UNIVERSAL_MOCK_DATA, MOCK_APPS } from '../../data/mockData';
import { PlatformType } from '../../types/analytics';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      <div className="p-8 text-center text-[#666]">
        Account not found.
        <br />
        <button onClick={() => navigate(`/app/analytics/${platform}`)} className="mt-4 text-black font-bold underline">Go back to {appInfo.name}</button>
      </div>
    );
  }

  const { overview, aiInsights, growthHistory, content } = account;

  const sortedContent = [...content].sort((a, b) => {
    return ((b.metrics as any)[contentSort] || 0) - ((a.metrics as any)[contentSort] || 0);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(`/app/analytics/${platform}`)} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" />
        </button>
        <div className="flex items-center gap-3">
          <img src={account.profileImageUrl} alt={account.name} className="w-10 h-10 rounded-full border border-neutral-200" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">{account.name}</h1>
            <p className="text-[#666] text-sm font-light">{account.handle} • {appInfo.name}</p>
          </div>
        </div>
      </header>

      {/* Level 4: Account Overview */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">Account Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Followers', value: overview.followers?.toLocaleString() || '0', icon: <Users className="w-4 h-4 text-[#666]" /> },
            { label: 'Total Views', value: overview.views >= 1000 ? `${(overview.views/1000).toFixed(1)}K` : overview.views, icon: <BarChart2 className="w-4 h-4 text-[#666]" /> },
            { label: 'Engagements', value: overview.engagements >= 1000 ? `${(overview.engagements/1000).toFixed(1)}K` : overview.engagements, icon: <Activity className="w-4 h-4 text-[#666]" /> },
            { label: 'Reach', value: overview.reach ? (overview.reach >= 1000 ? `${(overview.reach/1000).toFixed(1)}K` : overview.reach) : 'N/A', icon: <Target className="w-4 h-4 text-[#666]" /> },
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

      {/* Growth Chart */}
      {growthHistory.length > 0 && (
        <section className="bg-white border border-[#EFEFEF] rounded-2xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-6">Growth History</h2>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthHistory}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} dx={-6} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #EFEFEF', fontSize: '11px' }} />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2.5} fill="url(#growthGrad)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Account AI Insights */}
      {aiInsights && (
        <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <h3 className="text-xs font-semibold mb-3 flex items-center gap-2 uppercase tracking-widest text-indigo-900">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Account AI Insights
          </h3>
          <p className="text-sm text-indigo-800 leading-relaxed font-medium">
            {aiInsights.summary}
          </p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-indigo-900">
            <div className="bg-white/60 p-3 rounded-lg">Health: {aiInsights.healthScore}/100</div>
            <div className="bg-white/60 p-3 rounded-lg">Consistency: {aiInsights.consistencyScore}/100</div>
            <div className="bg-white/60 p-3 rounded-lg">Trend: {aiInsights.growthTrend}</div>
            <div className="bg-white/60 p-3 rounded-lg">Frequency: {aiInsights.postingFrequency}</div>
          </div>
        </section>
      )}

      {/* Content Analytics List */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A]">Recent Content</h2>
          <div className="flex gap-2 overflow-x-auto">
            {contentSorts.map(s => (
              <button key={s} onClick={() => setContentSort(s)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-xs font-medium transition-all ${contentSort === s ? 'bg-neutral-800 text-white border-neutral-800' : 'bg-white text-[#666] border-neutral-300 hover:border-neutral-400'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white border border-[#EFEFEF] rounded-2xl overflow-hidden divide-y divide-[#EFEFEF]">
          {sortedContent.length === 0 ? (
            <div className="p-8 text-center text-[#666] text-sm">No recent content to analyze.</div>
          ) : (
            sortedContent.map(item => {
              const displayVal = (item.metrics as any)[contentSort] || 0;
              return (
                <Link 
                  key={item.id} 
                  to={`/app/analytics/${platform}/${accountId}/${item.id}`}
                  className="flex items-center gap-4 py-4 px-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-[#666] flex-shrink-0 border border-[#EFEFEF]">
                    {item.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#1A1A1A] truncate group-hover:underline">{item.title}</div>
                    <div className="flex gap-3 mt-1 text-xs font-medium text-[#999]">
                      <span>{item.publishedAt}</span>
                      {item.metrics.likes !== undefined && <span>❤️ {item.metrics.likes}</span>}
                      {item.metrics.comments !== undefined && <span>💬 {item.metrics.comments}</span>}
                      {item.metrics.shares !== undefined && <span>🔁 {item.metrics.shares}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-[#1A1A1A]">
                      {displayVal >= 1000 ? `${(displayVal/1000).toFixed(1)}K` : displayVal}
                    </div>
                    <div className="text-[10px] text-[#999] uppercase tracking-wider font-semibold">{contentSort}</div>
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
