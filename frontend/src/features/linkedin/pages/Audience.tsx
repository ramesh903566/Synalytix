import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { AudienceService } from '../services';

export const Audience: React.FC = () => {
  const COLORS = ['#0A66C2', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6B7280'];
  const audienceData = AudienceService.getAudienceData();

  const AudiencePieChart = ({ data, title }: { data: { name: string; value?: number; pct?: number }[], title: string }) => (
    <div className="bg-bg-elevated border border-border-light rounded-2xl p-6 h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-text-primary mb-4">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="pct"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 22, 29, 0.8)', 
                backdropFilter: 'blur(12px)',
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#A1A1AA' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AudiencePieChart data={audienceData.jobTitles} title="Job Titles" />
        <AudiencePieChart data={audienceData.industries} title="Industries" />
        <AudiencePieChart data={audienceData.locations} title="Locations" />
        <AudiencePieChart data={audienceData.seniority} title="Seniority" />
        <AudiencePieChart data={audienceData.companySize} title="Company Size" />
        <AudiencePieChart data={audienceData.companies} title="Companies" />
      </div>
    </div>
  );
};
