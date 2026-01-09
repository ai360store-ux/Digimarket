
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
 * Now tries to fetch from Supabase cloud first, then falls back to localStorage.
 */
/**
 * Retrieves the master vault credentials.
 * Prioritizes:
 * 1. LocalStorage override (if admin changed it)
 * 2. Hardcoded GLOBAL defaults (so the site works for everyone by default)
 */
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
    console.error("Critical Storage Retrieval Error:", e);
  }

  // FALLBACK: Environment Variables (The proper way to configure for production/distribution)
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_KEY;

  if (envUrl && envKey) {
    // Extract project ID from URL if possible, otherwise just use URL
    // Format: https://<project_id>.supabase.co
    let projectId = '';
    try {
      const urlObj = new URL(envUrl);
      const hostParts = urlObj.hostname.split('.');
      if (hostParts.length > 0) {
        projectId = hostParts[0];
      }
    } catch (e) {
      // warning: invalid url format in env
    }

    return {
      projectId: projectId, // specific ID might not be critical if we have URL
      key: envKey,
      url: envUrl
    };
  }

  // No config found
  return {
    projectId: '',
    key: '',
    url: ''
  };
};

/**
 * Saves the Supabase configuration to localStorage (for bootstrap) 
 * and to cloud (for global access).
 */
export const saveSupabaseConfig = async (projectId: string, key: string) => {
  const config = {
    projectId: projectId.trim(),
    key: key.trim(),
    url: `https://${projectId.trim()}.supabase.co`
  };

  // Save to localStorage immediately for bootstrap
  localStorage.setItem('dm_supabase_config', JSON.stringify(config));

  // Try to save to cloud for global access
  try {
    const client = createClient(config.url, config.key);
    const { error } = await client
      .from('dm_config')
      .upsert({
        id: 'global-config',
        config: config,
        updated_at: new Date().toISOString()
      });

    if (error && error.code !== '42P01') {
      console.warn("Could not save config to cloud:", error);
    }
  } catch (e) {
    console.warn("Cloud config save skipped:", e);
  }

  return config;
};

/**
 * Attempts to fetch the Supabase configuration from the cloud.
 * This enables global configuration sharing across all instances.
 */
export const fetchConfigFromCloud = async () => {
  // First, we need bootstrap credentials from localStorage
  const bootstrapConfig = getSupabaseConfig();

  if (!bootstrapConfig.projectId || !bootstrapConfig.key) {
    return null;
  }

  try {
    const client = createClient(bootstrapConfig.url, bootstrapConfig.key);
    const { data, error } = await client
      .from('dm_config')
      .select('config')
      .eq('id', 'global-config')
      .single();

    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST116') {
        // Table doesn't exist or no data - use bootstrap config
        return null;
      }
      throw error;
    }

    if (data?.config) {
      // Update localStorage with cloud config
      localStorage.setItem('dm_supabase_config', JSON.stringify(data.config));
      return data.config;
    }
  } catch (e) {
    console.log("Cloud config fetch skipped:", e);
  }

  return null;
};

let supabaseInstance: any = null;
let configSyncAttempted = false;

/**
 * Initializes the global system bridge using the stored master credentials.
 */
export const initSupabase = async (skipCloudSync = false) => {
  // Try to sync config from cloud if not already attempted
  if (!configSyncAttempted && !skipCloudSync) {
    configSyncAttempted = true;
    const cloudConfig = await fetchConfigFromCloud();
    if (cloudConfig) {
      console.log("✓ Global configuration synced from cloud");
    }
  }

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

// Immediate initialization attempt with cloud sync
initSupabase();

/**
 * Accessor for the active system bridge. 
 * Re-initializes automatically if credentials have been updated.
 */
export const supabase = () => {
  // If no instance exists but we have keys, initialize now.
  if (!supabaseInstance) {
    return initSupabase(true); // Skip cloud sync on re-init to avoid loops
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
  if (!client) return { data: [], error: 'no-client' };

  try {
    const { data, error } = await client
      .from(table)
      .select('data');

    if (error) {
      if (error.code === '42P01') return { data: [], error: 'missing-table' }; // Infrastructure not provisioned
      throw error;
    }
    return { data: data?.map((item: any) => item.data) || [], error: null };
  } catch (e) {
    console.error(`Global System Pull Error (${table}):`, e);
    return { data: [], error: 'fetch-error' };
  }
};
