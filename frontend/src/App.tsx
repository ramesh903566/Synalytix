import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useAppContext } from './context/AppContext';
import { PageContextProvider } from './hooks/usePageContext';
import AppLayout from './layouts/AppLayout';

const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Studio = lazy(() => import('./pages/Studio'));
const AppsList = lazy(() => import('./pages/AppsList'));
const AppDetails = lazy(() => import('./pages/AppDetails'));
const AnalyticsHub = lazy(() => import('./pages/AnalyticsHub'));
const PlatformAnalytics = lazy(() => import('./pages/analytics/PlatformAnalytics'));
const AccountAnalytics = lazy(() => import('./pages/analytics/AccountAnalytics'));
const ContentAnalytics = lazy(() => import('./pages/analytics/ContentAnalytics'));
const Settings = lazy(() => import('./pages/Settings'));
const Planner = lazy(() => import('./pages/Planner'));
const Recommendations = lazy(() => import('./pages/Recommendations'));

function PageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-border-strong border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoadingAuth } = useAppContext();
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-canvas">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageSpinner />}>
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
    </Suspense>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <PageContextProvider>
            <AppRoutes />
          </PageContextProvider>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
