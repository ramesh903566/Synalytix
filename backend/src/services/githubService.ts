import axios from 'axios';
import { GitHubProfile, GitHubRepo } from '../types';

const GITHUB_API = 'https://api.github.com';

/**
 * GitHubService
 * All calls to the GitHub REST API v3.
 * Takes a decrypted access_token and returns structured data.
 */
export const GitHubService = {

  /**
   * Get the authenticated user's profile.
   * API: GET /user
   */
  async getProfile(accessToken: string): Promise<GitHubProfile> {
    const { data } = await axios.get(`${GITHUB_API}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    return {
      platform: 'github',
      username: data.login,
      name: data.name ?? data.login,
      avatar_url: data.avatar_url,
      bio: data.bio,
      followers: data.followers,
      following: data.following,
      public_repos: data.public_repos,
    };
  },

  /**
   * Get the user's repositories, sorted by last updated.
   * API: GET /user/repos
   */
  async getRepos(accessToken: string, page = 1, perPage = 30): Promise<GitHubRepo[]> {
    const { data } = await axios.get(`${GITHUB_API}/user/repos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      params: {
        sort: 'updated',
        direction: 'desc',
        per_page: perPage,
        page,
        visibility: 'all',
      },
    });

    return data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      is_private: repo.private,
      updated_at: repo.updated_at,
    }));
  },

  /**
   * Get every repository visible to the authenticated user.
   * Used for live aggregate stats such as total stars.
   */
  async getAllRepos(accessToken: string): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const pageRepos = await this.getRepos(accessToken, page, perPage);
      repos.push(...pageRepos);

      if (pageRepos.length < perPage) break;
      page += 1;
    }

    return repos;
  },

  /**
   * Get contribution stats — counts commits from the events API.
   * GitHub doesn't expose the contribution graph via API directly,
   * so we approximate it from recent events.
   * API: GET /users/{username}/events
   */
  async getContributions(accessToken: string, username: string): Promise<{
    total_this_year: number;
    recent_pushes: number;
    recent_pull_requests: number;
    recent_issues: number;
    events: { type: string; repo: string; created_at: string }[];
  }> {
    const { data } = await axios.get(`${GITHUB_API}/users/${username}/events`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      params: { per_page: 100 },
    });

    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const thisYear = data.filter(
      (e: any) => new Date(e.created_at) > yearAgo
    );

    const pushEvents = thisYear.filter((e: any) => e.type === 'PushEvent');
    const prEvents = thisYear.filter((e: any) => e.type === 'PullRequestEvent');
    const issueEvents = thisYear.filter((e: any) => e.type === 'IssuesEvent');

    // Count total commits from push events
    const totalCommits = pushEvents.reduce(
      (sum: number, e: any) => sum + (e.payload?.commits?.length ?? 1),
      0
    );

    return {
      total_this_year: totalCommits + prEvents.length + issueEvents.length,
      recent_pushes: pushEvents.length,
      recent_pull_requests: prEvents.length,
      recent_issues: issueEvents.length,
      events: data.slice(0, 20).map((e: any) => ({
        type: e.type,
        repo: e.repo?.name ?? '',
        created_at: e.created_at,
      })),
    };
  },

  /**
   * Get languages used across all repos (for a breakdown chart).
   */
  async getLanguageBreakdown(
    accessToken: string,
    repos: GitHubRepo[]
  ): Promise<Record<string, number>> {
    const breakdown: Record<string, number> = {};

    for (const repo of repos.slice(0, 10)) {
      // avoid too many API calls
      try {
        const { data } = await axios.get(
          `${GITHUB_API}/repos/${repo.full_name}/languages`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          }
        );

        for (const [lang, bytes] of Object.entries(data)) {
          breakdown[lang] = (breakdown[lang] ?? 0) + (bytes as number);
        }
      } catch {
        // Skip repos that fail (e.g., empty repos)
      }
    }

    return breakdown;
  },

  /**
   * Validate the access token is still valid.
   */
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await axios.get(`${GITHUB_API}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Create a new repository for the authenticated user.
   */
  async createRepo(
    accessToken: string,
    data: {
      name: string;
      description?: string;
      private?: boolean;
      auto_init?: boolean;
      gitignore_template?: string;
      license_template?: string;
    }
  ) {
    const { data: responseData } = await axios.post(`${GITHUB_API}/user/repos`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return responseData;
  },

  /**
   * Commit multiple files to a repository in a single commit.
   */
  async commitFiles(
    accessToken: string,
    owner: string,
    repo: string,
    branch: string,
    message: string,
    files: { path: string; content: string; encoding?: 'utf-8' | 'base64' }[]
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    // 1. Get the current commit SHA of the branch
    const { data: refData } = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/${branch}`, { headers });
    const latestCommitSha = refData.object.sha;

    // 2. Get the base tree SHA
    const { data: commitData } = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, { headers });
    const baseTreeSha = commitData.tree.sha;

    // 3. Create blobs for each file
    const treeItems = await Promise.all(
      files.map(async (file) => {
        const { data: blobData } = await axios.post(
          `${GITHUB_API}/repos/${owner}/${repo}/git/blobs`,
          {
            content: file.content,
            encoding: file.encoding || 'utf-8',
          },
          { headers }
        );
        return {
          path: file.path,
          mode: '100644', // 100644 for blob (file)
          type: 'blob',
          sha: blobData.sha,
        };
      })
    );

    // 4. Create a new tree
    const { data: treeData } = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees`,
      {
        base_tree: baseTreeSha,
        tree: treeItems,
      },
      { headers }
    );
    const newTreeSha = treeData.sha;

    // 5. Create a new commit
    const { data: newCommitData } = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/git/commits`,
      {
        message,
        tree: newTreeSha,
        parents: [latestCommitSha],
      },
      { headers }
    );
    const newCommitSha = newCommitData.sha;

    // 6. Update the reference (branch)
    const { data: updatedRefData } = await axios.patch(
      `${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        sha: newCommitSha,
      },
      { headers }
    );

    return updatedRefData;
  }
};
