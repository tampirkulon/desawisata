// Navbar Component with Stitch Modern Styling & Material Icons

export const renderNavbar = () => {
  const currentHash = window.location.hash || '#/';
  
  const navItems = [
    { hash: '#/', label: 'Beranda' },
    { hash: '#/profil', label: 'Profil Desa' },
    { hash: '#/destinasi', label: 'Destinasi' },
    { hash: '#/paket', label: 'Paket Wisata' },
    { hash: '#/galeri', label: 'Galeri' },
    { hash: '#/blog', label: 'Blog & News' },
    { hash: '#/kontak', label: 'Kontak & Reservasi' },
  ];

  return `
    <nav class="navbar transparent" id="main-navbar">
      <div class="container navbar-container">
        <a href="#/" class="navbar-brand">
          <span>Tampirkulon</span>
          <span class="navbar-brand-badge">Wisata</span>
        </a>

        <ul class="navbar-nav">
          ${navItems.map(item => `
            <li>
              <a href="${item.hash}" class="nav-link ${currentHash === item.hash ? 'active' : ''}">${item.label}</a>
            </li>
          `).join('')}
        </ul>

        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="#/kontak" class="btn btn-primary" style="font-size: 0.85rem;">Pesan Sekarang</a>
          <a href="#/admin/login" class="btn btn-sm btn-outline hidden-mobile">Admin Panel</a>
          <button class="hamburger-btn" id="hamburger-toggle" aria-label="Toggle Menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>

    <div class="mobile-drawer-overlay" id="drawer-overlay"></div>
    <div class="mobile-drawer" id="mobile-drawer">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-display); font-weight: 800; font-size: 1.25rem; color: var(--primary);">Tampirkulon</span>
        <button id="drawer-close" style="font-size: 1.5rem; background: none; border: none; cursor: pointer;">✕</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
        ${navItems.map(item => `
          <a href="${item.hash}" class="nav-link ${currentHash === item.hash ? 'active' : ''}">${item.label}</a>
        `).join('')}
        <a href="#/admin/login" class="btn btn-secondary" style="margin-top: 16px;">Admin Login</a>
      </div>
    </div>
  `;
};

export const initNavbarEvents = () => {
  const navbar = document.getElementById('main-navbar');
  const hamburger = document.getElementById('hamburger-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.remove('transparent');
      navbar.classList.add('solid');
    } else {
      navbar.classList.remove('solid');
      navbar.classList.add('transparent');
    }
  };

  window.removeEventListener('scroll', handleScroll);
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  if (hamburger && drawer && overlay) {
    const openDrawer = () => {
      drawer.classList.add('open');
      overlay.classList.add('open');
    };
    const closeDrawer = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    };

    hamburger.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }
};
