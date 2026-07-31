import React from 'react';

interface HeatmapProps {
  data: { day: number; hour: number; value: number }[];
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }).map((_, i) => `${i % 12 === 0 ? 12 : i % 12}${i < 12 ? 'a' : 'p'}`);

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  const getColor = (value: number) => {
    if (value === 0) return 'bg-bg-sunken';
    const intensity = value / maxValue;
    // Map to blue color scale
    if (intensity < 0.2) return 'bg-[#0A66C2]/20';
    if (intensity < 0.4) return 'bg-[#0A66C2]/40';
    if (intensity < 0.6) return 'bg-[#0A66C2]/60';
    if (intensity < 0.8) return 'bg-[#0A66C2]/80';
    return 'bg-[#0A66C2]';
  };

  return (
    <div className="bg-bg-elevated border border-border-light rounded-2xl p-6 overflow-x-auto">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary">Engagement Heatmap</h3>
        <p className="text-sm text-text-muted mt-1">Engagements grouped by publish day and hour</p>
      </div>
      
      <div className="min-w-[700px]">
        {/* Header row (Hours) */}
        <div className="flex mb-2">
          <div className="w-12 shrink-0"></div>
          <div className="flex-1 flex justify-between px-1">
            {hours.map((h, i) => (
              <div key={i} className="text-[10px] text-text-muted w-6 text-center">{i % 3 === 0 ? h : ''}</div>
            ))}
          </div>
        </div>
        
        {/* Grid */}
        <div className="flex flex-col gap-1">
          {days.map((day, dIdx) => (
            <div key={day} className="flex items-center">
              <div className="w-12 shrink-0 text-xs font-bold text-text-secondary">{day}</div>
              <div className="flex-1 flex justify-between gap-1">
                {Array.from({ length: 24 }).map((_, hIdx) => {
                  const cellData = data.find(d => d.day === dIdx && d.hour === hIdx);
                  const val = cellData ? cellData.value : 0;
                  return (
                    <div 
                      key={hIdx} 
                      className={`h-6 flex-1 rounded-sm ${getColor(val)} transition-colors cursor-pointer hover:ring-1 hover:ring-white/50`}
                      title={`${day} ${hours[hIdx]} - ${val} engagements`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-end gap-2 text-[10px] text-text-muted font-bold uppercase tracking-wider">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-sm bg-bg-sunken"></div>
            <div className="w-4 h-4 rounded-sm bg-[#0A66C2]/20"></div>
            <div className="w-4 h-4 rounded-sm bg-[#0A66C2]/40"></div>
            <div className="w-4 h-4 rounded-sm bg-[#0A66C2]/60"></div>
            <div className="w-4 h-4 rounded-sm bg-[#0A66C2]/80"></div>
            <div className="w-4 h-4 rounded-sm bg-[#0A66C2]"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
