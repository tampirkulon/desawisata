import { openAdminSearchModal, initGlobalSearchShortcut } from './search-modal.js';
import { toggleNotificationPopover, fetchNotificationData, updateHeaderNotifBadge } from './notification-popover.js';

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

    // Bind notification toggle button
    const notifBtn = document.getElementById('admin-notif-btn');
    if (notifBtn && !notifBtn.dataset.bound) {
      notifBtn.dataset.bound = 'true';
      notifBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleNotificationPopover();
      });
    }

    // Bind mobile menu toggle button
    const menuToggle = document.getElementById('admin-mobile-menu-toggle');
    if (menuToggle && !menuToggle.dataset.bound) {
      menuToggle.dataset.bound = 'true';
      menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const sidebar = document.querySelector('.admin-sidebar');
        const backdrop = document.getElementById('admin-sidebar-backdrop');
        if (sidebar) {
          sidebar.classList.toggle('mobile-open');
        }
        if (backdrop) {
          backdrop.classList.toggle('hidden');
        }
      });
    }

    // Load initial unread notification count
    try {
      const { unreadCount } = await fetchNotificationData();
      updateHeaderNotifBadge(unreadCount);
    } catch (e) {
      console.warn('Failed to load initial notification count:', e);
    }
  }, 10);

  return `
    <header class="h-20 flex-shrink-0 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between z-30 shadow-sm">
      <!-- Left: Mobile Menu Toggle & Search Pill Input -->
      <div class="flex items-center gap-3 flex-1 max-w-md">
        <!-- Mobile Sidebar Hamburger Toggle (Visible on <= 1024px) -->
        <button id="admin-mobile-menu-toggle" type="button" aria-label="Buka Menu Sidebar" class="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0">
          <span class="material-symbols-outlined text-2xl text-slate-700">menu</span>
        </button>

        <button id="admin-global-search-trigger" class="relative w-full text-left bg-slate-100/80 hover:bg-slate-100 text-slate-400 text-xs font-medium pl-10 pr-12 py-2.5 rounded-full border border-slate-200/80 transition-all shadow-2xs flex items-center justify-between cursor-pointer">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <span class="text-slate-500 truncate">Cari di admin...</span>
          <span class="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs shrink-0">⌘F</span>
        </button>
      </div>

      <!-- Right: Action Buttons, Notifications & User Profile -->
      <div class="flex items-center gap-3 md:gap-5">
        <!-- Notification -->
        <div class="flex items-center gap-3">
          <button id="admin-notif-btn" type="button" title="Notifikasi" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors relative cursor-pointer">
            <span class="material-symbols-outlined text-lg">notifications</span>
            <span id="admin-notif-badge" class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full items-center justify-center px-1 ring-2 ring-white shadow-xs"></span>
          </button>
        </div>

        <!-- User Profile Card (Interactive link to Pengaturan Profil Desa) -->
        <a href="#/admin/profil" id="admin-header-profile-link" title="Buka Pengaturan Profil Desa" class="flex items-center gap-3 pl-2 border-l border-slate-200 hover:opacity-85 transition-all group cursor-pointer no-underline">
          <div class="w-10 h-10 rounded-full bg-[#316342] group-hover:bg-[#254d33] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-emerald-100 transition-colors">
            P
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="text-xs font-bold text-slate-800 leading-tight group-hover:text-[#316342] transition-colors flex items-center gap-1">
              <span>Pengelola Desa</span>
              <span class="material-symbols-outlined text-xs text-slate-400 group-hover:text-[#316342]">settings</span>
            </span>
            <span class="text-[11px] font-medium text-slate-400">admin@tampirkulon.id</span>
          </div>
        </a>
      </div>
    </header>
  `;
};

