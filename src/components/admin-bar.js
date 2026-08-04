import { auth } from '../utils/auth.js';

export const initFloatingAdminBar = async () => {
  const session = await auth.getSession();
  if (!session) {
    const existing = document.getElementById('floating-admin-bar');
    if (existing) existing.remove();
    return;
  }

  const existing = document.getElementById('floating-admin-bar');
  if (existing) return;

  const bar = document.createElement('div');
  bar.id = 'floating-admin-bar';
  bar.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white backdrop-blur-md px-5 py-2.5 rounded-full shadow-level-3 border border-slate-700/80 flex items-center gap-4 text-xs animate-slide-up';

  bar.innerHTML = `
    <div class="flex items-center gap-2 font-bold text-emerald-400">
      <span class="material-symbols-outlined text-base">admin_panel_settings</span>
      <span>Mode Pengelola</span>
    </div>
    <span class="w-px h-4 bg-slate-700"></span>
    <a href="#/admin/overview" class="hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
      <span>Dashboard Admin</span>
      <span class="material-symbols-outlined text-xs">dashboard</span>
    </a>
  `;

  document.body.appendChild(bar);
};
