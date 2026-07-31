import { motion } from 'framer-motion';
import { Shield, Star, Trophy } from 'lucide-react';

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function Flame(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

const ACHIEVEMENTS_DATA = [
  { id: 1, title: '100 Day Streak', description: 'Contributed 100 days in a row', icon: <Flame className="w-6 h-6 text-orange-500" />, color: 'from-orange-500/20 to-red-500/5', border: 'border-orange-500/30' },
  { id: 2, title: 'Open Source Hero', description: 'Contributed to 10+ public repos', icon: <Globe className="w-6 h-6 text-blue-500" />, color: 'from-blue-500/20 to-cyan-500/5', border: 'border-blue-500/30' },
  { id: 3, title: '1k Stars Club', description: 'Earned over 1,000 stars total', icon: <Star className="w-6 h-6 text-yellow-500" />, color: 'from-yellow-500/20 to-amber-500/5', border: 'border-yellow-500/30' },
  { id: 4, title: 'Top Reviewer', description: 'Reviewed over 100 PRs', icon: <Shield className="w-6 h-6 text-purple-500" />, color: 'from-purple-500/20 to-pink-500/5', border: 'border-purple-500/30' },
];

export const Achievements: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-zinc-800/50 rounded-3xl p-6 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-zinc-400" />
        <h2 className="text-lg font-semibold text-zinc-100">Achievements</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACHIEVEMENTS_DATA.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden p-5 rounded-2xl border ${achievement.border} bg-gradient-to-br ${achievement.color} group hover:scale-[1.02] transition-transform cursor-default`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <span className="w-24 h-24 opacity-20">{achievement.icon}</span>
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-zinc-950/50 backdrop-blur-md flex items-center justify-center border border-white/5 mb-4 shadow-xl">
                {achievement.icon}
              </div>
              <h3 className="font-bold text-zinc-100 mb-1">{achievement.title}</h3>
              <p className="text-xs text-zinc-400 font-medium">{achievement.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
