import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { ConnectionService } from '../services/connectionService';
import { GitHubService } from '../services/githubService';

const router = Router();

const GitHubCreateRepoSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_.-]+$/, 'Invalid repository name'),
  description: z.string().max(350).optional(),
  private: z.boolean().optional(),
});

const GitHubPublishSchema = z.object({
  owner: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_.-]+$/),
  repo: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_.-]+$/),
  branch: z.string().max(100).regex(/^[a-zA-Z0-9_/.-]*$/).optional().default('main'),
  message: z.string().min(1).max(200),
  files: z.array(z.object({
    path: z.string().min(1).max(500).refine(p => !p.includes('..'), 'Path must not contain ..'),
    content: z.string().max(1000000),
  })).min(1).max(20),
});

// Retrieve GitHub Token Helper
const getGitHubToken = async (userId: string) => {
  const conn = await ConnectionService.getByUserAndPlatform(userId, 'github');
  if (!conn?.decrypted_access_token) {
    throw new Error('GitHub account not connected');
  }
  return conn.decrypted_access_token;
};

// GET /api/studio/github/repos
// List user repositories
router.get('/github/repos', authenticate, async (req, res) => {
  try {
    const accessToken = await getGitHubToken(req.userId!);
    const repos = await GitHubService.getAllRepos(accessToken);
    res.json(repos);
  } catch (error: any) {
    if (error.message === 'GitHub account not connected') {
      res.status(401).json({ success: false, error: error.message });
    } else {
      console.error('Error fetching GitHub repos:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch repositories' });
    }
  }
});

// POST /api/studio/github/repos
// Create a new repository
router.post('/github/repos', authenticate, async (req, res) => {
  const parsed = GitHubCreateRepoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }

  try {
    const accessToken = await getGitHubToken(req.userId!);
    const newRepo = await GitHubService.createRepo(accessToken, parsed.data);
    res.json({ success: true, repo: newRepo });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.response?.data?.message || 'Failed to create repository'
    });
  }
});

// POST /api/studio/github/publish
// Publish files to a GitHub repository
router.post('/github/publish', authenticate, async (req, res) => {
  const parsed = GitHubPublishSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }

  try {
    const accessToken = await getGitHubToken(req.userId!);
    const { owner, repo, branch, message, files } = parsed.data;

    const commitResult = await GitHubService.commitFiles(
      accessToken,
      owner,
      repo,
      branch,
      message,
      files
    );

    res.json({ success: true, commit: commitResult });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.response?.data?.message || 'Failed to publish to GitHub'
    });
  }
});

export default router;
