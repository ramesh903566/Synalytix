import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ProfileHeader } from '../components/ProfileHeader';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

// Lazy loaded heavy components
const ContributionHeatmap = React.lazy(() => import('../components/ContributionHeatmap').then(m => ({ default: m.ContributionHeatmap })));
const ActivityOverview = React.lazy(() => import('../components/ActivityOverview').then(m => ({ default: m.ActivityOverview })));
const LanguageAnalytics = React.lazy(() => import('../components/LanguageAnalytics').then(m => ({ default: m.LanguageAnalytics })));
const ContributionTimeline = React.lazy(() => import('../components/ContributionTimeline').then(m => ({ default: m.ContributionTimeline })));
const PinnedRepositories = React.lazy(() => import('../components/PinnedRepositories').then(m => ({ default: m.PinnedRepositories })));
const RepositoryExplorer = React.lazy(() => import('../components/RepositoryExplorer').then(m => ({ default: m.RepositoryExplorer })));
const Achievements = React.lazy(() => import('../components/Achievements').then(m => ({ default: m.Achievements })));
const AIInsightsPanel = React.lazy(() => import('../components/AIInsightsPanel').then(m => ({ default: m.AIInsightsPanel })));
const SkillsDetection = React.lazy(() => import('../components/SkillsDetection').then(m => ({ default: m.SkillsDetection })));
const ProductivityAnalytics = React.lazy(() => import('../components/ProductivityAnalytics').then(m => ({ default: m.ProductivityAnalytics })));
const OpenSourceAnalytics = React.lazy(() => import('../components/OpenSourceAnalytics').then(m => ({ default: m.OpenSourceAnalytics })));
const CollaborationAnalytics = React.lazy(() => import('../components/CollaborationAnalytics').then(m => ({ default: m.CollaborationAnalytics })));
const ComparisonMode = React.lazy(() => import('../components/ComparisonMode').then(m => ({ default: m.ComparisonMode })));

// Skeleton fallback
const SkeletonLoader = ({ height = "h-80" }) => (
  <div className={`w-full ${height} animate-pulse bg-zinc-900/50 rounded-3xl border border-zinc-800/50`} />
);

// We hardcode the mock username for now
const GITHUB_USERNAME = "ramesh903566";

export const GithubAnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30 pb-32 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-zinc-950/60 border-b border-zinc-800/50 supports-[backdrop-filter]:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-zinc-800/50 rounded-xl transition-colors text-zinc-400 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-zinc-900" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <h1 className="font-semibold text-sm tracking-wide text-zinc-100">GitHub Analytics</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl transition-all disabled:opacity-50"
              title="Refresh Data"
            >
              {isRefreshing ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : <RefreshCw className="w-5 h-5" />}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-8 space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Full width header */}
          <ProfileHeader username={GITHUB_USERNAME} />
        </motion.div>

        {/* 12-column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Heatmap spans full width on desktop */}
          <div className="col-span-1 md:col-span-12">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-64" />}>
                <ContributionHeatmap username={GITHUB_USERNAME} />
              </React.Suspense>
            </ErrorBoundary>
          </div>

          {/* Activity and Languages split */}
          <div className="col-span-1 md:col-span-12 lg:col-span-7">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[400px]" />}>
                <ActivityOverview username={GITHUB_USERNAME} />
              </React.Suspense>
            </ErrorBoundary>
          </div>
          <div className="col-span-1 md:col-span-12 lg:col-span-5">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[400px]" />}>
                <LanguageAnalytics username={GITHUB_USERNAME} />
              </React.Suspense>
            </ErrorBoundary>
          </div>

          {/* AI Insights & Achievements */}
          <div className="col-span-1 md:col-span-12 lg:col-span-4">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-full min-h-[300px]" />}>
                <AIInsightsPanel username={GITHUB_USERNAME} />
              </React.Suspense>
            </ErrorBoundary>
          </div>
          <div className="col-span-1 md:col-span-12 lg:col-span-8">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-full min-h-[300px]" />}>
                <Achievements />
              </React.Suspense>
            </ErrorBoundary>
          </div>

          {/* Productivity & Open Source */}
          <div className="col-span-1 md:col-span-12 lg:col-span-8">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[450px]" />}>
                <ProductivityAnalytics />
              </React.Suspense>
            </ErrorBoundary>
          </div>
          <div className="col-span-1 md:col-span-12 lg:col-span-4">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[450px]" />}>
                <OpenSourceAnalytics />
              </React.Suspense>
            </ErrorBoundary>
          </div>

          {/* Repositories full width split */}
          <div className="col-span-1 md:col-span-12 lg:col-span-6">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[600px]" />}>
                <PinnedRepositories username={GITHUB_USERNAME} />
              </React.Suspense>
            </ErrorBoundary>
          </div>
          <div className="col-span-1 md:col-span-12 lg:col-span-6">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[600px]" />}>
                <RepositoryExplorer username={GITHUB_USERNAME} />
              </React.Suspense>
            </ErrorBoundary>
          </div>

          {/* Collaboration, Skills, Comparison */}
          <div className="col-span-1 md:col-span-12 lg:col-span-4">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[450px]" />}>
                <CollaborationAnalytics />
              </React.Suspense>
            </ErrorBoundary>
          </div>
          <div className="col-span-1 md:col-span-12 lg:col-span-4">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[450px]" />}>
                <SkillsDetection />
              </React.Suspense>
            </ErrorBoundary>
          </div>
          <div className="col-span-1 md:col-span-12 lg:col-span-4">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[450px]" />}>
                <ComparisonMode currentUsername={GITHUB_USERNAME} />
              </React.Suspense>
            </ErrorBoundary>
          </div>

          {/* Timeline */}
          <div className="col-span-1 md:col-span-12">
            <ErrorBoundary>
              <React.Suspense fallback={<SkeletonLoader height="h-[700px]" />}>
                <ContributionTimeline username={GITHUB_USERNAME} />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
};
