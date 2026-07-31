import React from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLeetCodeData } from '../hooks/useLeetCodeData';

interface LeetCodeAnalyticsDashboardProps {
  appInfo: any;
  renderActiveAccountsStory: () => React.ReactNode;
}

export const LeetCodeAnalyticsDashboard: React.FC<LeetCodeAnalyticsDashboardProps> = ({
  appInfo,
  renderActiveAccountsStory,
}) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useLeetCodeData();

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500 mt-20">Loading LeetCode data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 mt-20">{error.message}</div>;
  }

  if (!data) return null;

  const { stats, submissions = [] } = data;
  const acceptance = stats?.acceptance_rate ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Apps
      </button>
      {renderActiveAccountsStory()}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center text-2xl">🎯</div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">LeetCode Workspace</h1>
          <p className="text-zinc-500 font-light text-sm">{stats?.leetcode_username} · Rank {stats?.ranking?.toLocaleString() || 'N/A'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Practice History</h2>
            <button className="text-xs font-medium border border-neutral-200 px-3 py-1.5 rounded-lg flex items-center gap-1"><Activity className="w-3 h-3"/> Filter</button>
          </div>
          <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border-light text-xs font-semibold text-neutral-500 uppercase">
              <div className="col-span-3">Last Submitted</div>
              <div className="col-span-5">Problem</div>
              <div className="col-span-2">Last Result</div>
              <div className="col-span-2">Submissions</div>
            </div>
            {submissions.map((item, i) => (
              <div key={item.id || i} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-border-light last:border-0 hover:bg-neutral-50 transition-colors text-sm">
                <div className="col-span-3 text-neutral-500 text-xs">
                  {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="col-span-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${item.status_display === 'Accepted' ? 'border-green-500' : 'border-neutral-300'}`} />
                    <span className="font-medium text-text-primary truncate text-xs">{item.title}</span>
                  </div>
                  <div className="text-[10px] font-bold mt-0.5 ml-6 text-neutral-400">{item.lang}</div>
                </div>
                <div className={`col-span-2 font-medium text-xs ${item.status_display === 'Accepted' ? 'text-green-600' : 'text-red-500'}`}>{item.status_display}</div>
                <div className="col-span-2 text-xs text-neutral-500">1</div>
              </div>
            ))}
            {submissions.length === 0 && <div className="p-8 text-center text-xs text-neutral-400">No recent submissions found.</div>}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="bg-bg-elevated border border-border rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-neutral-500 font-medium mb-1">Total Solved</div>
                <div className="text-3xl font-bold"><span className="text-blue-500">{stats?.total_solved ?? 0}</span> <span className="text-sm font-medium text-neutral-400">Problems</span></div>
              </div>
              <div className="text-xs font-semibold bg-neutral-100 rounded-lg px-2 py-1.5">Rank {stats?.ranking?.toLocaleString() || 'N/A'}</div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-green-50 text-green-700 text-center rounded-lg py-2 text-xs font-bold">Easy <span className="text-black text-base font-bold block">{stats?.easy_solved ?? 0}</span></div>
              <div className="flex-1 bg-yellow-50 text-yellow-700 text-center rounded-lg py-2 text-xs font-bold">Med. <span className="text-black text-base font-bold block">{stats?.medium_solved ?? 0}</span></div>
              <div className="flex-1 bg-red-50 text-red-700 text-center rounded-lg py-2 text-xs font-bold">Hard <span className="text-black text-base font-bold block">{stats?.hard_solved ?? 0}</span></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-bg-elevated border border-border rounded-xl p-4">
              <div className="text-xs text-neutral-500 mb-1">Submissions</div>
              <div className="text-2xl font-bold text-fuchsia-600">{stats?.total_submissions ?? 0}</div>
            </div>
            <div className="flex-1 bg-bg-elevated border border-border rounded-xl p-4">
              <div className="text-xs text-neutral-500 mb-1">Acceptance</div>
              <div className="text-2xl font-bold text-green-500">{acceptance}<span className="text-sm">%</span></div>
            </div>
          </div>
          <div className="bg-bg-elevated border border-border rounded-xl p-4">
            <div className="text-xs text-neutral-500 mb-3 font-semibold uppercase tracking-widest">Weekly Trend</div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{n:'Mon',v:2},{n:'Tue',v:5},{n:'Wed',v:3},{n:'Thu',v:7},{n:'Fri',v:4},{n:'Sat',v:8},{n:'Sun',v:1}]}>
                  <Bar dataKey="v" fill="var(--color-text-primary)" radius={[3,3,0,0]} barSize={12}/>
                  <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill:'#999',fontSize:9}}/>
                  <Tooltip contentStyle={{borderRadius:'8px',border:"1px solid var(--color-border)",fontSize:'11px'}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
