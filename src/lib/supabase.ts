import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

const isValidUrl = (url: string) => {
  try {
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or Anon Key is missing. Please configure them in the Secrets panel.');
    }
    
    if (!isValidUrl(supabaseUrl)) {
      throw new Error('L\'URL di Supabase non è valido. Assicurati che inizi con https://');
    }

    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error: any) {
      throw new Error(`Errore durante l'inizializzazione di Supabase: ${error.message}`);
    }
  }
  return supabaseInstance;
};

// Export a dummy object for types if needed, but avoid calling createClient
export const supabase = null as unknown as SupabaseClient;
