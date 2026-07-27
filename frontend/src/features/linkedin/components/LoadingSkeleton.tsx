import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 h-36">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1A222C]" />
              <div className="w-16 h-6 rounded-md bg-[#1A222C]" />
            </div>
            <div className="w-24 h-8 rounded bg-[#1A222C] mb-2" />
            <div className="w-16 h-4 rounded bg-[#1A222C]" />
          </div>
        ))}
      </div>
      
      {/* Chart Area */}
      <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 h-[400px]">
        <div className="w-48 h-6 rounded bg-[#1A222C] mb-2" />
        <div className="w-32 h-4 rounded bg-[#1A222C] mb-8" />
        <div className="w-full h-[280px] rounded bg-[#1A222C]" />
      </div>
    </div>
  );
};
