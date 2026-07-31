import { X, Github, Linkedin, Code2, Twitter, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recommendation } from '../../types/recommendations';

interface ExplainabilityDrawerProps {
  recommendation: Recommendation | null;
  onClose: () => void;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  leetcode: <Code2 className="w-4 h-4" />,
  x: <Twitter className="w-4 h-4" />,
};

export default function ExplainabilityDrawer({ recommendation, onClose }: ExplainabilityDrawerProps) {
  const rec = recommendation;

  return (
    <AnimatePresence>
      {rec && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-[#EFEFEF] shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#EFEFEF] p-5 flex items-center justify-between z-10">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Recommendation Details</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">{rec.title}</h3>
                <p className="text-xs text-[#666] leading-relaxed">{rec.description}</p>
              </div>

              {/* Why am I seeing this? */}
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2">
                  Why am I seeing this?
                </h4>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <p className="text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">{rec.reasoning}</p>
                </div>
              </section>

              {/* What data caused this? */}
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2">
                  What data caused this?
                </h4>
                <div className="flex flex-wrap gap-2">
                  {rec.dataSources.map(source => (
                    <div
                      key={source}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-[#1A1A1A]"
                    >
                      {PLATFORM_ICONS[source.toLowerCase()] || <BarChart3 className="w-3.5 h-3.5" />}
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </div>
                  ))}
                </div>
              </section>

              {/* What happens if I do it? */}
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2">
                  What happens if I do it?
                </h4>
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs text-emerald-800 leading-relaxed">{rec.expectedOutcome}</p>
                </div>
              </section>

              {/* Expected impact */}
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-2">
                  Expected Impact
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.impactScore}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: rec.impactScore >= 80 ? '#10b981' : rec.impactScore >= 50 ? '#f59e0b' : '#f43f5e',
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[#1A1A1A]">{rec.impactScore}/100</span>
                </div>
              </section>

              {/* Full action steps */}
              <section>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-3">
                  Action Steps
                </h4>
                <ol className="space-y-2.5">
                  {rec.actionSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs text-[#1A1A1A] leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Meta info */}
              <div className="border-t border-[#EFEFEF] pt-4 flex items-center gap-4 text-[10px] text-[#999]">
                <span>Confidence: {rec.confidenceLevel.toUpperCase()}</span>
                <span>•</span>
                <span>Difficulty: {rec.difficulty}</span>
                <span>•</span>
                <span>Est. {rec.estimatedTime.value} {rec.estimatedTime.unit}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
