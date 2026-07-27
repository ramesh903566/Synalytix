import React from 'react';

interface PremiumScoreCardProps {
  title: string;
  score: number;
  description: string;
  trend?: number;
}

export const PremiumScoreCard: React.FC<PremiumScoreCardProps> = ({
  title,
  score,
  description,
  trend
}) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#10B981'; // emerald
  let gradientId = 'score-emerald';
  
  if (score < 50) {
    color = '#EF4444'; // red
    gradientId = 'score-red';
  } else if (score < 80) {
    color = '#F59E0B'; // amber
    gradientId = 'score-amber';
  }

  return (
    <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute -top-1/2 -right-1/4 w-full h-full opacity-[0.03] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.06]"
        style={{ backgroundColor: color }}
      />
      
      <div className="max-w-[60%] z-10">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 mb-4">{description}</p>
        
        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">vs last 30d</span>
          </div>
        )}
      </div>

      <div className="relative z-10 w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.5" />
            </linearGradient>
            <filter id={`glow-${gradientId}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle
            className="text-[#1A222C]"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
          <circle
            className="transition-all duration-1000 ease-out"
            strokeWidth="12"
            stroke={`url(#${gradientId})`}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              filter: `url(#glow-${gradientId})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Score</span>
        </div>
      </div>
    </div>
  );
};
