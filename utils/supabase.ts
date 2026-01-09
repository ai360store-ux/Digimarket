
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Retrieves the master vault credentials from permanent storage.
 */
export const getSupabaseConfig = () => {
  try {
    const saved = localStorage.getItem('dm_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure the URL is correctly constructed from the Project ID
      if (parsed.projectId && !parsed.url) {
        parsed.url = `https://${parsed.projectId}.supabase.co`;
      }
      return parsed;
    }
  } catch (e) {
    console.error("Critical Storage Retrieval Error:", e);
  }
  return { url: '', key: '', projectId: '' };
};

let supabaseInstance: any = null;

/**
 * Initializes the global system bridge using the stored master credentials.
 */
export const initSupabase = () => {
  const config = getSupabaseConfig();
  
  if (config.projectId && config.key) {
    const url = config.url || `https://${config.projectId}.supabase.co`;
    if (validateUrl(url)) {
      try {
        supabaseInstance = createClient(url, config.key);
        return supabaseInstance;
      } catch (e) {
        console.error("Database Handshake Failure:", e);
      }
    }
  }
  supabaseInstance = null;
  return null;
};

// Immediate initialization attempt
initSupabase();

/**
 * Accessor for the active system bridge. 
 * Re-initializes automatically if credentials have been updated.
 */
export const supabase = () => {
  // If no instance exists but we have keys, initialize now.
  if (!supabaseInstance) {
    return initSupabase();
  }
  return supabaseInstance;
};

/**
 * Global Bridge Status.
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
    console.error(`Global System Sync Error (${table}):`, error);
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
      if (error.code === '42P01') return []; // Infrastructure not provisioned
      throw error;
    }
    return data?.map((item: any) => item.data) || [];
  } catch (e) {
    console.error(`Global System Pull Error (${table}):`, e);
    return [];
  }
};
