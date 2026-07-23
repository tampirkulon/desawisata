import { auth } from '../../utils/auth.js';
import { router } from '../../utils/router.js';
import { showToast } from '../../components/toast.js';

export const renderAdminLogin = async () => {
  // If already logged in, redirect to overview
  const session = await auth.getSession();
  if (session) {
    router.navigate('#/admin/overview');
    return document.createElement('div');
  }

  const container = document.createElement('div');
  container.className = 'admin-login-wrapper';
  container.style.cssText = `
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--dark-navy) 0%, var(--primary-700) 100%);
    padding: 20px;
  `;

  container.innerHTML = `
    <div class="card" style="max-width: 420px; width: 100%; padding: 40px; box-shadow: var(--shadow-xl);">
      <div style="text-align: center; margin-bottom: 28px;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">🌿</span>
        <h2 style="font-size: 1.6rem; color: var(--neutral-900);">Admin Panel Login</h2>
        <p style="font-size: 0.9rem; color: var(--neutral-600); margin-top: 4px;">Desa Wisata Tampirkulon</p>
      </div>

      <form id="admin-login-form">
        <div class="form-group">
          <label class="form-label" for="login-email">Email Admin</label>
          <input type="email" id="login-email" class="form-control" placeholder="admin@tampirkulon.desawisata.id" required />
        </div>

        <div class="form-group" style="margin-bottom: 24px;">
          <label class="form-label" for="login-password">Kata Sandi</label>
          <input type="password" id="login-password" class="form-control" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem;" id="login-submit-btn">
          Masuk ke Dashboard
        </button>
      </form>

      <div style="text-align: center; margin-top: 24px;">
        <a href="#/" style="font-size: 0.85rem; color: var(--primary-500); font-weight: 500;">← Kembali ke Website Publik</a>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector('#admin-login-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = container.querySelector('#login-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Memverifikasi...';

        const email = container.querySelector('#login-email').value.trim();
        const password = container.querySelector('#login-password').value;

        const res = await auth.login(email, password);

        if (res.success) {
          showToast('Login berhasil! Mengalihkan ke Dashboard...', 'success');
          router.navigate('#/admin/overview');
        } else {
          showToast('Login gagal: ' + (res.error || 'Email atau password salah'), 'error');
          submitBtn.disabled = false;
          submitBtn.innerText = 'Masuk ke Dashboard';
        }
      });
    }
  }, 0);

  return container;
};
