import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { router } from './router.js';

export const auth = {
  async getSession() {
    if (!isSupabaseConfigured() || !supabase) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (e) {
      console.warn('Auth session check failed:', e);
      return null;
    }
  },

  async login(email, password) {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase belum dikonfigurasi. Periksa file .env' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, session: data.session };
  },

  async logout() {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    router.navigate('#/admin/login');
  },

  async requireAuth() {
    const session = await this.getSession();
    if (!session) {
      router.navigate('#/admin/login');
      return false;
    }
    return true;
  }
};
