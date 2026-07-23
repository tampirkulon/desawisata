import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { router } from './router.js';
import { mockData } from '../data/seed.js';

export const auth = {
  async getSession() {
    if (!isSupabaseConfigured()) {
      // Mock session for preview/offline mode if logged in via localStorage
      const mockLogged = localStorage.getItem('mock_admin_logged');
      if (mockLogged === 'true') {
        return { user: { email: 'admin@tampirkulon.desawisata.id', role: 'authenticated' } };
      }
      return null;
    }
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  },

  async login(email, password) {
    if (!isSupabaseConfigured()) {
      // Mock auth check
      if (email === 'admin@tampirkulon.desawisata.id' && password === 'admin123') {
        localStorage.setItem('mock_admin_logged', 'true');
        return { success: true, user: { email } };
      }
      // Allow any test password in mock mode
      localStorage.setItem('mock_admin_logged', 'true');
      return { success: true, user: { email } };
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
    if (!isSupabaseConfigured()) {
      localStorage.removeItem('mock_admin_logged');
      router.navigate('#/admin/login');
      return;
    }

    await supabase.auth.signOut();
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
