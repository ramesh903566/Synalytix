import React from 'react';
import { useAnalytics } from '../core/AnalyticsContext';

export const ConnectedAccounts: React.FC = () => {
  const { data, setSelectedAccount, setView } = useAnalytics();
  
  if (!data || data.accounts.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold mb-6">Connected Accounts</h3>
      <div className="bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-text-secondary uppercase tracking-wider bg-bg-sunken border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">Profile</th>
                <th className="px-6 py-4 font-bold">Followers</th>
                <th className="px-6 py-4 font-bold">Growth</th>
                <th className="px-6 py-4 font-bold">Reach</th>
                <th className="px-6 py-4 font-bold">Engagement</th>
                <th className="px-6 py-4 font-bold">Health Score</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {data.accounts.map((account) => (
                <tr 
                  key={account.id} 
                  onClick={() => {
                    setSelectedAccount(account);
                    setView('account_detail');
                  }}
                  className="hover:bg-bg-sunken cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-border overflow-hidden bg-bg-canvas">
                        {account.avatarUrl ? (
                          <img src={account.avatarUrl} alt={account.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-lg bg-gradient-to-tr from-brand-light to-brand text-white">
                            {account.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">{account.username}</div>
                        <div className="text-xs text-text-muted">{account.platform}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">{account.followers.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${account.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {account.growth > 0 ? '+' : ''}{account.growth.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{account.reach.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold">{account.engagement.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-bg-canvas rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${account.healthScore > 80 ? 'bg-green-500' : account.healthScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${account.healthScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs">{account.healthScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {account.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
