import { openAdminSearchModal, initGlobalSearchShortcut } from './search-modal.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';

export const renderAdminHeader = (pageTitle = 'Dashboard') => {
  setTimeout(async () => {
    const triggerBtn = document.getElementById('admin-global-search-trigger');
    if (triggerBtn && !triggerBtn.dataset.bound) {
      triggerBtn.dataset.bound = 'true';
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminSearchModal();
      });
    }
    initGlobalSearchShortcut();

    // Check live unread reservasi count for notification badge
    if (isSupabaseConfigured() && supabase) {
      try {
        const { count, error } = await supabase.from('reservasi').select('*', { count: 'exact', head: true }).eq('status', 'baru');
        if (!error && count && count > 0) {
          const notifBtn = document.getElementById('admin-notif-btn');
          const notifBadge = document.getElementById('admin-notif-badge');
          if (notifBadge) {
            notifBadge.innerText = count > 9 ? '9+' : count;
            notifBadge.classList.remove('hidden');
            notifBadge.classList.add('flex');
          }
          if (notifBtn) {
            notifBtn.title = `${count} Reservasi Baru Menunggu Konfirmasi`;
          }
        }
      } catch (e) {
        console.warn('Notification query error:', e);
      }
    }
  }, 10);

  return `
    <header class="h-20 flex-shrink-0 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between z-30 shadow-sm">
      <!-- Left: Search Pill Input -->
      <div class="flex items-center gap-4 flex-1 max-w-md">
        <button id="admin-global-search-trigger" class="relative w-full text-left bg-slate-100/80 hover:bg-slate-100 text-slate-400 text-xs font-medium pl-10 pr-12 py-2.5 rounded-full border border-slate-200/80 transition-all shadow-2xs flex items-center justify-between cursor-pointer">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <span class="text-slate-500">Cari di admin...</span>
          <span class="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">⌘F</span>
        </button>
      </div>

      <!-- Right: Action Buttons, Notifications & User Profile -->
      <div class="flex items-center gap-5">
        <!-- Notification -->
        <div class="flex items-center gap-3 border-r border-slate-200 pr-5">
          <a href="#/admin/reservasi" id="admin-notif-btn" title="Notifikasi Reservasi" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors relative">
            <span class="material-symbols-outlined text-lg">notifications</span>
            <span id="admin-notif-badge" class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full items-center justify-center px-1 ring-2 ring-white shadow-xs"></span>
          </a>
        </div>

        <!-- User Profile Card -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#316342] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-emerald-100">
            P
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="text-xs font-bold text-slate-800 leading-tight">Pengelola Desa</span>
            <span class="text-[11px] font-medium text-slate-400">admin@tampirkulon.id</span>
          </div>
        </div>
      </div>
    </header>
  `;
};

