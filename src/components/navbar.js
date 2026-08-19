// Navbar Component with Stitch Modern Transparent Header Styling & Bilingual Switcher

import { t, getLanguage, setLanguage } from '../utils/i18n.js';

export const renderNavbar = (isSolid = false) => {
  const currentHash = window.location.hash || '#/';
  const activeLang = getLanguage();
  
  const navItems = [
    { hash: '#/', label: t('nav.beranda') },
    { hash: '#/profil', label: t('nav.profil') },
    { hash: '#/destinasi', label: t('nav.destinasi') },
    { hash: '#/paket', label: t('nav.paket') },
    { hash: '#/galeri', label: t('nav.galeri') },
    { hash: '#/blog', label: t('nav.blog') },
  ];

  const initialClasses = isSolid 
    ? 'scrolled-nav bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/20' 
    : 'transparent-nav';

  const renderLangSwitcher = (idPrefix = 'desktop') => `
    <div class="lang-switcher-pill flex items-center bg-black/20 backdrop-blur-md p-1 rounded-full border border-white/25 shadow-xs" role="group" aria-label="${t('nav.lang_switch')}">
      <button 
        type="button" 
        data-lang="id" 
        id="${idPrefix}-lang-id" 
        class="lang-btn-switch px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${activeLang === 'id' ? 'bg-primary text-white shadow-xs' : 'text-white/80 hover:text-white'}"
        title="Bahasa Indonesia"
      >
        ID
      </button>
      <button 
        type="button" 
        data-lang="en" 
        id="${idPrefix}-lang-en" 
        class="lang-btn-switch px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${activeLang === 'en' ? 'bg-primary text-white shadow-xs' : 'text-white/80 hover:text-white'}"
        title="English"
      >
        EN
      </button>
    </div>
  `;

  return `
    <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300 ${initialClasses}" id="main-navbar" ${isSolid ? 'data-solid="true"' : ''}>
      <div class="flex justify-between items-center px-4 sm:px-6 md:px-12 max-w-container-max mx-auto h-20 w-full">
        <!-- Rata Kiri: Logo -->
        <a href="#/" class="font-display-lg text-xl sm:text-2xl font-bold nav-brand flex items-center gap-2 shrink-0">
          <span>Tampirkulon</span>
        </a>

        <!-- Rata Kanan: Nav Links, Lang Switcher & CTA -->
        <div class="hidden md:flex items-center gap-6">
          <ul class="flex gap-6 items-center list-none m-0 p-0">
            ${navItems.map(item => `
              <li>
                <a href="${item.hash}" class="font-body-md text-sm transition-all duration-200 nav-item-link ${currentHash === item.hash ? 'active font-bold border-b-2 pb-1' : ''}">${item.label}</a>
              </li>
            `).join('')}
          </ul>
          
          <!-- Desktop Language Switcher -->
          ${renderLangSwitcher('desktop')}

          <a href="#/kontak" class="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-xs hover:bg-primary-container transition-all shadow-level-1 hover:shadow-level-2 shrink-0">${t('nav.kontak')}</a>
        </div>

        <!-- Mobile Menu Controls (Lang + Hamburger) -->
        <div class="flex md:hidden items-center gap-3">
          ${renderLangSwitcher('mobile-nav')}
          <button class="p-2 nav-hamburger" id="hamburger-toggle" aria-label="Toggle Menu">
            <span class="material-symbols-outlined text-2xl">menu</span>
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
      
      <!-- Drawer Language Switcher Banner -->
      <div class="flex items-center justify-between mt-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
        <span class="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
          <span class="material-symbols-outlined text-base text-primary">language</span>
          <span>${t('nav.lang_switch')}</span>
        </span>
        <div class="flex items-center bg-surface-container-high p-1 rounded-full border border-outline-variant/40" role="group">
          <button 
            type="button" 
            data-lang="id" 
            class="lang-btn-switch px-3 py-1 rounded-full text-xs font-bold transition-all ${activeLang === 'id' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}"
          >
            ID
          </button>
          <button 
            type="button" 
            data-lang="en" 
            class="lang-btn-switch px-3 py-1 rounded-full text-xs font-bold transition-all ${activeLang === 'en' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}"
          >
            EN
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2 mt-4">
        ${navItems.map(item => `
          <a href="${item.hash}" class="py-2.5 px-3 rounded-lg font-body-md text-base transition-colors ${currentHash === item.hash ? 'bg-primary-fixed/50 text-primary font-bold' : 'text-on-surface hover:bg-surface-container-low'}">${item.label}</a>
        `).join('')}
        <a href="#/kontak" class="bg-primary text-white font-bold text-center py-3 rounded-xl mt-4">${t('nav.kontak')}</a>
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

  // Bind all language switch buttons
  document.querySelectorAll('.lang-btn-switch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang && targetLang !== getLanguage()) {
        setLanguage(targetLang);
      }
    });
  });

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
