import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, MessageCircle, Share2, Heart, Sparkles } from 'lucide-react';
import { UNIVERSAL_MOCK_DATA, MOCK_APPS } from '../../data/mockData';
import { PlatformType } from '../../types/analytics';

export default function ContentAnalytics() {
  const { platform, accountId, contentId } = useParams<{ platform: string, accountId: string, contentId: string }>();
  const navigate = useNavigate();

  const data = UNIVERSAL_MOCK_DATA[platform as PlatformType];
  const appInfo = MOCK_APPS.find(app => app.id === platform);
  
  if (!data || !appInfo) return null;

  const account = data.accounts.find(a => a.id === accountId);
  if (!account) return null;

  const content = account.content.find(c => c.id === contentId);

  if (!content) {
    return (
      <div className="p-8 text-center text-[#666]">
        Content not found.
        <br />
        <button onClick={() => navigate(`/app/analytics/${platform}/${accountId}`)} className="mt-4 text-black font-bold underline">Go back</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(`/app/analytics/${platform}/${accountId}`)} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" />
        </button>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-1">
            {appInfo.name} • {account.handle} • {content.type}
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">{content.title}</h1>
          <p className="text-[#666] text-xs font-medium mt-1">Published: {content.publishedAt}</p>
        </div>
      </header>

      {/* Level 5: Content Performance */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">Content Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Views', value: content.metrics.views.toLocaleString(), icon: <BarChart2 className="w-4 h-4 text-[#666]" /> },
            { label: 'Likes', value: content.metrics.likes?.toLocaleString() || '0', icon: <Heart className="w-4 h-4 text-[#666]" /> },
            { label: 'Comments', value: content.metrics.comments?.toLocaleString() || '0', icon: <MessageCircle className="w-4 h-4 text-[#666]" /> },
            { label: 'Shares', value: content.metrics.shares?.toLocaleString() || '0', icon: <Share2 className="w-4 h-4 text-[#666]" /> },
          ].map(m => (
            <div key={m.label} className="p-5 rounded-xl border border-[#EFEFEF] bg-white">
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs text-[#666] font-medium">{m.label}</div>
                {m.icon}
              </div>
              <div className="text-xl font-bold text-[#1A1A1A]">{m.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Metrics */}
      <section className="bg-white border border-[#EFEFEF] rounded-2xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-6">Deep Dive Metrics</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[#F5F5F5]">
            <span className="text-sm font-medium text-[#666]">Reach</span>
            <span className="text-sm font-bold text-[#1A1A1A]">{content.metrics.reach?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#F5F5F5]">
            <span className="text-sm font-medium text-[#666]">Saves</span>
            <span className="text-sm font-bold text-[#1A1A1A]">{content.metrics.saves?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm font-medium text-[#666]">Total Engagements</span>
            <span className="text-sm font-bold text-[#1A1A1A]">{content.metrics.engagements.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Content AI Insights (Mocked for single content) */}
      <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
        <h3 className="text-xs font-semibold mb-3 flex items-center gap-2 uppercase tracking-widest text-emerald-900">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Content AI Analysis
        </h3>
        <p className="text-sm text-emerald-800 leading-relaxed font-medium">
          This {content.type.toLowerCase()} performed significantly better than your average post. The format and timing contributed to a high reach efficiency. We recommend creating similar content next week.
        </p>
      </section>

    </motion.div>
  );
}
