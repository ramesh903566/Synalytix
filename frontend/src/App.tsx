import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useAppContext } from './context/AppContext';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import AppsList from './pages/AppsList';
import AppDetails from './pages/AppDetails';
import AnalyticsHub from './pages/AnalyticsHub';
import PlatformAnalytics from './pages/analytics/PlatformAnalytics';
import AccountAnalytics from './pages/analytics/AccountAnalytics';
import ContentAnalytics from './pages/analytics/ContentAnalytics';
import Settings from './pages/Settings';
import Planner from './pages/Planner';
import Recommendations from './pages/Recommendations';
import AppLayout from './layouts/AppLayout';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoadingAuth } = useAppContext();
  
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="studio" element={<Studio />} />
        <Route path="apps" element={<AppsList />} />
        <Route path="apps/:id" element={<AppDetails />} />
        <Route path="apps/:id/connect" element={<AppDetails />} />
        <Route path="analytics">
          <Route index element={<AnalyticsHub />} />
          <Route path=":platform" element={<PlatformAnalytics />} />
          <Route path=":platform/:accountId" element={<AccountAnalytics />} />
          <Route path=":platform/:accountId/:contentId" element={<ContentAnalytics />} />
        </Route>
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="planner" element={<Planner />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
