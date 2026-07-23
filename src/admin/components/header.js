// Admin Top Header Component

export const renderAdminHeader = (pageTitle = 'Dashboard Overview') => {
  return `
    <header class="admin-header">
      <div style="display: flex; align-items: center; gap: 16px;">
        <h2 style="font-size: 1.25rem; color: var(--neutral-900);">${pageTitle}</h2>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <a href="#/" target="_blank" class="btn btn-sm btn-secondary" style="font-size: 0.85rem;">
          🌐 Lihat Website Publik ↗
        </a>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-500); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
            A
          </div>
          <span style="font-size: 0.9rem; font-weight: 600;">Pengelola Desa</span>
        </div>
      </div>
    </header>
  `;
};
