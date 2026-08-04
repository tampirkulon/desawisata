import { openDestinasiModal } from '../components/destinasi-modal.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderDestinasi = async (queryParams) => {
  const selectedId = queryParams ? queryParams.get('id') : null;

  let kategoriList = mockData.kategori_wisata;
  let destinasiList = mockData.destinasi;
  let profil = mockData.profil_desa;

  if (isSupabaseConfigured()) {
    try {
      const { data: kat } = await supabase.from('kategori_wisata').select('*').order('urutan', { ascending: true });
      if (kat && kat.length > 0) kategoriList = kat;

      const { data: dest } = await supabase.from('destinasi').select('*').eq('is_published', true);
      if (dest && dest.length > 0) destinasiList = dest;

      const { data: prof } = await supabase.from('profil_desa').select('*').single();
      if (prof) profil = prof;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  let activeCategory = 'all';

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-surface text-on-surface';

  const renderContent = () => {
    const filteredDestinasi = activeCategory === 'all' 
      ? destinasiList 
      : destinasiList.filter(d => d.kategori_id === activeCategory);

    return `
      ${renderNavbar()}

      <!-- Page Header -->
      <section class="relative flex items-center justify-center overflow-hidden w-full bg-primary pt-20 px-6 text-center text-white" style="min-height: 391px;">
        <div class="absolute inset-0 z-0">
          <img alt="Tampirkulon Heritage" class="w-full h-full object-cover opacity-30" src="https://lh3.googleusercontent.com/aida/AP1WRLv0kmPyXlx735C-3FBTB_btvd6IOzpOfv8reV4yrmbXWSpYqTUCgFkZ_2PuSVRtioFNOUL_7vEfh9ykgRLvufo9vdRONN04mxuEumo797mDUt6r-DwXjhT8pZHuKBVfRgc3KcVFFHdy8NgyVVD17ZnV22HDZWY5H1at2jNZuOgrJ-kgBsda7pjf_0_rL9fYtVDavMg9G7Qv7iqE8gyLZpw9eZryb4JbvYGL_t-Hb1rDIcleP0-J6wiUfg" />
          <div class="absolute inset-0 bg-primary/60 backdrop-blur-[2px]"></div>
        </div>
        <div class="relative z-10 max-w-container-max mx-auto px-4 text-center py-8">
          <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-white mb-4">Eksplorasi Destinasi Kami</h1>
          <p class="font-body-md text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Temukan keindahan alam yang tak tertandingi, kekayaan budaya yang otentik, dan pengalaman tak terlupakan di Desa Wisata Tampirkulon.
          </p>
        </div>
      </section>

      <!-- Filter Bar -->
      <section class="max-w-container-max mx-auto px-4 md:px-16 my-8">
        <div class="flex flex-wrap justify-center gap-3">
          <button class="filter-btn border px-6 py-2 rounded-full font-label-caps text-xs font-semibold transition-colors ${activeCategory === 'all' ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-primary border-primary hover:bg-primary-fixed'}" data-cat="all">
            Semua
          </button>
          ${kategoriList.map(cat => `
            <button class="filter-btn border px-6 py-2 rounded-full font-label-caps text-xs font-semibold transition-colors ${activeCategory === cat.id ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-primary border-primary hover:bg-primary-fixed'}" data-cat="${cat.id}">
              ${cat.nama}
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Destination Grid -->
      <section class="max-w-container-max mx-auto px-4 md:px-16 mb-20 flex-grow">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${filteredDestinasi.map(item => `
            <div class="bg-surface-container-lowest rounded-xl shadow-level-1 hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative group cursor-pointer border border-outline-variant/30 destinasi-card-item" data-id="${item.id}">
              <div class="relative w-full aspect-[4/3] overflow-hidden">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${item.nama}" />
                <span class="absolute top-4 left-4 bg-tertiary-fixed/90 text-primary font-label-caps text-xs px-3 py-1 rounded-full backdrop-blur-sm shadow-sm font-bold">
                  ${item.harga_tiket || 'Gratis'}
                </span>
              </div>
              <div class="p-6 flex flex-col flex-grow">
                <h3 class="font-display-lg text-xl font-bold text-primary mb-2 line-clamp-1">${item.nama}</h3>
                <p class="font-body-sm text-sm text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">
                  ${item.deskripsi || ''}
                </p>
                <div class="mt-auto flex justify-between items-center pt-4 border-t border-outline-variant/10">
                  <span class="text-xs text-on-surface-variant flex items-center gap-1 font-semibold">
                    <span class="material-symbols-outlined text-sm text-primary">location_on</span>
                    ${item.lokasi || 'Tampirkulon'}
                  </span>
                  <button class="detail-btn w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary hover:bg-secondary hover:text-on-secondary transition-colors duration-300 pointer-events-none" data-id="${item.id}">
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        ${filteredDestinasi.length === 0 ? `
          <div class="text-center py-16 text-on-surface-variant">
            <p class="text-lg">Belum ada destinasi dalam kategori ini.</p>
          </div>
        ` : ''}
      </section>

      ${renderFooter(profil)}
    `;
  };

  container.innerHTML = renderContent();

  const bindEvents = () => {
    initNavbarEvents();

    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeCategory = e.currentTarget.getAttribute('data-cat');
        container.innerHTML = renderContent();
        bindEvents();
      });
    });

    container.querySelectorAll('.destinasi-card-item').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = destinasiList.find(d => d.id === id);
        if (item) openDestinasiModal(item);
      });
    });
  };

  setTimeout(() => {
    bindEvents();
    if (selectedId) {
      const item = destinasiList.find(d => d.id === selectedId);
      if (item) openDestinasiModal(item);
    }
  }, 0);

  return container;
};
