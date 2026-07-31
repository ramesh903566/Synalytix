import React from 'react';

// For brevity in this refactoring, we'll implement a simple placeholder for Audience, 
// as it would eventually need its own set of generic charting components.
export const AudienceTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Audience Demographics</h2>
          <p className="text-sm text-text-muted">Understand who is interacting with your content.</p>
        </div>
      </div>
      
      <div className="p-12 text-center text-text-muted bg-bg-elevated rounded-2xl border border-border">
        Audience demographic visualization goes here (Age, Gender, Location, Active Times).
      </div>
    </div>
  );
};
