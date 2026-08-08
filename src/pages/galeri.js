import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { openLightbox } from '../components/lightbox.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';
import { getProfilDesa } from '../utils/profile-store.js';

export const renderGaleri = async () => {
  let galeriList = mockData.galeri;
  const profil = await getProfilDesa();

  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('galeri').select('*').order('urutan', { ascending: true });
      if (data && data.length > 0) galeriList = data;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  let activeFilter = 'all';
  const namaDesa = profil.nama_desa || 'Desa Wisata Tampirkulon';

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background pt-20';

  const renderContent = () => {
    const categories = ['all', ...new Set(galeriList.map(g => g.kategori).filter(Boolean))];
    const filteredGaleri = activeFilter === 'all' ? galeriList : galeriList.filter(g => g.kategori === activeFilter);

    return `
      ${renderNavbar(true, profil)}

      <main class="max-w-container-max mx-auto px-4 md:px-16 pb-20 w-full flex-grow">
        <!-- Header Section -->
        <section class="text-center py-12">
          <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-3">Galeri Kenangan ${namaDesa}</h1>
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
          ${filteredGaleri.map((item, idx) => {
            let colSpan = 'md:col-span-1';
            if (idx === 0) colSpan = 'md:col-span-2 md:row-span-2';
            else if (idx === 1 || idx === 4 || idx === 5) colSpan = 'md:col-span-2';

            return `
              <div class="${colSpan} relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 gallery-item cursor-pointer" data-idx="${idx}">
                <img src="${item.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}" alt="${item.judul || 'Foto Galeri'}" class="w-full h-full min-h-[240px] max-h-[420px] object-cover transform transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div class="overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <div>
                    <h3 class="text-white font-display-lg text-lg md:text-xl font-bold">${item.judul || ('Dokumentasi ' + namaDesa)}</h3>
                    <span class="text-xs text-tertiary-fixed font-semibold">${item.kategori || 'Galeri'}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </section>
      </main>

      ${renderFooter(profil)}
    `;
  };

  container.innerHTML = renderContent();

  const bindEvents = () => {
    initNavbarEvents(true);

    container.querySelectorAll('.galeri-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeFilter = e.currentTarget.getAttribute('data-cat');
        container.innerHTML = renderContent();
        bindEvents();
      });
    });

    container.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
        const filteredList = activeFilter === 'all' ? galeriList : galeriList.filter(g => g.kategori === activeFilter);
        openLightbox(filteredList, idx);
      });
    });
  };

  setTimeout(() => bindEvents(), 0);
  return container;
};
