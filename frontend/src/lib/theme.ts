/**
 * Runtime design-token helpers.
 * Provides typed access to chart colors, motion config, and spacing
 * for JS-driven values that can't be purely CSS (e.g. Recharts props).
 */

export const chartColors = {
  primary: '#4F46E5',
  cyan: '#06B6D4',
  violet: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316',
} as const;

export const CHART_PALETTE = [
  chartColors.primary,
  chartColors.cyan,
  chartColors.violet,
  chartColors.pink,
  chartColors.orange,
] as const;

export const semanticColors = {
  success: '#10B981',
  successLight: '#ECFDF5',
  successText: '#065F46',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  errorText: '#991B1B',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  warningText: '#92400E',
  info: '#3B82F6',
  infoLight: '#EFF6FF',
  infoText: '#1E40AF',
} as const;

export const brandColors = {
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  primaryLight: '#EEF2FF',
  primaryMuted: '#C7D2FE',
} as const;

export const textColors = {
  primary: '#0F172A',
  secondary: '#475569',
  muted: '#64748B',
  inverse: '#FFFFFF',
} as const;

export const borderColors = {
  default: '#E2E8F0',
  light: '#F1F5F9',
  strong: '#CBD5E1',
} as const;

export const motion = {
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
  },
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
  easeDefault: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const;

export const layout = {
  sidebarWidth: 264,
  sidebarCollapsed: 72,
  topBarHeight: 72,
  contentMaxWidth: 1200,
  cardPadding: 24,
} as const;

/** Format large numbers to K/M shorthand */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

/** Get time-of-day greeting */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
