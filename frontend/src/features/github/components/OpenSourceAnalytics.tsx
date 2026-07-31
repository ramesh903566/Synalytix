import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, Star, Users, ArrowUpRight } from 'lucide-react';

export const OpenSourceAnalytics: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-zinc-800/50 rounded-3xl p-6 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5 text-zinc-400" />
        <h2 className="text-lg font-semibold text-zinc-100">Open Source Impact</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
          <Star className="w-4 h-4 text-blue-400 mb-2" />
          <span className="text-2xl font-bold text-zinc-100">4,520</span>
          <span className="text-xs text-zinc-400">Total Stars Earned</span>
        </div>
        <div className="flex flex-col gap-1 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
          <Heart className="w-4 h-4 text-emerald-400 mb-2" />
          <span className="text-2xl font-bold text-zinc-100">12</span>
          <span className="text-xs text-zinc-400">OSS Projects Maintained</span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Top External Contributions</h3>
        <div className="space-y-3">
          {['vercel/next.js', 'facebook/react', 'tailwindlabs/tailwindcss'].map(repo => (
            <div key={repo} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group border border-transparent hover:border-zinc-800">
              <span className="text-sm font-medium text-zinc-300 group-hover:text-blue-400">{repo}</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
