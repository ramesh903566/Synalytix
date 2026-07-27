import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppName } from '../types';
import { disconnectPlatform, getConnectionStatus } from '../lib/api';

export interface ScheduledPost {
  id: string;
  description: string;
  apps: AppName[];
  date: string;
  time: string;
  status: 'scheduled' | 'published';
}

export interface DraftPost {
  id: string;
  description: string;
  apps: AppName[];
  drafts: Record<string, string>;
  createdAt: string;
}

export interface PlannerTask {
  id: string;
  title: string;
  projectId?: string;
  status: 'todo' | 'scheduled' | 'done' | 'unplanned';
  scheduledDate?: string;
  scheduledTime?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: () => void;
  logout: () => void;
  connectedApps: AppName[];
  connectApp: (app: AppName) => void;
  disconnectApp: (app: AppName) => Promise<void>;
  scheduledPosts: ScheduledPost[];
  addScheduledPost: (post: Omit<ScheduledPost, 'id' | 'status'>) => void;
  deleteScheduledPost: (id: string) => void;
  savedDrafts: DraftPost[];
  saveDraft: (draft: Omit<DraftPost, 'id' | 'createdAt'>) => void;
  deleteDraft: (id: string) => void;
  plannerTasks: PlannerTask[];
  addPlannerTask: (task: Omit<PlannerTask, 'id' | 'createdAt'>) => void;
  updatePlannerTask: (id: string, updates: Partial<PlannerTask>) => void;
  deletePlannerTask: (id: string) => void;
  refreshConnections: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [connectedApps, setConnectedApps] = useState<AppName[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [savedDrafts, setSavedDrafts] = useState<DraftPost[]>([]);
  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>([
    { id: 'pt1', title: 'Post Tuesday Reel', projectId: 'content', status: 'scheduled', scheduledDate: '2026-05-27', scheduledTime: '21:00', priority: 'high', createdAt: new Date().toISOString() },
    { id: 'pt2', title: 'Update GitHub README', projectId: 'dev', status: 'todo', priority: 'medium', createdAt: new Date().toISOString() },
    { id: 'pt3', title: 'Reply to all Instagram comments', projectId: 'content', status: 'unplanned', priority: 'low', createdAt: new Date().toISOString() },
    { id: 'pt4', title: 'Solve 2 LeetCode Hard problems', projectId: 'dev', status: 'done', priority: 'high', createdAt: new Date().toISOString() },
    { id: 'pt5', title: 'LinkedIn post about Synalytix', projectId: 'content', status: 'unplanned', priority: 'medium', createdAt: new Date().toISOString() },
  ]);

  const login = () => setIsAuthenticated(true);
  const logout = async () => {
    setIsAuthenticated(false);
    setConnectedApps([]);
    setScheduledPosts([]);
    setSavedDrafts([]);
  };

  const connectApp = (app: AppName) => {
    if (!connectedApps.includes(app)) setConnectedApps([...connectedApps, app]);
  };

  const disconnectApp = async (app: AppName) => {
    await disconnectPlatform(app);
    setConnectedApps(prev => prev.filter((a) => a !== app));
  };

  const addScheduledPost = (post: Omit<ScheduledPost, 'id' | 'status'>) => {
    setScheduledPosts(prev => [{ ...post, id: Math.random().toString(36).substr(2, 9), status: 'scheduled' }, ...prev]);
  };

  const deleteScheduledPost = (id: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== id));
  };

  const saveDraft = (draft: Omit<DraftPost, 'id' | 'createdAt'>) => {
    setSavedDrafts(prev => [{ ...draft, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }, ...prev]);
  };

  const deleteDraft = (id: string) => {
    setSavedDrafts(prev => prev.filter(p => p.id !== id));
  };

  const addPlannerTask = (task: Omit<PlannerTask, 'id' | 'createdAt'>) => {
    setPlannerTasks(prev => [{ ...task, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }, ...prev]);
  };

  const updatePlannerTask = (id: string, updates: Partial<PlannerTask>) => {
    setPlannerTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deletePlannerTask = (id: string) => {
    setPlannerTasks(prev => prev.filter(t => t.id !== id));
  };

  const refreshConnections = useCallback(async () => {
    try {
      setConnectedApps(['github', 'instagram', 'x', 'linkedin', 'leetcode'] as AppName[]);
    } catch (e) {
      console.error('Failed to refresh connections:', e);
    }
  }, []);

  useEffect(() => {
    // Fake check if authenticated on reload (always true for dev mode)
    const timer = setTimeout(() => {
      setIsAuthenticated(true);
      refreshConnections();
      setIsLoadingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthenticated, isLoadingAuth, login, logout,
      connectedApps, connectApp, disconnectApp,
      scheduledPosts, addScheduledPost, deleteScheduledPost,
      savedDrafts, saveDraft, deleteDraft,
      plannerTasks, addPlannerTask, updatePlannerTask, deletePlannerTask,
      refreshConnections,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
