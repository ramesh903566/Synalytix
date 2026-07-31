import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, Trash2, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_APPS } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { AppName } from '../types';
import toast from 'react-hot-toast';

import { useStudioStore } from '../store/studioStore';
import { useGenerateDrafts } from '../lib/studio/api';

import { FileDropzone } from '../components/studio/FileDropzone';
import { UploadedFilesPanel } from '../components/studio/UploadedFilesPanel';
import { DestinationAppSelector } from '../components/studio/DestinationAppSelector';
import { PostPreviewPanel } from '../components/studio/PostPreviewPanel';
import { GitHubPublishDetailsModal } from '../components/studio/GitHubPublishDetailsModal';

const MOCK_ACCOUNTS: Record<string, {id: string, name: string, handle: string}[]> = {
  instagram: [{id: 'ig_1', name: 'Synalytix HQ', handle: '@synalytix'}],
  x: [{id: 'x_1', name: 'Synalytix', handle: '@synalytix_app'}],
  linkedin: [{id: 'li_1', name: 'Synalytix AI', handle: 'synalytix-company'}],
  github: [{id: 'gh_1', name: 'Synalytix', handle: 'synalytix-hq'}],
  leetcode: [{id: 'lc_1', name: 'Synalytix', handle: 'synalytix_dev'}],
};

export default function Studio() {
  const { connectedApps, scheduledPosts, addScheduledPost, deleteScheduledPost, saveDraft, savedDrafts, deleteDraft } = useAppContext();
  
  const { 
    postDescription, 
    setPostDescription, 
    selectedApps, 
    setSelectedApps, 
    uploadedFiles, 
    optimizedDrafts, 
    setOptimizedDrafts,
    resetStudio 
  } = useStudioStore();

  const generateDraftsMutation = useGenerateDrafts();

  const [showAccountModal, setShowAccountModal] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, string[]>>({});

  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [didSchedule, setDidSchedule] = useState(false);

  const [githubModalFileId, setGithubModalFileId] = useState<string | null>(null);

  // Auto-select based on file uploads is now partially handled by the capabilities check, 
  // but we can retain the suggestion logic here if needed.
  useEffect(() => {
    if (uploadedFiles.length > 0 && selectedApps.length === 0) {
      const fileNames = uploadedFiles.map(f => f.file.name.toLowerCase());
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
        
        setSelectedApps(Array.from(new Set([...selectedApps, ...availableAndSuggested])) as AppName[]);
        toast.success('AI auto-selected platforms based on uploaded content type');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles.length, connectedApps]);

  const handleOptimize = () => {
    if (!postDescription || selectedApps.length === 0) return;
    
    generateDraftsMutation.mutate(
      { description: postDescription, apps: selectedApps },
      {
        onSuccess: (drafts) => {
          setOptimizedDrafts(drafts);
        }
      }
    );
  };

  const handleSendOrSchedule = () => {
    if (isScheduling && scheduleDate && scheduleTime) {
      addScheduledPost({
        description: postDescription,
        apps: selectedApps,
        date: scheduleDate,
        time: scheduleTime
      });
      setDidSchedule(true);
      setTimeout(() => setDidSchedule(false), 3000);
      
      // Reset form
      resetStudio();
      setIsScheduling(false);
      setScheduleDate('');
      setScheduleTime('');
    } else {
      // Post now logic (mocked)
      toast.success('Post submitted successfully!');
      resetStudio();
    }
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto pb-20 space-y-8"
    >
      <header>
        <h1 className="text-xl font-semibold tracking-tight mb-2 text-text-primary">Studio AI Engine</h1>
        <p className="text-text-muted text-sm">Draft, optimize, and orchestrate your posts across all platforms with AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and configuration */}
        <div className="col-span-12 lg:col-span-7 bg-bg-elevated border border-border rounded-[var(--radius-card)] flex flex-col p-6 gap-6 shadow-level-1">
          
          <FileDropzone />
          <UploadedFilesPanel onOpenGithubModal={setGithubModalFileId} />

          {/* Description Input */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Post Description</label>
            <textarea
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              placeholder="Tell Synalytix what you want to share..."
              className="w-full p-4 bg-bg-canvas border border-border rounded-[var(--radius-input)] text-sm h-32 outline-none focus:border-brand transition-all resize-none text-text-primary"
            />
          </div>

          <DestinationAppSelector 
            onShowAccountModal={setShowAccountModal} 
            selectedAccounts={selectedAccounts} 
          />
          
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-light">
            <div className="flex gap-3 items-center">
              <button className="p-2 bg-brand-light rounded-[var(--radius-button)] text-brand">
                <Sparkles className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-text-muted font-medium">AI will optimize for selected platforms</span>
            </div>
            <button 
              onClick={handleOptimize}
              disabled={generateDraftsMutation.isPending || !postDescription || selectedApps.length === 0}
              className="px-8 py-3 bg-brand text-text-inverse text-xs font-bold rounded-[var(--radius-button)] tracking-wide disabled:opacity-50 transition-all flex items-center gap-2 hover:bg-brand-hover shadow-level-1"
            >
              {generateDraftsMutation.isPending ? 'OPTIMIZING...' : 'GENERATE DRAFTS'}
            </button>
          </div>
        </div>

        {/* Right Column: AI Optimization and Post Execution */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <PostPreviewPanel 
            onOpenGithubModal={setGithubModalFileId} 
            isGenerating={generateDraftsMutation.isPending}
          />

          <AnimatePresence>
            {Object.keys(optimizedDrafts).length > 0 && !generateDraftsMutation.isPending && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 space-y-4 flex flex-col shadow-level-1"
              >
                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isScheduling} onChange={() => setIsScheduling(!isScheduling)} className="accent-brand w-4 h-4 rounded text-brand border-border" />
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
                        saveDraft({ description: postDescription, apps: selectedApps, drafts: optimizedDrafts });
                        resetStudio();
                        toast.success('Draft saved successfully');
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
                    setPostDescription(draft.description);
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
                    setSelectedApps([...selectedApps, showAccountModal as AppName]);
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

      <GitHubPublishDetailsModal 
        isOpen={githubModalFileId !== null} 
        onClose={() => setGithubModalFileId(null)} 
        fileId={githubModalFileId} 
      />
    </>
  );
}
