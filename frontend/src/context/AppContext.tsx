import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppName } from '../types';
import { disconnectPlatform, getConnectionStatus } from '../lib/api';
import { supabase } from '../lib/supabase';

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

export type PlannerCategory = 'content' | 'dev' | 'business' | 'other';

export interface PlannerTask {
  id: string;
  title: string;
  projectId?: string;
  category: PlannerCategory | 'google-event';
  color?: string;
  status: 'todo' | 'scheduled' | 'done' | 'unplanned';
  scheduledDate?: string;
  scheduledTime?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type ExternalCalendarProvider = 'google' | 'apple' | 'outlook';

export interface ExternalCalendarConnection {
  id: string;
  provider: ExternalCalendarProvider;
  email: string;
  status: 'connected' | 'error' | 'syncing';
  lastSynced: string;
}

export interface ExternalEvent {
  id: string;
  connectionId: string;
  title: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  isAllDay: boolean;
}

interface AppContextType {
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: () => void;
  logout: () => Promise<void>;
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
  calendarConnections: ExternalCalendarConnection[];
  connectCalendar: (provider: ExternalCalendarProvider) => Promise<void>;
  disconnectCalendar: (id: string) => void;
  externalEvents: ExternalEvent[];
  refreshConnections: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [connectedApps, setConnectedApps] = useState<AppName[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [savedDrafts, setSavedDrafts] = useState<DraftPost[]>([]);
  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>([
    { id: 'pt1', title: 'Post Tuesday Reel', projectId: 'content', category: 'content', status: 'scheduled', scheduledDate: '2026-05-27', scheduledTime: '21:00', priority: 'high', createdAt: new Date().toISOString() },
    { id: 'pt2', title: 'Update GitHub README', projectId: 'dev', category: 'dev', status: 'todo', priority: 'medium', createdAt: new Date().toISOString() },
    { id: 'pt3', title: 'Reply to all Instagram comments', projectId: 'content', category: 'business', status: 'unplanned', priority: 'low', createdAt: new Date().toISOString() },
    { id: 'pt4', title: 'Solve 2 LeetCode Hard problems', projectId: 'dev', category: 'dev', status: 'done', priority: 'high', createdAt: new Date().toISOString() },
    { id: 'pt5', title: 'LinkedIn post about Synalytix', projectId: 'content', category: 'content', status: 'unplanned', priority: 'medium', createdAt: new Date().toISOString() },
  ]);
  const [calendarConnections, setCalendarConnections] = useState<ExternalCalendarConnection[]>([]);
  const [externalEvents, setExternalEvents] = useState<ExternalEvent[]>([]);

  const login = () => setIsAuthenticated(true);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Auth is bypassed for review — signOut may fail with no session
    }
    setIsAuthenticated(false);
    setConnectedApps([]);
    setScheduledPosts([]);
    setSavedDrafts([]);
    setCalendarConnections([]);
    setExternalEvents([]);
    window.location.href = '/auth';
  };

  const connectApp = (app: AppName) => {
    if (!connectedApps.includes(app)) setConnectedApps([...connectedApps, app]);
  };

  const disconnectApp = async (app: AppName) => {
    await disconnectPlatform(app);
    setConnectedApps(prev => prev.filter((a) => a !== app));
  };

  const addScheduledPost = (post: Omit<ScheduledPost, 'id' | 'status'>) => {
    setScheduledPosts(prev => [{ ...post, id: crypto.randomUUID(), status: 'scheduled' }, ...prev]);
  };

  const deleteScheduledPost = (id: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== id));
  };

  const saveDraft = (draft: Omit<DraftPost, 'id' | 'createdAt'>) => {
    setSavedDrafts(prev => [{ ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...prev]);
  };

  const deleteDraft = (id: string) => {
    setSavedDrafts(prev => prev.filter(p => p.id !== id));
  };

  const addPlannerTask = (task: Omit<PlannerTask, 'id' | 'createdAt'>) => {
    setPlannerTasks(prev => [{ ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...prev]);
  };

  const updatePlannerTask = (id: string, updates: Partial<PlannerTask>) => {
    setPlannerTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deletePlannerTask = (id: string) => {
    setPlannerTasks(prev => prev.filter(t => t.id !== id));
  };

  const connectCalendar = async (provider: ExternalCalendarProvider) => {
    if (provider === 'google') {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;
      window.location.href = `${backendUrl}/api/auth/connect/google-calendar`;
    }
  };

  const disconnectCalendar = (id: string) => {
    setCalendarConnections(prev => prev.filter(c => c.id !== id));
    setExternalEvents(prev => prev.filter(e => e.connectionId !== id));
  };

  const refreshConnections = useCallback(async () => {
    try {
      const result = await getConnectionStatus();
      if (result.success && result.data) {
        setConnectedApps(result.data.connected as AppName[]);

        if (result.data.connected.includes('google-calendar' as AppName)) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;
            const res = await fetch(`${backendUrl}/api/data/google-calendar/events`, {
              headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              }
            });
            const data = await res.json();
            if (data.success && data.data) {
              setExternalEvents(data.data);
            }
          } catch (e) {
            console.error('Failed to fetch google calendar events', e);
          }
        }
      }
    } catch (e) {
      console.error('Failed to refresh connections:', e);
    }
  }, []);

  useEffect(() => {
    // Bypass auth for review — set authenticated immediately
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
    refreshConnections();

    // TODO: Uncomment for production auth
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setIsAuthenticated(!!session);
    //   if (session) refreshConnections();
    //   setIsLoadingAuth(false);
    // });
    //
    // const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    //   setIsAuthenticated(!!session);
    //   if (session) {
    //     refreshConnections();
    //   } else {
    //     setConnectedApps([]);
    //   }
    // });
    //
    // return () => subscription.unsubscribe();
  }, [refreshConnections]);

  return (
    <AppContext.Provider value={{
      isAuthenticated, isLoadingAuth, login, logout,
      connectedApps, connectApp, disconnectApp,
      scheduledPosts, addScheduledPost, deleteScheduledPost,
      savedDrafts, saveDraft, deleteDraft,
      plannerTasks, addPlannerTask, updatePlannerTask, deletePlannerTask,
      calendarConnections, connectCalendar, disconnectCalendar,
      externalEvents,
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
