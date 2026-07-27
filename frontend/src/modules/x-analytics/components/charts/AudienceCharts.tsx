import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartCard } from './ChartCard';
export default function AudienceCharts({ data }: { data: any }) {
  const aiBadge = (
    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
      🤖 AI Estimated
    </span>
  );

  return (
    <>
      <ChartCard title="Age Distribution" action={aiBadge} className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.age} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} width={60} />
            <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      
      <ChartCard title="Gender" action={aiBadge} className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.gender}>
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
              {data.gender.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#a855f7' : '#71717a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top Countries" action={aiBadge} className="h-[350px] md:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.countries} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}
