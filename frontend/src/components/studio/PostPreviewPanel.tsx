import React, { useEffect, useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { Sparkles, Github } from 'lucide-react';
import { MOCK_APPS } from '../../data/mockData';
import { AppName } from '../../types';

interface PostPreviewPanelProps {
  onOpenGithubModal: (fileId: string) => void;
  isGenerating: boolean;
}

export const PostPreviewPanel: React.FC<PostPreviewPanelProps> = ({ onOpenGithubModal, isGenerating }) => {
  const { selectedApps, activePreviewTab, setActivePreviewTab, postDescription, uploadedFiles, optimizedDrafts } = useStudioStore();

  // Ensure activePreviewTab is valid if selectedApps changes
  useEffect(() => {
    if (selectedApps.length > 0) {
      if (!activePreviewTab || !selectedApps.includes(activePreviewTab)) {
        setActivePreviewTab(selectedApps[0]);
      }
    } else {
      setActivePreviewTab(null);
    }
  }, [selectedApps, activePreviewTab, setActivePreviewTab]);

  if (selectedApps.length === 0 && !postDescription && uploadedFiles.length === 0) {
    return (
      <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 flex-1 text-center flex flex-col justify-center items-center shadow-level-1 h-full min-h-[400px]">
        <Sparkles className="w-8 h-8 text-text-muted/30 mb-4" />
        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">Awaiting Input</p>
      </div>
    );
  }

  if (selectedApps.length === 0) {
    return (
      <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] p-6 flex-1 text-center flex flex-col justify-center items-center shadow-level-1 h-full min-h-[400px]">
        <p className="text-sm text-text-secondary font-medium">Select a destination to preview your post</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-elevated border border-border rounded-[var(--radius-card)] flex flex-col shadow-level-1 h-full min-h-[400px] overflow-hidden">
      {/* Tab Strip */}
      <div className="flex bg-bg-canvas border-b border-border p-2 gap-2 overflow-x-auto custom-scrollbar">
        {selectedApps.map(app => {
          const appInfo = MOCK_APPS.find(a => a.id === app);
          const isActive = activePreviewTab === app;
          return (
            <button
              key={app}
              onClick={() => setActivePreviewTab(app)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-badge)] text-xs font-bold transition-all flex-shrink-0
                ${isActive ? 'bg-bg-elevated border border-border text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}
              `}
            >
              <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-4 h-4 rounded-[var(--radius-badge)]" />
              {appInfo?.name}
            </button>
          );
        })}
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-bg-canvas/50">
        {isGenerating ? (
           <div className="flex flex-col gap-4 animate-pulse">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-border"></div>
               <div className="space-y-2">
                 <div className="w-24 h-3 bg-border rounded"></div>
                 <div className="w-16 h-2 bg-border rounded"></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="w-full h-4 bg-border rounded"></div>
               <div className="w-full h-4 bg-border rounded"></div>
               <div className="w-3/4 h-4 bg-border rounded"></div>
             </div>
             <div className="w-full h-48 bg-border rounded-[var(--radius-card)] mt-2"></div>
           </div>
        ) : (
          <>
            {activePreviewTab === 'instagram' && <InstagramPreviewCard />}
            {activePreviewTab === 'x' && <XPreviewCard />}
            {activePreviewTab === 'linkedin' && <LinkedInPreviewCard />}
            {activePreviewTab === 'github' && <GitHubPublishSummaryCard onOpenGithubModal={onOpenGithubModal} />}
            {/* Fallback for others if any */}
            {!['instagram', 'x', 'linkedin', 'github'].includes(activePreviewTab || '') && activePreviewTab && (
              <GenericPreviewCard app={activePreviewTab} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// --- App-specific Previews ---

const usePreviewContent = (app: AppName) => {
  const { postDescription, uploadedFiles, perAppInclusion, optimizedDrafts } = useStudioStore();
  const text = optimizedDrafts[app] || postDescription;
  const files = uploadedFiles.filter(f => perAppInclusion[f.id]?.[app] === true);
  return { text, files };
};

const InstagramPreviewCard = () => {
  const { text, files } = usePreviewContent('instagram');
  const hasMedia = files.length > 0;
  
  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center p-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-0.5">
          <div className="w-full h-full bg-white rounded-full border border-white"></div>
        </div>
        <div className="ml-2 font-semibold text-xs text-gray-900">synalytix</div>
      </div>
      
      {hasMedia ? (
        <div className="aspect-square bg-gray-100 relative">
          {files[0].file.type.startsWith('image/') ? (
            <img src={files[0].objectUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xs">Video Preview</div>
          )}
        </div>
      ) : (
        <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-xs p-4 text-center">
          Add images or video for Instagram
        </div>
      )}

      <div className="p-3 text-sm text-gray-900 whitespace-pre-wrap">
        <span className="font-semibold mr-2">synalytix</span>
        {text}
        
        <div className="mt-2 text-[10px] text-gray-400 font-medium">
          {text.length}/2200 characters
        </div>
      </div>
    </div>
  );
};

const XPreviewCard = () => {
  const { text, files } = usePreviewContent('x');
  const isOverLimit = text.length > 280;

  return (
    <div className="max-w-md mx-auto bg-black text-white p-4 rounded-xl border border-gray-800">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm">Synalytix</span>
            <span className="text-gray-500 text-sm">@synalytix_app</span>
          </div>
          <div className="text-sm mt-1 whitespace-pre-wrap">
            {text || <span className="text-gray-600">What's happening?</span>}
          </div>
          
          {files.length > 0 && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800 flex max-h-64">
              {files.slice(0, 4).map((f, i) => (
                <div key={i} className={`flex-1 border-r border-gray-800 last:border-0 ${files.length > 1 ? 'aspect-[3/4]' : ''}`}>
                  {f.file.type.startsWith('image/') ? (
                    <img src={f.objectUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-xs">Media</div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className={`mt-3 text-xs font-bold ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
            {text.length}/280
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkedInPreviewCard = () => {
  const { text, files } = usePreviewContent('linkedin');

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center p-4">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="ml-3">
          <div className="font-bold text-sm text-gray-900">Synalytix AI</div>
          <div className="text-xs text-gray-500">10,492 followers</div>
          <div className="text-[10px] text-gray-400 flex items-center gap-1">Now • 🌐</div>
        </div>
      </div>
      
      <div className="px-4 pb-2 text-sm text-gray-900 whitespace-pre-wrap">
        {text}
      </div>

      {files.length > 0 && (
        <div className="bg-gray-100 max-h-80 overflow-hidden">
          {files[0].file.type.startsWith('image/') ? (
             <img src={files[0].objectUrl} alt="preview" className="w-full h-auto object-cover" />
          ) : files[0].file.type.startsWith('video/') ? (
             <div className="w-full h-48 flex items-center justify-center bg-gray-800 text-white text-xs">Video Player</div>
          ) : (
             <div className="w-full p-6 border-t border-gray-300 flex items-center gap-4 bg-white">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center font-bold text-xs">PDF</div>
                <div className="font-semibold text-sm">{files[0].file.name}</div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

const GitHubPublishSummaryCard = ({ onOpenGithubModal }: { onOpenGithubModal: (fileId: string) => void }) => {
  const { text, files } = usePreviewContent('github');
  const { githubPublishConfigByFileId } = useStudioStore();

  const configuredFiles = files.filter(f => githubPublishConfigByFileId[f.id]);
  const unconfiguredFiles = files.filter(f => !githubPublishConfigByFileId[f.id]);

  return (
    <div className="max-w-md mx-auto bg-bg-canvas border border-border rounded-[var(--radius-card)] p-5">
      <div className="flex items-center gap-3 mb-6 border-b border-border-light pb-4">
        <Github className="w-6 h-6 text-text-primary" />
        <div>
          <h4 className="text-sm font-bold text-text-primary">GitHub Publish Summary</h4>
          <p className="text-xs text-text-muted">Review files scheduled for commit</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
           <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Commit Description (Optional)</p>
           <p className="text-xs text-text-primary bg-bg-elevated p-3 rounded-[var(--radius-input)] border border-border whitespace-pre-wrap">
             {text || <span className="text-text-muted italic">No description provided</span>}
           </p>
        </div>

        <div>
           <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 flex justify-between items-center">
             Files ({files.length})
           </p>
           
           {files.length === 0 && (
             <p className="text-xs text-text-muted italic bg-bg-elevated p-3 rounded-[var(--radius-input)] border border-border border-dashed text-center">
               No files included for GitHub
             </p>
           )}

           <div className="space-y-2">
             {configuredFiles.map(f => {
               const config = githubPublishConfigByFileId[f.id];
               return (
                 <div key={f.id} className="p-3 bg-success-light/30 border border-success-text/30 rounded-[var(--radius-card-inner)] flex justify-between items-center">
                   <span className="text-sm font-medium text-text-primary truncate">{f.file.name}</span>
                   <span className="text-[10px] font-bold text-success-text px-2 py-1 bg-success-light rounded-[var(--radius-badge)]">
                     {config.owner}/{config.repo} ({config.branch})
                   </span>
                 </div>
               );
             })}
             
             {unconfiguredFiles.map(f => (
                <div key={f.id} className="p-3 bg-bg-elevated border border-border rounded-[var(--radius-card-inner)] flex justify-between items-center">
                   <span className="text-sm font-medium text-text-primary truncate">{f.file.name}</span>
                   <button 
                     onClick={() => onOpenGithubModal(f.id)}
                     className="text-[10px] font-bold text-brand bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-[var(--radius-button)] transition-colors"
                   >
                     Configure Target
                   </button>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const GenericPreviewCard = ({ app }: { app: AppName }) => (
  <div className="max-w-md mx-auto bg-bg-canvas border border-border rounded-[var(--radius-card)] p-8 text-center">
    <p className="text-sm text-text-primary font-medium">Preview for {app} is not available.</p>
  </div>
);
