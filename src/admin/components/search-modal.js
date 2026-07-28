// Global Admin Command Palette Search Modal (No Emojis)
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

let searchModalRoot = null;
let selectedIndex = -1;
let currentResults = [];

export const openAdminSearchModal = () => {
  if (!searchModalRoot) {
    searchModalRoot = document.createElement('div');
    searchModalRoot.id = 'admin-search-modal-root';
    document.body.appendChild(searchModalRoot);
  }

  searchModalRoot.innerHTML = `
    <div class="search-modal-overlay active" id="search-modal-overlay">
      <div class="search-modal-container">
        <!-- Search Input Bar -->
        <div class="search-modal-header">
          <span class="material-symbols-outlined search-icon">search</span>
          <input 
            type="text" 
            id="palette-search-input" 
            placeholder="Cari destinasi, paket wisata, reservasi, artikel..." 
            autocomplete="off"
            autofocus
          />
          <span class="search-modal-kbd">ESC</span>
        </div>

        <!-- Search Results List -->
        <div id="palette-search-results" class="search-modal-results">
          <div class="search-placeholder-hint">
            Ketik minimal 1 karakter untuk mencari di seluruh database admin...
          </div>
        </div>

        <!-- Footer Navigation Tips -->
        <div class="search-modal-footer">
          <span class="tip-item"><strong>↑↓</strong> untuk navigasi</span>
          <span class="tip-item"><strong>↵</strong> untuk memilih</span>
          <span class="tip-item"><strong>esc</strong> untuk menutup</span>
        </div>
      </div>
    </div>
  `;

  const overlay = searchModalRoot.querySelector('#search-modal-overlay');
  const searchInput = searchModalRoot.querySelector('#palette-search-input');
  const resultsContainer = searchModalRoot.querySelector('#palette-search-results');

  setTimeout(() => searchInput?.focus(), 50);

  const closeModal = () => {
    if (searchModalRoot) {
      searchModalRoot.innerHTML = '';
    }
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  const performSearch = async (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      currentResults = [];
      resultsContainer.innerHTML = `
        <div class="search-placeholder-hint">
          Ketik minimal 1 karakter untuk mencari di seluruh database admin...
        </div>
      `;
      return;
    }

    let results = [];

    if (isSupabaseConfigured()) {
      try {
        const [{ data: dests }, { data: pkts }, { data: rsvs }, { data: arts }] = await Promise.all([
          supabase.from('destinasi').select('id, nama, lokasi').ilike('nama', `%${q}%`).limit(4),
          supabase.from('paket_wisata').select('id, nama, harga').ilike('nama', `%${q}%`).limit(4),
          supabase.from('reservasi').select('id, nama, status, paket_wisata(nama)').ilike('nama', `%${q}%`).limit(4),
          supabase.from('artikel').select('id, judul, kategori').ilike('judul', `%${q}%`).limit(4)
        ]);

        if (dests) dests.forEach(d => results.push({ category: 'Destinasi', title: d.nama, subtitle: d.lokasi || 'Destinasi Wisata', link: '#/admin/destinasi', icon: 'landscape' }));
        if (pkts) pkts.forEach(p => results.push({ category: 'Paket Wisata', title: p.nama, subtitle: `Rp ${p.harga?.toLocaleString('id-ID') || '0'}`, link: '#/admin/paket', icon: 'inventory_2' }));
        if (rsvs) rsvs.forEach(r => results.push({ category: 'Reservasi', title: r.nama, subtitle: `Status: ${r.status}`, link: '#/admin/reservasi', icon: 'event_note' }));
        if (arts) arts.forEach(a => results.push({ category: 'Artikel', title: a.judul, subtitle: a.kategori || 'Artikel Blog', link: '#/admin/artikel', icon: 'rss_feed' }));
      } catch (e) {
        console.warn('Search fallback to seed data:', e);
      }
    }

    if (results.length === 0) {
      mockData.destinasi.filter(d => d.nama.toLowerCase().includes(q)).forEach(d => results.push({ category: 'Destinasi', title: d.nama, subtitle: d.lokasi, link: '#/admin/destinasi', icon: 'landscape' }));
      mockData.paket_wisata.filter(p => p.nama.toLowerCase().includes(q)).forEach(p => results.push({ category: 'Paket Wisata', title: p.nama, subtitle: `Rp ${p.harga.toLocaleString('id-ID')}`, link: '#/admin/paket', icon: 'inventory_2' }));
      mockData.reservasi.filter(r => r.nama.toLowerCase().includes(q)).forEach(r => results.push({ category: 'Reservasi', title: r.nama, subtitle: `Status: ${r.status}`, link: '#/admin/reservasi', icon: 'event_note' }));
      mockData.artikel.filter(a => a.judul.toLowerCase().includes(q)).forEach(a => results.push({ category: 'Artikel', title: a.judul, subtitle: a.kategori, link: '#/admin/artikel', icon: 'rss_feed' }));
    }

    currentResults = results;
    selectedIndex = results.length > 0 ? 0 : -1;
    renderResults();
  };

  const renderResults = () => {
    if (currentResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          Tidak ada hasil yang ditemukan untuk pencarian ini.
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = currentResults.map((item, idx) => `
      <a href="${item.link}" class="palette-result-item ${idx === selectedIndex ? 'active' : ''}" data-index="${idx}">
        <div class="palette-icon-box">
          <span class="material-symbols-outlined">${item.icon}</span>
        </div>
        <div class="palette-item-content">
          <div class="palette-item-title">${item.title}</div>
          <div class="palette-item-subtitle">${item.subtitle}</div>
        </div>
        <span class="palette-category-badge">${item.category}</span>
      </a>
    `).join('');

    resultsContainer.querySelectorAll('.palette-result-item').forEach(el => {
      el.addEventListener('click', () => {
        closeModal();
      });
    });
  };

  searchInput.addEventListener('input', (e) => performSearch(e.target.value));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex + 1) % currentResults.length;
        renderResults();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
        renderResults();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && currentResults[selectedIndex]) {
        window.location.hash = currentResults[selectedIndex].link;
        closeModal();
      }
    }
  });
};

export const initGlobalSearchShortcut = () => {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'f')) {
      e.preventDefault();
      openAdminSearchModal();
    }
  });
};
