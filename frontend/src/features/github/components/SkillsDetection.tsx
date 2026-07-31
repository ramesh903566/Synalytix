import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Layout, Database, Sparkles } from 'lucide-react';

const SKILLS = [
  { domain: 'Frontend', icon: <Layout className="w-4 h-4" />, color: 'bg-blue-500', shadow: 'shadow-blue-500/50', items: [{ name: 'React', score: 95 }, { name: 'Tailwind CSS', score: 90 }, { name: 'Framer Motion', score: 85 }] },
  { domain: 'Backend', icon: <Server className="w-4 h-4" />, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50', items: [{ name: 'Node.js', score: 88 }, { name: 'Go', score: 75 }, { name: 'Python', score: 70 }] },
  { domain: 'Languages', icon: <Code2 className="w-4 h-4" />, color: 'bg-purple-500', shadow: 'shadow-purple-500/50', items: [{ name: 'TypeScript', score: 98 }, { name: 'JavaScript', score: 95 }] },
  { domain: 'Data & DB', icon: <Database className="w-4 h-4" />, color: 'bg-orange-500', shadow: 'shadow-orange-500/50', items: [{ name: 'PostgreSQL', score: 80 }, { name: 'Redis', score: 75 }] },
];

export const SkillsDetection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">AI-Inferred Skills</h2>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
          Based on recent commits
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
        {SKILLS.map((domain, domainIdx) => (
          <div key={domain.domain} className="space-y-5">
            <div className="flex items-center gap-3 text-zinc-300">
              <div className={`p-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400`}>
                {domain.icon}
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">{domain.domain}</h3>
            </div>
            
            <div className="space-y-4">
              {domain.items.map((skill, i) => (
                <motion.div 
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (domainIdx * 0.1) + (i * 0.1) }}
                  className="group"
                >
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors">{skill.name}</span>
                    <span className="text-xs font-semibold text-zinc-500">{skill.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, delay: 0.2 + (domainIdx * 0.1) + (i * 0.1), ease: "easeOut" }}
                      className={`h-full ${domain.color} rounded-full shadow-lg ${domain.shadow} relative`}
                    >
                      {/* Inner shine */}
                      <div className="absolute inset-0 bg-white/20 w-1/3 skew-x-12 animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
