
import React, { useState, useEffect } from 'react';
import { supabase, getSupabaseConfig } from '../../utils/supabase.ts';
import { Product, Category, AppSettings } from '../../types';

interface DebugPageProps {
    products?: Product[];
    categories?: Category[];
    settings?: AppSettings;
}

const DebugPage: React.FC<DebugPageProps> = ({ products = [], categories = [], settings }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [config, setConfig] = useState<any>(null);
    const [showState, setShowState] = useState(false);

    const log = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const runDiagnostics = async () => {
        setLogs([]);
        log("Starting Diagnostics...");

        try {
            // 1. Check Configuration
            const cfg = getSupabaseConfig();
            setConfig(cfg);
            log(`Config Loaded. URL: ${cfg.url}, Key Length: ${cfg.key?.length || 0}`);

            if (!cfg.url || !cfg.key) {
                log("❌ CRITICAL: Missing URL or Key. Aborting.");
                return;
            }

            const client = supabase();
            if (!client) {
                log("❌ CRITICAL: Client init failed.");
                return;
            }
            log("✓ Client initialized.");

            // 2. Test Connection (Read Settings)
            log("Testing Connection (Reading dm_settings)...");
            const { data: sData, error: sError } = await client.from('dm_settings').select('count', { count: 'exact', head: true });

            if (sError) {
                log(`❌ READ FAILED: ${sError.code} - ${sError.message}`);
                if (sError.code === '42P01') {
                    log("⚠️ TIP: Tables are missing. Run the SQL script.");
                }
            } else {
                log(`✓ READ OK. Count: ${sData}`);
            }

            // 3. Test Write (Upsert Dummy)
            const testId = 'debug-test-' + Math.random().toString(36).substr(2, 5);
            log(`Testing Write (Upserting ID: ${testId} to dm_settings)...`);

            const { error: wError } = await client
                .from('dm_settings')
                .upsert({ id: testId, data: { test: true, timestamp: new Date().toISOString() } })
                .select();

            if (wError) {
                log(`❌ WRITE FAILED: ${wError.code} - ${wError.message}`);
                // Check for RLS
                if (wError.code === '42501') {
                    log("⚠️ TIP: RLS BLOCKING WRITES. 'ROW LEVEL SECURITY' is enabled but no policy allows 'anon' role to write.");
                }
            } else {
                log("✓ WRITE OK.");

                // 4. Test Verification (Read Back)
                log("Verifying Write...");
                const { data: vData, error: vError } = await client
                    .from('dm_settings')
                    .select('data')
                    .eq('id', testId)
                    .single();

                if (vError || !vData) {
                    log(`❌ VERIFY FAILED: Could not read back the record we just wrote.`);
                } else {
                    log("✓ VERIFY OK: Data matches.");
                }

                // 5. Clean Up
                log("Cleaning Up...");
                const { error: dError } = await client.from('dm_settings').delete().eq('id', testId);
                if (dError) log(`❌ DELETE FAILED: ${dError.message}`);
                else log("✓ DELETE OK.");
            }

        } catch (e: any) {
            log(`❌ UNEXPECTED CRASH: ${e.message}`);
        }

        log("Diagnostics Complete.");
    };

    return (
        <div className="p-10 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black">System Diagnostics</h1>
                <div className="space-x-4">
                    <button onClick={() => setShowState(!showState)} className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-bold hover:bg-slate-300">
                        {showState ? 'Hide App State' : 'Show App State'}
                    </button>
                    <button onClick={runDiagnostics} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                        Run DB Connection Test
                    </button>
                </div>
            </div>

            {/* APP STATE SECTION */}
            {showState && (
                <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 space-y-4">
                    <h2 className="text-xl font-bold">Current Application State</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase">Products</p>
                            <p className="text-3xl font-black">{products.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase">Categories</p>
                            <p className="text-3xl font-black">{categories.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase">Settings</p>
                            <p className="text-sm font-bold truncate">{settings ? 'Loaded' : 'Missing'}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Raw Data Dump (First 3 Items)</p>
                        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-auto max-h-[300px]">
                            {JSON.stringify({
                                settings,
                                categories,
                                productsSample: products.slice(0, 3)
                            }, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            <div className="bg-slate-100 p-6 rounded-xl space-y-4">
                <p><strong>URL:</strong> {config?.url || 'Checking...'}</p>
                <p><strong>Key (first 10):</strong> {config?.key?.substring(0, 10)}...</p>
            </div>

            <div className="bg-slate-900 text-green-400 font-mono p-6 rounded-xl text-sm min-h-[400px] overflow-y-auto whitespace-pre-wrap">
                {logs.length === 0 ? "Ready to run tests..." : logs.join('\n')}
            </div>
        </div>
    );
};

export default DebugPage;
