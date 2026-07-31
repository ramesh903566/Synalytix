import React, { useState } from 'react';
import { AnalyticsTable } from '../components/AnalyticsTable';
import { AnalyticsDrawer } from '../components/AnalyticsDrawer';
import { LinkedInPost } from '../types/linkedin';
import { PostAnalyticsService } from '../services';

export const ContentAnalytics: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<LinkedInPost | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Article' | 'Carousel' | 'Video' | 'Image' | 'Poll'>('All');
  const posts = PostAnalyticsService.getPosts();

  const filteredPosts = activeTab === 'All' ? posts : posts.filter(p => p.type === activeTab);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Carousel', 'Video', 'Article', 'Image', 'Poll'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-white text-black' 
                : 'bg-bg-sunken text-text-secondary hover:text-text-primary hover:bg-bg-sunken hover:bg-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnalyticsTable data={filteredPosts} onRowClick={setSelectedPost} />

      <AnalyticsDrawer 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
        post={selectedPost} 
      />
    </div>
  );
};
