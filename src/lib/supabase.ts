import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Use import.meta.env for standard Vite compatibility (works better on Vercel)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || (process.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || (process.env.VITE_SUPABASE_ANON_KEY as string) || '';

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
