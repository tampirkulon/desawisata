import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { openLightbox } from '../components/lightbox.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderGaleri = async () => {
  let galeriList = mockData.galeri;
  let profil = mockData.profil_desa;

  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('galeri').select('*').order('urutan', { ascending: true });
      if (data && data.length > 0) galeriList = data;

      const { data: prof } = await supabase.from('profil_desa').select('*').single();
      if (prof) profil = prof;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  let activeFilter = 'all';

  const container = document.createElement('div');

  const renderContent = () => {
    const categories = ['all', ...new Set(galeriList.map(g => g.kategori).filter(Boolean))];
    const filteredGaleri = activeFilter === 'all' ? galeriList : galeriList.filter(g => g.kategori === activeFilter);

    return `
      ${renderNavbar()}

      <div style="background: var(--dark-navy); color: #fff; padding: 120px 0 50px; text-align: center;">
        <div class="container">
          <h1 style="color: #fff; font-size: 2.5rem; margin-bottom: 12px;">Galeri Foto & Video Tampirkulon</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 1.1rem;">Dokumentasi keindahan alam, kegiatan masyarakat, dan festival kebudayaan.</p>
        </div>
      </div>

      <div class="container section">
        <!-- Category Filter -->
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 36px;">
          ${categories.map(cat => `
            <button class="btn ${activeFilter === cat ? 'btn-primary' : 'btn-secondary'} galeri-filter-btn" data-cat="${cat}">
              ${cat === 'all' ? 'Semua Galeri' : cat}
            </button>
          `).join('')}
        </div>

        <!-- Masonry Grid -->
        <div class="gallery-masonry">
          ${filteredGaleri.map((item, idx) => `
            <div class="gallery-item" data-idx="${idx}">
              <img src="${item.url}" alt="${item.judul || 'Foto Galeri'}" loading="lazy" />
              <div class="gallery-overlay">
                <div>
                  <h4 style="font-size: 1.1rem; color: #fff;">${item.judul || 'Foto'}</h4>
                  <span style="font-size: 0.85rem; color: var(--accent-gold);">${item.kategori || ''}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${renderFooter(profil)}
    `;
  };

  container.innerHTML = renderContent();

  const bindEvents = () => {
    initNavbarEvents();

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
