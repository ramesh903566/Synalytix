import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { APP_REGISTRY } from '../../lib/appRegistry';

export default function ContentAnalytics() {
  const { platform, accountId, contentId } = useParams<{ platform: string, accountId: string, contentId: string }>();
  const navigate = useNavigate();

  const appInfo = APP_REGISTRY.find(app => app.id === platform);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8 pb-12">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(`/app/analytics/${platform}/${accountId}`)} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-text-primary" />
        </button>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
            {appInfo?.name || platform} • Content Detail
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Content #{contentId}</h1>
        </div>
      </header>

      <div className="bg-bg-elevated border border-border rounded-2xl p-8 text-center text-sm text-text-muted">
        Detailed content analytics will be available once content data is synced from {appInfo?.name || 'the platform'}.
      </div>
    </motion.div>
  );
}
