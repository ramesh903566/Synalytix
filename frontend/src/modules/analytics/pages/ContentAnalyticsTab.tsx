import React, { useState } from 'react';
import { useAnalytics } from '../core/AnalyticsContext';
import { LayoutGrid, List, AlignJustify } from 'lucide-react';

type ViewType = 'list' | 'grid' | 'compact';

export const ContentAnalyticsTab: React.FC = () => {
  const { data, setSelectedContentItem } = useAnalytics();
  const [sortMetric, setSortMetric] = useState<'reach' | 'impressions' | 'engagement'>('reach');
  const [viewType, setViewType] = useState<ViewType>('list');

  if (!data?.selectedAccountContent) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Content Performance</h2>
          <p className="text-sm text-text-muted">Analyze your individual posts, videos, and stories.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 bg-bg-elevated p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewType('list')}
              className={`p-1.5 rounded-md transition-colors ${viewType === 'list' ? 'bg-bg-canvas text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewType === 'grid' ? 'bg-bg-canvas text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType('compact')}
              className={`p-1.5 rounded-md transition-colors ${viewType === 'compact' ? 'bg-bg-canvas text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              title="Compact View"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            {(['reach', 'impressions', 'engagement'] as const).map(s => (
              <button 
                key={s} 
                onClick={() => setSortMetric(s)} 
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all capitalize
                  ${sortMetric === s ? 'bg-black text-white border-black' : 'bg-bg-elevated text-text-muted border-border hover:border-border-strong'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={
        viewType === 'list' ? 'divide-y divide-border' :
        viewType === 'compact' ? 'divide-y divide-border' :
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
      }>
        {data.selectedAccountContent.map(post => {
          // Calculate an engagement approximation to sort on
          const engagementVal = post.likes + post.comments + post.shares + post.saves;
          const displayVal = sortMetric === 'reach' ? post.reach 
                           : sortMetric === 'impressions' ? post.impressions 
                           : engagementVal;

          const formattedDate = new Date(post.publishDate).toLocaleDateString();

          if (viewType === 'grid') {
            return (
              <div 
                key={post.id} 
                onClick={() => setSelectedContentItem(post)} 
                className="flex flex-col gap-3 p-4 bg-bg-elevated border border-border hover:border-border-strong cursor-pointer rounded-2xl transition-all hover:shadow-sm"
              >
                <div className="w-full aspect-square rounded-xl bg-bg-canvas flex items-center justify-center text-4xl border border-border overflow-hidden">
                  {post.thumbnailUrl ? (
                    <img src={post.thumbnailUrl} alt={post.caption} className="w-full h-full object-cover" />
                  ) : (
                    '📄'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{post.caption || `${post.type} post`}</div>
                  <div className="flex gap-3 mt-1 text-xs text-text-secondary">
                    <span>{formattedDate}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1 pt-3 border-t border-border-light">
                  <div className="flex gap-2 text-xs text-text-secondary">
                    {post.likes > 0 && <span>❤️ {post.likes >= 1000 ? `${(post.likes/1000).toFixed(1)}K` : post.likes}</span>}
                    {post.comments > 0 && <span>💬 {post.comments}</span>}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">
                      {displayVal >= 1000 ? `${(displayVal/1000).toFixed(1)}K` : displayVal}
                    </div>
                    <div className="text-[10px] text-text-secondary capitalize">{sortMetric}</div>
                  </div>
                </div>
              </div>
            );
          }

          if (viewType === 'compact') {
            return (
              <div 
                key={post.id} 
                onClick={() => setSelectedContentItem(post)} 
                className="flex items-center gap-3 py-2 hover:bg-bg-sunken cursor-pointer rounded-lg px-2 transition-colors"
              >
                <div className="w-8 h-8 rounded-md bg-bg-canvas flex items-center justify-center text-lg flex-shrink-0 border border-border overflow-hidden">
                  {post.thumbnailUrl ? (
                    <img src={post.thumbnailUrl} alt={post.caption} className="w-full h-full object-cover" />
                  ) : (
                    '📄'
                  )}
                </div>
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="text-xs font-medium text-text-primary truncate max-w-[200px]">{post.caption || `${post.type} post`}</div>
                    <div className="text-[10px] text-text-secondary">{formattedDate}</div>
                  </div>
                  <div className="flex gap-3 text-[10px] text-text-secondary">
                    {post.likes > 0 && <span>❤️ {post.likes >= 1000 ? `${(post.likes/1000).toFixed(1)}K` : post.likes}</span>}
                    {post.comments > 0 && <span>💬 {post.comments >= 1000 ? `${(post.comments/1000).toFixed(1)}K` : post.comments}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 w-16">
                  <div className="text-sm font-bold">
                    {displayVal >= 1000 ? `${(displayVal/1000).toFixed(1)}K` : displayVal}
                  </div>
                </div>
              </div>
            );
          }

          // Default list view
          return (
            <div 
              key={post.id} 
              onClick={() => setSelectedContentItem(post)} 
              className="flex items-center gap-4 py-4 hover:bg-bg-sunken cursor-pointer rounded-xl px-2 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-bg-canvas flex items-center justify-center text-2xl flex-shrink-0 border border-border overflow-hidden">
                {post.thumbnailUrl ? (
                  <img src={post.thumbnailUrl} alt={post.caption} className="w-full h-full object-cover" />
                ) : (
                  '📄'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">{post.caption || `${post.type} post`}</div>
                <div className="flex gap-3 mt-1 text-xs text-text-secondary">
                  <span>{formattedDate}</span>
                  {post.likes > 0 && <span>❤️ {post.likes.toLocaleString()}</span>}
                  {post.comments > 0 && <span>💬 {post.comments.toLocaleString()}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold">
                  {displayVal >= 1000 ? `${(displayVal/1000).toFixed(1)}K` : displayVal}
                </div>
                <div className="text-[10px] text-text-secondary capitalize">{sortMetric}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
