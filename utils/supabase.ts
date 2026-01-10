
import { createClient } from '@supabase/supabase-js';

// configuration
export const getSupabaseConfig = () => {
  // Priority: Env Vars (Production) -> LocalStorage (Bootstrap)
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_KEY;

  if (envUrl && envKey) return { url: envUrl, key: envKey };

  try {
    const saved = localStorage.getItem('dm_supabase_config');
    if (saved) return JSON.parse(saved);
  } catch { }

  return null;
};

let supabaseInstance: any = null;

export const initSupabase = (force = false) => {
  if (supabaseInstance && !force) return supabaseInstance;
  const config = getSupabaseConfig();
  if (config) {
    supabaseInstance = createClient(config.url, config.key);
    return supabaseInstance;
  }
  return null;
};

export const saveSupabaseConfig = async (projectId: string, key: string) => {
  const config = { projectId, url: `https://${projectId}.supabase.co`, key };
  localStorage.setItem('dm_supabase_config', JSON.stringify(config));
  // In a real app, we might also save this to a 'dm_config' table if we have a master key.
  // For now, local storage handles the bootstrap.
};

export const supabase = () => {
  if (!supabaseInstance) return initSupabase();
  return supabaseInstance;
};

export const isCloudConnected = () => !!supabase();

// --- CRUD ---

export const fetchFromCloud = async (table: string) => {
  const client = supabase();
  if (!client) return { data: [], error: 'no-client' };

  const { data, error } = await client.from(table).select('data');
  if (error) {
    console.error(`Fetch Error (${table}):`, error);
    return { data: [], error: error };
  }
  // Unpack the JSONB 'data' column
  return { data: data.map((row: any) => row.data), error: null };
};

export const saveToCloud = async (table: string, id: string, data: any) => {
  const client = supabase();
  if (!client) return;

  const { error } = await client
    .from(table)
    .upsert({ id, data, updated_at: new Date().toISOString() });

  if (error) console.error(`Save Error (${table}):`, error);
};

export const deleteFromCloud = async (table: string, id: string) => {
  const client = supabase();
  if (!client) return;

  const { error } = await client.from(table).delete().eq('id', id);
  if (error) console.error(`Delete Error (${table}):`, error);
};

// --- STORAGE ---

export const uploadImage = async (file: File): Promise<string> => {
  const client = supabase();
  if (!client) throw new Error("Supabase not connected");

  // Create unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

  // Upload to 'dm_assets' bucket
  const { error: uploadError } = await client.storage
    .from('dm_assets') // BUCKET NAME must be 'dm_assets'
    .upload(fileName, file);

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // Get Public URL
  const { data } = client.storage.from('dm_assets').getPublicUrl(fileName);
  return data.publicUrl;
};
