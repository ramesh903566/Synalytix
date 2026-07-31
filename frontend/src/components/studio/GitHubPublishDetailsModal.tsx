import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { useStudioStore } from '../../store/studioStore';
import { useGitHubRepos, useCreateRepo } from '../../lib/studio/api';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fileId: string | null;
}

export const GitHubPublishDetailsModal: React.FC<Props> = ({ isOpen, onClose, fileId }) => {
  const { uploadedFiles, githubPublishConfigByFileId, setGithubPublishConfig } = useStudioStore();
  const fileObj = uploadedFiles.find(f => f.id === fileId);
  
  const { data: repos, isLoading: isLoadingRepos, isError: isErrorRepos } = useGitHubRepos();
  const createRepoMutation = useCreateRepo();

  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  
  // Existing repo states
  const [selectedRepoFullName, setSelectedRepoFullName] = useState('');
  const [branch, setBranch] = useState('main');
  const [targetPath, setTargetPath] = useState('');

  // New repo states
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoPrivate, setNewRepoPrivate] = useState(false);
  const [newRepoAutoInit, setNewRepoAutoInit] = useState(true);

  useEffect(() => {
    if (isOpen && fileObj) {
      const existingConfig = githubPublishConfigByFileId[fileObj.id];
      if (existingConfig) {
        setSelectedRepoFullName(`${existingConfig.owner}/${existingConfig.repo}`);
        setBranch(existingConfig.branch);
        setTargetPath(existingConfig.path);
        setActiveTab('existing');
      } else {
        setSelectedRepoFullName('');
        setBranch('main');
        setTargetPath(fileObj.file.name);
      }
    }
  }, [isOpen, fileObj, githubPublishConfigByFileId]);

  if (!isOpen || !fileObj) return null;

  const handleSaveConfig = () => {
    if (activeTab === 'existing') {
      if (!selectedRepoFullName) {
        toast.error('Please select a repository');
        return;
      }
      const [owner, repo] = selectedRepoFullName.split('/');
      setGithubPublishConfig(fileObj.id, {
        owner,
        repo,
        branch: branch || 'main',
        path: targetPath || fileObj.file.name,
      });
      toast.success('GitHub configuration saved');
      onClose();
    } else {
      if (!newRepoName) {
        toast.error('Repository name is required');
        return;
      }
      createRepoMutation.mutate(
        { name: newRepoName, private: newRepoPrivate, auto_init: newRepoAutoInit },
        {
          onSuccess: (data) => {
            // Assuming data contains owner and repo from backend, or we can just parse it
            const createdFullName = data.full_name || `${data.owner?.login}/${data.name}`;
            const [owner, repo] = createdFullName.split('/');
            setGithubPublishConfig(fileObj.id, {
              owner,
              repo,
              branch: branch || 'main',
              path: targetPath || fileObj.file.name,
            });
            toast.success('Repository created and configuration saved');
            onClose();
          },
          onError: (error) => {
            toast.error(`Failed to create repo: ${error.message}`);
          }
        }
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configure Target for "${fileObj.file.name}"`}>
      <Tabs>
        <TabsList className="mb-4">
          <TabsTrigger 
            active={activeTab === 'existing'} 
            onClick={() => setActiveTab('existing')}
          >
            Select Existing Repo
          </TabsTrigger>
          <TabsTrigger 
            active={activeTab === 'new'} 
            onClick={() => setActiveTab('new')}
          >
            Create New Repo
          </TabsTrigger>
        </TabsList>

        <TabsContent active={activeTab === 'existing'}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Repository</label>
              {isLoadingRepos ? (
                <div className="text-sm text-text-muted p-2 border border-border rounded-[var(--radius-input)]">Loading repos...</div>
              ) : isErrorRepos ? (
                <div className="text-sm text-error-text p-2 border border-error-text/30 bg-error-light rounded-[var(--radius-input)]">
                  Failed to load repositories. Please check your GitHub connection.
                </div>
              ) : (
                <select
                  value={selectedRepoFullName}
                  onChange={(e) => setSelectedRepoFullName(e.target.value)}
                  className="w-full p-2 bg-bg-canvas border border-border rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-brand"
                >
                  <option value="" disabled>-- Select a repository --</option>
                  {repos?.map(repo => (
                    <option key={repo.id} value={repo.full_name}>{repo.full_name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent active={activeTab === 'new'}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Repository Name</label>
              <input
                type="text"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                placeholder="my-awesome-project"
                className="w-full p-2 bg-bg-canvas border border-border rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="private-repo"
                checked={newRepoPrivate}
                onChange={(e) => setNewRepoPrivate(e.target.checked)}
                className="rounded border-border text-brand focus:ring-brand"
              />
              <label htmlFor="private-repo" className="text-sm text-text-secondary cursor-pointer">Make repository private</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-init"
                checked={newRepoAutoInit}
                onChange={(e) => setNewRepoAutoInit(e.target.checked)}
                className="rounded border-border text-brand focus:ring-brand"
              />
              <label htmlFor="auto-init" className="text-sm text-text-secondary cursor-pointer">Initialize with README</label>
            </div>
          </div>
        </TabsContent>

        {/* Common fields below tabs */}
        <div className="mt-6 pt-6 border-t border-border space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className="w-full p-2 bg-bg-canvas border border-border rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Target Path</label>
              <input
                type="text"
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
                placeholder="e.g. src/utils/file.ts"
                className="w-full p-2 bg-bg-canvas border border-border rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary bg-bg-elevated border border-border rounded-[var(--radius-button)] hover:bg-bg-sunken transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={createRepoMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-[var(--radius-button)] hover:bg-brand/90 transition-colors disabled:opacity-50"
          >
            {createRepoMutation.isPending ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </Tabs>
    </Modal>
  );
};
