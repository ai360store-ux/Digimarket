
import React from 'react';
import { AppSettings } from '../../types';

interface AdminSettingsProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, setSettings }) => {
  const handleChange = (field: keyof AppSettings, value: string | number) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      
      {/* Brand & Market */}
      <section className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-sm space-y-12 relative overflow-hidden">
        <div className="flex items-center gap-6 border-b border-slate-100 pb-8 relative z-10">
          <span className="text-3xl">⚙️</span>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">General Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Market Brand Name</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 text-2xl font-black tracking-tighter italic uppercase"
              value={settings.brandName}
              onChange={e => handleChange('brandName', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Default Marketplace Currency</label>
            <div className="relative">
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 font-black appearance-none cursor-pointer text-lg"
                value={settings.currencySymbol}
                onChange={e => handleChange('currencySymbol', e.target.value)}
              >
                <option value="₹">₹ Indian Rupee (INR)</option>
                <option value="$">$ US Dollar (USD)</option>
                <option value="€">€ Euro (EUR)</option>
                <option value="£">£ British Pound (GBP)</option>
                <option value="¥">¥ Japanese Yen (JPY)</option>
                <option value="AED">AED UAE Dirham (AED)</option>
                <option value="SAR">SAR Saudi Riyal (SAR)</option>
                <option value="AUD">A$ Australian Dollar (AUD)</option>
                <option value="CAD">C$ Canadian Dollar (CAD)</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected currency will be applied to all existing and new products globally.</p>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Established Since</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 font-black text-lg italic tracking-widest"
              value={settings.establishedYear}
              onChange={e => handleChange('establishedYear', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Default Tax Percentage (%)</label>
            <input 
              type="number"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 font-black text-lg"
              value={settings.defaultTaxPercent}
              onChange={e => handleChange('defaultTaxPercent', Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      {/* Bridge Integration */}
      <section className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-sm space-y-12 relative overflow-hidden">
        <div className="flex items-center gap-6 border-b border-slate-100 pb-8 relative z-10">
          <span className="text-3xl">💬</span>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Support Integration</h3>
        </div>
        <div className="space-y-10 relative z-10">
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">WhatsApp Support Number</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-emerald-600 font-mono text-2xl font-black tracking-widest"
              value={settings.whatsappNumber}
              onChange={e => handleChange('whatsappNumber', e.target.value)}
            />
            <p className="mt-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic opacity-80">Note: Use full country code without '+' for automated WhatsApp link generation.</p>
          </div>
        </div>
      </section>

      <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-[32px] flex items-center gap-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-600/20 text-white">✓</div>
        <div>
          <p className="font-black text-slate-900 uppercase text-[13px] tracking-[0.3em] mb-2 italic">Global Sync Status: Operational</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">System state changes are deployed to the public storefront immediately. Maintain operational security.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
