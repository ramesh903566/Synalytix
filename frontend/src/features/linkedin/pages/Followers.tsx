import React from 'react';
import { ForecastChart } from '../components/ForecastChart';
import { GrowthCard } from '../components/GrowthCard';
import { AudienceService } from '../services';

export const Followers: React.FC = () => {
  const followerForecast = AudienceService.getFollowerForecast();
  const followerGrowthTimeline = AudienceService.getFollowerGrowthTimeline();
  const followersStats = AudienceService.getFollowerStats();

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GrowthCard title="Total Followers" value={followersStats.total.toLocaleString()} growth={followersStats.totalGrowth} description="vs last month" />
        <GrowthCard title="New Followers" value={`+${followersStats.newFollowers}`} growth={followersStats.newFollowersGrowth} description="vs last month" />
        <GrowthCard title="Lost Followers" value={`-${followersStats.lostFollowers}`} growth={followersStats.lostFollowersTrend} description="vs last month (Good)" />
        <GrowthCard title="Follower Velocity" value={`${followersStats.followerVelocity}/day`} growth={followersStats.velocityGrowth} description="Net daily growth" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ForecastChart 
            title="Follower Growth & Forecast"
            subtitle="Historical growth with 7-day AI projection"
            data={[...followerGrowthTimeline, ...followerForecast]}
            height={400}
          />
        </div>
        <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Net Follower Growth</h3>
            <div className="text-5xl font-bold text-white mb-2">+{followersStats.netGrowth}</div>
            <p className="text-sm text-emerald-400 font-bold">+{followersStats.netGrowthRate}% <span className="text-zinc-500 font-normal">vs previous period</span></p>
          </div>
          
          <div className="space-y-4 border-t border-[rgba(255,255,255,0.06)] pt-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Gained</span>
              <span className="text-emerald-400 font-bold">+{followersStats.newFollowers}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Lost</span>
              <span className="text-red-400 font-bold">-{followersStats.lostFollowers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
