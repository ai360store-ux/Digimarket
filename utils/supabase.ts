
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// Handles the bootstrapping of the Supabase connection
export const getSupabaseConfig = () => {
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

export const supabase = () => {
  if (!supabaseInstance) return initSupabase();
  return supabaseInstance;
};

export const isCloudConnected = () => {
  const config = getSupabaseConfig();
  return !!(config?.url && config?.key);
};

export const saveSupabaseConfig = (projectId: string, key: string) => {
  const url = `https://${projectId}.supabase.co`;
  const config = { projectId, url, key };
  localStorage.setItem('dm_supabase_config', JSON.stringify(config));
  initSupabase(true); // Force re-init after saving
};

// --- CORE CRUD (Strict Database First) ---

export const fetchFromCloud = async (table: string) => {
  const client = supabase();
  if (!client) throw new Error("Database not connected. Please check your settings.");

  const { data, error } = await client.from(table).select('data');
  if (error) throw error;

  return { data: data.map((row: any) => row.data), error: null };
};

export const saveToCloud = async (table: string, id: string, data: any) => {
  const client = supabase();
  if (!client) throw new Error("Database not connected.");

  const { error } = await client
    .from(table)
    .upsert({ id, data, updated_at: new Date().toISOString() });

  if (error) throw error;
};

export const deleteFromCloud = async (table: string, id: string) => {
  const client = supabase();
  if (!client) throw new Error("Database not connected.");

  const { error } = await client.from(table).delete().eq('id', id);
  if (error) throw error;
};

// --- STORAGE ---

export const uploadImage = async (file: File): Promise<string> => {
  const client = supabase();
  if (!client) throw new Error("Supabase not connected. Visit Settings.");

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

  const { error: uploadError } = await client.storage
    .from('dm_assets')
    .upload(fileName, file);

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data } = client.storage.from('dm_assets').getPublicUrl(fileName);
  return data.publicUrl;
};
