import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_APPS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Check, Plus } from 'lucide-react';

const BACKEND_APPS = new Set(['github', 'instagram', 'x', 'linkedin', 'leetcode']);

const APP_META: Record<string, { desc: string, metrics?: string }> = {
  instagram: { desc: 'View detailed reel performance, story views, profile visits and audience demographics.', metrics: '53.6K Views · 488 Followers' },
  x: { desc: 'Track tweet impressions, profile clicks, engagement rates and follower trends over time.', metrics: '12K Impressions · +24 Follows' },
  linkedin: { desc: 'Track post impressions, profile views, connection growth and professional engagement.', metrics: 'Connect to sync analytics' },
  github: { desc: 'Monitor contributions, repository stars, followers and coding activity heatmap.', metrics: '89 Contributions · 6 Repos' },
  leetcode: { desc: 'Track problems solved, acceptance rate, difficulty breakdown and submission history.', metrics: '28 Solved · 94.6% Acceptance' },
  tiktok: { desc: 'Track video views, profile interactions, followers growth and trending sounds.', metrics: 'Connect to sync analytics' },
  facebook: { desc: 'Track page reach, post engagement, audience demographics and ad performance.', metrics: 'Connect to sync analytics' },
};
export default function AppsList() {
  const { connectedApps, refreshConnections } = useAppContext();
  const navigate = useNavigate();
  const [showUpcoming, setShowUpcoming] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUpcoming(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Check for OAuth callbacks
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'true') {
      refreshConnections();
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (params.get('error')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refreshConnections]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-end mb-10">
        <header>
          <h1 className="text-xl font-semibold tracking-tight mb-2 text-[#1A1A1A]">Applications</h1>
          <p className="text-[#666] text-sm font-light">Connect your platforms to manage and analyze your digital presence.</p>
        </header>
        
        {/* User requested new upcoming apps button upper right */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="px-5 py-2.5 bg-white text-[#1A1A1A] border border-[#EFEFEF] rounded-lg font-medium text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Request App
          </button>
          
          <AnimatePresence>
            {showUpcoming && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EFEFEF] rounded-xl shadow-xl z-50 p-4"
              >
                 <h3 className="font-bold text-[#999] uppercase tracking-widest text-[10px] mb-3">Upcoming Integrations</h3>
                 <div className="flex flex-col gap-2 opacity-50 grayscale">
                    {/* Replaced TikTok with Pinterest since TikTok is now connected */}
                    <div className="px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-[#1A1A1A]">Pinterest</div>
                    <div className="px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-[#1A1A1A]">Hashnode</div>
                    <div className="px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-[#1A1A1A]">Dev.to</div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_APPS.map(app => {
          const isConnected = connectedApps.includes(app.id as any);
          const isSupported = BACKEND_APPS.has(app.id);
          const meta = APP_META[app.id];
          return (
            <div key={app.id}
              className={`p-6 rounded-2xl border transition-all group ${isSupported ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} ${isConnected ? 'bg-white border-[#EFEFEF] hover:border-neutral-300' : 'bg-neutral-50 border-transparent hover:bg-white hover:border-[#EFEFEF]'}`}
              onClick={() => {
                if (!isSupported) return;
                navigate(isConnected ? `/app/apps/${app.id}` : `/app/apps/${app.id}/connect`);
              }}>
              <div className="flex justify-between items-start mb-8">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#EFEFEF] flex items-center justify-center text-xl shadow-sm overflow-hidden">
                  <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover scale-[1.15]" />
                </div>
                {isConnected ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded text-[9px] font-bold uppercase tracking-widest border border-green-100">
                    <Check className="w-3 h-3"/> Connected
                  </span>
                ) : isSupported ? (
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded text-[9px] font-bold uppercase tracking-widest border border-neutral-200">
                    Not Connected
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-400 rounded text-[9px] font-bold uppercase tracking-widest border border-neutral-200">
                    Soon
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold mb-2 text-[#1A1A1A]">{app.name}</h3>
              <p className="text-[#666] text-xs font-light leading-relaxed mb-3">{meta?.desc}</p>
              {isConnected && meta?.metrics && (
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest border-t border-[#F5F5F5] pt-3 mt-3">{meta.metrics}</p>
              )}
              {!isConnected && isSupported && (
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Click to authorize →</p>
              )}
              {!isConnected && !isSupported && (
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Integration coming soon</p>
              )}
            </div>
          );
        })}
      </div>

    </motion.div>
  );
}
