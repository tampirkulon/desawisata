import { auth } from '../../utils/auth.js';

export const renderAdminSidebar = (activeRoute = 'overview') => {
  const mainMenuItems = [
    { key: 'overview', hash: '#/admin/overview', label: 'Overview', icon: 'dashboard' },
    { key: 'destinasi', hash: '#/admin/destinasi', label: 'Destinasi', icon: 'landscape' },
    { key: 'kategori', hash: '#/admin/kategori', label: 'Kategori', icon: 'category' },
    { key: 'paket', hash: '#/admin/paket', label: 'Paket Wisata', icon: 'inventory_2' },
    { key: 'artikel', hash: '#/admin/artikel', label: 'Artikel Blog', icon: 'rss_feed' },
    { key: 'galeri', hash: '#/admin/galeri', label: 'Galeri Foto', icon: 'imagesmode' },
    { key: 'reservasi', hash: '#/admin/reservasi', label: 'Reservasi', icon: 'event_note' },
  ];

  const settingMenuItems = [
    { key: 'profil', hash: '#/admin/profil', label: 'Profil Desa', icon: 'settings' },
  ];

  const normalizedRoute = (activeRoute || '').replace('#/admin/', '').replace('dashboard', 'overview');

  return `
    <aside class="admin-sidebar w-[260px] flex-shrink-0 flex flex-col bg-white border-r border-slate-200/80 sticky top-0 h-screen overflow-hidden z-40">
      <!-- Header Brand (Fixed Top) -->
      <div class="h-20 flex items-center px-6 border-b border-slate-100 gap-3 flex-shrink-0">
        <div class="w-9 h-9 rounded-xl bg-[#316342] text-white flex items-center justify-center font-bold text-lg shadow-sm">
          🍃
        </div>
        <div>
          <h1 class="font-display-lg text-base font-bold text-slate-800 m-0 leading-tight">Tampirkulon</h1>
          <p class="text-[11px] font-medium text-slate-400 m-0">Admin Dashboard</p>
        </div>
      </div>

      <!-- Navigation Menu (Scrollable Middle) -->
      <nav class="flex-1 py-5 px-3 flex flex-col gap-6 overflow-y-auto min-h-0">
        <!-- Main Menu Group -->
        <div>
          <p class="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-label">MENU</p>
          <div class="flex flex-col gap-1">
            ${mainMenuItems.map(item => {
              const isActive = normalizedRoute === item.key || activeRoute === item.key || activeRoute === item.hash;
              return `
                <a class="donezo-sidebar-item ${isActive ? 'active' : ''}" href="${item.hash}">
                  <span class="material-symbols-outlined text-xl ${isActive ? 'text-[#316342]' : 'text-slate-400'}">${item.icon}</span>
                  <span>${item.label}</span>
                </a>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Settings Group -->
        <div>
          <p class="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-label">PENGATURAN</p>
          <div class="flex flex-col gap-1">
            ${settingMenuItems.map(item => {
              const isActive = normalizedRoute === item.key || activeRoute === item.key || activeRoute === item.hash;
              return `
                <a class="donezo-sidebar-item ${isActive ? 'active' : ''}" href="${item.hash}">
                  <span class="material-symbols-outlined text-xl ${isActive ? 'text-[#316342]' : 'text-slate-400'}">${item.icon}</span>
                  <span>${item.label}</span>
                </a>
              `;
            }).join('')}
            <button id="admin-logout-btn" class="donezo-sidebar-item text-rose-600 hover:bg-rose-50 w-full text-left">
              <span class="material-symbols-outlined text-xl text-rose-500">logout</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Bottom Floating CTA Card (Fixed Bottom) -->
      <div class="p-4 border-t border-slate-100 flex-shrink-0">
        <div class="donezo-cta-card">
          <h4 class="text-sm font-bold text-white m-0 mb-1">Pratinjau Publik</h4>
          <p class="text-[11px] text-emerald-100/80 m-0 mb-3">Lihat tampilan website utama desa wisata secara langsung.</p>
          <a href="#/" target="_blank" class="inline-flex items-center justify-center w-full py-2 px-3 rounded-xl bg-white text-[#316342] font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm gap-1">
            <span>Buka Website</span>
            <span class="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </div>
    </aside>
  `;
};

export const renderSidebar = renderAdminSidebar;

export const initAdminSidebarEvents = () => {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logout();
    });
  }
};

