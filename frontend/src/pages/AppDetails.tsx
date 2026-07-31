import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { MOCK_APPS, MOCK_ACCOUNTS, IG_OVERVIEW, IG_AUDIENCE, IG_CONTENT_POSTS } from '../data/mockData';
import { connectLeetCode, connectPlatform, getGitHubData, getLeetCodeData } from '../lib/api';
import { ArrowLeft, Plus, Heart, MessageCircle, Send, Bookmark, X, Eye, Activity, Info, ChevronDown, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { XAnalyticsModule } from '../modules/x-analytics/XAnalyticsModule';
import { LinkedInAnalyticsDashboard } from '../features/linkedin/pages/LinkedInAnalyticsDashboard';

type ContentSort = 'Views' | 'Accounts reached' | 'Follows' | 'Likes' | 'Comments' | 'Reposts' | 'Shares' | 'Saves';
type InsightsTab = 'overview' | 'content' | 'audience';

const contentSorts: ContentSort[] = ['Views','Accounts reached','Follows','Likes','Comments','Reposts','Shares','Saves'];
const SORT_KEYS: Record<ContentSort, keyof typeof IG_CONTENT_POSTS[0]> = {
  'Views': 'views','Accounts reached': 'accountsReached','Follows': 'follows',
  'Likes': 'likes','Comments': 'comments','Reposts': 'reposts','Shares': 'shares','Saves': 'saves',
};
const BACKEND_APPS = new Set(['github', 'instagram', 'x', 'linkedin', 'leetcode']);
const OAUTH_APPS = new Set(['github', 'instagram', 'x', 'linkedin']);

export default function AppDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { connectedApps, refreshConnections } = useAppContext();

  const appInfo = MOCK_APPS.find(a => a.id === id);
  const isConnected = connectedApps.includes(id as any);
  const isConnectionCallback = new URLSearchParams(location.search).get('connected') === 'true';
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [igTab, setIgTab] = useState<InsightsTab>('overview');
  const [contentSort, setContentSort] = useState<ContentSort>('Views');
  const [audienceSegment, setAudienceSegment] = useState<'overall'|'follows'|'unfollows'>('overall');
  const [activeDay, setActiveDay] = useState('Su');
  const [locationView, setLocationView] = useState<'Countries'|'Towns/cities'>('Countries');
  const [isRefreshingConnection, setIsRefreshingConnection] = useState(isConnectionCallback);
  
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  const [githubData, setGithubData] = useState<any>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [leetcodeData, setLeetcodeData] = useState<any>(null);
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const [leetcodeError, setLeetcodeError] = useState('');

  useEffect(() => {
    if (!isConnectionCallback) return;

    setIsRefreshingConnection(true);
    refreshConnections()
      .finally(() => {
        setIsRefreshingConnection(false);
        navigate(location.pathname, { replace: true });
      });
  }, [isConnectionCallback, location.pathname, navigate, refreshConnections]);

  useEffect(() => {
    if (appInfo?.id !== 'github' || !isConnected) return;

    let cancelled = false;

    const loadGitHubData = (silent = false) => {
      if (!silent) setGithubLoading(true);
      setGithubError('');

      getGitHubData()
        .then(res => {
          if (cancelled) return;
          setGithubData(res.data);
        })
        .catch(err => {
          if (!cancelled) setGithubError(err.message);
        })
        .finally(() => {
          if (!cancelled && !silent) setGithubLoading(false);
        });
    };

    loadGitHubData();
    const interval = window.setInterval(() => loadGitHubData(true), 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [appInfo?.id, isConnected]);

  useEffect(() => {
    if (appInfo?.id !== 'leetcode' || !isConnected) return;

    let cancelled = false;
    setLeetcodeLoading(true);
    setLeetcodeError('');

    getLeetCodeData()
      .then(res => {
        if (!cancelled) setLeetcodeData(res.data);
      })
      .catch(err => {
        if (!cancelled) setLeetcodeError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLeetcodeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appInfo?.id, isConnected]);

  const accounts = useMemo(() => id ? (MOCK_ACCOUNTS[id as string] || []) : [], [id]);

  useEffect(() => {
    if (isConnected && accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [isConnected, accounts, selectedAccount]);

  if (!appInfo) return <div className="p-8 text-sm text-text-muted">App not found.</div>;

  if (!isConnected && isRefreshingConnection) {
    return <div className="p-8 text-center text-zinc-500 mt-20">Finishing connection...</div>;
  }

  if (!isConnected) {
    const isSupported = id ? BACKEND_APPS.has(id) : false;
    const usesOAuth = id ? OAUTH_APPS.has(id) : false;
    const startConnection = async () => {
      setConnectionError('');
      setIsConnecting(true);
      try {
        if (id === 'leetcode') {
          await connectLeetCode(leetcodeUsername);
          await refreshConnections();
          navigate(`/app/apps/${id}?connected=true`, { replace: true });
          return;
        }
        await connectPlatform(id as string);
        await refreshConnections();
        navigate(`/app/apps/${id}?connected=true`, { replace: true });
      } catch (e: any) {
        setConnectionError(e.message || 'Failed to connect application');
      } finally {
        setIsConnecting(false);
      }
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center mt-20">
        <div className={`w-20 h-20 mx-auto rounded-3xl bg-bg-elevated border border-zinc-100 flex items-center justify-center shadow-sm overflow-hidden mb-8`}>
          <img src={appInfo.iconUrl} alt={appInfo.name} className="w-full h-full object-cover scale-[1.15]" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-4">Connect {appInfo.name}</h1>
        <p className="text-zinc-500 font-light mb-10 leading-relaxed max-w-lg mx-auto">
          {isSupported
            ? `Authorized access will allow Synalytix to retrieve engagement analytics and help AI optimize your content for ${appInfo.name}.`
            : `${appInfo.name} is on the roadmap and does not have a backend connector yet.`}
        </p>
        {id === 'leetcode' && (
          <div className="max-w-sm mx-auto mb-6 text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">LeetCode Username</label>
            <input
              value={leetcodeUsername}
              onChange={e => setLeetcodeUsername(e.target.value)}
              placeholder="your_username"
              className="w-full rounded-xl border border-zinc-200 bg-bg-elevated px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>
        )}
        {connectionError && <p className="text-sm text-red-600 mb-6">{connectionError}</p>}
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-full font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors">Cancel</button>
          <button
            onClick={startConnection}
            disabled={!isSupported || isConnecting || (id === 'leetcode' && !leetcodeUsername.trim())}
            className="px-6 py-3 rounded-full font-medium text-white bg-black hover:bg-zinc-800 transition-colors disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {isConnecting ? 'Connecting...' : usesOAuth ? 'Authorize Application' : id === 'leetcode' ? 'Connect Username' : 'Coming Soon'}
          </button>
        </div>
      </motion.div>
    );
  }

  const sortedContent = [...IG_CONTENT_POSTS].sort((a, b) => (b[SORT_KEYS[contentSort]] as number) - (a[SORT_KEYS[contentSort]] as number));
  const days = ['Su','M','Tu','W','Th','F','Sa'];

  const renderActiveAccountsStory = () => {
    if (accounts.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-4">Active Accounts</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {accounts.map((acc: any) => {
            const isActive = selectedAccount?.id === acc.id;
            return (
              <div key={acc.id} onClick={() => setSelectedAccount(acc)} className={`flex flex-col items-center gap-1.5 cursor-pointer ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
                <div className={`w-14 h-14 rounded-full p-[2px] transition-all ${isActive ? 'bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400' : 'bg-transparent border-2 border-zinc-200'}`}>
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-bg-elevated">
                    <img src={acc.avatarUrl || `https://ui-avatars.com/api/?name=${acc.username}`} alt={acc.username} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-[9px] font-semibold uppercase text-text-primary max-w-[64px] truncate text-center">{acc.username}</span>
              </div>
            );
          })}
          <div 
            onClick={() => {
              if (appInfo?.id === 'x' || appInfo?.id === 'instagram') {
                setShowAddAccountModal(true);
              } else {
                toast('Coming soon!', { icon: '🚧' });
              }
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          >
            <div className="w-14 h-14 rounded-full border-2 border-transparent p-[2px]">
              <div className="w-full h-full rounded-full border-2 border-dashed border-[#999] flex items-center justify-center bg-bg-sunken">
                <Plus className="w-4 h-4 text-text-secondary" />
              </div>
            </div>
            <span className="text-[9px] font-semibold uppercase text-text-primary">Add</span>
          </div>
        </div>
      </div>
    );
  };

  const renderAddAccountModal = () => {
    if (!showAddAccountModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowAddAccountModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="relative w-full max-w-sm bg-bg-canvas rounded-2xl shadow-xl overflow-hidden p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary">Add Account</h3>
            <button onClick={() => setShowAddAccountModal(false)} className="text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
          </div>
          <p className="text-sm text-text-secondary mb-6">Select the type of account you want to connect for {appInfo?.name}:</p>
          <div className="space-y-3">
            <button 
              onClick={() => { setShowAddAccountModal(false); toast.success('Connecting Professional Account...'); }}
              className="w-full text-left p-4 rounded-xl border border-border hover:border-brand bg-bg-elevated hover:bg-brand-light transition-colors group"
            >
              <div className="font-semibold text-text-primary group-hover:text-brand">Professional Account</div>
              <div className="text-xs text-text-secondary mt-1">Access advanced analytics and business tools.</div>
            </button>
            <button 
              onClick={() => { setShowAddAccountModal(false); toast.success('Connecting Personal Account...'); }}
              className="w-full text-left p-4 rounded-xl border border-border hover:border-brand bg-bg-elevated hover:bg-brand-light transition-colors group"
            >
              <div className="font-semibold text-text-primary group-hover:text-brand">Personal Account</div>
              <div className="text-xs text-text-secondary mt-1">Basic metrics and overview.</div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // ─── GITHUB ───
  if (appInfo.id === 'github') {
    if (githubLoading) return <div className="p-8 text-center text-zinc-500 mt-20">Loading GitHub data...</div>;
    if (githubError) return <div className="p-8 text-center text-red-500 mt-20">{githubError}</div>;
    if (!githubData) return null;

    const { profile, repos, contributions, stats } = githubData;
    const totalStars = stats?.total_stars ?? repos?.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0) ?? 0;

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Apps
        </button>
        {renderActiveAccountsStory()}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-zinc-100 flex items-center justify-center shadow-sm font-semibold text-2xl text-gray-800">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-2xl" /> : 'G'}
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">GitHub Workspace</h1>
            <p className="text-zinc-500 font-light text-sm">{profile.username} · {contributions?.total_this_year || 0} contributions this year</p>
          </div>
          <div className="ml-auto flex gap-3">
            <div className="text-center"><div className="text-2xl font-bold">{profile.public_repos}</div><div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Repos</div></div>
            <div className="text-center ml-4"><div className="text-2xl font-bold">{contributions?.total_this_year || 0}</div><div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Contributions</div></div>
            <div className="text-center ml-4"><div className="text-2xl font-bold">{totalStars}</div><div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Stars</div></div>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-4">Popular repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {(repos || []).slice(0, 6).map((repo: any) => (
            <a href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name} className="border border-border rounded-xl p-5 bg-bg-elevated flex flex-col gap-3 hover:border-neutral-300 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="text-[#0969DA] font-semibold hover:underline cursor-pointer text-sm">{repo.name}</h3>
                <span className="text-[10px] border border-neutral-200 px-2 py-0.5 rounded-full text-neutral-500 font-semibold">{repo.is_private ? 'Private' : 'Public'}</span>
              </div>
              {repo.description && <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{repo.description}</p>}
              <div className="flex items-center gap-4 mt-auto pt-2">
                {repo.language && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-[10px] text-neutral-500 font-medium">{repo.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium">
                  ⭐ {repo.stargazers_count}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="border border-border rounded-xl p-6 bg-bg-elevated">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold">{contributions?.total_this_year || 0} contributions in the last year</h2>
          </div>
          <div className="w-full h-28 bg-bg-sunken rounded-xl flex items-center justify-center border border-neutral-100 overflow-hidden">
             <div className="text-zinc-400 text-sm">See full contribution graph on your GitHub profile.</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── LEETCODE ───
  if (appInfo.id === 'leetcode') {
    if (leetcodeLoading) return <div className="p-8 text-center text-zinc-500 mt-20">Loading LeetCode data...</div>;
    if (leetcodeError) return <div className="p-8 text-center text-red-500 mt-20">{leetcodeError}</div>;
    if (!leetcodeData) return null;

    const { stats, submissions = [] } = leetcodeData;
    const acceptance = stats?.acceptance_rate ?? 0;

    return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Apps
      </button>
      {renderActiveAccountsStory()}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center text-2xl">🎯</div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">LeetCode Workspace</h1>
          <p className="text-zinc-500 font-light text-sm">{stats?.username} · Rank {stats?.ranking?.toLocaleString() || 'N/A'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Practice History</h2>
            <button className="text-xs font-medium border border-neutral-200 px-3 py-1.5 rounded-lg flex items-center gap-1"><Activity className="w-3 h-3"/> Filter</button>
          </div>
          <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border-light text-xs font-semibold text-neutral-500 uppercase">
              <div className="col-span-3">Last Submitted</div>
              <div className="col-span-5">Problem</div>
              <div className="col-span-2">Last Result</div>
              <div className="col-span-2">Submissions</div>
            </div>
            {submissions.map((item: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-border-light last:border-0 hover:bg-neutral-50 transition-colors text-sm">
                <div className="col-span-3 text-neutral-500 text-xs">{new Date(item.timestamp).toLocaleDateString()}</div>
                <div className="col-span-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${item.status_display === 'Accepted' ? 'border-green-500' : 'border-neutral-300'}`} />
                    <span className="font-medium text-text-primary truncate text-xs">{item.title}</span>
                  </div>
                  <div className="text-[10px] font-bold mt-0.5 ml-6 text-neutral-400">{item.lang}</div>
                </div>
                <div className={`col-span-2 font-medium text-xs ${item.status_display === 'Accepted' ? 'text-green-600' : 'text-red-500'}`}>{item.status_display}</div>
                <div className="col-span-2 text-xs text-neutral-500">1</div>
              </div>
            ))}
            {submissions.length === 0 && <div className="p-8 text-center text-xs text-neutral-400">No recent submissions found.</div>}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="bg-bg-elevated border border-border rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-neutral-500 font-medium mb-1">Total Solved</div>
                <div className="text-3xl font-bold"><span className="text-blue-500">{stats?.total_solved ?? 0}</span> <span className="text-sm font-medium text-neutral-400">Problems</span></div>
              </div>
              <div className="text-xs font-semibold bg-neutral-100 rounded-lg px-2 py-1.5">Rank {stats?.ranking?.toLocaleString() || 'N/A'}</div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-green-50 text-green-700 text-center rounded-lg py-2 text-xs font-bold">Easy <span className="text-black text-base font-bold block">{stats?.easy_solved ?? 0}</span></div>
              <div className="flex-1 bg-yellow-50 text-yellow-700 text-center rounded-lg py-2 text-xs font-bold">Med. <span className="text-black text-base font-bold block">{stats?.medium_solved ?? 0}</span></div>
              <div className="flex-1 bg-red-50 text-red-700 text-center rounded-lg py-2 text-xs font-bold">Hard <span className="text-black text-base font-bold block">{stats?.hard_solved ?? 0}</span></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-bg-elevated border border-border rounded-xl p-4">
              <div className="text-xs text-neutral-500 mb-1">Submissions</div>
              <div className="text-2xl font-bold text-fuchsia-600">{stats?.total_submissions ?? 0}</div>
            </div>
            <div className="flex-1 bg-bg-elevated border border-border rounded-xl p-4">
              <div className="text-xs text-neutral-500 mb-1">Acceptance</div>
              <div className="text-2xl font-bold text-green-500">{acceptance}<span className="text-sm">%</span></div>
            </div>
          </div>
          <div className="bg-bg-elevated border border-border rounded-xl p-4">
            <div className="text-xs text-neutral-500 mb-3 font-semibold uppercase tracking-widest">Weekly Trend</div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{n:'Mon',v:2},{n:'Tue',v:5},{n:'Wed',v:3},{n:'Thu',v:7},{n:'Fri',v:4},{n:'Sat',v:8},{n:'Sun',v:1}]}>
                  <Bar dataKey="v" fill="var(--color-text-primary)" radius={[3,3,0,0]} barSize={12}/>
                  <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill:'#999',fontSize:9}}/>
                  <Tooltip contentStyle={{borderRadius:'8px',border:"1px solid var(--color-border)",fontSize:'11px'}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    );
  }

  // ─── INSTAGRAM (Full Insights) ───
  if (appInfo.id === 'instagram') return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Apps
      </button>
      {renderActiveAccountsStory()}

      {/* Account header */}
      <div className="bg-bg-elevated border border-border rounded-2xl p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 p-[2px]">
          <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-bg-canvas flex items-center justify-center text-xl font-bold">
            {selectedAccount?.avatarUrl ? (
              <img src={selectedAccount.avatarUrl} alt={selectedAccount.username} className="w-full h-full object-cover" />
            ) : 'R'}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            {selectedAccount?.username || '@ramesh988025'}
            {(selectedAccount?.isPremium || true) && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white" title="Verified">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </h1>
          <p className="text-sm text-text-muted font-light">{selectedAccount?.username || '@ramesh988025'} · Creator · Instagram Insights</p>
        </div>
        <div className="flex gap-6 text-center">
          <div><div className="text-xl font-bold">{IG_AUDIENCE.followers}</div><div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Followers</div></div>
          <div><div className="text-xl font-bold text-green-600">+{IG_AUDIENCE.followerGrowth}%</div><div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Growth</div></div>
          <div><div className="text-xl font-bold">{IG_OVERVIEW.allContent.views.toLocaleString()}</div><div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Views (30d)</div></div>
        </div>
      </div>

      {/* Insights Tabs */}
      <div className="bg-bg-elevated border border-border rounded-2xl overflow-hidden">
        <div className="border-b border-border-light flex">
          {(['overview','content','audience'] as InsightsTab[]).map(tab => (
            <button key={tab} onClick={() => setIgTab(tab)}
              className={`px-8 py-4 text-sm font-medium capitalize relative transition-colors ${igTab === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-muted'}`}>
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
              {igTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"/>}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {igTab === 'overview' && (
          <div className="p-6 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-bold text-text-primary">All content</h3>
                <button className="flex items-center gap-1 text-sm text-text-muted">30 days <ChevronDown className="w-4 h-4"/></button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {[{label:'Views',value:IG_OVERVIEW.allContent.views.toLocaleString(),sel:true},{label:'Net followers',value:`+${IG_OVERVIEW.allContent.netFollowers}`,sel:false},{label:'Interactions',value:IG_OVERVIEW.allContent.interactions.toLocaleString(),sel:false}].map(m=>(
                  <div key={m.label} className={`flex-shrink-0 p-4 rounded-xl border min-w-[140px] cursor-pointer ${m.sel?'border-neutral-400 bg-bg-elevated shadow-sm':'border-border bg-neutral-50 hover:bg-bg-elevated'}`}>
                    <div className="text-xs text-text-muted mb-1">{m.label}</div>
                    <div className="text-2xl font-bold text-text-primary">{m.value}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3">{IG_OVERVIEW.allContent.followers_pct}% followers · {IG_OVERVIEW.allContent.nonfollowers_pct}% non-followers</p>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={IG_OVERVIEW.viewsHistory}>
                  <defs><linearGradient id="igG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e879f9" stopOpacity={0.3}/><stop offset="95%" stopColor="#e879f9" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5"/>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#999',fontSize:9}} dy={6} interval={2}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill:'#999',fontSize:9}} dx={-4} tickFormatter={v=>v>=1000?`${v/1000}K`:v}/>
                  <Tooltip contentStyle={{borderRadius:'10px',border:"1px solid var(--color-border)",fontSize:'11px'}} formatter={(v:any)=>[v.toLocaleString(),'Views']}/>
                  <Area type="monotone" dataKey="val" stroke="#e879f9" strokeWidth={2.5} fill="url(#igG)" dot={false} activeDot={{r:4}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Views by content type <span className="text-[10px] text-text-secondary">ⓘ</span></h4>
              <div className="flex justify-between text-sm font-bold mb-4"><span>Accounts reached</span><span>{IG_OVERVIEW.allContent.accountsReached.toLocaleString()}</span></div>
              <div className="flex gap-4 text-[10px] text-text-secondary mb-3">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-500 inline-block"/>Followers</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-fuchsia-300 inline-block"/>Non-followers</span>
              </div>
              {[{label:'Reels',f:60,nf:40,total:'36K'},{label:'Stories',f:80,nf:20,total:'13K'},{label:'Posts',f:55,nf:45,total:'3.8K'},{label:'Live videos',f:0,nf:0,total:'0'}].map(r=>(
                <div key={r.label} className="mb-4">
                  <div className="flex justify-between text-sm font-medium mb-1.5"><span>{r.label}</span><span className="font-bold">{r.total}</span></div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className="bg-fuchsia-500 h-full" style={{width:`${r.f}%`}}/>
                    <div className="bg-fuchsia-300 h-full" style={{width:`${r.nf}%`}}/>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">Interactions by content type <span className="text-[10px] text-text-secondary">ⓘ</span></h4>
              {[{label:'Reels',v:2500,p:100},{label:'Stories',v:639,p:26},{label:'Posts',v:200,p:8},{label:'Live videos',v:0,p:0}].map(r=>(
                <div key={r.label} className="mb-4">
                  <div className="flex justify-between text-sm font-medium mb-1.5"><span>{r.label}</span><span className="font-bold">{r.v>=1000?`${(r.v/1000).toFixed(1)}K`:r.v}</span></div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-fuchsia-500 h-full rounded-full" style={{width:`${r.p}%`}}/>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">Profile activity <span className="text-[10px] text-text-secondary">ⓘ</span></h4>
              {[{label:'Profile visits',value:'1,098',icon:'👤'},{label:'Bio link taps',value:'31',icon:'🔗'},{label:'Business address taps',value:'0',icon:'🏪'}].map(r=>(
                <div key={r.label} className="flex items-center gap-4 p-4 border-b border-border-light last:border-0">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-lg">{r.icon}</div>
                  <span className="flex-1 text-sm font-medium">{r.label}</span>
                  <span className="text-sm font-bold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {igTab === 'content' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-5">
              <button className="flex items-center gap-1.5 text-sm font-bold">All content <ChevronDown className="w-4 h-4"/></button>
              <button className="flex items-center gap-1.5 text-sm text-text-muted">30 days <ChevronDown className="w-4 h-4"/></button>
            </div>
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {contentSorts.map(s=>(
                <button key={s} onClick={()=>setContentSort(s)} className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-xs font-medium transition-all ${contentSort===s?'bg-neutral-800 text-white border-neutral-800':'bg-bg-elevated text-text-muted border-neutral-300 hover:border-neutral-400'}`}>{s}</button>
              ))}
            </div>
            <div className="divide-y divide-[#F5F5F5]">
              {sortedContent.map(post=>{
                const displayVal = post[SORT_KEYS[contentSort]] as number;
                return (
                  <div key={post.id} onClick={()=>setSelectedPost(post)} className="flex items-center gap-4 py-4 hover:bg-neutral-50 cursor-pointer rounded-xl px-2 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl flex-shrink-0 border border-border">{post.emoji||'📹'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">{post.title||post.emoji||'Post'}</div>
                      <div className="flex gap-3 mt-1 text-xs text-text-secondary">
                        <span>{post.age}</span>
                        {post.likes>0&&<span>❤️ {post.likes>=1000?`${(post.likes/1000).toFixed(1)}K`:post.likes}</span>}
                        {post.reposts>0&&<span>🔁 {post.reposts}</span>}
                        {post.shares>0&&<span>↗️ {post.shares}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold">{displayVal>=1000?`${(displayVal/1000).toFixed(displayVal>=10000?0:1)}K`:displayVal}</div>
                      <div className="text-[10px] text-text-secondary">{contentSort}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AUDIENCE TAB */}
        {igTab === 'audience' && (
          <div className="p-6 space-y-8">
            <div>
              <div className="flex justify-between items-center">
                <h4 className="text-base font-bold">Followers</h4>
                <button className="flex items-center gap-1 text-sm text-text-muted">30 days <ChevronDown className="w-4 h-4"/></button>
              </div>
              <div className="text-4xl font-bold mt-2">{IG_AUDIENCE.followers}</div>
              <div className="text-sm text-green-600 font-semibold mt-1">+{IG_AUDIENCE.followerGrowth}% since {IG_AUDIENCE.followersSince}</div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Follower growth over time</h4>
              <div className="flex gap-2 mb-4">
                {['overall','follows','unfollows'].map(s=>(
                  <button key={s} onClick={()=>setAudienceSegment(s as any)} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${audienceSegment===s?'bg-neutral-800 text-white border-neutral-800':'text-text-muted border-neutral-300'}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
                ))}
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={IG_AUDIENCE.followerGrowthHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5"/>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#999',fontSize:9}} dy={6} interval={2}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fill:'#999',fontSize:9}} dx={-4}/>
                    <Tooltip contentStyle={{borderRadius:'10px',border:"1px solid var(--color-border)",fontSize:'11px'}}/>
                    <Line type="monotone" dataKey="val" stroke="#e879f9" strokeWidth={2.5} dot={false} activeDot={{r:4}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Gender <span className="text-[10px] text-text-secondary">ⓘ</span></h4>
              {[{label:'Women',value:IG_AUDIENCE.gender.women,color:'bg-fuchsia-500'},{label:'Men',value:IG_AUDIENCE.gender.men,color:'bg-fuchsia-300'}].map(g=>(
                <div key={g.label} className="mb-4">
                  <div className="flex justify-between text-sm font-medium mb-1.5"><span>{g.label}</span><span className="font-bold">{g.value}%</span></div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`${g.color} h-full rounded-full`} style={{width:`${g.value}%`}}/>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Age range <span className="text-[10px] text-text-secondary">ⓘ</span></h4>
              {IG_AUDIENCE.age.map(a=>(
                <div key={a.range} className="mb-3">
                  <div className="flex justify-between text-sm font-medium mb-1"><span>{a.range}</span><span className="font-bold">{a.pct}%</span></div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className="bg-fuchsia-500 h-full" style={{width:`${a.pct*(IG_AUDIENCE.gender.women/100)}%`}}/>
                    <div className="bg-fuchsia-300 h-full" style={{width:`${a.pct*(IG_AUDIENCE.gender.men/100)}%`}}/>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Top locations <span className="text-[10px] text-text-secondary">ⓘ</span></h4>
              <div className="flex gap-2 mb-4">
                {['Countries','Towns/cities'].map(v=>(
                  <button key={v} onClick={()=>setLocationView(v as any)} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${locationView===v?'bg-neutral-800 text-white border-neutral-800':'text-text-muted border-neutral-300'}`}>{v}</button>
                ))}
              </div>
              <div className="flex justify-between text-sm mb-1.5 font-medium"><span>🇮🇳 India</span><span className="font-bold">100%</span></div>
              <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="bg-fuchsia-500 h-full rounded-full w-full"/>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Follower active times <span className="text-[10px] text-text-secondary">ⓘ</span></h4>
              <div className="flex gap-2 mb-5">
                {days.map(d=>(
                  <button key={d} onClick={()=>setActiveDay(d)} className={`w-10 h-10 rounded-full text-xs font-semibold transition-all ${activeDay===d?'bg-text-primary text-white':'bg-neutral-100 text-text-muted hover:bg-neutral-200'}`}>{d}</button>
                ))}
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{t:'12a',v:30},{t:'3a',v:10},{t:'6a',v:55},{t:'9a',v:70},{t:'12p',v:75},{t:'3p',v:65},{t:'6p',v:85},{t:'9p',v:60}]}>
                    <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{fill:'#999',fontSize:9}}/>
                    <Tooltip contentStyle={{borderRadius:'8px',border:"1px solid var(--color-border)",fontSize:'11px'}}/>
                    <Bar dataKey="v" radius={[4,4,0,0]} barSize={28}>
                      {[30,10,55,70,75,65,85,60].map((_,i)=>(
                        <Cell key={i} fill={i===6?'#e879f9':'#f0abfc'}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                <h5 className="text-xs font-bold">Top times</h5>
                {IG_AUDIENCE.topTimes.map(t=>(
                  <div key={t} className="text-sm font-semibold">{t.split(' ')[0]} <span className="text-text-muted font-normal">{t.split(' ').slice(1).join(' ')}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Insights Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelectedPost(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,y:60,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,scale:0.97,y:20}}
              className="relative w-full max-w-sm max-h-[85vh] bg-[#0A0A0A] rounded-[32px] overflow-y-auto text-white shadow-2xl">
              <div className="sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md z-10 px-6 py-4 flex items-center gap-4 border-b border-white/10">
                <button onClick={()=>setSelectedPost(null)} className="p-1 hover:bg-bg-elevated/10 rounded-full transition-colors"><ArrowLeft className="w-5 h-5"/></button>
                <h2 className="text-xl font-bold">Post insights</h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col items-center border-b border-white/10 pb-6">
                  <div className="w-28 h-36 bg-zinc-800 rounded-xl mb-4 flex items-center justify-center text-4xl">{selectedPost.emoji||'📹'}</div>
                  <span className="text-zinc-400 text-sm mb-6">Post • {selectedPost.age}</span>
                  <div className="flex w-full justify-between px-4">
                    <div className="flex flex-col items-center gap-1"><Heart className="w-5 h-5"/><span className="text-sm font-semibold">{selectedPost.likes>=1000?`${(selectedPost.likes/1000).toFixed(1)}K`:selectedPost.likes}</span></div>
                    <div className="flex flex-col items-center gap-1"><MessageCircle className="w-5 h-5"/><span className="text-sm font-semibold">{selectedPost.comments}</span></div>
                    <div className="flex flex-col items-center gap-1"><Send className="w-5 h-5"/><span className="text-sm font-semibold">{selectedPost.shares}</span></div>
                    <div className="flex flex-col items-center gap-1"><Activity className="w-5 h-5"/><span className="text-sm font-semibold">{selectedPost.reposts}</span></div>
                    <div className="flex flex-col items-center gap-1"><Bookmark className="w-5 h-5"/><span className="text-sm font-semibold">{selectedPost.saves}</span></div>
                  </div>
                </div>
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-base font-semibold mb-4 flex items-center gap-2">Overview <Info className="w-4 h-4 text-zinc-500"/></h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between"><span className="text-zinc-300">Views</span><span className="font-bold">{selectedPost.views?.toLocaleString()||0}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-300">Accounts reached</span><span className="font-bold">{selectedPost.accountsReached?.toLocaleString()||0}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-300">Follows</span><span className="font-bold">{selectedPost.follows||0}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-4 flex items-center gap-2">Reach <Info className="w-4 h-4 text-zinc-500"/></h3>
                  <div className="relative w-40 h-40 mx-auto my-4 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2A2A2A" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e879f9" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251*(1-((selectedPost.views||1)/16900))}/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm text-zinc-400">Views</span>
                      <span className="text-2xl font-bold">{selectedPost.views>=1000?`${(selectedPost.views/1000).toFixed(1)}K`:selectedPost.views||0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {renderAddAccountModal()}
    </motion.div>
  );

  // ─── X ANALYTICS ───
  if (appInfo.id === 'x') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Apps
          </button>
          
          <div className="mb-4">
            {renderActiveAccountsStory()}
          </div>
        </div>
        
        {selectedAccount ? (
          <XAnalyticsModule appInfo={appInfo} account={selectedAccount} />
        ) : (
          <div className="max-w-5xl mx-auto px-6 py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-medium text-white mb-2">No Account Selected</h2>
            <p className="text-zinc-500">Please select or connect an X account to view analytics.</p>
          </div>
        )}
        {renderAddAccountModal()}
      </motion.div>
    );
  }

  // ─── LINKEDIN ───
  if (appInfo.id === 'linkedin') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="max-w-[1400px] mx-auto px-6 pt-6">
          <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Apps
          </button>
          
          <div className="mb-4">
            {renderActiveAccountsStory()}
          </div>
        </div>
        
        {selectedAccount ? (
          <div className="max-w-[1400px] mx-auto px-6">
            <LinkedInAnalyticsDashboard />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-6 py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-medium text-white mb-2">No Account Selected</h2>
            <p className="text-zinc-500">Please select or connect a LinkedIn account to view analytics.</p>
          </div>
        )}
      </motion.div>
    );
  }

  // ─── OTHERS (generic) ───
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Apps
      </button>
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-bg-elevated border border-zinc-100 flex items-center justify-center shadow-sm overflow-hidden`}>
            <img src={appInfo.iconUrl} alt={appInfo.name} className="w-full h-full object-cover scale-[1.15]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{appInfo.name} Workspace</h1>
            <p className="text-zinc-500 font-light">Manage accounts and view analytics.</p>
          </div>
        </div>
      </div>
      {renderActiveAccountsStory()}
      {selectedAccount && (
        <div className="bg-bg-elevated rounded-2xl border border-border p-8">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border-light">
            <img src={selectedAccount.avatarUrl} className="w-12 h-12 rounded-full" alt=""/>
            <div>
              <div className="text-sm font-semibold">{selectedAccount.username}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{selectedAccount.type} Account</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="bg-[#FBFBFB] border border-border rounded-xl p-6"><div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-2">Followers</div><div className="text-3xl font-light">14.2K</div></div>
            <div className="bg-[#FBFBFB] border border-border rounded-xl p-6"><div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-2">Monthly Reach</div><div className="text-3xl font-light">89.4K</div></div>
            <div className="bg-[#FBFBFB] border border-border rounded-xl p-6"><div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-2">Avg. Engagement</div><div className="text-3xl font-light">4.8%</div></div>
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-4">Recent Posts</h3>
          <div className="space-y-3">
            {[1,2,3].map(i=>(
              <div key={i} onClick={()=>setSelectedPost({id:i,title:`Post ${i}`,views:1200*i,likes:45*i,comments:5,shares:2,reposts:1,saves:1,emoji:'📝',age:`${i}w`,accountsReached:800*i,follows:i})}
                className="p-4 border border-border bg-[#FBFBFB] rounded-xl hover:bg-neutral-50 cursor-pointer flex justify-between items-center transition-colors">
                <span className="font-medium text-xs">Post insight overview for campaign {i}</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-text-secondary">VIEW DETAILS</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelectedPost(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,y:60}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
              className="relative w-full max-w-xl bg-[#0A0A0A] rounded-2xl text-white shadow-2xl overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-4 border-b border-white/10">
                <button onClick={()=>setSelectedPost(null)} className="p-2 hover:bg-bg-elevated/10 rounded-full"><X className="w-5 h-5"/></button>
                <h2 className="text-xl font-bold">Post Analytics</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="border border-white/10 rounded-xl p-5 flex justify-around">
                  <div className="flex flex-col items-center gap-2"><Heart className="w-5 h-5 text-zinc-400"/><span className="text-xl font-bold">{selectedPost.likes||0}</span></div>
                  <div className="flex flex-col items-center gap-2"><Activity className="w-5 h-5 text-zinc-400"/><span className="text-xl font-bold">{selectedPost.reposts||0}</span></div>
                  <div className="flex flex-col items-center gap-2"><MessageCircle className="w-5 h-5 text-zinc-400"/><span className="text-xl font-bold">{selectedPost.comments||0}</span></div>
                </div>
                <div className="grid grid-cols-3 gap-4 p-2">
                  <div><span className="text-sm text-zinc-400 flex items-center gap-1">Impressions <Info className="w-3 h-3"/></span><span className="text-2xl font-bold">{selectedPost.views||0}</span></div>
                  <div><span className="text-sm text-zinc-400 flex items-center gap-1">Engagements <Info className="w-3 h-3"/></span><span className="text-2xl font-bold">{selectedPost.likes||0}</span></div>
                  <div><span className="text-sm text-zinc-400 flex items-center gap-1">Profile visits <Info className="w-3 h-3"/></span><span className="text-2xl font-bold">{selectedPost.follows||0}</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
