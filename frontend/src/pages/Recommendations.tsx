import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useRecommendations, useGenerateRecommendations, useCompleteRecommendation, useDismissRecommendation } from '../hooks/useRecommendations';
import { useRecommendationsStore } from '../store/recommendationsStore';
import type { Recommendation } from '../types/recommendations';

import ScoreOverview from '../components/recommendations/ScoreOverview';
import FilterBar from '../components/recommendations/FilterBar';
import GenerateButton from '../components/recommendations/GenerateButton';
import RecommendationList from '../components/recommendations/RecommendationList';
import WeeklyPlanPanel from '../components/recommendations/WeeklyPlanPanel';
import CareerGapPanel from '../components/recommendations/CareerGapPanel';
import MonthlyRoadmapPanel from '../components/recommendations/MonthlyRoadmapPanel';
import OpportunityAlerts from '../components/recommendations/OpportunityAlerts';
import ProgressTracker from '../components/recommendations/ProgressTracker';
import ExplainabilityDrawer from '../components/recommendations/ExplainabilityDrawer';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/skeleton';

export default function Recommendations() {
  const { connectedApps, refreshConnections } = useAppContext();
  const navigate = useNavigate();

  const { data: recData, isLoading, refetch } = useRecommendations();
  const { mutate: generate, isPending: isGenerating } = useGenerateRecommendations();
  const { mutate: markComplete } = useCompleteRecommendation();
  const { mutate: dismiss } = useDismissRecommendation();

  const { filters, setFilters, selectedRecommendationId, setSelectedRecommendationId } = useRecommendationsStore();

  const handleGenerate = () => {
    const focusCategory = filters.category !== 'ALL' ? filters.category : undefined;
    generate({ forceRefresh: true, focusCategory }, {
      onSuccess: () => toast.success("Recommendations updated!"),
      onError: (err) => toast.error(err.message),
    });
  };

  const showEmptyState = !isLoading && !isGenerating && (!recData || !recData.recommendations || recData.recommendations.length === 0);
  const hasConnections = connectedApps.length > 0;

  const recommendations = recData?.recommendations || [];
  const selectedRecommendation = recommendations.find(r => r.id === selectedRecommendationId) || null;

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand" />
            AI Recommendations
          </h1>
          <p className="text-text-muted text-sm">Your personalised, prioritised career intelligence feed.</p>
        </div>
        <GenerateButton 
          isGenerating={isGenerating} 
          lastGeneratedAt={recData?.scores?.computedAt || null} 
          onGenerate={handleGenerate} 
        />
      </div>

      <OpportunityAlerts alerts={recData?.opportunityAlerts || []} />

      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-[var(--radius-card)]" />)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7 space-y-4">
              <Skeleton className="h-12 rounded-[var(--radius-input)] w-full mb-6" />
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-[var(--radius-card)]" />)}
            </div>
            <div className="xl:col-span-5 space-y-6">
              <Skeleton className="h-64 rounded-[var(--radius-card)]" />
              <Skeleton className="h-48 rounded-[var(--radius-card)]" />
            </div>
          </div>
        </div>
      ) : showEmptyState ? (
        <div className="flex flex-col items-center justify-center py-20 bg-bg-elevated border border-border rounded-[var(--radius-card)] shadow-level-1">
          <div className="w-16 h-16 bg-brand-light rounded-[var(--radius-badge)] flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-brand" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            {hasConnections ? "Ready to generate insights!" : "Connect your platforms to get started"}
          </h2>
          <p className="text-text-muted max-w-md text-center mb-8">
            {hasConnections 
              ? "We've detected your connected platforms. Generate your first personalized career recommendations now."
              : "Synalytix analyses your GitHub, LinkedIn, LeetCode and more to generate personalised career recommendations."}
          </p>
          {hasConnections ? (
            <button 
              onClick={handleGenerate}
              className="px-6 py-3 bg-brand hover:bg-brand-hover text-text-inverse rounded-[var(--radius-button)] font-medium transition-colors shadow-level-1"
            >
              Generate Recommendations
            </button>
          ) : (
            <button 
              onClick={() => navigate('/app/apps')}
              className="px-6 py-3 bg-brand hover:bg-brand-hover text-text-inverse rounded-[var(--radius-button)] font-medium transition-colors shadow-level-1"
            >
              Connect Platforms
            </button>
          )}
        </div>
      ) : (
        <>
          <ScoreOverview scores={recData?.scores || { career: 0, employability: 0, branding: 0, technical: 0, computedAt: "" }} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column (List) - 60% approx */}
            <div className="xl:col-span-7 space-y-6">
              <FilterBar filters={filters} onFilterChange={setFilters} />
              <RecommendationList 
                recommendations={recommendations} 
                filters={filters} 
                onComplete={markComplete} 
                onDismiss={dismiss} 
                onExplain={(rec) => setSelectedRecommendationId(rec.id)} 
              />
            </div>

            {/* Right Column (Panels) - 40% approx */}
            <div className="xl:col-span-5 space-y-6">
              <ProgressTracker 
                completedCount={recommendations.filter(r => r.completedAt).length} 
                totalCount={recommendations.length}
                growthImpact={recData?.scoreDelta ? (recData.scoreDelta.career + recData.scoreDelta.employability + recData.scoreDelta.branding + recData.scoreDelta.technical) / 4 : 0}
              />
              <WeeklyPlanPanel weeklyPlan={recData?.weeklyPlan || []} />
              <CareerGapPanel gaps={recData?.gaps || { skills: [], assets: [], activities: [] }} />
              <MonthlyRoadmapPanel roadmap={recData?.monthlyRoadmap || []} />
            </div>
          </div>
        </>
      )}

      <ExplainabilityDrawer recommendation={selectedRecommendation} onClose={() => setSelectedRecommendationId(null)} />
    </div>
  );
}
