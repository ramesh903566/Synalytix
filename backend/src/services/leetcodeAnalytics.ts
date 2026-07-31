import { LeetCodeProfileSnapshot } from '../types';

export const calculateGrowthRate = (
  snapshots: LeetCodeProfileSnapshot[],
  days: number = 7
): number => {
  if (!snapshots || snapshots.length < 2) return 0;
  
  // Sort by timestamp descending
  const sorted = [...snapshots].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const current = sorted[0];
  const cutoffTime = new Date(current.timestamp).getTime() - (days * 24 * 60 * 60 * 1000);
  
  // Find the snapshot closest to 'days' ago
  let past = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length; i++) {
    if (new Date(sorted[i].timestamp).getTime() <= cutoffTime) {
      past = sorted[i];
      break;
    }
  }
  
  const currentTotal = (current.easy_solved || 0) + (current.medium_solved || 0) + (current.hard_solved || 0);
  const pastTotal = (past.easy_solved || 0) + (past.medium_solved || 0) + (past.hard_solved || 0);
  
  if (pastTotal === 0) return 0;
  return Number(((currentTotal - pastTotal) / pastTotal * 100).toFixed(2));
};

export const calculateConsistencyScore = (
  snapshots: LeetCodeProfileSnapshot[]
): number => {
  if (!snapshots || snapshots.length === 0) return 0;
  
  // Simple heuristic: 
  // +10 points for every day with activity (increase in total solved or submission)
  // Max score 100
  // For now, based on total solved increase
  
  let activeDays = 0;
  const sorted = [...snapshots].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  let lastTotal = -1;
  for (const snap of sorted) {
    const currentTotal = (snap.easy_solved || 0) + (snap.medium_solved || 0) + (snap.hard_solved || 0);
    if (lastTotal !== -1 && currentTotal > lastTotal) {
      activeDays += 1;
    }
    lastTotal = currentTotal;
  }
  
  return Math.min(100, activeDays * 10);
};

export const calculateEstimatedWeeklyTime = (
  snapshots: LeetCodeProfileSnapshot[]
): number => {
  // Estimate time spent in the last 7 days based on problem difficulty
  // Easy: 15 min, Medium: 45 min, Hard: 120 min
  
  if (!snapshots || snapshots.length < 2) return 0;
  
  const sorted = [...snapshots].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  const current = sorted[0];
  const cutoffTime = new Date(current.timestamp).getTime() - (7 * 24 * 60 * 60 * 1000);
  
  let past = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length; i++) {
    if (new Date(sorted[i].timestamp).getTime() <= cutoffTime) {
      past = sorted[i];
      break;
    }
  }
  
  const dEasy = (current.easy_solved || 0) - (past.easy_solved || 0);
  const dMed = (current.medium_solved || 0) - (past.medium_solved || 0);
  const dHard = (current.hard_solved || 0) - (past.hard_solved || 0);
  
  const minutes = (Math.max(0, dEasy) * 15) + (Math.max(0, dMed) * 45) + (Math.max(0, dHard) * 120);
  return Number((minutes / 60).toFixed(1)); // Hours
};
