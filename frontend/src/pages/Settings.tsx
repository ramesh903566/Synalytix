import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MOCK_APPS } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const BACKEND_APPS = new Set(['github', 'instagram', 'x', 'linkedin', 'leetcode']);

export default function Settings() {
  const { connectedApps, disconnectApp } = useAppContext();
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'integrations' | 'billing'>('account');
  const [profile, setProfile] = useState({ name: 'Ramesh Kumar', email: 'ramesh@synalytix.ai', bio: 'Developer & creator building Synalytix 🚀', handle: '@ramesh988025' });
  const [prefs, setPrefs] = useState({ format: 'PNG', tone: 'Casual', aiAggressiveness: 'Medium', theme: 'Light', notifications: true, weeklyDigest: true });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (profilePhoto) URL.revokeObjectURL(profilePhoto);
    };
  }, [profilePhoto]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePhoto(url);
    }
  };

  const handleSave = () => {
    toast.success('Changes saved successfully');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pb-12 pt-6">


      <div className="bg-bg-elevated rounded-[var(--radius-card)] border border-border overflow-hidden shadow-level-1">
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[600px]">
          {/* Sidebar */}
          <div className="border-r border-border bg-bg-canvas p-5">
            <nav className="space-y-1">
              {([['account','Account'],['preferences','Preferences'],['integrations','Integrations'],['billing','Billing']] as [typeof activeTab, string][]).map(([key,label])=>(
                <button key={key} onClick={()=>setActiveTab(key)}
                  className={`w-full text-left px-4 py-2.5 rounded-[var(--radius-card-inner)] text-sm font-medium transition-colors ${activeTab===key?'bg-bg-elevated text-brand shadow-sm border border-border':'text-text-muted hover:bg-bg-sunken hover:text-text-primary'}`}>
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="col-span-3 p-8 md:p-10">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-text-primary mb-6">Account Details</h2>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-[var(--radius-avatar)] bg-brand flex items-center justify-center text-text-inverse font-bold text-xl overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      "RK"
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handlePhotoUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold border border-border px-3 py-1.5 rounded-[var(--radius-button)] text-text-primary hover:bg-bg-sunken transition-colors"
                    >
                      Change photo
                    </button>
                    <p className="text-[10px] text-text-muted mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">Full Name</label>
                    <input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} className="w-full text-sm p-3 border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all bg-bg-canvas text-text-primary"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">Handle</label>
                    <input value={profile.handle} onChange={e=>setProfile({...profile,handle:e.target.value})} className="w-full text-sm p-3 border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all bg-bg-canvas text-text-primary"/>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">Email Address</label>
                  <input value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})} className="w-full text-sm p-3 border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all bg-bg-canvas text-text-primary"/>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2">Bio</label>
                  <textarea value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})} rows={3} className="w-full text-sm p-3 border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all bg-bg-canvas resize-none text-text-primary"/>
                </div>
                <div className="border-t border-border-light pt-6">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Change Password</h3>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current password" className="w-full text-sm p-3 border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all bg-bg-canvas text-text-primary"/>
                    <input type="password" placeholder="New password" className="w-full text-sm p-3 border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all bg-bg-canvas text-text-primary"/>
                    <input type="password" placeholder="Confirm new password" className="w-full text-sm p-3 border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all bg-bg-canvas text-text-primary"/>
                  </div>
                </div>
                <button onClick={handleSave} className="px-6 py-2.5 bg-brand text-text-inverse text-sm font-medium rounded-[var(--radius-button)] hover:bg-brand-hover transition-colors shadow-level-1">Save Changes</button>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-text-primary mb-6">Preferences</h2>
                {[
                  { label: 'Default Export Format', desc: 'Format for downloaded media', type: 'select', key: 'format', options: ['PNG','JPG','WEBP'] },
                  { label: 'AI Writing Tone', desc: 'Tone used when generating captions', type: 'select', key: 'tone', options: ['Professional','Casual','Friendly','Bold','Minimal'] },
                  { label: 'AI Aggressiveness', desc: 'How much AI rewrites your content', type: 'select', key: 'aiAggressiveness', options: ['Low','Medium','High'] },
                ].map(pref => (
                  <div key={pref.key} className="flex justify-between items-center py-4 border-b border-border-light">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{pref.label}</div>
                      <div className="text-xs text-text-muted mt-0.5">{pref.desc}</div>
                    </div>
                    <select value={(prefs as any)[pref.key]} onChange={e=>setPrefs({...prefs,[pref.key]:e.target.value})}
                      className="text-sm border border-border rounded-[var(--radius-input)] px-3 py-2 outline-none bg-bg-canvas text-text-primary cursor-pointer focus:border-brand">
                      {pref.options.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                {[
                  { label: 'Email Notifications', desc: 'Receive post performance alerts', key: 'notifications' },
                  { label: 'Weekly Digest', desc: 'Sunday summary of all platform activity', key: 'weeklyDigest' },
                ].map(toggle => (
                  <div key={toggle.key} className="flex justify-between items-center py-4 border-b border-border-light">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{toggle.label}</div>
                      <div className="text-xs text-text-muted mt-0.5">{toggle.desc}</div>
                    </div>
                    <button onClick={()=>setPrefs({...prefs,[toggle.key]:!(prefs as any)[toggle.key]})}
                      className={`w-10 h-6 rounded-[var(--radius-button-pill)] transition-colors relative ${(prefs as any)[toggle.key]?'bg-brand':'bg-border'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${(prefs as any)[toggle.key]?'translate-x-5':'translate-x-1'}`}/>
                    </button>
                  </div>
                ))}
                <button onClick={handleSave} className="px-6 py-2.5 bg-brand text-text-inverse text-sm font-medium rounded-[var(--radius-button)] hover:bg-brand-hover transition-colors shadow-level-1">Save Preferences</button>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-text-primary mb-6">Connected Integrations</h2>
                {MOCK_APPS.map(app => {
                  const isConn = connectedApps.includes(app.id as any);
                  const isSupported = BACKEND_APPS.has(app.id);
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-[var(--radius-card-inner)] border border-border bg-bg-canvas">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-[var(--radius-badge)] bg-bg-elevated border border-border flex items-center justify-center font-bold text-sm overflow-hidden`}>
                          <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover scale-[1.15]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text-primary">{app.name}</div>
                          <div className="text-[10px] text-text-muted">{isConn ? 'Connected and syncing' : isSupported ? 'Not connected' : 'Coming soon'}</div>
                        </div>
                      </div>
                      {isConn ? (
                        <button onClick={()=>disconnectApp(app.id as any).catch(() => {})} className="text-[10px] font-bold text-error-text bg-error-light border border-error-text/20 px-3 py-1.5 rounded-[var(--radius-badge)] hover:bg-error-text/10 transition-colors">
                          Disconnect
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-text-muted bg-bg-sunken border border-border px-3 py-1.5 rounded-[var(--radius-badge)]">
                          Not Connected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-text-primary mb-6">Billing & Plan</h2>
                <div className="p-5 bg-brand text-text-inverse rounded-[var(--radius-card-inner)] shadow-level-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-text-inverse/70 mb-2">Current Plan</div>
                  <div className="text-2xl font-bold mb-1">Pro</div>
                  <div className="text-sm text-text-inverse/90">$12/month · Renews June 1, 2026</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{name:'Free',price:'$0',features:['2 platforms','Basic analytics','5 posts/month'],current:false},
                    {name:'Pro',price:'$12',features:['5 platforms','AI insights','Unlimited posts','Studio access'],current:true},
                    {name:'Business',price:'$39',features:['15 platforms','Team members','Priority AI','API access'],current:false}].map(plan=>(
                    <div key={plan.name} className={`p-4 rounded-[var(--radius-card-inner)] border ${plan.current?'border-brand bg-bg-elevated shadow-level-1':'border-border bg-bg-canvas'}`}>
                      <div className="font-bold text-text-primary mb-1">{plan.name}</div>
                      <div className="text-xl font-bold text-text-primary">{plan.price}<span className="text-xs font-normal text-text-muted">/mo</span></div>
                      <ul className="mt-3 space-y-1.5">
                        {plan.features.map(f=><li key={f} className="text-[10px] text-text-secondary flex items-center gap-1.5"><span className="text-success-text font-bold">✓</span>{f}</li>)}
                      </ul>
                      {!plan.current && <button className="mt-4 w-full py-1.5 text-[10px] font-bold border border-border text-text-primary rounded-[var(--radius-button)] hover:bg-bg-sunken transition-colors">Upgrade</button>}
                      {plan.current && <div className="mt-4 text-[10px] font-bold text-center text-brand">CURRENT</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
