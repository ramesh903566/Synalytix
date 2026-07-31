import React from 'react';
import { motion } from 'motion/react';
import { staggerContainer } from '../animations/variants';
import { useAudienceDemographics } from '../hooks/useXData';

const LazyAudienceCharts = React.lazy(() => import('../components/charts/AudienceCharts'));

export const AudiencePage: React.FC = () => {
  const { data: demographics, isLoading, error } = useAudienceDemographics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">Audience Insights</h2>
      </div>
      
      {isLoading ? (
        <div className="h-96 flex items-center justify-center text-text-muted animate-pulse">Loading audience data...</div>
      ) : error || !demographics ? (
        <div className="h-96 flex items-center justify-center text-red-500">Failed to load audience data.</div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <React.Suspense fallback={<div className="col-span-1 md:col-span-2 h-96 flex items-center justify-center text-text-muted animate-pulse">Loading charts...</div>}>
            <LazyAudienceCharts data={demographics} />
          </React.Suspense>
        </motion.div>
      )}
    </div>
  );
};
