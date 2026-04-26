import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Rimuoviamo /rest/v1/ dall'URL di fallback
const fallbackUrl = 'https://egrxrqmvlubrsaprkmwc.supabase.co'; 
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncnhycW12bHVicnNhcHJrbXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTQyOTEsImV4cCI6MjA5MTY3MDI5MX0.Fd8UbRzacBZ8Cd7XUuZ9x6K8cJhUVN2cN61_2fzYPSM'; // la tua chiave intera

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackKey;

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    // Inizializziamo il client con l'URL PULITO
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export const supabase = getSupabase();