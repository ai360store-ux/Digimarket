
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppSettings, Product, Category } from '../../types.ts';
import { isCloudConnected, saveToCloud, initSupabase, getSupabaseConfig, supabase, fetchFromCloud } from '../../utils/supabase.ts';

interface AdminSettingsProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  categories: Category[];
  setCategories: (c: Category[]) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, setSettings, products, setProducts, categories, setCategories }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cloudConfig, setCloudConfig] = useState(() => getSupabaseConfig());
  const [testStatus, setTestStatus] = useState<{ type: 'idle' | 'testing' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
  const [syncStatus, setSyncStatus] = useState({ active: false, current: 0, total: 0, message: '' });
  const [showSql, setShowSql] = useState(false);
  const [dbStats, setDbStats] = useState<{ products: number, categories: number, connected: boolean }>({ products: 0, categories: 0, connected: false });
  const [profileInput, setProfileInput] = useState('');

  // Handle URL-based Auto-Configuration
  useEffect(() => {
    const configParam = searchParams.get('vault_link');
    if (configParam) {
      try {
        const decoded = JSON.parse(atob(configParam));
        if (decoded.projectId && decoded.key) {
          localStorage.setItem('dm_supabase_config', JSON.stringify(decoded));
          setCloudConfig(decoded);
          // Remove param from URL for cleanliness
          searchParams.delete('vault_link');
          setSearchParams(searchParams);
          // Trigger instant test
          setTimeout(() => testConnection(decoded), 500);
        }
      } catch (e) {
        console.error("Invalid Vault Link");
      }
    }
  }, [searchParams]);

  const sqlScript = `-- 1. Create the tables
CREATE TABLE IF NOT EXISTS dm_products (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS dm_categories (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS dm_settings (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());
-- 2. Disable RLS
ALTER TABLE dm_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE dm_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE dm_settings DISABLE ROW LEVEL SECURITY;`;

  useEffect(() => {
    if (isCloudConnected()) {
      checkCloudStats();
    }
  }, []);

  const checkCloudStats = async () => {
    const client = supabase();
    if (!client) return;
    try {
      const { count: pCount } = await client.from('dm_products').select('*', { count: 'exact', head: true });
      const { count: cCount } = await client.from('dm_categories').select('*', { count: 'exact', head: true });
      setDbStats({ products: pCount || 0, categories: cCount || 0, connected: true });
    } catch (e) {
      setDbStats(prev => ({ ...prev, connected: false }));
    }
  };

  const handleCloudConfigChange = (field: string, value: string) => {
    let newConfig = { ...cloudConfig, [field]: value.trim() };
    if (field === 'projectId' && value.trim()) {
      newConfig.url = `https://${value.trim()}.supabase.co`;
    }
    setCloudConfig(newConfig);
    localStorage.setItem('dm_supabase_config', JSON.stringify(newConfig));
  };

  const generateSetupLink = () => {
    const profile = btoa(JSON.stringify(cloudConfig));
    const baseUrl = window.location.href.split('?')[0];
    const setupUrl = `${baseUrl}?vault_link=${profile}`;
    navigator.clipboard.writeText(setupUrl);
    alert('ONE-CLICK SETUP LINK COPIED!\n\nOpen this link in any other browser to instantly sync your credentials.');
  };

  const testConnection = async (overrideConfig?: any) => {
    const config = overrideConfig || getSupabaseConfig();
    if (!config.url || !config.key) {
      setTestStatus({ type: 'error', message: 'Credentials missing. Check Project ID and Key.' });
      return;
    }

    setTestStatus({ type: 'testing', message: 'Syncing Cloud Handshake...' });
    
    try {
      const client = initSupabase();
      if (!client) throw new Error("Client initialization failed");

      const { error } = await client.from('dm_settings').select('id').limit(1);
      
      if (error) {
        if (error.code === '42P01') {
          setTestStatus({ type: 'error', message: 'Bridge Established, but tables missing. Run SQL below.' });
          setShowSql(true);
          return;
        }
        throw error;
      }

      setTestStatus({ type: 'success', message: 'Vault Linked. Populating this browser...' });
      
      const [cloudP, cloudC, cloudS] = await Promise.all([
        fetchFromCloud('dm_products'),
        fetchFromCloud('dm_categories'),
        fetchFromCloud('dm_settings')
      ]);

      if (cloudP && cloudP.length > 0) setProducts(cloudP);
      if (cloudC && cloudC.length > 0) setCategories(cloudC);
      if (cloudS && cloudS.length > 0) setSettings(cloudS[0]);

      checkCloudStats();
    } catch (e: any) {
      console.error(e);
      setTestStatus({ type: 'error', message: e.message || 'Connection failed.' });
    }
  };

  const pushCurrentToCloud = async () => {
    if (!isCloudConnected()) {
      setSyncStatus({ ...syncStatus, message: 'Error: Bridge Offline.' });
      return;
    }
    const totalItems = products.length + categories.length + 1;
    setSyncStatus({ active: true, current: 0, total: totalItems, message: 'Filing Remote Records...' });
    try {
      let count = 0;
      for (const p of products) {
        await saveToCloud('dm_products', p.id, p);
        count++;
        setSyncStatus(prev => ({ ...prev, current: count, message: `Uploading Items (${count}/${products.length})` }));
      }
      for (const c of categories) {
        await saveToCloud('dm_categories', c.id, c);
        count++;
        setSyncStatus(prev => ({ ...prev, current: count, message: `Uploading Groups (${count - products.length}/${categories.length})` }));
      }
      await saveToCloud('dm_settings', 'global-config', settings);
      setSyncStatus({ active: false, current: totalItems, total: totalItems, message: 'CLOUD ARCHIVE COMPLETE' });
      checkCloudStats();
    } catch (e: any) {
      console.error(e);
      setSyncStatus({ active: false, current: 0, total: 0, message: 'Sync Failed.' });
    }
    setTimeout(() => setSyncStatus(prev => ({ ...prev, message: '' })), 5000);
  };

  const handleChange = (field: keyof AppSettings, value: string | number) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      
      {/* CLOUD BRIDGE CONTROLS */}
      <section className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-3xl border border-white/10">☁️</div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Cloud Synchronization</h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Authorized Supabase Bridge</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               {isCloudConnected() && (
                 <button 
                  onClick={generateSetupLink}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                 >
                   One-Click Setup Link
                 </button>
               )}
               <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all ${isCloudConnected() ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isCloudConnected() ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                <span className="text-[11px] font-black uppercase tracking-widest italic">{isCloudConnected() ? 'Synced' : 'Local Only'}</span>
              </div>
            </div>
          </div>

          {!isCloudConnected() && (
            <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
              <p className="text-white/40 text-[11px] font-bold leading-relaxed italic">
                <span className="text-blue-400 font-black">Browser Isolation:</span> For security, your cloud credentials are stored only in this specific browser's local cache. If you open this site in a different browser, the bridge will be offline until you re-link it using your credentials or a <span className="text-white">Setup Link</span>.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Project ID</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all text-white font-mono text-xs"
                    placeholder="abcdefghijklm"
                    value={cloudConfig.projectId}
                    onChange={e => handleCloudConfigChange('projectId', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">API Secret Key</label>
                  <input 
                    type="password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all text-white font-mono text-xs"
                    placeholder="Paste public key..."
                    value={cloudConfig.key}
                    onChange={e => handleCloudConfigChange('key', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col items-center gap-8 pt-4">
              <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <button 
                  disabled={testStatus.type === 'testing'}
                  onClick={() => testConnection()} 
                  className={`w-full group relative bg-white text-slate-900 font-black px-16 py-6 rounded-[2rem] hover:bg-blue-600 hover:text-white transition-all duration-500 uppercase text-[13px] tracking-[0.3em] italic shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95 overflow-hidden ${testStatus.type === 'testing' ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <span className="relative z-10">
                    {testStatus.type === 'testing' ? 'Connecting...' : 'Test & Link This Browser'}
                  </span>
                </button>
                
                {testStatus.message && (
                  <div className={`text-center text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border ${testStatus.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                    {testStatus.message}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-6 pt-4 border-t border-white/5 w-full">
                <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                  <span>Inventory: {dbStats.products} Items</span>
                  <span>Sectors: {dbStats.categories} Groups</span>
                </div>

                <div className="w-full max-w-sm space-y-4">
                  <button 
                    disabled={syncStatus.active}
                    onClick={pushCurrentToCloud}
                    className="w-full text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center justify-center gap-3"
                  >
                    {syncStatus.active ? 'Syncing...' : 'Force Local Data to Cloud'}
                  </button>
                  
                  {syncStatus.active && (
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(syncStatus.current / syncStatus.total) * 100}%` }}></div>
                    </div>
                  )}

                  {syncStatus.message && (
                    <p className="text-blue-400 font-black uppercase text-[10px] tracking-widest italic animate-pulse text-center">{syncStatus.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SQL SCHEMA */}
      {showSql && (
        <section className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-xl space-y-6">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Required SQL Setup</h3>
          <p className="text-slate-500 text-[13px] font-medium leading-relaxed italic">Run this in your Supabase SQL Editor:</p>
          <pre className="w-full bg-slate-900 text-slate-300 p-8 rounded-3xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">{sqlScript}</pre>
        </section>
      )}

      {/* MARKETPLACE CONFIG */}
      <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
        <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">⚙️</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Marketplace Identity</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Core branding and regional settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Official Brand Label</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 text-3xl font-black tracking-tighter italic uppercase"
              value={settings.brandName}
              onChange={e => handleChange('brandName', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Operational Currency</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 font-black text-lg"
              value={settings.currencySymbol}
              onChange={e => handleChange('currencySymbol', e.target.value)}
            >
              <option value="₹">₹ Indian Rupee (INR)</option>
              <option value="$">$ US Dollar (USD)</option>
              <option value="€">€ Euro (EUR)</option>
              <option value="AED">AED UAE Dirham (AED)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Establishment Year</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 font-black text-lg italic tracking-widest"
              value={settings.establishedYear}
              onChange={e => handleChange('establishedYear', e.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;
