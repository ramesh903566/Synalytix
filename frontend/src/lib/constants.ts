export const CATEGORY_LABELS: Record<string, string> = {
  CAREER_GROWTH: "Career Growth",
  PERSONAL_BRANDING: "Personal Branding",
  TECHNICAL_SKILLS: "Technical Skills",
  NETWORKING: "Networking",
  OPEN_SOURCE: "Open Source",
  ENTREPRENEURSHIP: "Entrepreneurship",
};

export const PRIORITY_ORDER: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export const STORAGE_KEYS = {
  HAS_VISITED_LANDING: 'synalytix_has_visited_landing',
} as const;

export const APP_CONFIG = {
  // Set VITE_SHOW_LANDING_ONCE=true in your .env to enable the single-visit landing page feature
  SHOW_LANDING_ONCE: import.meta.env.VITE_SHOW_LANDING_ONCE === 'true',
} as const;
