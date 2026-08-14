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
  },

  async forgotPassword(email, redirectTo = null) {
    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail) {
      return { success: false, error: 'Alamat email wajib diisi.' };
    }

    if (!isSupabaseConfigured() || !supabase) {
      return { 
        success: true, 
        isDemo: true, 
        message: `(Mode Demo) Tautan pemulihan password telah disimulasikan untuk email: ${trimmedEmail}` 
      };
    }

    try {
      const redirectUrl = redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/#/admin/reset-password` : '');
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Tautan reset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau spam.' };
    } catch (e) {
      return { success: false, error: e.message || 'Terjadi kesalahan saat memproses permintaan.' };
    }
  },

  async resetPassword(newPassword) {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password baru minimal harus 6 karakter.' };
    }

    if (!isSupabaseConfigured() || !supabase) {
      return { 
        success: true, 
        isDemo: true, 
        message: '(Mode Demo) Password berhasil diperbarui secara lokal.' 
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Password Anda berhasil diperbarui. Silakan login kembali.' };
    } catch (e) {
      return { success: false, error: e.message || 'Terjadi kesalahan saat memperbarui password.' };
    }
  }
};
