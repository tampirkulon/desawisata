import { auth } from '../../utils/auth.js';

export const renderAdminForgotPassword = () => {
  const container = document.createElement('div');
  container.className = 'min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-surface-container-low to-primary-fixed/30 px-4 py-12';

  container.innerHTML = `
    <div class="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
      <div class="bg-surface-container-lowest rounded-2xl shadow-level-2 border border-outline-variant/30 p-8 w-full">
        <!-- Header Icon & Title -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-container text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span class="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h1 class="font-display-lg text-2xl font-bold text-primary">Lupa Password Admin</h1>
          <p class="font-body-sm text-sm text-on-surface-variant mt-1.5 leading-relaxed">
            Masukkan alamat email akun pengelola Anda untuk menerima instruksi dan tautan pemulihan kata sandi.
          </p>
        </div>

        <!-- Alert Container -->
        <div id="forgot-alert" class="hidden mb-6 p-4 rounded-xl text-sm font-semibold leading-relaxed"></div>

        <!-- Forgot Password Form -->
        <form id="forgot-form" class="space-y-5">
          <div>
            <label class="block font-label-caps text-xs text-primary font-bold uppercase tracking-wider mb-2" for="forgot-email">
              Alamat Email Terdaftar
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
                <span class="material-symbols-outlined text-xl">mail</span>
              </span>
              <input 
                class="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                id="forgot-email" 
                name="email" 
                placeholder="admin@tampirkulon.desa.id" 
                required 
                type="email" 
              />
            </div>
          </div>

          <button 
            id="forgot-submit-btn" 
            class="w-full bg-primary hover:bg-primary-container text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-level-1 flex items-center justify-center gap-2 mt-6 cursor-pointer" 
            type="submit"
          >
            <span id="btn-text">Kirim Tautan Pemulihan</span>
            <span class="material-symbols-outlined text-sm" id="btn-icon">send</span>
          </button>
        </form>

        <!-- Navigation Links -->
        <div class="mt-8 text-center border-t border-outline-variant/30 pt-6 flex flex-col gap-3">
          <a class="inline-flex items-center justify-center gap-2 text-xs font-bold text-primary hover:text-secondary transition-colors" href="#/admin/login">
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Halaman Login
          </a>
          <a class="inline-flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-primary transition-colors" href="#/">
            <span>Kembali ke Beranda Publik</span>
          </a>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector('#forgot-form');
    const alertBox = container.querySelector('#forgot-alert');
    const submitBtn = container.querySelector('#forgot-submit-btn');
    const btnText = container.querySelector('#btn-text');
    const btnIcon = container.querySelector('#btn-icon');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = container.querySelector('#forgot-email')?.value.trim();

        if (!email) {
          alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
          alertBox.innerHTML = '❌ Harap masukkan alamat email yang valid.';
          alertBox.classList.remove('hidden');
          return;
        }

        // Loading state
        submitBtn.disabled = true;
        btnText.innerText = 'Mengirim Tautan...';
        btnIcon.innerText = 'sync';
        btnIcon.classList.add('animate-spin');

        const result = await auth.forgotPassword(email);

        submitBtn.disabled = false;
        btnText.innerText = 'Kirim Ulang Tautan';
        btnIcon.innerText = 'send';
        btnIcon.classList.remove('animate-spin');

        if (result.success) {
          alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300';
          alertBox.innerHTML = `✅ ${result.message}`;
          alertBox.classList.remove('hidden');
          form.reset();
        } else {
          alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
          alertBox.innerHTML = `❌ ${result.error || 'Gagal mengirim email reset password.'}`;
          alertBox.classList.remove('hidden');
        }
      });
    }
  }, 0);

  return container;
};
