import { ArrowUpRight, Users, MessageSquare, Eye, TrendingUp, Activity, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_APPS, MOCK_POSTS, IG_OVERVIEW, IG_AUDIENCE } from '../data/mockData';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { connectedApps, scheduledPosts, savedDrafts, plannerTasks } = useAppContext();
  const navigate = useNavigate();

  const pendingTasks = plannerTasks.filter(t => t.status !== 'done').length;
  const doneTasks = plannerTasks.filter(t => t.status === 'done').length;

  const overviewStats = [
    { label: 'Total Views (30d)', value: IG_OVERVIEW.allContent.views.toLocaleString(), change: '+12.4%', icon: Eye, up: true },
    { label: 'Net New Followers', value: `+${IG_OVERVIEW.allContent.netFollowers}`, change: '+4.1% since Apr 23', icon: Users, up: true },
    { label: 'Total Interactions', value: IG_OVERVIEW.allContent.interactions.toLocaleString(), change: 'Reels + Stories + Posts', icon: Activity, up: true },
    { label: 'Accounts Reached', value: IG_OVERVIEW.allContent.accountsReached.toLocaleString(), change: '42.4% followers', icon: TrendingUp, up: true },
  ];

  const studioStats = [
    { label: 'Scheduled Posts', value: scheduledPosts.length.toString(), sub: 'Ready to publish', color: 'bg-blue-50 text-blue-700' },
    { label: 'Saved Drafts', value: savedDrafts.length.toString(), sub: 'In progress', color: 'bg-amber-50 text-amber-700' },
    { label: 'Planner Tasks', value: pendingTasks.toString(), sub: `${doneTasks} completed`, color: 'bg-purple-50 text-purple-700' },
  ];

  const topContent = MOCK_POSTS.slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-10">
      
      {/* Header */}
      <header>
        <h1 className="text-xl font-semibold tracking-tight mb-1 text-[#1A1A1A]">Dashboard Overview</h1>
        <p className="text-[#666] text-sm font-light">Your complete Synalytix summary — platforms, content & productivity.</p>
      </header>

      {/* KPI — Platform Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Platform Performance · Last 30 Days</h2>
          <button onClick={() => navigate('/app/analytics')} className="text-[10px] font-bold text-black uppercase tracking-widest hover:underline">View Full Analytics →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat, i) => (
            <div key={i} className="bg-white border border-[#EFEFEF] p-5 rounded-2xl flex flex-col justify-between h-36 hover:border-neutral-300 transition-all">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-[#1A1A1A]" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{stat.change}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
                <p className="text-[10px] text-[#999] mt-0.5 font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Views Chart + Audience */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border border-[#EFEFEF] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A]">Views Over Time</h3>
            <span className="text-[10px] text-[#999] font-medium">Apr 23 – May 22</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={IG_OVERVIEW.viewsHistory}>
                <defs>
                  <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} dy={8} interval={2} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 9 }} dx={-8} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #EFEFEF', fontSize: '12px' }} cursor={{ stroke: '#F0F0F0', strokeWidth: 2 }} formatter={(v: any) => [v.toLocaleString(), 'Views']} />
                <Area type="monotone" dataKey="val" stroke="#1A1A1A" strokeWidth={2.5} fill="url(#viewGrad)" dot={false} activeDot={{ r: 5, fill: '#1A1A1A' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6 flex flex-col">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-5">Audience Split</h3>
          <div className="flex flex-col gap-4 flex-1">
            <div>
              <div className="flex justify-between text-xs text-[#666] mb-1.5 font-medium">
                <span>Followers</span><span className="font-bold text-[#1A1A1A]">{IG_OVERVIEW.allContent.followers_pct}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="bg-black h-full rounded-full" style={{ width: `${IG_OVERVIEW.allContent.followers_pct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#666] mb-1.5 font-medium">
                <span>Non-followers</span><span className="font-bold text-[#1A1A1A]">{IG_OVERVIEW.allContent.nonfollowers_pct}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="bg-neutral-400 h-full rounded-full" style={{ width: `${IG_OVERVIEW.allContent.nonfollowers_pct}%` }} />
              </div>
            </div>
            <div className="border-t border-[#F5F5F5] pt-4 mt-auto">
              <div className="flex justify-between text-xs text-[#666] mb-2 font-medium"><span>Men</span><span className="font-bold text-[#1A1A1A]">{IG_AUDIENCE.gender.men}%</span></div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full rounded-full" style={{ width: `${IG_AUDIENCE.gender.men}%` }} />
              </div>
              <div className="flex justify-between text-xs text-[#666] mt-3 mb-1.5 font-medium"><span>Women</span><span className="font-bold text-[#1A1A1A]">{IG_AUDIENCE.gender.women}%</span></div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: `${IG_AUDIENCE.gender.women}%` }} />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1A1A1A]">{IG_AUDIENCE.followers}</div>
              <div className="text-[10px] text-[#999] uppercase tracking-widest font-medium">Total Followers</div>
              <div className="text-[10px] text-green-600 font-bold mt-1">+{IG_AUDIENCE.followerGrowth}% since Apr 23</div>
            </div>
          </div>
        </div>
      </div>

      {/* Studio + Planner Stats */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Studio & Planner Status</h2>
          <button onClick={() => navigate('/app/studio')} className="text-[10px] font-bold text-black uppercase tracking-widest hover:underline">Open Studio →</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {studioStats.map((s, i) => (
            <div key={i} className="bg-white border border-[#EFEFEF] rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${s.color}`}>
                {i === 0 ? '📅' : i === 1 ? '📝' : '✅'}
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">{s.value}</div>
                <div className="text-[10px] text-[#999] font-semibold uppercase tracking-widest">{s.label}</div>
                <div className="text-[10px] text-[#666] mt-0.5">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interaction Breakdown */}
      <section>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-4">Interactions by Content Type</h2>
        <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A1A] mb-4 uppercase tracking-widest">Views by Content</h4>
              {[
                { label: 'Reels', value: 36000, color: 'bg-black' },
                { label: 'Stories', value: 13000, color: 'bg-neutral-600' },
                { label: 'Posts', value: 3800, color: 'bg-neutral-400' },
                { label: 'Live Videos', value: 0, color: 'bg-neutral-200' },
              ].map(item => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs text-[#666] mb-1">
                    <span>{item.label}</span>
                    <span className="font-semibold text-[#1A1A1A]">{item.value >= 1000 ? `${(item.value/1000).toFixed(0)}K` : item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${(item.value / 36000) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A1A] mb-4 uppercase tracking-widest">Interactions by Content</h4>
              {[
                { label: 'Reels', value: 2500, color: 'bg-pink-500' },
                { label: 'Stories', value: 639, color: 'bg-pink-300' },
                { label: 'Posts', value: 200, color: 'bg-pink-200' },
                { label: 'Live Videos', value: 0, color: 'bg-neutral-100' },
              ].map(item => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs text-[#666] mb-1">
                    <span>{item.label}</span>
                    <span className="font-semibold text-[#1A1A1A]">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${(item.value / 2500) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#F5F5F5] mt-6 pt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-[#1A1A1A]">{IG_OVERVIEW.allContent.profileVisits.toLocaleString()}</div>
              <div className="text-[10px] text-[#999] uppercase tracking-widest font-medium mt-1">Profile Visits</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#1A1A1A]">{IG_OVERVIEW.allContent.bioLinkTaps}</div>
              <div className="text-[10px] text-[#999] uppercase tracking-widest font-medium mt-1">Bio Link Taps</div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#1A1A1A]">{IG_OVERVIEW.allContent.businessAddressTaps}</div>
              <div className="text-[10px] text-[#999] uppercase tracking-widest font-medium mt-1">Business Taps</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold text-[#1A1A1A] flex items-center gap-2 uppercase tracking-widest">Recent Posts Performance</h2>
            <button onClick={() => navigate('/app/analytics')} className="text-[10px] font-bold text-black uppercase tracking-widest hover:underline">See All</button>
          </div>
          <div className="bg-white rounded-2xl border border-[#EFEFEF] overflow-hidden">
            <div className="divide-y divide-[#F5F5F5]">
              {topContent.map(post => (
                <div key={post.id} className="p-5 hover:bg-neutral-50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-[#1A1A1A] group-hover:text-black line-clamp-1 flex-1 pr-4">{post.content}</div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-100 flex-shrink-0 shadow-sm">
                      <img src={MOCK_APPS.find(a => a.id === post.app)?.iconUrl} alt={post.app} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex gap-5 text-xs text-[#666] font-light">
                    {post.views ? <span className="flex items-center gap-1.5"><Eye className="w-3 h-3" /> {post.views >= 1000 ? `${(post.views/1000).toFixed(1)}K` : post.views} views</span> : null}
                    <span className="flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3" /> {post.likes >= 1000 ? `${(post.likes/1000).toFixed(1)}K` : post.likes} Likes</span>
                    <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> {post.comments} Comments</span>
                    <span className="text-neutral-300">•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold text-[#1A1A1A] flex items-center gap-2 uppercase tracking-widest">Network Health</h2>
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6 space-y-3 flex-1">
            {connectedApps.length === 0 ? (
              <div className="text-xs text-[#666] text-center py-8">No apps connected.</div>
            ) : (
              connectedApps.map(app => {
                const appInfo = MOCK_APPS.find(a => a.id === app);
                return (
                  <div key={app} className="flex items-center justify-between py-4 px-5 rounded-xl border border-neutral-100 bg-neutral-50 text-xs">
                    <div className="flex items-center gap-4">
                      <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-8 h-8 object-cover rounded-full" />
                      <span className="font-semibold uppercase tracking-wider text-[#1A1A1A]">{appInfo?.name}</span>
                    </div>
                    <span className="text-green-700 bg-green-100/50 px-2.5 py-1 rounded border border-green-200/50 font-bold uppercase text-[9px]">Active</span>
                  </div>
                );
              })
            )}
            <button onClick={() => navigate('/app/apps')} className="w-full py-3 mt-2 text-[10px] font-bold text-neutral-400 hover:text-black border border-neutral-200 rounded-lg transition-all">
              MANAGE CONNECTIONS
            </button>
          </div>

          {/* Age breakdown quick */}
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-4">Top Age Group</h3>
            {IG_AUDIENCE.age.slice(0, 4).map(a => (
              <div key={a.range} className="mb-2.5">
                <div className="flex justify-between text-xs text-[#666] mb-1">
                  <span>{a.range}</span><span className="font-bold text-[#1A1A1A]">{a.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="bg-black h-full rounded-full" style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Planner Quick View */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Upcoming Planner Tasks</h2>
          <button onClick={() => navigate('/app/planner')} className="text-[10px] font-bold text-black uppercase tracking-widest hover:underline">Open Planner →</button>
        </div>
        <div className="bg-white rounded-2xl border border-[#EFEFEF] overflow-hidden">
          {plannerTasks.filter(t => t.status !== 'done').slice(0, 4).map((task, i, arr) => (
            <div key={task.id} className={`flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors ${i < arr.length - 1 ? 'border-b border-[#F5F5F5]' : ''}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'}`} />
              <span className="flex-1 text-sm text-[#1A1A1A] font-medium">{task.title}</span>
              <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${
                task.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                task.status === 'todo' ? 'bg-amber-50 text-amber-600' :
                'bg-neutral-100 text-neutral-500'
              }`}>{task.status}</span>
              {task.scheduledDate && <span className="text-[10px] text-[#999]">{task.scheduledDate}</span>}
            </div>
          ))}
          {plannerTasks.filter(t => t.status !== 'done').length === 0 && (
            <div className="p-8 text-center text-xs text-[#999]">All caught up! No pending tasks.</div>
          )}
        </div>
      </section>

      {/* AI Insight Banner */}
      <div className="bg-neutral-900 rounded-2xl p-6 flex items-start gap-5">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">AI Recommendation</div>
          <p className="text-white text-sm leading-relaxed">
            Your <strong className="text-white">NAM HORI 🐮</strong> reel hit <strong className="text-white">16.9K views</strong> — your best performing content in 30 days.
            73.8% of your audience is <strong className="text-white">18–24 age group</strong>. Post a similar outdoor/lifestyle reel this 
            <strong className="text-white"> Thursday between 6–9 PM IST</strong> (your peak follower active window) to maximize reach.
          </p>
        </div>
        <button onClick={() => navigate('/app/analytics')} className="text-[10px] font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap">View Insights →</button>
      </div>

    </motion.div>
  );
}
