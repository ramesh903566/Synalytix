import React from 'react';
import { APP_REGISTRY } from '../../lib/appRegistry';
import { useStudioStore } from '../../store/studioStore';
import { useAppContext } from '../../context/AppContext';
import { AppName } from '../../types';
import { Tooltip } from '../ui/tooltip';

interface Props {
  onShowAccountModal: (appId: string) => void;
  selectedAccounts: Record<string, string[]>;
}

export const DestinationAppSelector: React.FC<Props> = ({ onShowAccountModal, selectedAccounts }) => {
  const { connectedApps } = useAppContext();
  const { selectedApps, setSelectedApps, uploadedFiles, perAppInclusion } = useStudioStore();

  const handleAppClick = (appId: string) => {
    if (selectedApps.includes(appId as AppName)) {
      setSelectedApps(selectedApps.filter(a => a !== appId));
    } else {
      onShowAccountModal(appId);
    }
  };

  if (connectedApps.length === 0) {
    return (
      <div className="text-sm text-error-text bg-error-light p-4 rounded-[var(--radius-card-inner)] border border-error-text/20">
        You need to connect apps in the Settings section first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {connectedApps.filter(id => id !== 'leetcode').map(appId => {
          const appInfo = APP_REGISTRY.find(a => a.id === appId);
          const isSelected = selectedApps.includes(appId as AppName);

          // Check if any uploaded file is incompatible with this app
          const incompatibleFiles = uploadedFiles.filter(f => 
            perAppInclusion[f.id] && perAppInclusion[f.id][appId as AppName] === false
          );
          const hasIncompatible = isSelected && incompatibleFiles.length > 0;

          const baseClasses = "px-4 py-2 rounded-[var(--radius-button)] border text-sm font-medium transition-all flex items-center gap-2";
          
          let stateClasses = "bg-bg-elevated text-text-secondary border-border hover:border-border-strong";
          if (isSelected) {
            if (hasIncompatible) {
              stateClasses = "bg-warning-light text-warning-text border-warning-text shadow-level-1 opacity-80";
            } else {
              stateClasses = "bg-brand text-text-inverse border-brand shadow-level-1";
            }
          }

          const buttonContent = (
            <button
              key={appId}
              onClick={() => handleAppClick(appId)}
              className={`${baseClasses} ${stateClasses}`}
            >
              <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-4 h-4 object-cover rounded-[var(--radius-badge)]" />
              <span>{appInfo?.name}</span>
            </button>
          );

          if (hasIncompatible) {
            const tooltipContent = `Incompatible files: ${incompatibleFiles.map(f => f.file.name).join(', ')}`;
            return (
              <Tooltip key={appId} content={tooltipContent} side="top">
                {buttonContent}
              </Tooltip>
            );
          }

          return buttonContent;
        })}
      </div>

      {selectedApps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border-light space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Accounts Selected</label>
          <div className="flex flex-col gap-2">
            {selectedApps.map(appId => {
              const appInfo = APP_REGISTRY.find(a => a.id === appId);
              // For demonstration, we just show mocked selected accounts
              const accIds = selectedAccounts[appId] || [];
              const allAccountsForApp = [
                { id: `${appId}_1`, name: `Main ${appInfo?.name}`, handle: `@synalytix_${appId}` }
              ]; // simplified since we just need rendering. If we wanted exact mock we could import MOCK_ACCOUNTS.
              
              if (accIds.length === 0) return null;
              
              return (
                <div key={appId} className="flex items-center gap-3 p-2 bg-bg-canvas rounded-[var(--radius-card-inner)] border border-border">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-brand/10 border border-brand/20 rounded-[var(--radius-badge)]">
                     <img src={appInfo?.iconUrl} alt={appInfo?.name} className="w-3 h-3 object-cover rounded-[var(--radius-badge)]" />
                     <span className="text-[10px] font-bold text-brand">{appInfo?.name}</span>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {accIds.map(accId => (
                      <span key={accId} className="text-xs text-text-secondary font-medium bg-bg-elevated px-2 py-0.5 rounded-[var(--radius-badge)] border border-border-light">
                        {allAccountsForApp[0].name} <span className="text-[10px] text-text-muted ml-1">{allAccountsForApp[0].handle}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
