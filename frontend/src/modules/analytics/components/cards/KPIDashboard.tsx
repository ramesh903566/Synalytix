import React from 'react';
import { KPIMetric } from '../../types';
import { KPICard } from './KPICard';

export const KPIDashboard: React.FC<{ metrics: KPIMetric[] }> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <KPICard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};
