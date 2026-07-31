import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Layout, Database } from 'lucide-react';

const SKILLS = [
  { domain: 'Frontend', icon: <Layout className="w-4 h-4" />, items: [{ name: 'React', score: 95 }, { name: 'Tailwind CSS', score: 90 }, { name: 'Framer Motion', score: 85 }] },
  { domain: 'Backend', icon: <Server className="w-4 h-4" />, items: [{ name: 'Node.js', score: 88 }, { name: 'Go', score: 75 }, { name: 'Python', score: 70 }] },
  { domain: 'Languages', icon: <Code2 className="w-4 h-4" />, items: [{ name: 'TypeScript', score: 98 }, { name: 'JavaScript', score: 95 }] },
  { domain: 'Data & DB', icon: <Database className="w-4 h-4" />, items: [{ name: 'PostgreSQL', score: 80 }, { name: 'Redis', score: 75 }] },
];

export const SkillsDetection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-6">Inferred Skills</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILLS.map((domain) => (
          <div key={domain.domain} className="space-y-4">
            <div className="flex items-center gap-2 text-text-secondary">
              {domain.icon}
              <h3 className="text-sm font-medium">{domain.domain}</h3>
            </div>
            <div className="space-y-3">
              {domain.items.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">{skill.name}</span>
                    <span className="text-text-muted">{skill.score}% confidence</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
