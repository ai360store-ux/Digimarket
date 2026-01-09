
import React, { useState, useEffect } from 'react';
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
  // Use state but initialize directly from permanent storage to prevent refresh loss
  const [cloudConfig, setCloudConfig] = useState(() => getSupabaseConfig());
  const [testStatus, setTestStatus] = useState<{ type: 'idle' | 'testing' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
  const [syncStatus, setSyncStatus] = useState({ active: false, message: '' });
  const [showSql, setShowSql] = useState(false);
  const [dbStats, setDbStats] = useState({ products: 0, categories: 0 });

  // Safety check: Re-sync state from storage on mount
  useEffect(() => {
    const config = getSupabaseConfig();
    setCloudConfig(config);
    if (config.projectId && config.key) {
      checkCloudStats();
    }
  }, []);

  const checkCloudStats = async () => {
    const client = supabase();
    if (!client) return;
    try {
      const { count: pCount } = await client.from('dm_products').select('*', { count: 'exact', head: true });
      const { count: cCount } = await client.from('dm_categories').select('*', { count: 'exact', head: true });
      setDbStats({ products: pCount || 0, categories: cCount || 0 });
    } catch (e) {
      console.log("Cloud stats check waiting for connection...");
    }
  };

  const handleCloudConfigChange = (field: string, value: string) => {
    const trimmedValue = value.trim();
    setCloudConfig(prev => {
      const newConfig = { ...prev, [field]: trimmedValue };
      if (field === 'projectId') {
        newConfig.url = `https://${trimmedValue}.supabase.co`;
      }
      // HARD PERSISTENCE: Save to browser system memory immediately
      localStorage.setItem('dm_supabase_config', JSON.stringify(newConfig));
      return newConfig;
    });
  };

  const testConnection = async () => {
    // Ensure we are using the absolute latest keys from the state
    if (!cloudConfig.projectId || !cloudConfig.key) {
      setTestStatus({ type: 'error', message: 'Master Keys Required.' });
      return;
    }

    setTestStatus({ type: 'testing', message: 'Connecting to Global Vault...' });
    
    try {
      // Re-init the bridge with the new keys
      const client = initSupabase();
      if (!client) throw new Error("Connection initialization failed.");

      // Verify connection by checking the settings table
      const { error } = await client.from('dm_settings').select('id').limit(1);
      
      if (error) {
        if (error.code === '42P01') {
          setTestStatus({ type: 'error', message: 'Vault Found, but Tables are Missing. Run SQL below.' });
          setShowSql(true);
          return;
        }
        throw error;
      }

      setTestStatus({ type: 'success', message: 'Global System Link: ACTIVE' });
      
      // Pull latest repository data
      setSyncStatus({ active: true, message: 'Syncing Marketplace Inventory...' });
      
      const [cloudP, cloudC, cloudS] = await Promise.all([
        fetchFromCloud('dm_products'),
        fetchFromCloud('dm_categories'),
        fetchFromCloud('dm_settings')
      ]);

      if (cloudP && cloudP.length > 0) setProducts(cloudP);
      if (cloudC && cloudC.length > 0) setCategories(cloudC);
      if (cloudS && cloudS.length > 0) setSettings(cloudS[0]);

      checkCloudStats();
      setSyncStatus({ active: false, message: 'Sync Complete.' });
      setTimeout(() => setSyncStatus({ active: false, message: '' }), 3000);
    } catch (e: any) {
      console.error(e);
      setTestStatus({ type: 'error', message: 'Invalid Credentials. Please check your Project ID and Key.' });
    }
  };

  const pushToCloud = async () => {
    setSyncStatus({ active: true, message: 'Broadcasting data to vault...' });
    try {
      // Upload all current data to the cloud
      await Promise.all([
        ...products.map(p => saveToCloud('dm_products', p.id, p)),
        ...categories.map(c => saveToCloud('dm_categories', c.id, c)),
        saveToCloud('dm_settings', 'global-config', settings)
      ]);
      setSyncStatus({ active: false, message: 'Vault Updated Successfully.' });
      checkCloudStats();
    } catch (e: any) {
      console.error(e);
      setSyncStatus({ active: false, message: 'Broadcast Failed.' });
    }
    setTimeout(() => setSyncStatus({ active: false, message: '' }), 3000);
  };

  const handleChange = (field: keyof AppSettings, value: string | number) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      
      {/* MASTER SYSTEM BRIDGE */}
      <section className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-3xl border border-white/10 shadow-inner">🔗</div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Global System Bridge</h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Permanent Supabase Vault Connection</p>
              </div>
            </div>
            
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${isCloudConnected() ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${isCloudConnected() ? 'bg-blue-500 animate-pulse' : 'bg-rose-500'}`}></div>
              <span className="text-[11px] font-black uppercase tracking-widest italic">{isCloudConnected() ? 'System Linked' : 'System Offline'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Project ID</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all text-white font-mono text-xs"
                    placeholder="e.g. jdfkgjsldgkjlds"
                    value={cloudConfig.projectId || ''}
                    onChange={e => handleCloudConfigChange('projectId', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Master Secret API Key</label>
                  <input 
                    type="password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all text-white font-mono text-xs"
                    placeholder="Enter Secret Key..."
                    value={cloudConfig.key || ''}
                    onChange={e => handleCloudConfigChange('key', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col items-center gap-8 pt-4">
              <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <button 
                  disabled={testStatus.type === 'testing'}
                  onClick={testConnection} 
                  className={`w-full group relative bg-white text-slate-900 font-black px-16 py-6 rounded-[2rem] hover:bg-blue-600 hover:text-white transition-all duration-500 uppercase text-[13px] tracking-[0.3em] italic shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95 overflow-hidden ${testStatus.type === 'testing' ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <span className="relative z-10">
                    {testStatus.type === 'testing' ? 'Synchronizing...' : 'Synchronize Database'}
                  </span>
                </button>
                
                {testStatus.message && (
                  <div className={`text-center text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border ${testStatus.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                    {testStatus.message}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-6 pt-4 border-t border-white/5 w-full">
                <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                  <span>Cloud Items: {dbStats.products}</span>
                  <span>Cloud Groups: {dbStats.categories}</span>
                </div>

                <div className="w-full max-w-sm space-y-4">
                  <button 
                    disabled={syncStatus.active}
                    onClick={pushToCloud}
                    className="w-full text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center justify-center gap-3"
                  >
                    {syncStatus.active ? 'Processing...' : 'Force Global Update'}
                  </button>
                  
                  {syncStatus.message && (
                    <p className="text-blue-400 font-black uppercase text-[10px] tracking-widest italic animate-pulse text-center">{syncStatus.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE SETUP */}
      {showSql && (
        <section className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-xl space-y-6">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Vault Infrastructure SQL</h3>
          <p className="text-slate-500 text-[13px] font-medium leading-relaxed italic">Run this SQL in your Supabase SQL Editor to finish the system link:</p>
          <pre className="w-full bg-slate-900 text-slate-300 p-8 rounded-3xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`CREATE TABLE IF NOT EXISTS dm_products (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS dm_categories (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS dm_settings (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE dm_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE dm_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE dm_settings DISABLE ROW LEVEL SECURITY;`}
          </pre>
        </section>
      )}

      {/* BRAND CONFIG */}
      <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
        <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">⚙️</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">System Identity</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Global Marketplace Localization</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Official Brand Name</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 text-3xl font-black tracking-tighter italic uppercase"
              value={settings.brandName}
              onChange={e => handleChange('brandName', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Currency Symbol</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 font-black text-lg"
              value={settings.currencySymbol}
              onChange={e => handleChange('currencySymbol', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Foundation Year</label>
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
