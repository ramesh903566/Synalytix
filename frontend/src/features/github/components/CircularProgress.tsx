import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number;
  label: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  label,
  color = '#3B82F6',
  size = 80,
  strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background track */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-800"
          />
          {/* Animated progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="drop-shadow-lg"
            style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
          />
        </svg>
        {/* Value text in center */}
        <div className="absolute text-sm font-bold text-zinc-100 tabular-nums tracking-tight">
          {Math.round(value)}%
        </div>
      </div>
      <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
    </div>
  );
};
