
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getSupabaseConfig = () => {
  try {
    const saved = localStorage.getItem('dm_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && !parsed.url) {
        parsed.url = `https://${parsed.projectId}.supabase.co`;
      }
      return parsed;
    }
  } catch (e) {
    console.error("Config Retrieval Error:", e);
  }
  return { url: '', key: '', projectId: '' };
};

let supabaseInstance: any = null;

export const initSupabase = () => {
  const config = getSupabaseConfig();
  
  if (config.projectId && config.key) {
    const url = config.url || `https://${config.projectId}.supabase.co`;
    if (validateUrl(url)) {
      try {
        supabaseInstance = createClient(url, config.key);
        return supabaseInstance;
      } catch (e) {
        console.error("System Bridge Initialization Failed:", e);
      }
    }
  }
  supabaseInstance = null;
  return null;
};

// Auto-init on script load
initSupabase();

export const supabase = () => {
  if (!supabaseInstance) return initSupabase();
  return supabaseInstance;
};

/**
 * Global Connection Status.
 * Returns true if the Master Vault Credentials are set in the system.
 */
export const isCloudConnected = () => {
  const config = getSupabaseConfig();
  return !!(config.projectId && config.key);
};

export const saveToCloud = async (table: string, id: string, data: any) => {
  const client = supabase();
  if (!client) return null;
  
  try {
    const { error } = await client
      .from(table)
      .upsert({ id, data, updated_at: new Date().toISOString() });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Global Sync Error (${table}):`, error);
    throw error;
  }
};

export const fetchFromCloud = async (table: string) => {
  const client = supabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from(table)
      .select('data');
    
    if (error) {
      if (error.code === '42P01') return []; // Table doesn't exist yet
      throw error;
    }
    return data?.map((item: any) => item.data) || [];
  } catch (e) {
    console.error(`Global Pull Error (${table}):`, e);
    return [];
  }
};
