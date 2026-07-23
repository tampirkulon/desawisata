import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

export const isSupabaseConfigured = () => {
  return supabaseUrl && !supabaseUrl.includes('your-project-ref') && supabaseAnonKey && !supabaseAnonKey.includes('your-anon-key');
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
