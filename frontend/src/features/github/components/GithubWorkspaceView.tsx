import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGithubProfile, useGithubContributions, useGithubRepositories } from '../hooks/useGithubData';
import { ContributionHeatmap } from './ContributionHeatmap';
import { RepoCard } from './PinnedRepositories';
import { AccountStorySwitcher, Account } from '../../../components/ui/AccountStorySwitcher';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

interface GithubWorkspaceViewProps {
  accounts: Account[];
  selectedAccount: Account | null;
  onSelectAccount: (acc: Account) => void;
  onAddAccount: () => void;
  onBack: () => void;
}

// Subcomponent for the profile header to manage its own loading state
const ProfileHeaderStats: React.FC<{ username: string }> = ({ username }) => {
  const { data: profile, isLoading: profileLoading } = useGithubProfile(username);
  const { data: contributions, isLoading: contribsLoading } = useGithubContributions(username);
  const { data: repos, isLoading: reposLoading } = useGithubRepositories(username);

  if (profileLoading || contribsLoading || reposLoading) {
    return <div className="w-full h-32 animate-pulse bg-bg-elevated rounded-2xl border border-border-light mb-10" />;
  }

  if (!profile) return null;

  const totalStars = repos?.reduce((sum, r) => sum + (r.stargazerCount || 0), 0) || 0;
  const totalContributions = contributions?.totalContributions || 0;

  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-light flex items-center justify-center shadow-sm font-semibold text-2xl text-zinc-50 overflow-hidden">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : profile.login.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">GitHub Workspace</h1>
          <p className="text-zinc-400 font-light text-sm">{profile.login} · {totalContributions} contributions this year</p>
        </div>
        
        <div className="md:ml-auto flex flex-col items-end gap-3">
          {/* Primary Stats */}
          <div className="flex gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-50">{profile.repositories.totalCount}</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Repos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-50">{totalContributions}</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Contributions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-50">{totalStars}</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Stars</div>
            </div>
          </div>
          {/* Secondary Stats */}
          <div className="flex gap-4 sm:gap-6 mt-1 opacity-80">
            <div className="text-center">
              <div className="text-sm font-bold text-zinc-300">{profile.followers.totalCount}</div>
              <div className="text-[9px] text-text-secondary uppercase tracking-widest font-medium">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-zinc-300">{profile.following.totalCount}</div>
              <div className="text-[9px] text-text-secondary uppercase tracking-widest font-medium">Following</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-zinc-300">0</div> {/* Mocked orgs for now */}
              <div className="text-[9px] text-text-secondary uppercase tracking-widest font-medium">Organizations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponent for pinned repos
const WorkspacePinnedRepos: React.FC<{ username: string }> = ({ username }) => {
  const { data: repos, isLoading, isError } = useGithubRepositories(username);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[1, 2].map(i => <div key={i} className="h-48 animate-pulse bg-bg-elevated border border-border-light rounded-xl" />)}
      </div>
    );
  }

  if (isError || !repos || repos.length === 0) {
    return (
      <div className="w-full p-6 text-center text-text-muted bg-bg-elevated border border-border-light rounded-xl mb-8">
        No repositories pinned yet. Show your top repositories to the world!
      </div>
    );
  }

  // Fallback to top-by-stars if we don't explicitly have pinned info
  const displayRepos = [...repos].sort((a, b) => b.stargazerCount - a.stargazerCount).slice(0, 6);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-50">Popular repositories</h2>
        <span className="text-xs text-text-muted bg-bg-sunken px-2 py-1 rounded-md">Top by Stars</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {displayRepos.map(repo => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </>
  );
};

export const GithubWorkspaceView: React.FC<GithubWorkspaceViewProps> = ({
  accounts,
  selectedAccount,
  onSelectAccount,
  onAddAccount,
  onBack
}) => {
  // Use a fallback username if none selected, mostly for mock testing
  const username = selectedAccount?.username || 'ramesh903566';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto px-6 py-6 pb-24">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-100 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Apps
      </button>
      
      <AccountStorySwitcher 
        accounts={accounts}
        selectedAccountId={selectedAccount?.id}
        onSelectAccount={onSelectAccount}
        onAddAccount={onAddAccount}
      />

      <ErrorBoundary>
        <ProfileHeaderStats username={username} />
      </ErrorBoundary>

      <ErrorBoundary>
        <WorkspacePinnedRepos username={username} />
      </ErrorBoundary>

      <div className="mt-8 border border-border-light rounded-2xl p-1 bg-bg-elevated overflow-hidden">
        <ErrorBoundary>
          <React.Suspense fallback={<div className="h-64 animate-pulse bg-bg-sunken" />}>
            <ContributionHeatmap username={username} />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </motion.div>
  );
};
