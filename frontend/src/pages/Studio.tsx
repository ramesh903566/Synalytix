import { useState, useEffect } from 'react';
import { UploadCloud, Sparkles, Calendar, Clock, CheckCircle2, Trash2, Save, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_APPS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { AppName } from '../types';
import toast from 'react-hot-toast';

const MOCK_ACCOUNTS: Record<string, {id: string, name: string, handle: string}[]> = {
  instagram: [{id: 'ig_1', name: 'Synalytix HQ', handle: '@synalytix'}],
  x: [{id: 'x_1', name: 'Synalytix', handle: '@synalytix_app'}],
  linkedin: [{id: 'li_1', name: 'Synalytix AI', handle: 'synalytix-company'}],
  github: [{id: 'gh_1', name: 'Synalytix', handle: 'synalytix-hq'}],
  leetcode: [{id: 'lc_1', name: 'Synalytix', handle: 'synalytix_dev'}],
};

export default function Studio() {
  const { connectedApps, scheduledPosts, addScheduledPost, deleteScheduledPost, saveDraft, savedDrafts, deleteDraft } = useAppContext();
  const [description, setDescription] = useState('');
  const [selectedApps, setSelectedApps] = useState<AppName[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedDrafts, setOptimizedDrafts] = useState<Record<string, string>>({});
  
  const [showAccountModal, setShowAccountModal] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, string[]>>({});

  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [didSchedule, setDidSchedule] = useState(false);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const fileNames = uploadedFiles.map(f => f.name.toLowerCase());
      const hasImage = fileNames.some(n => n.match(/\.(png|jpg|jpeg|webp|gif)$/));
      const hasVideo = fileNames.some(n => n.match(/\.(mp4|mov|webm)$/));
      const hasCode = fileNames.some(n => n.match(/\.(js|tsx|ts|py|html|css|json)$/));
      
      let suggestedApps: string[] = [];
      if (hasVideo) suggestedApps = ['instagram', 'x', 'linkedin'];
      else if (hasImage) suggestedApps = ['instagram', 'x', 'linkedin'];
      else if (hasCode) suggestedApps = ['github', 'leetcode', 'x', 'linkedin'];
      else suggestedApps = ['x', 'linkedin'];

      const availableAndSuggested = suggestedApps.filter(app => connectedApps.includes(app as AppName));
      
      if (availableAndSuggested.length > 0) {
        const newSelectedAccounts = { ...selectedAccounts };
        availableAndSuggested.forEach(app => {
          if (!newSelectedAccounts[app] || newSelectedAccounts[app].length === 0) {
            if (MOCK_ACCOUNTS[app] && MOCK_ACCOUNTS[app].length > 0) {
              newSelectedAccounts[app] = [MOCK_ACCOUNTS[app][0].id];
            }
          }
        });
        setSelectedAccounts(newSelectedAccounts);
        
        setSelectedApps(prev => {
          const newSelection = Array.from(new Set([...prev, ...availableAndSuggested])) as AppName[];
          if (newSelection.length > prev.length) {
            toast.success('AI auto-selected platforms based on uploaded content type');
          }
          return newSelection;
        });
      }
    }
  }, [uploadedFiles, connectedApps]);

  const handleAppClick = (appId: string) => {
    if (selectedApps.includes(appId as AppName)) {
      setSelectedApps(prev => prev.filter(a => a !== appId));
    } else {
      if (!selectedAccounts[appId] && MOCK_ACCOUNTS[appId]?.length > 0) {
        setSelectedAccounts(prev => ({...prev, [appId]: [MOCK_ACCOUNTS[appId][0].id]}));
      }
      setShowAccountModal(appId);
    }
  };

  const handleOptimize = () => {
    if (!description || selectedApps.length === 0) return;
    
    setIsOptimizing(true);
    // Simulate AI optimization delay
    setTimeout(() => {
      const drafts: Record<string, string> = {};
      selectedApps.forEach(app => {
        let prefix = '';
        let suffix = '';
        if (app === 'linkedin') { prefix = 'Excited to share an update on my professional journey. '; suffix = '\n\n#ProfessionalGrowth #Innovation'; }
        if (app === 'x') { suffix = ' 🚀 #buildinpublic'; }
        if (app === 'instagram') { suffix = '\n\n.\n.\n.\n#inspiration #daily #grow'; }
        if (app === 'github') { prefix = '🚀 Released new features: \n'; suffix = '\nCheck out the repo!'; }
        if (app === 'leetcode') { prefix = 'Another milestone reached! '; suffix = '\n#algorithms #dailycoding'; }
        
        drafts[app] = `${prefix}${description}${suffix}`;
      });
      setOptimizedDrafts(drafts);
      setIsOptimizing(false);
    }, 1500);
  };

  const handleScheduleToggle = () => {
    setIsScheduling(!isScheduling);
  };

  const handleSendOrSchedule = () => {
    if (isScheduling && scheduleDate && scheduleTime) {
      addScheduledPost({
        description,
        apps: selectedApps as AppName[],
        date: scheduleDate,
        time: scheduleTime
      });
      setDidSchedule(true);
      setTimeout(() => setDidSchedule(false), 3000);
      
      // Reset form
      setOptimizedDrafts({});
      setDescription('');
      setSelectedApps([]);
      setIsScheduling(false);
      setScheduleDate('');
      setScheduleTime('');
    } else {
      // Just immediately post (mock)
      setOptimizedDrafts({});
      setDescription('');
      setSelectedApps([]);
    }
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-20 space-y-8"
    >
      <header>
        <h1 className="text-xl font-semibold tracking-tight mb-2 text-text-primary">Studio AI Engine</h1>
        <p className="text-text-muted text-sm">Draft, optimize, and orchestrate your posts across all platforms with AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and configuration */}
        <div className="col-span-8 bg-bg-elevated border border-border rounded-[var(--radius-card)] flex flex-col p-6 gap-6 shadow-level-1">
          
          {/* Media Upload */}
          <div className="flex-1 bg-bg-canvas rounded-[var(--radius-card-inner)] p-8 border border-dashed border-border-strong flex flex-col items-center justify-center text-center hover:bg-bg-sunken transition-colors">
            <input type="file" multiple className="hidden" id="fileUpload" onChange={(e) => {
              if(e.target.files && e.target.files.length > 0) {
                 setUploadedFiles(Array.from(e.target.files));
              }
            }} />
            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center w-full">
              <UploadCloud className="w-12 h-12 mb-4 text-text-muted/50" />
              <p className="text-xs font-medium text-text-secondary">Drop your files here or click to upload</p>
              <p className="text-[10px] text-text-muted mt-1">Supports any file type compatible with your selected apps</p>
            </label>
            {uploadedFiles.length > 0 && (
                <div className="mt-4 w-full flex gap-2 flex-wrap justify-center">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-1 text-[10px] bg-bg-elevated border border-border pl-2 pr-1 py-1 rounded-[var(--radius-pill)] text-text-secondary max-w-[140px]">
                      <span className="truncate min-w-0 flex-1">{f.name}</span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setUploadedFiles(prev => prev.filter((_, index) => index !== i));
                        }}
                        className="p-0.5 hover:bg-bg-sunken rounded-full text-text-muted hover:text-error-text transition-colors flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Post Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell Synalytix what you want to share..."
              className="w-full p-4 bg-bg-canvas border border-border rounded-[var(--radius-input)] text-sm h-32 outline-none focus:border-brand transition-all resize-none text-text-primary"
            />
          </div>

          {/* Target App Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Select Destination Apps</label>
            {connectedApps.length === 0 ? (
              <div className="text-sm text-error-text bg-error-light p-4 rounded-[var(--radius-card-inner)] border border-error-text/20">
                You need to connect apps in the Settings section first.
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {connectedApps.filter(id => id !== 'leetcode').map(appId => {
                  const appInfo = MOCK_APPS.find(a => a.id === appId);
                  const isSelected = selectedApps.includes(appId);
                  return (
                    <button
                      key={appId}
                      onClick={() => handleAppClick(appId)}
                      className={`px-4 py-2 rounded-[var(--radius-button)] border text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-brand text-text-inverse border-brand shadow-level-1' 
                          : 'bg-bg-elevated text-text-secondary border-border hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-4 h-4 object-cover rounded-[var(--radius-badge)]" />
                        <span>{appInfo?.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            
            {selectedApps.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border-light space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Accounts Selected</label>
                <div className="flex flex-col gap-2">
                  {selectedApps.map(appId => {
                    const appInfo = MOCK_APPS.find(a => a.id === appId);
                    const accIds = selectedAccounts[appId] || [];
                    const accs = (MOCK_ACCOUNTS[appId] || []).filter(a => accIds.includes(a.id));
                    
                    if (accs.length === 0) return null;
                    
                    return (
                      <div key={appId} className="flex items-center gap-3 p-2 bg-bg-canvas rounded-[var(--radius-card-inner)] border border-border">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-brand/10 border border-brand/20 rounded-[var(--radius-badge)]">
                           <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-3 h-3 object-cover rounded-[var(--radius-badge)]" />
                           <span className="text-[10px] font-bold text-brand">{appInfo?.name}</span>
                        </div>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {accs.map(acc => (
                            <span key={acc.id} className="text-xs text-text-secondary font-medium bg-bg-elevated px-2 py-0.5 rounded-[var(--radius-badge)] border border-border-light">
                              {acc.name} <span className="text-[10px] text-text-muted ml-1">{acc.handle}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-light">
              <div className="flex gap-3 items-center">
                <button className="p-2 bg-brand-light rounded-[var(--radius-button)] text-brand">
                  <Sparkles className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-text-muted font-medium">AI will optimize for selected platforms</span>
              </div>
              <button 
                onClick={handleOptimize}
                disabled={isOptimizing || !description || selectedApps.length === 0}
                className="px-8 py-3 bg-brand text-text-inverse text-xs font-bold rounded-[var(--radius-button)] tracking-wide disabled:opacity-50 transition-all flex items-center gap-2 hover:bg-brand-hover shadow-level-1"
              >
                {isOptimizing ? 'OPTIMIZING...' : 'GENERATE DRAFTS'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Optimization and Post Execution */}
        <div className="col-span-4 flex flex-col gap-6">
            <AnimatePresence>
              {Object.keys(optimizedDrafts).length > 0 && !isOptimizing ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 flex-1 space-y-4 flex flex-col shadow-level-1"
                >
                  <h3 className="text-xs font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-text-primary">
                    <Sparkles className="w-3 h-3 text-brand" />
                    Optimized Drafts
                  </h3>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {selectedApps.map(appId => {
                      if (!optimizedDrafts[appId]) return null;
                      return (
                         <div key={appId} className="p-4 bg-bg-canvas border border-border rounded-[var(--radius-card-inner)] relative group">
                           <div className="flex items-center gap-2 mb-2">
                             <img src={MOCK_APPS.find(a=>a.id===appId)?.iconUrl} alt="icon" className="w-4 h-4 object-cover rounded-[var(--radius-badge)]" />
                             <div className="font-bold text-[10px] uppercase tracking-wider text-text-secondary">{MOCK_APPS.find(a=>a.id===appId)?.name}</div>
                           </div>
                           <p className="text-xs text-text-primary leading-relaxed whitespace-pre-wrap">{optimizedDrafts[appId]}</p>
                         </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border-light space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isScheduling} onChange={handleScheduleToggle} className="accent-brand w-4 h-4 rounded text-brand border-border" />
                      <span className="text-xs font-semibold text-text-primary">Schedule for later</span>
                    </label>

                    {isScheduling && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] uppercase tracking-wider font-bold text-text-muted mb-1 block">Date</label>
                          <div className="relative">
                            <Calendar className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                              type="date" 
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 text-xs bg-bg-canvas border border-border rounded-[var(--radius-input)] outline-none focus:border-brand text-text-primary" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-wider font-bold text-text-muted mb-1 block">Time</label>
                          <div className="relative">
                            <Clock className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input 
                              type="time" 
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 text-xs bg-bg-canvas border border-border rounded-[var(--radius-input)] outline-none focus:border-brand text-text-primary" 
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          saveDraft({ description, apps: selectedApps as AppName[], drafts: optimizedDrafts });
                          setOptimizedDrafts({});
                          setDescription('');
                          setSelectedApps([]);
                        }}
                        className="w-full py-3 text-xs font-bold bg-bg-elevated text-text-primary border border-border rounded-[var(--radius-button)] flex justify-center items-center gap-2 transition-colors hover:bg-bg-sunken"
                      >
                        <Save className="w-4 h-4" /> SAVE DRAFT
                      </button>
                      <button 
                        onClick={handleSendOrSchedule}
                        disabled={isScheduling && (!scheduleDate || !scheduleTime)}
                        className="w-full py-3 text-xs font-bold bg-brand text-text-inverse rounded-[var(--radius-button)] flex justify-center items-center gap-2 transition-colors hover:bg-brand-hover disabled:opacity-50 shadow-level-1"
                      >
                        {isScheduling ? 'SCHEDULE' : 'POST NOW'}
                      </button>
                    </div>
                    {didSchedule && <p className="text-[10px] text-success-text font-bold text-center flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3"/> Scheduled Successfully!</p>}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 flex-1 text-center flex flex-col justify-center items-center shadow-level-1">
                   <Sparkles className="w-8 h-8 text-text-muted/30 mb-4" />
                   <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Awaiting Input</p>
                </div>
              )}
            </AnimatePresence>
        </div>
      </div>

      {/* Scheduled Posts Display Area */}
      {scheduledPosts.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Scheduled Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledPosts.map(post => (
              <div key={post.id} className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 flex flex-col shadow-level-1 hover:border-border-strong transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning-text" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-warning-text">{post.date} at {post.time}</span>
                  </div>
                  <button onClick={() => deleteScheduledPost(post.id)} className="text-text-muted hover:text-error-text transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-text-primary line-clamp-3 mb-4 flex-1">
                  {post.description}
                </p>

                <div className="flex gap-2 items-center flex-wrap mt-auto pt-4 border-t border-border-light">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-text-muted mr-1">Platforms:</span>
                  {post.apps.map(app => {
                    const appInfo = MOCK_APPS.find(a => a.id === app);
                    return (
                      <span key={app} className={`px-2 py-0.5 rounded-[var(--radius-badge)] text-[9px] font-bold text-text-primary bg-bg-canvas flex items-center gap-1.5 border border-border`}>
                        <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-3 h-3 object-cover rounded-[var(--radius-badge)]" />
                        {appInfo?.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Drafted Posts Display Area */}
      {savedDrafts.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Saved Drafts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDrafts.map(draft => (
              <div key={draft.id} className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 flex flex-col shadow-level-1 hover:border-border-strong transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4 text-text-muted" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Drafted</span>
                  </div>
                  <button onClick={() => deleteDraft(draft.id)} className="text-text-muted hover:text-error-text transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-text-primary line-clamp-3 mb-4 flex-1">
                  {draft.description}
                </p>

                <div className="flex gap-2 items-center flex-wrap mt-auto pt-4 border-t border-border-light mb-4">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-text-muted mr-1">Platforms:</span>
                  {draft.apps.map(app => {
                    const appInfo = MOCK_APPS.find(a => a.id === app);
                    return (
                      <span key={app} className={`px-2 py-0.5 rounded-[var(--radius-badge)] text-[9px] font-bold text-text-primary bg-bg-canvas flex items-center gap-1.5 border border-border`}>
                        <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-3 h-3 object-cover rounded-[var(--radius-badge)]" />
                        {appInfo?.name}
                      </span>
                    )
                  })}
                </div>
                <button 
                  onClick={() => {
                    setDescription(draft.description);
                    setSelectedApps(draft.apps);
                    if (draft.drafts) setOptimizedDrafts(draft.drafts);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-bg-canvas border border-border text-text-primary text-xs font-semibold rounded-[var(--radius-button)] hover:bg-bg-sunken transition-colors"
                >
                  Edit Draft
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>

      {/* Account Selection Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <div className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 max-w-sm w-full shadow-level-2">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Select accounts for {MOCK_APPS.find(a => a.id === showAccountModal)?.name}</h3>
              <div className="space-y-3 mb-6">
                {(MOCK_ACCOUNTS[showAccountModal] || []).map(acc => (
                  <label key={acc.id} className="flex items-center gap-3 p-3 rounded-[var(--radius-card-inner)] border border-border cursor-pointer hover:bg-bg-sunken">
                    <input type="checkbox" className="accent-brand" 
                      checked={selectedAccounts[showAccountModal]?.includes(acc.id) || false} 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccounts(prev => ({...prev, [showAccountModal]: [...(prev[showAccountModal]||[]), acc.id]}));
                        } else {
                          setSelectedAccounts(prev => ({...prev, [showAccountModal]: (prev[showAccountModal]||[]).filter(id => id !== acc.id)}));
                        }
                      }} 
                    />
                    <div>
                      <div className="text-sm font-medium text-text-primary">{acc.name}</div>
                      <div className="text-xs text-text-muted">{acc.handle}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAccountModal(null)} className="flex-1 py-2 text-xs font-semibold text-text-primary border border-border rounded-[var(--radius-button)] hover:bg-bg-sunken transition-colors">Cancel</button>
                <button onClick={() => {
                  if (selectedAccounts[showAccountModal]?.length > 0) {
                    setSelectedApps(prev => [...prev, showAccountModal as AppName]);
                    setShowAccountModal(null);
                  } else {
                    toast.error('Select at least one account');
                  }
                }} className="flex-1 py-2 text-xs font-semibold text-text-inverse bg-brand rounded-[var(--radius-button)] hover:bg-brand-hover transition-colors">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
