// Navbar Component with Stitch Modern Styling & Material Icons

export const renderNavbar = () => {
  const currentHash = window.location.hash || '#/';
  
  const navItems = [
    { hash: '#/', label: 'Beranda' },
    { hash: '#/profil', label: 'Profil Desa' },
    { hash: '#/destinasi', label: 'Destinasi' },
    { hash: '#/paket', label: 'Paket Wisata' },
    { hash: '#/galeri', label: 'Galeri' },
    { hash: '#/blog', label: 'Blog' },
    { hash: '#/kontak', label: 'Kontak' },
  ];

  return `
    <nav class="fixed top-0 w-full z-50 transition-all duration-300 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm" id="main-navbar">
      <div class="flex justify-between items-center px-4 md:px-16 max-w-container-max mx-auto h-20">
        <a href="#/" class="font-display-lg text-2xl font-bold text-primary flex items-center gap-2">
          <span>Tampirkulon</span>
          <span class="text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Wisata</span>
        </a>

        <ul class="hidden md:flex gap-8 items-center list-none">
          ${navItems.map(item => `
            <li>
              <a href="${item.hash}" class="font-body-md text-sm transition-all duration-200 ${currentHash === item.hash ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}">${item.label}</a>
            </li>
          `).join('')}
        </ul>

        <div class="flex items-center gap-3">
          <a href="#/kontak" class="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-xs hover:bg-primary-container transition-all shadow-level-1 hover:shadow-level-2">Pesan Sekarang</a>
          <a href="#/admin/login" class="hidden md:inline-flex border border-primary text-primary px-3.5 py-1.5 rounded-full font-semibold text-xs hover:bg-primary hover:text-on-primary transition-colors">Admin</a>
          <button class="md:hidden text-primary p-2" id="hamburger-toggle" aria-label="Toggle Menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>

    <div class="mobile-drawer-overlay" id="drawer-overlay"></div>
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="flex justify-between items-center pb-4 border-b border-outline-variant">
        <span class="font-display-lg font-bold text-xl text-primary">Tampirkulon</span>
        <button id="drawer-close" class="text-2xl text-on-surface-variant bg-none border-none cursor-pointer">✕</button>
      </div>
      <div class="flex flex-col gap-3 mt-6">
        ${navItems.map(item => `
          <a href="${item.hash}" class="py-2 px-3 rounded-lg font-body-md text-base transition-colors ${currentHash === item.hash ? 'bg-primary-fixed/50 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'}">${item.label}</a>
        `).join('')}
        <a href="#/admin/login" class="bg-surface-container text-primary font-bold text-center py-3 rounded-xl mt-4">Admin Login</a>
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
      navbar.classList.add('shadow-md', 'bg-surface/95');
    } else {
      navbar.classList.remove('shadow-md');
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
