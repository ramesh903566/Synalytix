import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../../core/AnalyticsContext';
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, Activity, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ContentDetailDrawer: React.FC = () => {
  const { selectedContentItem, setSelectedContentItem } = useAnalytics();

  if (!selectedContentItem) return null;

  const item = selectedContentItem;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={() => setSelectedContentItem(null)} 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.97 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          className="relative w-full max-w-md max-h-[85vh] bg-[#0A0A0A] rounded-[32px] overflow-y-auto text-white shadow-2xl no-scrollbar"
        >
          <div className="sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md z-10 px-6 py-4 flex items-center gap-4 border-b border-white/10">
            <button 
              onClick={() => setSelectedContentItem(null)} 
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold capitalize">{item.type} insights</h2>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col items-center border-b border-white/10 pb-6">
              <div className="w-28 h-36 bg-zinc-800 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-zinc-700">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.caption} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">📄</span>
                )}
              </div>
              <span className="text-zinc-400 text-sm mb-2">{new Date(item.publishDate).toLocaleDateString()}</span>
              <p className="text-sm font-medium text-center px-4 mb-6 line-clamp-2">{item.caption}</p>
              
              <div className="flex w-full justify-between px-4">
                <div className="flex flex-col items-center gap-1">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-semibold">{item.likes.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">{item.comments.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Send className="w-5 h-5" />
                  <span className="text-sm font-semibold">{item.shares.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Bookmark className="w-5 h-5" />
                  <span className="text-sm font-semibold">{item.saves.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">Overview <Info className="w-4 h-4 text-zinc-500"/></h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Reach</span>
                  <span className="font-bold">{item.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Impressions</span>
                  <span className="font-bold">{item.impressions.toLocaleString()}</span>
                </div>
                {item.profileVisits !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Profile Visits</span>
                    <span className="font-bold">{item.profileVisits.toLocaleString()}</span>
                  </div>
                )}
                {item.followersGained !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Followers Gained</span>
                    <span className="font-bold">{item.followersGained > 0 ? `+${item.followersGained.toLocaleString()}` : '0'}</span>
                  </div>
                )}
              </div>
            </div>

            {item.performanceTimeline && item.performanceTimeline.length > 0 && (
              <div className="border-b border-white/10 pb-6">
                <h3 className="text-base font-semibold mb-4">Performance Timeline</h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={item.performanceTimeline}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#71717a', fontSize: 10}} />
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {item.aiReview && (
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">✨ AI Review</h3>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">{item.aiReview}</p>
                
                {item.recommendations && item.recommendations.length > 0 && (
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {item.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-zinc-200 flex items-start gap-2">
                          <span className="text-blue-500">•</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
