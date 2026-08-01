import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { APP_REGISTRY } from '../lib/appRegistry';
import { connectLeetCode, connectPlatform, getInstagramData } from '../lib/api';
import { ArrowLeft, Plus, Heart, MessageCircle, Send, Bookmark, X, Eye, Activity, Info, ChevronDown, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { XAnalyticsModule } from '../modules/x-analytics/XAnalyticsModule';
import { LinkedInAnalyticsDashboard } from '../features/linkedin/pages/LinkedInAnalyticsDashboard';
import { UniversalAnalytics } from '../modules/analytics/UniversalAnalytics';
import { mapInstagramData } from '../modules/analytics/utils/instagramAdapter';
import { LeetCodeAnalyticsDashboard } from '../features/leetcode/pages/LeetCodeAnalyticsDashboard';
import { AccountStorySwitcher } from '../components/ui/AccountStorySwitcher';
import { GithubWorkspaceView } from '../features/github/components/GithubWorkspaceView';
type InsightsTab = 'overview' | 'content' | 'audience';

const BACKEND_APPS = new Set(['github', 'instagram', 'x', 'linkedin', 'leetcode']);
const OAUTH_APPS = new Set(['github', 'instagram', 'x', 'linkedin']);

export default function AppDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { connectedApps, refreshConnections } = useAppContext();

  const appInfo = APP_REGISTRY.find(a => a.id === id);
  const isConnected = connectedApps.includes(id as any);
  const isConnectionCallback = new URLSearchParams(location.search).get('connected') === 'true';
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [igTab, setIgTab] = useState<InsightsTab>('overview');
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
      // connectPlatform redirects to OAuth — no further navigation needed
      await connectPlatform(id as string);
    } catch (e: any) {
      setConnectionError(e.message || 'Failed to connect application');
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (!isConnectionCallback) return;

    setIsRefreshingConnection(true);
    refreshConnections()
      .finally(() => {
        setIsRefreshingConnection(false);
        navigate(location.pathname, { replace: true });
      });
  }, [isConnectionCallback, location.pathname, navigate, refreshConnections]);

  // Removed old manual GitHub data fetching in favor of React Query in GithubWorkspaceView

  // Build accounts from real connection status instead of mock data
  const accounts = useMemo(() => {
    if (!id) return [];
    // Use connection data from context (real backend data)
    return connectedApps.includes(id as any)
      ? [{ id: `${id}_1`, username: id, avatarUrl: '', type: 'connected' }]
      : [];
  }, [id, connectedApps]);

  // Fetch real Instagram data when on Instagram page
  const { data: igApiData } = useQuery({
    queryKey: ['instagram-all'],
    queryFn: async () => {
      const res = await getInstagramData();
      if (!res.success || !res.data) return null;
      return res.data;
    },
    enabled: id === 'instagram' && isConnected,
    staleTime: 5 * 60 * 1000,
  });

  // Handle app switching and initial account selection
  useEffect(() => {
    if (!isConnected || accounts.length === 0) return;
    
    // Check if current selected account belongs to this app
    const isValidAccount = selectedAccount && accounts.some((a: any) => a.id === selectedAccount.id);
    
    if (!isValidAccount) {
      let accountToSelect = accounts[0];
      
      if (id !== 'instagram') {
        const savedAccountId = localStorage.getItem(`last_account_${id}`);
        if (savedAccountId) {
          const found = accounts.find((a: any) => a.id === savedAccountId);
          if (found) accountToSelect = found;
        }
      }
      
      setSelectedAccount(accountToSelect);
    }
  }, [id, isConnected, accounts, selectedAccount]);

  // Save selected account to localStorage
  useEffect(() => {
    if (selectedAccount && id && id !== 'instagram') {
      localStorage.setItem(`last_account_${id}`, selectedAccount.id);
    }
  }, [selectedAccount, id]);

  if (!appInfo) return <div className="p-8 text-sm text-text-muted">App not found.</div>;

  if (!isConnected && isRefreshingConnection) {
    return <div className="p-8 text-center text-zinc-500 mt-20">Finishing connection...</div>;
  }

  if (!isConnected) {
    const isSupported = id ? BACKEND_APPS.has(id) : false;
    const usesOAuth = id ? OAUTH_APPS.has(id) : false;

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

  const renderActiveAccountsStory = () => {
    return (
      <AccountStorySwitcher 
        accounts={accounts} 
        selectedAccountId={selectedAccount?.id} 
        onSelectAccount={setSelectedAccount} 
        onAddAccount={() => setShowAddAccountModal(true)} 
      />
    );
  };

  const renderAddAccountModal = () => {
    if (!showAddAccountModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-bg-primary rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border relative">
          <button onClick={() => setShowAddAccountModal(false)} className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary bg-bg-elevated rounded-full transition-colors"><X className="w-5 h-5" /></button>
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center mb-6 text-3xl mx-auto shadow-sm shadow-brand/10">
            {appInfo?.id === 'instagram' ? '📷' : appInfo?.id === 'x' ? '𝕏' : appInfo?.id === 'leetcode' ? '💻' : '🔗'}
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Connect {appInfo?.name}</h2>
          
          {appInfo?.id === 'github' ? (
            <>
              <p className="text-sm text-text-secondary text-center mb-6">Choose how you want to connect your GitHub account.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { 
                    setShowAddAccountModal(false); 
                    window.location.href = `https://github.com/apps/synalytix/installations/new?state=app_connect`;
                  }}
                  className="w-full text-left p-4 rounded-xl border-2 border-brand bg-brand/5 hover:bg-brand/10 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
                  <div className="font-semibold text-brand">Organization Account</div>
                  <div className="text-xs text-text-secondary mt-1">Full access to org repos and team analytics.</div>
                </button>
                <button 
                  onClick={() => { setShowAddAccountModal(false); toast.success('Connecting Personal Account...'); }}
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-brand bg-bg-elevated hover:bg-brand-light transition-colors group"
                >
                  <div className="font-semibold text-text-primary group-hover:text-brand">Personal Account</div>
                  <div className="text-xs text-text-secondary mt-1">Basic metrics and overview.</div>
                </button>
              </div>
            </>
          ) : appInfo?.id === 'leetcode' ? (
            <>
              <p className="text-sm text-text-secondary mb-4 text-center">Enter your LeetCode username to connect a new account.</p>
              <div className="mb-6 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">LeetCode Username</label>
                <input
                  value={leetcodeUsername}
                  onChange={e => setLeetcodeUsername(e.target.value)}
                  placeholder="your_username"
                  className="w-full rounded-xl border border-zinc-200 bg-bg-elevated px-4 py-3 text-sm outline-none focus:border-black"
                  disabled={isConnecting}
                />
              </div>
              <button 
                onClick={startConnection}
                disabled={!leetcodeUsername.trim() || isConnecting}
                className="w-full py-3 rounded-xl font-medium text-white bg-black hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? 'Connecting...' : 'Connect Account'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-text-secondary mb-6 text-center">Authorize {appInfo?.name} to connect a new account to your workspace.</p>
              <button 
                onClick={() => { 
                  setShowAddAccountModal(false); 
                  toast.success(`Authorizing ${appInfo?.name} Account...`); 
                }}
                className="w-full text-center py-3 rounded-xl font-medium text-white bg-black hover:bg-zinc-800 transition-colors group"
              >
                Authorize Application
              </button>
            </>
          )}
        </motion.div>
      </div>
    );
  };

  // ─── GITHUB ───
  if (appInfo.id === 'github') {
    return (
      <GithubWorkspaceView
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={setSelectedAccount}
        onAddAccount={() => setShowAddAccountModal(true)}
        onBack={() => navigate('/app/apps')}
      />
    );
  }

  // ─── LEETCODE ───
  if (appInfo.id === 'leetcode') {
    return (
      <LeetCodeAnalyticsDashboard 
        appInfo={appInfo} 
        renderActiveAccountsStory={renderActiveAccountsStory} 
      />
    );
  }

  // ─── INSTAGRAM (Full Insights) ───
  if (appInfo.id === 'instagram') {
    const data = mapInstagramData(igApiData);
    return (
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <button onClick={() => navigate('/app/apps')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Apps
        </button>
        <UniversalAnalytics data={data} />
      </div>
    );
  }


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
