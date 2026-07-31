import { create } from 'zustand';
import { AppName } from '../types';

export interface GitHubPublishConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  message?: string;
}

export interface StudioFile {
  id: string; // Unique ID for state tracking
  file: File; // The actual file object
  objectUrl?: string; // URL for previews
}

interface StudioState {
  uploadedFiles: StudioFile[];
  selectedApps: AppName[];
  postDescription: string;
  activePreviewTab: AppName | null;
  githubPublishConfigByFileId: Record<string, GitHubPublishConfig>;
  perAppInclusion: Record<string, Record<AppName, boolean>>; // fileId -> { appName -> boolean }
  optimizedDrafts: Record<AppName, string>;

  // Actions
  setUploadedFiles: (files: StudioFile[]) => void;
  addUploadedFiles: (files: StudioFile[], initialInclusion: Record<string, Record<AppName, boolean>>) => void;
  removeFile: (fileId: string) => void;
  setSelectedApps: (apps: AppName[]) => void;
  setPostDescription: (description: string) => void;
  setActivePreviewTab: (tab: AppName | null) => void;
  setGithubPublishConfig: (fileId: string, config: GitHubPublishConfig) => void;
  setPerAppInclusion: (fileId: string, app: AppName, included: boolean) => void;
  setOptimizedDrafts: (drafts: Record<AppName, string>) => void;
  resetStudio: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  uploadedFiles: [],
  selectedApps: [],
  postDescription: '',
  activePreviewTab: null,
  githubPublishConfigByFileId: {},
  perAppInclusion: {},
  optimizedDrafts: {} as Record<AppName, string>,

  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  
  addUploadedFiles: (files, initialInclusion) => set((state) => ({ 
    uploadedFiles: [...state.uploadedFiles, ...files],
    perAppInclusion: { ...state.perAppInclusion, ...initialInclusion }
  })),

  removeFile: (fileId) => set((state) => {
    // Revoke object URL to avoid memory leaks
    const fileToRemove = state.uploadedFiles.find(f => f.id === fileId);
    if (fileToRemove?.objectUrl) {
      URL.revokeObjectURL(fileToRemove.objectUrl);
    }
    
    // Clean up associated inclusion and github config state
    const newPerAppInclusion = { ...state.perAppInclusion };
    delete newPerAppInclusion[fileId];

    const newGithubConfig = { ...state.githubPublishConfigByFileId };
    delete newGithubConfig[fileId];

    return {
      uploadedFiles: state.uploadedFiles.filter((f) => f.id !== fileId),
      perAppInclusion: newPerAppInclusion,
      githubPublishConfigByFileId: newGithubConfig,
    };
  }),

  setSelectedApps: (apps) => set((state) => {
    // When selected apps change, if the active tab is no longer selected, reset it
    const activePreviewTab = state.activePreviewTab && apps.includes(state.activePreviewTab) 
      ? state.activePreviewTab 
      : (apps.length > 0 ? apps[0] : null);

    return { selectedApps: apps, activePreviewTab };
  }),

  setPostDescription: (description) => set({ postDescription: description }),
  
  setActivePreviewTab: (tab) => set({ activePreviewTab: tab }),

  setGithubPublishConfig: (fileId, config) => set((state) => ({
    githubPublishConfigByFileId: {
      ...state.githubPublishConfigByFileId,
      [fileId]: config,
    }
  })),

  setPerAppInclusion: (fileId, app, included) => set((state) => ({
    perAppInclusion: {
      ...state.perAppInclusion,
      [fileId]: {
        ...(state.perAppInclusion[fileId] || {}),
        [app]: included,
      } as Record<AppName, boolean>,
    }
  })),

  setOptimizedDrafts: (drafts) => set({ optimizedDrafts: drafts }),

  resetStudio: () => set((state) => {
    // Revoke all object URLs
    state.uploadedFiles.forEach(f => {
      if (f.objectUrl) URL.revokeObjectURL(f.objectUrl);
    });
    
    return {
      uploadedFiles: [],
      selectedApps: [],
      postDescription: '',
      activePreviewTab: null,
      githubPublishConfigByFileId: {},
      perAppInclusion: {},
      optimizedDrafts: {} as Record<AppName, string>,
    };
  }),
}));
