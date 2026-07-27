export const calculateEngagementRate = (engagements: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return Number(((engagements / impressions) * 100).toFixed(2));
};

export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

export const calculateAverage = (total: number, count: number): number => {
  if (count === 0) return 0;
  return Number((total / count).toFixed(2));
};

export const calculateConsistencyScore = (postTimestamps: number[]): number => {
  if (postTimestamps.length < 2) return 0;
  
  const intervals: number[] = [];
  for (let i = 1; i < postTimestamps.length; i++) {
    intervals.push(Math.abs(postTimestamps[i] - postTimestamps[i - 1]));
  }
  
  const avgInterval = calculateAverage(intervals.reduce((a, b) => a + b, 0), intervals.length);
  
  const variance = intervals.reduce((acc, val) => acc + Math.pow(val - avgInterval, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower standard deviation means higher consistency.
  // Normalizing roughly to a 0-100 score. 
  const score = Math.max(0, 100 - (stdDev / (1000 * 60 * 60 * 24)) * 10); // Penalty based on day variance
  return Number(score.toFixed(1));
};
