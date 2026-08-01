import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { Trash2, FileText, Image as ImageIcon, Video, Grid, List, Check, Settings } from 'lucide-react';
import { APP_REGISTRY } from '../../lib/appRegistry';
import { AppName } from '../../types';

interface UploadedFilesPanelProps {
  onOpenGithubModal: (fileId: string) => void;
}

export const UploadedFilesPanel: React.FC<UploadedFilesPanelProps> = ({ onOpenGithubModal }) => {
  const { uploadedFiles } = useStudioStore();
  const [view, setView] = useState<'list' | 'grid'>('list');

  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Uploaded Files ({uploadedFiles.length})
        </h3>
        <div className="flex bg-bg-canvas rounded-[var(--radius-button)] border border-border p-1">
          <button 
            onClick={() => setView('list')} 
            className={`p-1.5 rounded-sm transition-colors ${view === 'list' ? 'bg-bg-elevated shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('grid')} 
            className={`p-1.5 rounded-sm transition-colors ${view === 'grid' ? 'bg-bg-elevated shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <FileListView onOpenGithubModal={onOpenGithubModal} />
      ) : (
        <FileGridView onOpenGithubModal={onOpenGithubModal} />
      )}
    </div>
  );
};

const FileIcon = ({ type, className }: { type: string, className?: string }) => {
  if (type.startsWith('image/')) return <ImageIcon className={className} />;
  if (type.startsWith('video/')) return <Video className={className} />;
  return <FileText className={className} />;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const FileListView: React.FC<{ onOpenGithubModal: (fileId: string) => void }> = ({ onOpenGithubModal }) => {
  const { uploadedFiles, selectedApps, perAppInclusion, setPerAppInclusion, removeFile, githubPublishConfigByFileId } = useStudioStore();

  return (
    <div className="flex flex-col gap-2">
      {uploadedFiles.map(fileObj => {
        const { id, file, objectUrl } = fileObj;
        return (
          <div key={id} className="flex items-center gap-4 p-3 bg-bg-canvas border border-border rounded-[var(--radius-card-inner)] hover:border-border-strong transition-colors">
            {objectUrl && file.type.startsWith('image/') ? (
              <img src={objectUrl} alt={file.name} className="w-10 h-10 object-cover rounded-[var(--radius-badge)] border border-border flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-bg-elevated rounded-[var(--radius-badge)] border border-border flex items-center justify-center flex-shrink-0">
                <FileIcon type={file.type} className="w-5 h-5 text-text-muted" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate" title={file.name}>{file.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded-[var(--radius-badge)]">{formatSize(file.size)}</span>
                
                {selectedApps.includes('github') && githubPublishConfigByFileId[id] && (
                  <span className="text-[10px] font-bold text-success-text bg-success-light px-1.5 py-0.5 rounded-[var(--radius-badge)] border border-success-text/20">
                    Configured for GitHub → {githubPublishConfigByFileId[id].repo}
                  </span>
                )}
                {selectedApps.includes('github') && !githubPublishConfigByFileId[id] && (
                  <button 
                    onClick={() => onOpenGithubModal(id)}
                    className="text-[10px] font-bold text-brand hover:underline flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" /> Configure GitHub
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {selectedApps.map(app => {
                const appInfo = APP_REGISTRY.find(a => a.id === app);
                const isIncluded = perAppInclusion[id]?.[app];
                const isCompatible = isIncluded !== undefined; // If it's undefined, it means our capabilities didn't even register it. Actually wait, it's boolean.

                return (
                  <button
                    key={app}
                    disabled={!isCompatible}
                    onClick={() => setPerAppInclusion(id, app, !isIncluded)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-[var(--radius-badge)] text-[10px] font-bold transition-all border
                      ${isIncluded 
                        ? 'bg-brand/10 border-brand/20 text-brand' 
                        : 'bg-bg-elevated border-border text-text-muted opacity-50 hover:opacity-100'}
                    `}
                    title={`Include in ${appInfo?.name}`}
                  >
                    <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-3 h-3 rounded-[var(--radius-badge)]" />
                    {isIncluded && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
              
              <div className="w-px h-6 bg-border mx-2"></div>
              
              <button 
                onClick={() => removeFile(id)}
                className="p-2 text-text-muted hover:text-error-text rounded-full hover:bg-error-light/50 transition-colors"
                aria-label="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FileGridView: React.FC<{ onOpenGithubModal: (fileId: string) => void }> = ({ onOpenGithubModal }) => {
  const { uploadedFiles, removeFile, selectedApps, githubPublishConfigByFileId } = useStudioStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {uploadedFiles.map(fileObj => {
        const { id, file, objectUrl } = fileObj;
        
        return (
          <div 
            key={id} 
            className="group relative aspect-square bg-bg-canvas border border-border rounded-[var(--radius-card-inner)] overflow-hidden hover:border-brand transition-colors cursor-pointer"
            onClick={() => {
              if (selectedApps.includes('github') && !githubPublishConfigByFileId[id]) {
                onOpenGithubModal(id);
              }
            }}
          >
            {objectUrl && file.type.startsWith('image/') ? (
              <img src={objectUrl} alt={file.name} className="w-full h-full object-cover" />
            ) : objectUrl && file.type.startsWith('video/') ? (
              <div className="w-full h-full relative">
                <video src={objectUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                   <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                     <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <FileIcon type={file.type} className="w-8 h-8 text-text-muted mb-2" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider text-center break-all line-clamp-2">
                  .{file.name.split('.').pop()}
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col">
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(id); }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white hover:text-error-text rounded-full transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              
              <div className="mt-auto">
                <p className="text-xs font-medium text-white truncate">{file.name}</p>
                <p className="text-[10px] text-white/70">{formatSize(file.size)}</p>
                
                {selectedApps.includes('github') && (
                   githubPublishConfigByFileId[id] ? (
                     <span className="inline-block mt-1 text-[8px] font-bold text-success-text bg-success-text/20 px-1 rounded-sm">
                       Configured for GitHub
                     </span>
                   ) : (
                     <span className="inline-block mt-1 text-[8px] font-bold text-brand bg-brand/20 px-1 rounded-sm border border-brand/50">
                       Click to configure GitHub
                     </span>
                   )
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
