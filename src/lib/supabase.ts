import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase URL or Anon Key is missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      // Return a proxy or a dummy client that throws on use, or just return null and handle it.
      // For now, let's try to create it and let it fail if empty, but prefer returning instance.
      supabaseInstance = createClient(supabaseUrl || 'https://egrxrqmvlubrsaprkmwc.supabase.co/rest/v1/', supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncnhycW12bHVicnNhcHJrbXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTQyOTEsImV4cCI6MjA5MTY3MDI5MX0.Fd8UbRzacBZ8Cd7XUuZ9x6K8cJhUVN2cN61_2fzYPSM');
    } else {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return supabaseInstance;
};

// Singleton instance for easier imports
export const supabase = getSupabase();
