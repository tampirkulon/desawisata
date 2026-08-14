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
        let msg = error.message;
        const lowerMsg = (msg || '').toLowerCase();
        if (lowerMsg.includes('rate limit') || error.code === 'over_email_send_rate_limit') {
          msg = 'Terlalu banyak permintaan pengiriman email dalam waktu singkat (Rate Limit). Harap tunggu beberapa menit sebelum mencoba mengirim tautan kembali demi keamanan.';
        } else if (lowerMsg.includes('user not found')) {
          msg = 'Email tidak terdaftar sebagai pengguna admin.';
        }
        return { success: false, error: msg };
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
      // 1. Ensure active recovery session exists
      let { data: { session } } = await supabase.auth.getSession();

      if (!session && typeof window !== 'undefined') {
        const fullUrl = window.location.href;

        // Try PKCE code exchange if present
        const codeMatch = fullUrl.match(/[?&#]code=([^&]+)/);
        if (codeMatch) {
          try {
            const { data: exchanged, error: codeErr } = await supabase.auth.exchangeCodeForSession(decodeURIComponent(codeMatch[1]));
            if (!codeErr && exchanged?.session) {
              session = exchanged.session;
            }
          } catch (e) {
            console.warn('exchangeCodeForSession warning:', e);
          }
        }

        // Try access_token / refresh_token extraction if present
        if (!session) {
          const tokenMatch = fullUrl.match(/[?&#]access_token=([^&]+)/);
          const refreshMatch = fullUrl.match(/[?&#]refresh_token=([^&]+)/);

          if (tokenMatch) {
            try {
              const { data: setSessionData, error: setErr } = await supabase.auth.setSession({
                access_token: decodeURIComponent(tokenMatch[1]),
                refresh_token: refreshMatch ? decodeURIComponent(refreshMatch[1]) : '',
              });
              if (!setErr && setSessionData?.session) {
                session = setSessionData.session;
              }
            } catch (e) {
              console.warn('setSession warning:', e);
            }
          }
        }
      }

      if (!session) {
        return {
          success: false,
          error: 'Sesi pemulihan tidak ditemukan atau tautan telah kedaluwarsa. Silakan ajukan ulang tautan lupa password.'
        };
      }

      // 2. Update user password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // 3. Clear session so user logs in cleanly with new password
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }

      return { success: true, message: 'Password Anda berhasil diperbarui. Silakan login kembali dengan password baru.' };
    } catch (e) {
      return { success: false, error: e.message || 'Terjadi kesalahan saat memperbarui password.' };
    }
  }
};
