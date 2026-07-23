import { auth } from '../../utils/auth.js';

export const renderAdminSidebar = (activeRoute = '#/admin/overview') => {
  const menuItems = [
    { hash: '#/admin/overview', label: 'Overview', icon: '📊' },
    { hash: '#/admin/destinasi', label: 'Kelola Destinasi', icon: '⛰️' },
    { hash: '#/admin/kategori', label: 'Kelola Kategori', icon: '🏷️' },
    { hash: '#/admin/paket', label: 'Kelola Paket Wisata', icon: '🎒' },
    { hash: '#/admin/artikel', label: 'Kelola Artikel', icon: '📰' },
    { hash: '#/admin/profil', label: 'Edit Profil Desa', icon: '🏛️' },
    { hash: '#/admin/galeri', label: 'Kelola Galeri', icon: '🖼️' },
    { hash: '#/admin/reservasi', label: 'Kelola Reservasi', icon: '📋' },
  ];

  return `
    <aside class="admin-sidebar" id="admin-sidebar">
      <div class="sidebar-header">
        <span style="font-size: 1.5rem;">🌿</span>
        <div>
          <h3 class="sidebar-title">Admin Panel</h3>
          <span style="font-size: 0.75rem; color: var(--accent-gold);">Desa Tampirkulon</span>
        </div>
      </div>

      <ul class="sidebar-menu">
        ${menuItems.map(item => `
          <li class="menu-item ${activeRoute === item.hash ? 'active' : ''}">
            <a href="${item.hash}">
              <span>${item.icon}</span>
              <span>${item.label}</span>
            </a>
          </li>
        `).join('')}
      </ul>

      <div class="sidebar-footer">
        <button id="admin-logout-btn" class="btn btn-sm btn-outline" style="width: 100%; border-color: rgba(255,255,255,0.3); color: #fff;">
          🚪 Logout
        </button>
      </div>
    </aside>
  `;
};

export const initAdminSidebarEvents = () => {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logout();
    });
  }
};
