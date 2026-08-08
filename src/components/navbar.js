// Navbar Component with Stitch Modern Transparent Header Styling & Dynamic Profile Branding
import { getProfilDesaSync } from '../utils/profile-store.js';

export const renderNavbar = (isSolid = false, customProfil = null) => {
  const currentHash = window.location.hash || '#/';
  const profil = customProfil || getProfilDesaSync();
  const namaDesa = profil.nama_desa || 'Tampirkulon';
  const brandDisplay = namaDesa.replace(/^Desa\s+Wisata\s+/i, '');
  const logoUrl = profil.logo_url;
  
  const navItems = [
    { hash: '#/', label: 'Beranda' },
    { hash: '#/profil', label: 'Profil Desa' },
    { hash: '#/destinasi', label: 'Destinasi' },
    { hash: '#/paket', label: 'Paket Wisata' },
    { hash: '#/galeri', label: 'Galeri' },
    { hash: '#/blog', label: 'Blog' },
  ];

  const initialClasses = isSolid 
    ? 'scrolled-nav bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/20' 
    : 'transparent-nav';

  return `
    <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300 ${initialClasses}" id="main-navbar" ${isSolid ? 'data-solid="true"' : ''}>
      <div class="flex justify-between items-center px-4 sm:px-6 md:px-12 max-w-container-max mx-auto h-20 w-full">
        <!-- Rata Kiri: Logo & Village Name -->
        <a href="#/" class="font-display-lg text-xl sm:text-2xl font-bold nav-brand flex items-center gap-2.5 shrink-0 group">
          ${logoUrl ? `
            <img src="${logoUrl}" alt="${namaDesa}" class="h-9 w-9 object-contain rounded-lg border border-white/20 bg-white/10 p-0.5 shadow-2xs group-hover:scale-105 transition-transform" />
          ` : `
            <span class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-extrabold border border-primary/30">
              ${brandDisplay.charAt(0)}
            </span>
          `}
          <span class="tracking-tight">${brandDisplay}</span>
        </a>

        <!-- Rata Kanan: Nav Links & CTA -->
        <div class="hidden md:flex items-center gap-8">
          <ul class="flex gap-7 items-center list-none m-0 p-0">
            ${navItems.map(item => `
              <li>
                <a href="${item.hash}" class="font-body-md text-sm transition-all duration-200 nav-item-link ${currentHash === item.hash ? 'active font-bold border-b-2 pb-1' : ''}">${item.label}</a>
              </li>
            `).join('')}
          </ul>
          <a href="#/kontak" class="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-xs hover:bg-primary-container transition-all shadow-level-1 hover:shadow-level-2 shrink-0">Kontak & Reservasi</a>
        </div>

        <!-- Mobile Menu Hamburger -->
        <button class="md:hidden p-2 nav-hamburger" id="hamburger-toggle" aria-label="Toggle Menu">
          <span class="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>
    </nav>

    <div class="mobile-drawer-overlay" id="drawer-overlay"></div>
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="flex justify-between items-center pb-4 border-b border-outline-variant">
        <div class="flex items-center gap-2">
          ${logoUrl ? `
            <img src="${logoUrl}" alt="${namaDesa}" class="h-8 w-8 object-contain rounded-md" />
          ` : ''}
          <span class="font-display-lg font-bold text-xl text-primary">${brandDisplay}</span>
        </div>
        <button id="drawer-close" class="text-2xl text-on-surface-variant bg-none border-none cursor-pointer">✕</button>
      </div>
      <div class="flex flex-col gap-3 mt-6">
        ${navItems.map(item => `
          <a href="${item.hash}" class="py-2 px-3 rounded-lg font-body-md text-base transition-colors ${currentHash === item.hash ? 'bg-primary-fixed/50 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'}">${item.label}</a>
        `).join('')}
        <a href="#/kontak" class="bg-primary text-white font-bold text-center py-3 rounded-xl mt-4">Kontak & Reservasi</a>
      </div>
    </div>
  `;
};

export const initNavbarEvents = (isSolid = false) => {
  const navbar = document.getElementById('main-navbar');
  const hamburger = document.getElementById('hamburger-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  const alwaysSolid = isSolid || (navbar && navbar.dataset.solid === 'true');

  const handleScroll = () => {
    if (!navbar) return;
    if (alwaysSolid || window.scrollY > 40) {
      navbar.classList.add('scrolled-nav', 'bg-surface/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-outline-variant/20');
      navbar.classList.remove('transparent-nav');
    } else {
      navbar.classList.remove('scrolled-nav', 'bg-surface/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-outline-variant/20');
      navbar.classList.add('transparent-nav');
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
