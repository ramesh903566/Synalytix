import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, Activity, Star, Users, ArrowRightLeft, X } from 'lucide-react';

const MOCK_FRIENDS = [
  { handle: 'torvalds', name: 'Linus Torvalds', avatar: 'https://ui-avatars.com/api/?name=Linus+Torvalds&background=random' },
  { handle: 'gaearon', name: 'Dan Abramov', avatar: 'https://ui-avatars.com/api/?name=Dan+Abramov&background=random' },
];

export const ComparisonMode: React.FC<{ currentUsername: string }> = ({ currentUsername }) => {
  const [comparingWith, setComparingWith] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-zinc-800/50 rounded-3xl p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-semibold text-zinc-100">Compare Profiles</h2>
        </div>
        {!comparingWith && (
          <button 
            aria-label="Find peer to compare"
            className="px-3 py-1.5 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            Find peer to compare
          </button>
        )}
      </div>

      {!comparingWith ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-zinc-800 rounded-2xl">
          <div className="flex -space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-xs font-bold">You</div>
            <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-zinc-500 text-lg">?</div>
          </div>
          <p className="text-sm text-zinc-400 mb-6 max-w-sm">
            Select a peer from your network to benchmark your activity, language adoption, and open source impact.
          </p>
          <div className="flex gap-2">
            {MOCK_FRIENDS.map(friend => (
              <button
                key={friend.handle}
                onClick={() => setComparingWith(friend.handle)}
                aria-label={`Compare with ${friend.name}`}
                className="flex items-center gap-2 p-2 pr-4 rounded-full border border-zinc-800/50 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-colors group"
              >
                <img src={friend.avatar} alt={friend.name} className="w-6 h-6 rounded-full" />
                <span className="text-xs text-zinc-300 group-hover:text-zinc-100 font-medium">@{friend.handle}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="comparison-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/50">You</div>
                  <span className="text-[10px] text-zinc-500">@{currentUsername}</span>
                </div>
                <div className="text-zinc-600 text-xs uppercase tracking-widest font-bold">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/50 relative">
                    <img src={`https://ui-avatars.com/api/?name=${comparingWith}&background=random`} alt={comparingWith} className="w-full h-full rounded-full absolute inset-0 object-cover opacity-80 mix-blend-screen" />
                    P
                  </div>
                  <span className="text-[10px] text-zinc-500">@{comparingWith}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setComparingWith(null)}
                aria-label="Close comparison view"
                className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Commits (30d)', icon: <GitMerge className="w-3.5 h-3.5" />, v1: 245, v2: 180, isBetter: true },
                { label: 'Avg PR Merge Time', icon: <Activity className="w-3.5 h-3.5" />, v1: '4h', v2: '12h', isBetter: true },
                { label: 'Stars Earned', icon: <Star className="w-3.5 h-3.5" />, v1: 4520, v2: 12500, isBetter: false },
                { label: 'Followers', icon: <Users className="w-3.5 h-3.5" />, v1: 150, v2: 450, isBetter: false },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/30">
                  <div className="flex items-center gap-2 w-32">
                    <span className="text-zinc-500">{stat.icon}</span>
                    <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className={`text-right text-sm font-bold ${stat.isBetter ? 'text-blue-400' : 'text-zinc-300'}`}>
                      {stat.v1}
                    </div>
                    <div className={`text-left text-sm font-bold ${!stat.isBetter ? 'text-emerald-400' : 'text-zinc-300'}`}>
                      {stat.v2}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};
