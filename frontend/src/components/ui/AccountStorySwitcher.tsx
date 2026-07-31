import React from 'react';
import { Plus } from 'lucide-react';

export interface Account {
  id: string;
  username: string;
  avatarUrl?: string;
  type?: string;
}

export interface AccountStorySwitcherProps {
  accounts: Account[];
  selectedAccountId?: string;
  onSelectAccount: (account: Account) => void;
  onAddAccount: () => void;
}

export const AccountStorySwitcher: React.FC<AccountStorySwitcherProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddAccount,
}) => {
  if (accounts.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-4">Active Accounts</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {accounts.map((acc) => {
          const isActive = selectedAccountId === acc.id;
          return (
            <div 
              key={acc.id} 
              onClick={() => onSelectAccount(acc)} 
              className={`flex flex-col items-center gap-1.5 cursor-pointer ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition-opacity'}`}
            >
              <div className={`w-14 h-14 rounded-full p-[2px] transition-all ${isActive ? 'bg-gradient-to-tr from-[#10b981] to-[#34d399] scale-110 shadow-sm shadow-[#10b981]/40' : 'bg-transparent border-2 border-zinc-200'}`}>
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-bg-elevated">
                  <img src={acc.avatarUrl || `https://ui-avatars.com/api/?name=${acc.username}`} alt={acc.username} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[9px] font-semibold uppercase text-text-primary max-w-[64px] truncate text-center">{acc.username}</span>
            </div>
          );
        })}
        <div 
          onClick={onAddAccount}
          className="flex flex-col items-center gap-1.5 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
        >
          <div className="w-14 h-14 rounded-full border-2 border-transparent p-[2px]">
            <div className="w-full h-full rounded-full border-2 border-dashed border-[#999] flex items-center justify-center bg-bg-sunken">
              <Plus className="w-4 h-4 text-text-secondary" />
            </div>
          </div>
          <span className="text-[9px] font-semibold uppercase text-text-primary">Add</span>
        </div>
      </div>
    </div>
  );
};
