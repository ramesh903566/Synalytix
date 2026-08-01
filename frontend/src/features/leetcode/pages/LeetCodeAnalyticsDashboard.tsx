import React, { useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLeetCodeData } from '../hooks/useLeetCodeData';

interface LeetCodeAnalyticsDashboardProps {
  appInfo: any;
  renderActiveAccountsStory: () => React.ReactNode;
}

export const LeetCodeAnalyticsDashboard: React.FC<LeetCodeAnalyticsDashboardProps> = ({
  renderActiveAccountsStory,
}) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useLeetCodeData();
  const [activeTab, setActiveTab] = useState('Recent AC');

  if (isLoading) {
    return <div className="p-8 text-center text-text-muted mt-20">Loading LeetCode data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-error mt-20">{error.message}</div>;
  }

  if (!data) return null;

  const { stats, submissions = [] } = data;
  const username = stats?.leetcode_username || 'User';

  const easySolved = stats?.easy_solved || 0;
  const medSolved = stats?.medium_solved || 0;
  const hardSolved = stats?.hard_solved || 0;
  const totalSolved = easySolved + medSolved + hardSolved;

  // Language Breakdown
  const languagesMap = new Map<string, number>();
  submissions.forEach((sub: any) => {
    if (sub.lang) {
      languagesMap.set(sub.lang, (languagesMap.get(sub.lang) || 0) + 1);
    }
  });
  const languagesList = Array.from(languagesMap.entries()).map(([lang, count]) => ({ lang, count }));

  // Heatmap generation
  const activitySummary = stats?.activity_summary || {};
  const totalActiveDays = Object.keys(activitySummary).length;
  const maxStreak = stats?.streak || 0;
  const submissionsPastYear = Object.values(activitySummary).reduce((a: number, b: number) => a + b, 0);

  const today = new Date();
  const heatmapGrid = [];
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - (50 * 7 - 1)); // 50 weeks ago

  for (let col = 0; col < 50; col++) {
    const column = [];
    for (let row = 0; row < 7; row++) {
      // Find timestamp for midnight of current date
      const timestamp = Math.floor(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime() / 1000);
      let count = 0;
      
      // Activity summary keys are timestamps in seconds
      for (const [key, val] of Object.entries(activitySummary)) {
         const t = parseInt(key);
         if (t >= timestamp && t < timestamp + 86400) {
            count += val as number;
         }
      }
      
      column.push(count);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    heatmapGrid.push(column);
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Apps
          </button>
          <div className="flex items-center gap-2">
            {renderActiveAccountsStory()}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[300px] flex flex-col gap-6 flex-shrink-0">
            {/* Profile Info */}
            <div className="bg-bg-elevated border border-border rounded-xl p-5 shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-lg bg-info-light text-info-text flex items-center justify-center flex-shrink-0 border border-info/20">
                  <span className="text-3xl">👤</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-text-primary font-semibold text-lg leading-tight">{username}</h1>
                  <p className="text-text-muted text-sm mb-1">{username}</p>
                  <p className="text-text-secondary text-sm">Rank <span className="font-bold text-text-primary">{stats?.ranking?.toLocaleString() || 'N/A'}</span></p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-bg-sunken hover:bg-border-light text-text-primary text-sm py-1.5 rounded-lg font-medium transition-colors border border-border">
                  Edit Profile
                </button>
                <button className="w-9 h-9 flex items-center justify-center bg-bg-sunken hover:bg-border-light text-text-secondary rounded-lg transition-colors border border-border">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="bg-bg-elevated border border-border rounded-xl p-5 shadow-sm">
              <h2 className="text-text-primary font-semibold mb-4 text-sm">Stats</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-2 text-text-secondary">
                    Reputation
                  </div>
                  <span className="font-semibold text-text-primary">{stats?.reputation || 0}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-2 text-text-secondary">
                    Total Submissions
                  </div>
                  <span className="font-semibold text-text-primary">{submissionsPastYear}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-bg-elevated border border-border rounded-xl p-5 shadow-sm">
              <h2 className="text-text-primary font-semibold mb-4 text-sm">Languages</h2>
              {languagesList.length > 0 ? languagesList.map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-bg-sunken border border-border-light rounded-full text-xs font-medium text-text-primary">{lang.lang}</span>
                  </div>
                  <div className="text-sm"><span className="font-semibold text-text-primary">{lang.count}</span> <span className="text-text-muted text-xs">problems solved</span></div>
                </div>
              )) : (
                <div className="text-sm text-text-muted italic">No recent languages</div>
              )}
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats Card */}
              <div className="bg-bg-elevated border border-border rounded-xl p-5 shadow-sm flex items-center justify-center gap-8">
                {/* Circular Gauge Placeholder */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" className="stroke-border-light" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" className="stroke-warning" strokeWidth="8" strokeDasharray={`${Math.min(283, (totalSolved / 500) * 283)} 283`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-text-primary flex items-baseline gap-1">
                      {totalSolved}
                    </div>
                    <div className="text-xs text-text-muted">Solved</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between text-xs bg-success-light px-3 py-1.5 rounded-lg">
                    <span className="text-success-text font-medium">Easy</span>
                    <span className="text-text-primary font-semibold">{easySolved}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-warning-light px-3 py-1.5 rounded-lg">
                    <span className="text-warning-text font-medium">Med.</span>
                    <span className="text-text-primary font-semibold">{medSolved}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-error-light px-3 py-1.5 rounded-lg">
                    <span className="text-error-text font-medium">Hard</span>
                    <span className="text-text-primary font-semibold">{hardSolved}</span>
                  </div>
                </div>
              </div>

              {/* Badges Card */}
              <div className="bg-bg-elevated border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs text-text-muted mb-1 font-medium">Badges</h3>
                  <div className="text-2xl font-bold text-text-primary">0</div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xs text-text-muted mb-1 font-medium">Locked Badge</h3>
                  <div className="text-sm text-text-primary font-medium flex items-center justify-between">
                    LeetCoding Challenge
                    <div className="w-8 h-8 rounded-full bg-bg-sunken border border-border flex items-center justify-center text-xs text-text-secondary">
                      🔒
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submissions Heatmap */}
            <div className="bg-bg-elevated border border-border rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-end mb-4">
                <div className="text-sm">
                  <span className="font-semibold text-text-primary">{submissionsPastYear}</span> <span className="text-text-secondary">submissions in the past one year</span>
                </div>
                <div className="flex gap-4 text-xs text-text-secondary">
                  <div>Total active days: <span className="font-semibold text-text-primary">{totalActiveDays}</span></div>
                  <div>Max streak: <span className="font-semibold text-text-primary">{maxStreak}</span></div>
                </div>
              </div>
              
              {/* Heatmap Grid */}
              <div className="flex gap-[3px] overflow-hidden h-28 items-end">
                {heatmapGrid.map((col, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-[3px]">
                    {col.map((count, rowIndex) => {
                      let bg = 'bg-bg-sunken border border-border-light';
                      if (count > 0 && count < 3) bg = 'bg-success-light border border-success/30';
                      else if (count >= 3) bg = 'bg-success border border-success';

                      return (
                        <div key={rowIndex} className={`w-[12px] h-[12px] rounded-sm box-border ${bg}`} title={`${count} submissions`} />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs & Submissions List */}
            <div className="bg-bg-elevated border border-border rounded-xl shadow-sm flex-1 min-h-[300px] overflow-hidden flex flex-col">
              <div className="flex gap-6 border-b border-border px-5 pt-5">
                {['Recent AC'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors ${
                      activeTab === tab 
                        ? 'text-brand border-b-2 border-brand' 
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === 'Recent AC' ? (
                  <div className="flex flex-col">
                    {submissions.length > 0 ? submissions.map((sub: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-4 px-5 border-b border-border-light hover:bg-bg-sunken transition-colors cursor-pointer">
                        <span className="text-text-primary text-sm font-medium">{sub.title} <span className="text-xs text-text-muted ml-2">({sub.lang})</span></span>
                        <span className="text-text-muted text-xs">{new Date(sub.timestamp).toLocaleDateString()}</span>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-20 text-text-muted h-full">
                        <div className="text-8xl font-bold text-border-light italic mb-4">Null</div>
                        <p className="text-sm">No recent submissions</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
