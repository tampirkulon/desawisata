import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    !supabaseUrl.includes('your-project-ref') && 
    supabaseAnonKey && 
    !supabaseAnonKey.includes('your-anon-key')
  );
};

let supabaseClient = null;
if (isSupabaseConfigured()) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Gagal inisialisasi Supabase client:', e);
  }
}

export const supabase = supabaseClient;

