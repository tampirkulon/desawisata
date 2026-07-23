import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderDestinasi = async (queryParams) => {
  const selectedId = queryParams.get('id');

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
  
  const renderContent = () => {
    const filteredDestinasi = activeCategory === 'all' 
      ? destinasiList 
      : destinasiList.filter(d => d.kategori_id === activeCategory);

    return `
      ${renderNavbar()}

      <div style="background: var(--primary); color: #fff; padding: 120px 0 60px; text-align: center;">
        <div class="container">
          <span class="badge badge-gold" style="margin-bottom: 12px;">Explore Tampirkulon</span>
          <h1 style="color: #fff; font-size: 3rem; margin-bottom: 12px;">Destinasi Wisata Desa</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 1.15rem; max-width: 600px; margin: 0 auto;">Eksplorasi tempat wisata alam, kebun durian, dan cagar seni budaya.</p>
        </div>
      </div>

      <div class="container section">
        <!-- Filter Tabs -->
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px;">
          <button class="btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-secondary'} filter-btn" data-cat="all">
            Semua Destinasi
          </button>
          ${kategoriList.map(cat => `
            <button class="btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'} filter-btn" data-cat="${cat.id}">
              <span>${cat.icon || '🍃'}</span>
              ${cat.nama}
            </button>
          `).join('')}
        </div>

        <!-- Destination Cards Grid -->
        <div class="destination-grid">
          ${filteredDestinasi.map(item => `
            <div class="card destination-card">
              <div class="destination-card-img">
                <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${item.nama}" loading="lazy" />
                ${item.is_unggulan ? '<span class="badge badge-gold" style="position: absolute; top: 16px; left: 16px;">Unggulan</span>' : ''}
              </div>
              <div class="destination-card-body">
                <h3 class="destination-card-title">${item.nama}</h3>
                <p style="font-size: 0.85rem; color: var(--on-surface-variant); margin-bottom: 10px; display: flex; align-items: center; gap: 4px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: var(--primary);">location_on</span>
                  ${item.lokasi || 'Tampirkulon, Candimulyo'}
                </p>
                <p class="destination-card-desc">${item.deskripsi ? item.deskripsi.substring(0, 110) + '...' : ''}</p>
                <div class="destination-card-footer">
                  <span style="font-weight: 800; color: var(--primary); font-size: 1.1rem;">${item.harga_tiket || 'Gratis'}</span>
                  <button class="btn btn-sm btn-outline detail-btn" data-id="${item.id}">Detail Destinasi →</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        ${filteredDestinasi.length === 0 ? `
          <div style="text-align: center; padding: 60px; color: var(--on-surface-variant);">
            <p style="font-size: 1.2rem;">Belum ada destinasi dalam kategori ini.</p>
          </div>
        ` : ''}
      </div>

      <div id="destinasi-modal-root"></div>

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

    container.querySelectorAll('.detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openDetailModal(id);
      });
    });
  };

  const openDetailModal = (id) => {
    const item = destinasiList.find(d => d.id === id);
    if (!item) return;

    const modalRoot = container.querySelector('#destinasi-modal-root');
    modalRoot.innerHTML = `
      <div class="modal-overlay active" id="detail-modal">
        <div class="modal-container" style="max-width: 720px;">
          <div class="modal-header">
            <h3 style="font-size: 1.4rem;">${item.nama}</h3>
            <button id="modal-close" style="font-size: 1.5rem; border: none; background: none; cursor: pointer;">✕</button>
          </div>
          <div class="modal-body">
            <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${item.nama}" style="width: 100%; height: 340px; object-fit: cover; border-radius: var(--radius-xl); margin-bottom: 20px;" />
            
            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; font-size: 0.95rem; background: var(--surface-container-low); padding: 16px; border-radius: var(--radius-lg);">
              <span>📍 <strong>Lokasi:</strong> ${item.lokasi || 'Tampirkulon'}</span>
              <span>⏰ <strong>Jam Buka:</strong> ${item.jam_buka || '08:00 - 16:00'}</span>
              <span>🎟️ <strong>Tiket:</strong> ${item.harga_tiket || 'Gratis'}</span>
            </div>

            <h4 style="margin-bottom: 10px; font-size: 1.1rem;">Deskripsi Destinasi</h4>
            <p style="line-height: 1.8; color: var(--on-surface-variant); font-size: 1rem;">${item.deskripsi || ''}</p>
          </div>
          <div class="modal-footer">
            <a href="#/kontak" class="btn btn-primary">Pesan Paket Terkait</a>
            <button id="modal-close-btn" class="btn btn-secondary">Tutup</button>
          </div>
        </div>
      </div>
    `;

    const closeModal = () => {
      modalRoot.innerHTML = '';
    };

    modalRoot.querySelector('#modal-close')?.addEventListener('click', closeModal);
    modalRoot.querySelector('#modal-close-btn')?.addEventListener('click', closeModal);
  };

  setTimeout(() => {
    bindEvents();
    if (selectedId) openDetailModal(selectedId);
  }, 0);

  return container;
};
