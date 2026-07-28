// Admin Top Header Component

export const renderAdminHeader = (pageTitle = 'Dashboard Overview') => {
  return `
    <header class="admin-header">
      <div style="display: flex; align-items: center; gap: 16px;">
        <h2 style="font-size: 1.35rem; color: var(--neutral-900); font-family: var(--font-display); font-weight: 700; margin: 0;">${pageTitle}</h2>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <a href="#/" target="_blank" class="btn btn-sm btn-secondary" style="font-size: 0.85rem; font-weight: 600;">
          <span class="material-symbols-outlined text-sm">open_in_new</span>
          Lihat Website Publik
        </a>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; shadow: var(--shadow-sm);">
            A
          </div>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 0.875rem; font-weight: 700; color: var(--neutral-900);">Pengelola Desa</span>
            <span style="font-size: 0.75rem; color: var(--neutral-500); font-weight: 500;">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  `;
};
