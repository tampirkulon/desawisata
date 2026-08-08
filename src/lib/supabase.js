import { createClient } from '@supabase/supabase-js';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const supabaseUrl = env.VITE_SUPABASE_URL || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || '';

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
