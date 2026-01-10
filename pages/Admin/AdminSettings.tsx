
import React, { useState, useEffect } from 'react';
import { useDigiContext } from '../../context/DigiContext';
import { getSupabaseConfig, saveSupabaseConfig, isCloudConnected } from '../../utils/supabase';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useDigiContext();
  const [cloudConfig, setCloudConfig] = useState(() => getSupabaseConfig() || { projectId: '', key: '' });
  const [testStatus, setTestStatus] = useState({ type: 'idle', message: '' });

  const handleSaveConfig = () => {
    if (!cloudConfig.projectId || !cloudConfig.key) {
      return alert("Master Keys Required.");
    }
    saveSupabaseConfig(cloudConfig.projectId, cloudConfig.key);
    setTestStatus({ type: 'success', message: 'Configuration Saved Locally & Globally' });
    alert("✓ System Hardware Reset: New Database Keys Applied.");
  };

  const handleUpdateIdentity = async () => {
    await updateSettings(settings);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">

      {/* Supabase Hardware Link */}
      <section className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 space-y-12">
          <div className="flex items-center gap-6 border-b border-white/5 pb-10">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-3xl border border-white/10 shadow-inner">🔗</div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Vault Connection Matrix</h3>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Primary Supabase Linkage</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Project Workspace ID</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none transition-all text-white font-mono text-sm"
                  value={cloudConfig.projectId}
                  onChange={e => setCloudConfig({ ...cloudConfig, projectId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Master Service Key</label>
                <input
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none transition-all text-white font-mono text-sm"
                  value={cloudConfig.key}
                  onChange={e => setCloudConfig({ ...cloudConfig, key: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed italic">
                  Link your website to the global repository. Changes made here will broadcast instantly to all production nodes and user devices worldwide.
                </p>
              </div>
              <button
                onClick={handleSaveConfig}
                className="w-full bg-white text-slate-900 font-black py-6 rounded-2xl uppercase text-[12px] tracking-widest italic hover:bg-blue-600 hover:text-white transition-all shadow-xl"
              >
                Synchronize Hardware
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Matrix */}
      <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
        <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">⚙️</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Brand Protocol</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Identity & Currency Localization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Official Nomenclature</label>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 outline-none font-black text-slate-900 text-2xl tracking-tighter italic uppercase"
              value={settings.brandName}
              onChange={e => updateSettings({ ...settings, brandName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Currency Glyph</label>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 outline-none font-black text-slate-900 text-lg"
              value={settings.currencySymbol}
              onChange={e => updateSettings({ ...settings, currencySymbol: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={handleUpdateIdentity}
            className="bg-slate-900 text-white font-black px-12 py-5 rounded-2xl uppercase text-[12px] tracking-widest italic hover:bg-black transition-all shadow-xl"
          >
            Apply Identity
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;
