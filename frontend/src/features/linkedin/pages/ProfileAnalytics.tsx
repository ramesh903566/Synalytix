import React from 'react';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { Search, UserCheck, Briefcase } from 'lucide-react';
import { ProfileService } from '../services';

export const ProfileAnalytics: React.FC = () => {
  const profileAnalytics = ProfileService.getProfileAnalytics();

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1A222C] flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="font-bold text-white">Profile Views</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{profileAnalytics.profileViews.toLocaleString()}</div>
          <p className="text-sm text-emerald-400 font-bold">+{profileAnalytics.profileViewsGrowth}% <span className="text-zinc-500 font-normal">vs last month</span></p>
        </div>
        
        <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1A222C] flex items-center justify-center">
              <Search className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="font-bold text-white">Search Appearances</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{profileAnalytics.searchAppearances.toLocaleString()}</div>
          <p className="text-sm text-red-400 font-bold">{profileAnalytics.searchAppearancesGrowth}% <span className="text-zinc-500 font-normal">vs last month</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart 
          title="Profile Views Trend"
          data={profileAnalytics.profileViewsTrend}
          dataKey="value"
          color="#0A66C2"
          gradientId="profileGrad"
        />
        <AnalyticsChart 
          title="Search Appearances Trend"
          data={profileAnalytics.searchAppearancesTrend}
          dataKey="value"
          color="#8B5CF6"
          gradientId="searchGrad"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Top Searchers by Company</h3>
          <div className="space-y-4">
            {profileAnalytics.searcherCompanies.map((company) => (
              <div key={company.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-300 text-sm font-medium">{company.name}</span>
                </div>
                <span className="text-white font-bold">{company.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Top Searchers by Role</h3>
          <div className="space-y-4">
            {profileAnalytics.searcherRoles.map((role) => (
              <div key={role.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-300 text-sm font-medium">{role.name}</span>
                </div>
                <span className="text-white font-bold">{role.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
