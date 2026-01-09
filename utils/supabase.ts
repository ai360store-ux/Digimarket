
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
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Supabase Config Error:", e);
  }
  return { url: '', key: '', projectId: '' };
};

// Lazy singleton client
let supabaseInstance: any = null;

export const initSupabase = () => {
  const config = getSupabaseConfig();
  if (config.url && config.key && validateUrl(config.url)) {
    try {
      supabaseInstance = createClient(config.url, config.key);
      return supabaseInstance;
    } catch (e) {
      console.error("Supabase Initialization Failed:", e);
      supabaseInstance = null;
    }
  }
  return null;
};

// Initial attempt
initSupabase();

export const supabase = () => supabaseInstance || initSupabase();

export const isCloudConnected = () => {
  const config = getSupabaseConfig();
  return !!(config.url && config.key && supabaseInstance);
};

/**
 * Saves or updates a document in the specified table.
 */
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
    console.error(`Supabase Upsert Error (${table}):`, error);
    throw error;
  }
};

/**
 * Fetches all records from a table and extracts the 'data' field.
 */
export const fetchFromCloud = async (table: string) => {
  const client = supabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from(table)
      .select('data');
    
    if (error) {
      // If table doesn't exist, we return empty so fallback logic can take over
      if (error.code === '42P01') {
        console.warn(`Supabase: Table ${table} not found yet.`);
        return [];
      }
      throw error;
    }
    return data?.map((item: any) => item.data) || [];
  } catch (e) {
    console.error(`Supabase Fetch Error (${table}):`, e);
    return [];
  }
};
