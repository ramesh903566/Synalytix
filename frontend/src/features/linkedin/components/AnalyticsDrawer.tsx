import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ThumbsUp, MessageSquare, Repeat2, Send, Activity, UserPlus, MousePointer2, Sparkles } from 'lucide-react';
import { LinkedInPost } from '../types/linkedin';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  post: LinkedInPost | null;
}

export const AnalyticsDrawer: React.FC<AnalyticsDrawerProps> = ({ isOpen, onClose, post }) => {
  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[500px] max-w-full bg-bg-canvas border-l border-[rgba(255,255,255,0.1)] z-50 overflow-y-auto shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[rgba(255,255,255,0.1)] sticky top-0 bg-bg-canvas backdrop-blur-md z-10 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Post Analytics</h2>
                <p className="text-xs text-text-secondary mt-1">Published on {new Date(post.publishedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Open post in new tab" className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-text-primary border border-border-light hover:border-border-strong transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button 
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-text-primary border border-border-light hover:border-border-strong transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1">
              {/* Preview Card */}
              <div className="bg-bg-elevated rounded-xl p-4 border border-border-light mb-4">
                <div className="flex gap-4">
                  {post.img && (
                    <img src={post.img} alt="" className="w-20 h-20 rounded-lg object-cover border border-[rgba(255,255,255,0.1)]" />
                  )}
                  <div>
                    <h3 className="font-bold text-text-primary text-sm line-clamp-2 leading-relaxed">{post.title}</h3>
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-bg-sunken text-text-secondary px-2 py-1 rounded">
                      {post.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Prediction */}
              <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-transparent border border-[#8B5CF6]/30 rounded-xl p-4 mb-8 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8B5CF6]" /> Virality Prediction
                  </h4>
                  <p className="text-xs text-text-secondary mt-1">AI estimate from engagement rate and repost velocity</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-[#8B5CF6]">{Math.min(99, Math.floor(post.engagementRate * 5))}%</div>
                  <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Probability</div>
                </div>
              </div>

              {/* Discovery Stats */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Discovery</h4>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-bg-elevated rounded-xl p-4 border border-border-light">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-secondary font-medium">Impressions</span>
                    <Activity className="w-4 h-4 text-[#0A66C2]" />
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{post.impressions.toLocaleString()}</div>
                </div>
                <div className="bg-bg-elevated rounded-xl p-4 border border-border-light">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-secondary font-medium">Unique Impressions</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{post.uniqueImpressions.toLocaleString()}</div>
                </div>
                <div className="bg-bg-elevated rounded-xl p-4 border border-border-light">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-secondary font-medium">Click-Through Rate</span>
                    <MousePointer2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{post.ctr}%</div>
                </div>
                <div className="bg-bg-elevated rounded-xl p-4 border border-border-light">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-secondary font-medium">Clicks</span>
                    <UserPlus className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-text-primary">{post.clicks.toLocaleString()}</div>
                </div>
              </div>

              {/* Engagement Stats */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center justify-between">
                <span>Engagement</span>
                <span className="text-[#0A66C2] bg-[#0A66C2]/10 px-2 py-0.5 rounded border border-[#0A66C2]/20">Rate: {post.engagementRate}%</span>
              </h4>
              <div className="bg-bg-elevated rounded-xl border border-border-light divide-y divide-[rgba(255,255,255,0.06)]">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                      <ThumbsUp className="w-4 h-4 text-[#0A66C2]" />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">Reactions</span>
                  </div>
                  <span className="font-bold text-text-primary text-lg">{(post.likes + post.celebrates + post.supports + post.loves + post.insightful + post.funny).toLocaleString()}</span>
                </div>
                
                {/* Breakdown of reactions */}
                <div className="px-4 py-3 bg-bg-canvas flex justify-between items-center text-xs text-text-muted">
                  <div className="flex gap-4">
                    <span>👍 {post.likes}</span>
                    <span>👏 {post.celebrates}</span>
                    <span>❤️ {post.loves}</span>
                    <span>💡 {post.insightful}</span>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">Comments</span>
                  </div>
                  <span className="font-bold text-text-primary text-lg">{post.comments.toLocaleString()}</span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Repeat2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">Reposts</span>
                  </div>
                  <span className="font-bold text-text-primary text-lg">{post.reposts.toLocaleString()}</span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Send className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">Sends</span>
                  </div>
                  <span className="font-bold text-text-primary text-lg">{post.shares.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
