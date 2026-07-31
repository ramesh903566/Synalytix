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
    <div className="min-h-screen bg-bg-canvas text-text-primary flex flex-col font-sans">


      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Horizontal Navigation Tabs */}
        <nav className="border-b border-border-light bg-bg-canvas px-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                  isActive ? 'text-[#0A66C2]' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A66C2]' : ''}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeHorizontalTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A66C2]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-canvas">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >

              
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};
