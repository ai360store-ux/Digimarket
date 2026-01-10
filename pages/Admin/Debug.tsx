
import React, { useState } from 'react';
import { useDigiContext } from '../../context/DigiContext';
import { supabase, getSupabaseConfig, saveToCloud } from '../../utils/supabase';

const DebugPage: React.FC = () => {
    const { products, categories, settings, isLive, refreshData } = useDigiContext();
    const [logs, setLogs] = useState<string[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const log = (msg: string) => setLogs(prev => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev]);

    const runDiagnostics = async () => {
        log("--- Starting Connection Diagnostics ---");
        const cfg = getSupabaseConfig();
        if (!cfg) {
            log("❌ ERROR: No Supabase configuration found in localStorage or ENV.");
            return;
        }

        log(`Targeting: ${cfg.url}`);
        const client = supabase();

        try {
            log("Testing Table Accessibility...");
            const { error: pError } = await client.from('dm_products').select('id').limit(1);
            if (pError) log(`❌ Products Table: ${pError.message}`);
            else log("✓ Products Table: Accessible");

            const { error: cError } = await client.from('dm_categories').select('id').limit(1);
            if (cError) log(`❌ Categories Table: ${cError.message}`);
            else log("✓ Categories Table: Accessible");

            const { error: sError } = await client.from('dm_settings').select('id').limit(1);
            if (sError) log(`❌ Settings Table: ${sError.message}`);
            else log("✓ Settings Table: Accessible");

            log("--- Diagnostics Complete ---");
        } catch (err: any) {
            log(`❌ CRITICAL CRASH: ${err.message}`);
        }
    };

    const pushToCloud = async () => {
        if (!window.confirm("This will attempt to write all current local/mock data to your connected Supabase project. Continue?")) return;
        setIsSyncing(true);
        log("--- Starting Bulk Migration ---");

        try {
            log(`Migrating ${products.length} Products...`);
            for (const p of products) {
                await saveToCloud('dm_products', p.id, p);
            }
            log("✓ Products Migrated.");

            log(`Migrating ${categories.length} Categories...`);
            for (const c of categories) {
                await saveToCloud('dm_categories', c.id, c);
            }
            log("✓ Categories Migrated.");

            log("Migrating Settings...");
            await saveToCloud('dm_settings', 'global-config', settings);
            log("✓ Settings Migrated.");

            log("🎉 Migration Successful. Refreshing state...");
            await refreshData();
        } catch (err: any) {
            log(`❌ MIGRATION FAILED: ${err.message}`);
            alert("Migration Failed: " + err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="space-y-10 max-w-5xl mx-auto pb-32">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">System Diagnostics</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Hardware & Sync Integrity Console</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={runDiagnostics}
                        className="bg-slate-100 text-slate-900 font-black px-6 py-3 rounded-2xl uppercase text-[10px] tracking-widest italic hover:bg-slate-200 transition-all border border-slate-200"
                    >
                        🔍 Test Link
                    </button>
                    <button
                        disabled={isSyncing}
                        onClick={pushToCloud}
                        className="bg-blue-600 text-white font-black px-8 py-3 rounded-2xl uppercase text-[10px] tracking-widest italic hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
                    >
                        {isSyncing ? '📡 Syncing...' : '🚀 Force Global Sync'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full"></div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h3 className="text-sm font-black uppercase tracking-tighter italic">Live Telemetry</h3>
                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic border ${isLive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {isLive ? 'Link Active' : 'Offline / Mock'}
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-white/40 uppercase tracking-widest">Products Found</span>
                            <span className="text-white italic">{products.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-white/40 uppercase tracking-widest">Categories Found</span>
                            <span className="text-white italic">{categories.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-white/40 uppercase tracking-widest">Brand Label</span>
                            <span className="text-white italic">{settings.brandName}</span>
                        </div>
                    </div>

                    <div className="pt-4 mt-auto">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[9px] font-mono text-white/50 break-all">
                            ENDPOINT: {getSupabaseConfig()?.url || 'NULL'}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Sync Activity Log</h3>
                        <button onClick={() => setLogs([])} className="text-[9px] font-black text-rose-600 uppercase tracking-widest hover:underline">Clear</button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] pr-2 custom-scrollbar">
                        {logs.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-300 italic">No activity detected.</div>
                        ) : (
                            logs.map((l, i) => (
                                <div key={i} className={`p-3 rounded-lg border flex items-start gap-4 ${l.includes('❌') ? 'bg-rose-50 border-rose-100 text-rose-700' : l.includes('✓') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                                    {l}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugPage;
