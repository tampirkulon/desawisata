import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { openLightbox } from '../components/lightbox.js';
import { renderPagination, initPaginationEvents } from '../components/pagination.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';
import { getProfilDesa } from '../utils/profile-store.js';

export const renderGaleri = async () => {
  let galeriList = mockData.galeri;
  let profil = await getProfilDesa();

  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('galeri').select('*').order('urutan', { ascending: true });
      if (data && data.length > 0) galeriList = data;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  let activeFilter = 'all';
  let currentPage = 1;
  const itemsPerPage = 12;

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background pt-20';

  const renderContent = () => {
    const categories = ['all', ...new Set(galeriList.map(g => g.kategori).filter(Boolean))];
    const filteredGaleri = activeFilter === 'all' ? galeriList : galeriList.filter(g => g.kategori === activeFilter);
    const totalPages = Math.max(1, Math.ceil(filteredGaleri.length / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedGaleri = filteredGaleri.slice(startIndex, startIndex + itemsPerPage);

    return `
      ${renderNavbar(true)}

      <main class="max-w-container-max mx-auto px-4 md:px-16 pb-20 w-full flex-grow">
        <!-- Header Section -->
        <section id="galeri-main-header" class="text-center py-12">
          <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-3">Galeri Kenangan Tampirkulon</h1>
          <p class="font-body-md text-base text-on-surface-variant max-w-2xl mx-auto">Jelajahi keindahan alam, kekayaan budaya, dan momen tak terlupakan di desa wisata kami.</p>
        </section>

        <!-- Filter Bar -->
        <section class="flex flex-wrap justify-center gap-3 mb-12">
          ${categories.map(cat => `
            <button class="galeri-filter-btn px-6 py-2 rounded-full font-label-caps text-xs font-semibold transition-colors cursor-pointer ${activeFilter === cat ? 'bg-primary text-on-primary shadow-sm' : 'bg-transparent text-primary border border-primary hover:bg-primary/10'}" data-cat="${cat}">
              ${cat === 'all' ? 'Semua' : cat}
            </button>
          `).join('')}
        </section>

        <!-- Grid Gallery -->
        <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
          ${paginatedGaleri.length === 0 ? `
            <div class="col-span-full text-center py-16 text-on-surface-variant">
              <span class="material-symbols-outlined text-5xl mb-2 text-outline">photo_library</span>
              <p class="font-body-md text-base">Tidak ada foto dalam kategori ini.</p>
            </div>
          ` : paginatedGaleri.map((item, pageIdx) => {
            const globalIdx = startIndex + pageIdx;
            let colSpan = 'md:col-span-1';
            if (pageIdx === 0) colSpan = 'md:col-span-2 md:row-span-2';
            else if (pageIdx === 1 || pageIdx === 4 || pageIdx === 5) colSpan = 'md:col-span-2';

            return `
              <div class="${colSpan} relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 gallery-item cursor-pointer" data-global-idx="${globalIdx}">
                <img src="${item.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}" alt="${item.judul || 'Foto Galeri'}" class="w-full h-full min-h-[240px] max-h-[420px] object-cover transform transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div class="overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <div>
                    <h3 class="text-white font-display-lg text-lg md:text-xl font-bold">${item.judul || 'Dokumentasi Tampirkulon'}</h3>
                    <span class="text-xs text-tertiary-fixed font-semibold">${item.kategori || 'Galeri'}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </section>

        <!-- Pagination Section -->
        ${renderPagination({
          totalItems: filteredGaleri.length,
          itemsPerPage,
          currentPage,
          labelItem: 'Foto'
        })}
      </main>

      ${renderFooter(profil)}
    `;
  };

  container.innerHTML = renderContent();

  const bindEvents = () => {
    initNavbarEvents(true);

    container.querySelectorAll('.galeri-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeFilter = e.currentTarget.dataset.cat;
        currentPage = 1;
        container.innerHTML = renderContent();
        bindEvents();
      });
    });

    container.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const globalIdx = Number.parseInt(e.currentTarget.dataset.globalIdx, 10);
        const filteredList = activeFilter === 'all' ? galeriList : galeriList.filter(g => g.kategori === activeFilter);
        openLightbox(filteredList, globalIdx);
      });
    });

    initPaginationEvents(container, {
      onPageChange: (newPage) => {
        currentPage = newPage;
        container.innerHTML = renderContent();
        bindEvents();
        const headerEl = container.querySelector('#galeri-main-header');
        if (headerEl) {
          headerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  };

  setTimeout(() => bindEvents(), 0);
  return container;
};
