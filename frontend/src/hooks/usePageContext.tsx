import { createContext, useContext, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export interface PageContext {
  page: string;
  platform?: string;
  selectedAccount?: string;
  selectedRepo?: string;
  dateRange?: { start: string; end: string };
  activeMetrics?: string[];
}

const PageContextCtx = createContext<PageContext>({ page: "dashboard" });

export function PageContextProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const page = resolvePage(location.pathname);

  const ctx: PageContext = { page };

  return (
    <PageContextCtx.Provider value={ctx}>{children}</PageContextCtx.Provider>
  );
}

export function usePageContext(): PageContext {
  return useContext(PageContextCtx);
}

function resolvePage(pathname: string): string {
  if (pathname === "/app") return "dashboard";
  if (pathname.startsWith("/app/analytics/github")) return "github";
  if (pathname.startsWith("/app/analytics/linkedin")) return "linkedin";
  if (pathname.startsWith("/app/analytics/instagram")) return "instagram";
  if (pathname.startsWith("/app/analytics/x")) return "x";
  if (pathname.startsWith("/app/analytics")) return "analytics";
  if (pathname.startsWith("/app/recommendations")) return "recommendations";
  if (pathname.startsWith("/app/planner")) return "planner";
  if (pathname.startsWith("/app/studio")) return "studio";
  if (pathname.startsWith("/app/settings")) return "settings";
  if (pathname.startsWith("/app/apps")) return "apps";
  return "dashboard";
}
