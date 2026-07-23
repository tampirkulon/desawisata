import { auth } from '../../utils/auth.js';

export const renderAdminSidebar = (activeRoute = 'overview') => {
  const menuItems = [
    { key: 'overview', hash: '#/admin/overview', label: 'Overview', icon: 'dashboard' },
    { key: 'destinasi', hash: '#/admin/destinasi', label: 'Destinasi', icon: 'landscape' },
    { key: 'kategori', hash: '#/admin/kategori', label: 'Kategori', icon: 'category' },
    { key: 'paket', hash: '#/admin/paket', label: 'Paket Wisata', icon: 'inventory_2' },
    { key: 'artikel', hash: '#/admin/artikel', label: 'Artikel Blog', icon: 'rss_feed' },
    { key: 'profil', hash: '#/admin/profil', label: 'Profil Desa', icon: 'account_balance' },
    { key: 'galeri', hash: '#/admin/galeri', label: 'Galeri Foto', icon: 'imagesmode' },
    { key: 'reservasi', hash: '#/admin/reservasi', label: 'Reservasi', icon: 'mail' },
  ];

  return `
    <aside class="w-[260px] flex-shrink-0 flex flex-col bg-[#1A2332] text-white">
      <div class="h-20 flex items-center px-6 border-b border-white/10">
        <span class="font-display-lg text-xl font-bold tracking-wide text-white">Tampirkulon Admin</span>
      </div>
      <nav class="flex-grow py-6 flex flex-col gap-1 overflow-y-auto">
        ${menuItems.map(item => `
          <a class="flex items-center px-6 py-3 transition-colors ${activeRoute === item.key || activeRoute === item.hash ? 'bg-primary-container border-l-4 border-tertiary-fixed text-white font-bold' : 'border-l-4 border-transparent text-gray-400 hover:text-white hover:bg-white/5'}" href="${item.hash}">
            <span class="material-symbols-outlined mr-4 text-xl">${item.icon}</span>
            <span class="font-body-md text-sm">${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="p-6 border-t border-white/10">
        <a href="#/" class="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          <span>Ke Website Utama</span>
        </a>
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
