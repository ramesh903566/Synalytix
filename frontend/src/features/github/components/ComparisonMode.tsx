import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, Activity, Star, Users, ArrowRightLeft, X, Search } from 'lucide-react';

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
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Compare Profiles</h2>
        </div>
        {!comparingWith && (
          <button 
            aria-label="Find peer to compare"
            className="px-4 py-2 text-xs font-semibold bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-50 transition-colors flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            Find peer
          </button>
        )}
      </div>

      {!comparingWith ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
          <div className="flex -space-x-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border-4 border-zinc-950 flex items-center justify-center text-sm font-bold text-zinc-300 z-10">You</div>
            <div className="w-14 h-14 rounded-full bg-zinc-800 border-4 border-zinc-950 flex items-center justify-center text-zinc-500 text-xl font-medium border-dashed">?</div>
          </div>
          <h3 className="text-zinc-100 font-semibold mb-2">Benchmark your progress</h3>
          <p className="text-sm text-zinc-400 mb-8 max-w-sm">
            Select a peer from your network to benchmark your activity, language adoption, and open source impact.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {MOCK_FRIENDS.map(friend => (
              <button
                key={friend.handle}
                onClick={() => setComparingWith(friend.handle)}
                aria-label={`Compare with ${friend.name}`}
                className="flex items-center gap-3 p-2 pr-5 rounded-full border border-border-light hover:border-zinc-600 bg-zinc-900 hover:bg-zinc-800 transition-colors group"
              >
                <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full border border-zinc-700" />
                <span className="text-sm text-zinc-400 group-hover:text-zinc-50 font-medium transition-colors">@{friend.handle}</span>
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
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8 p-4 bg-zinc-900/50 rounded-2xl border border-border-light">
              <div className="flex items-center gap-8 w-full">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm ring-2 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">You</div>
                  <span className="text-sm font-semibold text-zinc-100 hidden sm:block">@{currentUsername}</span>
                </div>
                
                <div className="text-zinc-500 text-xs uppercase tracking-widest font-bold px-3 py-1 bg-zinc-800 rounded-full">VS</div>
                
                <div className="flex items-center justify-end gap-3 flex-1">
                  <span className="text-sm font-semibold text-zinc-100 hidden sm:block">@{comparingWith}</span>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm ring-2 ring-emerald-500/50 relative shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <img src={`https://ui-avatars.com/api/?name=${comparingWith}&background=random`} alt={comparingWith} className="w-full h-full rounded-full absolute inset-0 object-cover opacity-80 mix-blend-screen" />
                    <span className="relative z-10">P</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setComparingWith(null)}
                aria-label="Close comparison view"
                className="ml-4 p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {[
                { label: 'Commits (30d)', icon: <GitMerge className="w-4 h-4" />, v1: 245, v2: 180, isBetter: true },
                { label: 'Avg PR Merge', icon: <Activity className="w-4 h-4" />, v1: '4h', v2: '12h', isBetter: true },
                { label: 'Stars Earned', icon: <Star className="w-4 h-4" />, v1: 4520, v2: 12500, isBetter: false },
                { label: 'Followers', icon: <Users className="w-4 h-4" />, v1: 150, v2: 450, isBetter: false },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-zinc-900/30 border border-border-light hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-zinc-500">{stat.icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.label}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`text-lg font-bold w-20 ${stat.isBetter ? 'text-blue-400' : 'text-zinc-300'}`}>
                      {stat.v1}
                    </div>
                    
                    <div className="flex-1 flex items-center mx-4 gap-1">
                      {/* Visual bars */}
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full flex justify-end overflow-hidden">
                        <div className={`h-full ${stat.isBetter ? 'bg-blue-500' : 'bg-zinc-600'} rounded-full`} style={{ width: stat.isBetter ? '100%' : '40%' }} />
                      </div>
                      <div className="w-1 h-3 bg-zinc-700 mx-1 rounded-full" />
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${!stat.isBetter ? 'bg-emerald-500' : 'bg-zinc-600'} rounded-full`} style={{ width: !stat.isBetter ? '100%' : '30%' }} />
                      </div>
                    </div>

                    <div className={`text-lg font-bold w-20 text-right ${!stat.isBetter ? 'text-emerald-400' : 'text-zinc-300'}`}>
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
