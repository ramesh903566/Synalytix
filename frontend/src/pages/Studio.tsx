import { useState } from 'react';
import { UploadCloud, Sparkles, Calendar, Clock, CheckCircle2, Trash2, Save, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MOCK_APPS } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { AppName } from '../types';

export default function Studio() {
  const { connectedApps, scheduledPosts, addScheduledPost, deleteScheduledPost, saveDraft, savedDrafts, deleteDraft } = useAppContext();
  const [description, setDescription] = useState('');
  const [selectedApps, setSelectedApps] = useState<AppName[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedDrafts, setOptimizedDrafts] = useState<Record<string, string>>({});
  
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [didSchedule, setDidSchedule] = useState(false);

  const handleAppToggle = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId as AppName) ? prev.filter(a => a !== appId) : [...prev, appId as AppName]
    );
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <header className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight mb-2 text-[#1A1A1A]">Studio AI Engine</h1>
        <p className="text-[#666] text-sm font-light">Draft, optimize, and orchestrate your posts across all platforms with AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and configuration */}
        <div className="col-span-8 bg-white border border-[#EFEFEF] rounded-2xl flex flex-col p-6 gap-6">
          
          {/* Media Upload */}
          <div className="flex-1 bg-neutral-50 rounded-xl p-8 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center hover:bg-neutral-100 transition-colors">
            <input type="file" multiple className="hidden" id="fileUpload" onChange={(e) => {
              if(e.target.files && e.target.files.length > 0) {
                 setUploadedFiles(Array.from(e.target.files));
              }
            }} />
            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center w-full">
              <UploadCloud className="w-12 h-12 mb-4 text-neutral-300" />
              <p className="text-xs text-[#666]">Drop your files here or click to upload</p>
              <p className="text-[10px] text-neutral-400 mt-1">Supports any file type compatible with your selected apps</p>
            </label>
            {uploadedFiles.length > 0 && (
                <div className="mt-4 w-full flex gap-2 flex-wrap justify-center">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-1 text-[10px] bg-white border border-neutral-200 pl-2 pr-1 py-1 rounded-full text-neutral-600 max-w-[140px]">
                      <span className="truncate min-w-0 flex-1">{f.name}</span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setUploadedFiles(prev => prev.filter((_, index) => index !== i));
                        }}
                        className="p-0.5 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
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
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Post Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell Synalytix what you want to share..."
              className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm h-32 outline-none focus:border-black transition-all resize-none text-[#1A1A1A]"
            />
          </div>

          {/* Target App Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Select Destination Apps</label>
            {connectedApps.length === 0 ? (
              <div className="text-sm font-light text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                You need to connect apps in the Apps section first.
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {connectedApps.map(appId => {
                  const appInfo = MOCK_APPS.find(a => a.id === appId);
                  const isSelected = selectedApps.includes(appId);
                  return (
                    <button
                      key={appId}
                      onClick={() => handleAppToggle(appId)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-[#666] border-[#EFEFEF] hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-4 h-4 object-cover rounded-full" />
                        <span>{appInfo?.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#F5F5F5]">
              <div className="flex gap-3 items-center">
                <button className="p-2 bg-neutral-100 rounded-lg text-neutral-600">
                  <Sparkles className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-neutral-400">AI will optimize for selected platforms</span>
              </div>
              <button 
                onClick={handleOptimize}
                disabled={isOptimizing || !description || selectedApps.length === 0}
                className="px-8 py-3 bg-black text-white text-xs font-bold rounded-xl tracking-wide disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isOptimizing ? 'OPTIMIZING...' : 'GENERATE DRAFTS'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Optimization and Post Execution */}
        <div className="col-span-4 flex flex-col gap-6">
            {/* AI Results */}
            <AnimatePresence>
              {Object.keys(optimizedDrafts).length > 0 && !isOptimizing ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-[#EFEFEF] rounded-2xl p-6 flex-1 space-y-4 flex flex-col"
                >
                  <h3 className="text-xs font-semibold mb-4 flex items-center gap-2 uppercase tracking-widest text-[#1A1A1A]">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    Optimized Drafts
                  </h3>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {selectedApps.map(appId => {
                      if (!optimizedDrafts[appId]) return null;
                      return (
                         <div key={appId} className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl relative group">
                           <div className="flex items-center gap-2 mb-2">
                             <img src={MOCK_APPS.find(a=>a.id===appId)?.iconUrl} alt="icon" className="w-4 h-4 object-cover rounded-full" />
                             <div className="font-semibold text-[10px] uppercase tracking-widest text-[#999]">{MOCK_APPS.find(a=>a.id===appId)?.name}</div>
                           </div>
                           <p className="text-[11px] text-[#666] leading-relaxed whitespace-pre-wrap">{optimizedDrafts[appId]}</p>
                         </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#F5F5F5] space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isScheduling} onChange={handleScheduleToggle} className="accent-black w-4 h-4 rounded" />
                      <span className="text-xs font-semibold text-[#1A1A1A]">Schedule for later</span>
                    </label>

                    {isScheduling && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] uppercase tracking-widest font-bold text-[#999] mb-1 block">Date</label>
                          <div className="relative">
                            <Calendar className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                            <input 
                              type="date" 
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-black" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-widest font-bold text-[#999] mb-1 block">Time</label>
                          <div className="relative">
                            <Clock className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                            <input 
                              type="time" 
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-black" 
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
                        className="w-full py-3 text-xs font-bold bg-white text-black border border-black rounded-lg flex justify-center items-center gap-2 transition-all hover:bg-neutral-50"
                      >
                        <Save className="w-4 h-4" /> SAVE TO DRAFT
                      </button>
                      <button 
                        onClick={handleSendOrSchedule}
                        disabled={isScheduling && (!scheduleDate || !scheduleTime)}
                        className="w-full py-3 text-xs font-bold bg-black text-white rounded-lg flex justify-center items-center gap-2 transition-all hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {isScheduling ? 'SCHEDULE POST' : 'CONFIRM & SEND'}
                      </button>
                    </div>
                    {didSchedule && <p className="text-[10px] text-green-600 font-bold text-center flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3"/> Scheduled Successfully!</p>}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white border border-[#EFEFEF] rounded-2xl p-6 flex-1 text-center flex flex-col justify-center items-center">
                   <Sparkles className="w-8 h-8 text-neutral-200 mb-4" />
                   <p className="text-xs text-[#999] font-medium uppercase tracking-widest">Awaiting Input</p>
                </div>
              )}
            </AnimatePresence>
        </div>
      </div>

      {/* Scheduled Posts Display Area */}
      {scheduledPosts.length > 0 && (
        <div className="mt-8 mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">Scheduled Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledPosts.map(post => (
              <div key={post.id} className="bg-white border border-[#EFEFEF] rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">{post.date} at {post.time}</span>
                  </div>
                  <button onClick={() => deleteScheduledPost(post.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-[#1A1A1A] line-clamp-3 mb-4 flex-1">
                  {post.description}
                </p>

                <div className="flex gap-2 items-center flex-wrap mt-auto pt-4 border-t border-[#F5F5F5]">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#999] mr-2">Platforms:</span>
                  {post.apps.map(app => {
                    const appInfo = MOCK_APPS.find(a => a.id === app);
                    return (
                      <span key={app} className={`px-2 py-0.5 rounded text-[9px] font-bold text-white bg-neutral-800 flex items-center gap-1.5 border border-neutral-700`}>
                        <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-3 h-3 object-cover rounded-full" />
                        {appInfo?.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drafted Posts Display Area */}
      {savedDrafts.length > 0 && (
        <div className="mt-8 mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">Saved Drafts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDrafts.map(draft => (
              <div key={draft.id} className="bg-white border border-[#EFEFEF] rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Drafted</span>
                  </div>
                  <button onClick={() => deleteDraft(draft.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-[#1A1A1A] line-clamp-3 mb-4 flex-1">
                  {draft.description}
                </p>

                <div className="flex gap-2 items-center flex-wrap mt-auto pt-4 border-t border-[#F5F5F5] mb-4">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#999] mr-2">Platforms:</span>
                  {draft.apps.map(app => {
                    const appInfo = MOCK_APPS.find(a => a.id === app);
                    return (
                      <span key={app} className={`px-2 py-0.5 rounded text-[9px] font-bold text-white bg-neutral-800 flex items-center gap-1.5 border border-neutral-700`}>
                        <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-3 h-3 object-cover rounded-full" />
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
                  className="w-full py-2 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Edit Draft
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
