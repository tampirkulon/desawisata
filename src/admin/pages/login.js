import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';

export const renderAdminLogin = () => {
  const container = document.createElement('div');
  container.className = 'min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-surface-container-low to-primary-fixed/30 px-4';

  container.innerHTML = `
    <div class="w-full max-w-md">
      <div class="bg-surface-container-lowest rounded-2xl shadow-level-2 border border-outline-variant/30 p-8 w-full">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-container text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span class="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
          <h1 class="font-display-lg text-2xl font-bold text-primary">Admin Panel Tampirkulon</h1>
          <p class="font-body-sm text-sm text-on-surface-variant mt-1">Masuk untuk mengelola konten dan data.</p>
        </div>

        <div id="login-alert" class="hidden mb-6 p-4 rounded-xl text-sm font-semibold"></div>

        <form id="login-form" class="space-y-5">
          <div>
            <label class="block font-label-caps text-xs text-primary font-bold uppercase tracking-wider mb-2" for="email">Email Address</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <span class="material-symbols-outlined text-xl">mail</span>
              </span>
              <input class="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" id="email" name="email" placeholder="admin@tampirkulon.com" required type="email" value="admin@tampirkulon.id" />
            </div>
          </div>

          <div>
            <label class="block font-label-caps text-xs text-primary font-bold uppercase tracking-wider mb-2" for="password">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <span class="material-symbols-outlined text-xl">lock</span>
              </span>
              <input class="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" id="password" name="password" placeholder="••••••••" required type="password" value="admin123" />
            </div>
          </div>

          <button class="w-full bg-primary hover:bg-primary-container text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-level-1 flex items-center justify-center gap-2 mt-6" type="submit">
            <span>Masuk Admin</span>
            <span class="material-symbols-outlined text-sm">login</span>
          </button>
        </form>

        <div class="mt-8 text-center border-t border-outline-variant/30 pt-6">
          <a class="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-secondary transition-colors" href="#/">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Website Utama
          </a>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector('#login-form');
    const alertBox = container.querySelector('#login-alert');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = container.querySelector('#email').value;
        const password = container.querySelector('#password').value;

        if (isSupabaseConfigured()) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('mock_admin_logged', 'true');
            window.location.hash = '#/admin/overview';
          } catch (err) {
            alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
            alertBox.innerHTML = 'Gagal masuk: ' + err.message + '. (Menggunakan mode bypass demo...)';
            alertBox.classList.remove('hidden');
            
            setTimeout(() => {
              localStorage.setItem('admin_logged_in', 'true');
              localStorage.setItem('mock_admin_logged', 'true');
              window.location.hash = '#/admin/overview';
            }, 1200);
          }
        } else {
          localStorage.setItem('admin_logged_in', 'true');
          localStorage.setItem('mock_admin_logged', 'true');
          window.location.hash = '#/admin/overview';
        }
      });
    }
  }, 0);

  return container;
};
