import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, UserCircle, Users, Target, FileText, Activity, Lightbulb, Bell, Search, Settings 
} from 'lucide-react';

import { Overview } from './Overview';
import { ProfileAnalytics } from './ProfileAnalytics';
import { Followers } from './Followers';
import { Audience } from './Audience';
import { ContentAnalytics } from './ContentAnalytics';
import { Performance } from './Performance';
import { AIInsights } from './AIInsights';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile Analytics', icon: UserCircle },
  { id: 'followers', label: 'Followers', icon: Users },
  { id: 'audience', label: 'Audience', icon: Target },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'performance', label: 'Performance', icon: Activity },
  { id: 'ai', label: 'AI Insights', icon: Lightbulb },
];

export const LinkedInAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'profile': return <ProfileAnalytics />;
      case 'followers': return <Followers />;
      case 'audience': return <Audience />;
      case 'content': return <ContentAnalytics />;
      case 'performance': return <Performance />;
      case 'ai': return <AIInsights />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col font-sans">
      {/* Top Navigation / Header */}
      <header className="h-16 border-b border-[rgba(255,255,255,0.06)] bg-[#11161D]/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-[#0A66C2] flex items-center justify-center font-bold text-lg">
            in
          </div>
          <h1 className="text-lg font-bold">LinkedIn Analytics</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full bg-[#1A222C] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#1A222C] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#1A222C] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center ml-2 border border-white/10 cursor-pointer">
            <span className="text-xs font-bold">US</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r border-[rgba(255,255,255,0.06)] bg-[#0B0F14] p-4 hidden md:flex flex-col gap-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">Dashboards</div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1A222C]/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#1A222C] rounded-lg border border-[rgba(255,255,255,0.06)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-[#0A66C2]' : ''}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0B0F14]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {NAV_ITEMS.find(i => i.id === activeTab)?.label}
                </h2>
                <p className="text-zinc-500 text-sm">Overview of your LinkedIn performance metrics.</p>
              </div>
              
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};
