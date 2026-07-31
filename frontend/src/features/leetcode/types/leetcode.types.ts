export interface LeetCodeStats {
  id?: string;
  leetcode_username: string;
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  acceptance_rate: number;
  ranking: number;
  contribution_points?: number;
  reputation?: number;
  total_submissions?: number;
  timestamp?: string;
}

export interface LeetCodeSubmission {
  id?: string;
  title: string;
  titleSlug: string;
  status: number;
  status_display: string;
  lang: string;
  timestamp: string;
}

export interface LeetCodeDataResponse {
  stats: LeetCodeStats;
  submissions: LeetCodeSubmission[];
}
