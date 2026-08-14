import { auth } from '../../utils/auth.js';
import { router } from '../../utils/router.js';

export const renderAdminResetPassword = (queryParams) => {
  const container = document.createElement('div');
  container.className = 'min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-surface-container-low to-primary-fixed/30 px-4 py-12';

  container.innerHTML = `
    <div class="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
      <div class="bg-surface-container-lowest rounded-2xl shadow-level-2 border border-outline-variant/30 p-8 w-full">
        <!-- Header Icon & Title -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-container text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span class="material-symbols-outlined text-3xl">key</span>
          </div>
          <h1 class="font-display-lg text-2xl font-bold text-primary">Atur Ulang Password</h1>
          <p class="font-body-sm text-sm text-on-surface-variant mt-1.5 leading-relaxed">
            Buat kata sandi baru yang aman untuk akun pengelola Desa Wisata Tampirkulon Anda.
          </p>
        </div>

        <!-- Alert Container -->
        <div id="reset-alert" class="hidden mb-6 p-4 rounded-xl text-sm font-semibold leading-relaxed"></div>

        <!-- Reset Password Form -->
        <form id="reset-form" class="space-y-5">
          <div>
            <label class="block font-label-caps text-xs text-primary font-bold uppercase tracking-wider mb-2" for="new-password">
              Password Baru
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <span class="material-symbols-outlined text-xl">lock</span>
              </span>
              <input 
                class="w-full pl-12 pr-12 py-3 bg-surface border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                id="new-password" 
                name="password" 
                placeholder="Minimal 6 karakter" 
                required 
                type="password" 
                minlength="6"
              />
              <button 
                type="button" 
                id="toggle-pwd-btn" 
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-outline hover:text-primary transition-colors cursor-pointer"
                title="Tampilkan / Sembunyikan Password"
              >
                <span class="material-symbols-outlined text-lg" id="pwd-icon">visibility</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block font-label-caps text-xs text-primary font-bold uppercase tracking-wider mb-2" for="confirm-password">
              Konfirmasi Password Baru
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <span class="material-symbols-outlined text-xl">lock_clock</span>
              </span>
              <input 
                class="w-full pl-12 pr-12 py-3 bg-surface border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                id="confirm-password" 
                name="confirm_password" 
                placeholder="Ulangi password baru" 
                required 
                type="password" 
                minlength="6"
              />
              <button 
                type="button" 
                id="toggle-confirm-btn" 
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-outline hover:text-primary transition-colors cursor-pointer"
                title="Tampilkan / Sembunyikan Password"
              >
                <span class="material-symbols-outlined text-lg" id="confirm-icon">visibility</span>
              </button>
            </div>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 flex items-center gap-2">
            <span class="material-symbols-outlined text-base text-primary">info</span>
            <span>Gunakan minimal 6 karakter kombinasi huruf dan angka.</span>
          </div>

          <button 
            id="reset-submit-btn" 
            class="w-full bg-primary hover:bg-primary-container text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-level-1 flex items-center justify-center gap-2 mt-6 cursor-pointer" 
            type="submit"
          >
            <span id="reset-btn-text">Simpan Password Baru</span>
            <span class="material-symbols-outlined text-sm" id="reset-btn-icon">check_circle</span>
          </button>
        </form>

        <!-- Navigation Links -->
        <div class="mt-8 text-center border-t border-outline-variant/30 pt-6 flex flex-col gap-3">
          <a class="inline-flex items-center justify-center gap-2 text-xs font-bold text-primary hover:text-secondary transition-colors" href="#/admin/login">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Halaman Login
          </a>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector('#reset-form');
    const alertBox = container.querySelector('#reset-alert');
    const submitBtn = container.querySelector('#reset-submit-btn');
    const btnText = container.querySelector('#reset-btn-text');
    const btnIcon = container.querySelector('#reset-btn-icon');

    // Check if URL has error params from expired/invalid Supabase recovery link
    const errorMsg = queryParams?.get('error_description') || queryParams?.get('error');
    if (errorMsg && alertBox) {
      alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
      alertBox.innerHTML = '❌ Tautan tidak valid atau telah kedaluwarsa: ' + decodeURIComponent(errorMsg.replace(/\+/g, ' '));
      alertBox.classList.remove('hidden');
    }

    const pwdInput = container.querySelector('#new-password');
    const confirmInput = container.querySelector('#confirm-password');
    const togglePwdBtn = container.querySelector('#toggle-pwd-btn');
    const toggleConfirmBtn = container.querySelector('#toggle-confirm-btn');
    const pwdIcon = container.querySelector('#pwd-icon');
    const confirmIcon = container.querySelector('#confirm-icon');

    // Show/Hide Password toggles
    togglePwdBtn?.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      pwdIcon.innerText = isPwd ? 'visibility_off' : 'visibility';
    });

    toggleConfirmBtn?.addEventListener('click', () => {
      const isPwd = confirmInput.type === 'password';
      confirmInput.type = isPwd ? 'text' : 'password';
      confirmIcon.innerText = isPwd ? 'visibility_off' : 'visibility';
    });

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = pwdInput?.value || '';
        const confirmPassword = confirmInput?.value || '';

        if (newPassword.length < 6) {
          alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
          alertBox.innerHTML = '❌ Password harus memiliki panjang minimal 6 karakter.';
          alertBox.classList.remove('hidden');
          return;
        }

        if (newPassword !== confirmPassword) {
          alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
          alertBox.innerHTML = '❌ Password baru dan konfirmasi password tidak cocok.';
          alertBox.classList.remove('hidden');
          return;
        }

        // Loading state
        submitBtn.disabled = true;
        btnText.innerText = 'Menyimpan Password...';
        btnIcon.innerText = 'sync';
        btnIcon.classList.add('animate-spin');

        const result = await auth.resetPassword(newPassword);

        submitBtn.disabled = false;
        btnText.innerText = 'Simpan Password Baru';
        btnIcon.innerText = 'check_circle';
        btnIcon.classList.remove('animate-spin');

        if (result.success) {
          alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300';
          alertBox.innerHTML = `✅ ${result.message} Mengalihkan ke halaman login dalam 2 detik...`;
          alertBox.classList.remove('hidden');
          form.reset();

          setTimeout(() => {
            router.navigate('#/admin/login');
          }, 2000);
        } else {
          alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
          alertBox.innerHTML = `❌ ${result.error || 'Gagal memperbarui kata sandi.'}`;
          alertBox.classList.remove('hidden');
        }
      });
    }
  }, 0);

  return container;
};
