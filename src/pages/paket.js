import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderPaket = async () => {
  let paketList = mockData.paket_wisata;
  let profil = mockData.profil_desa;

  if (isSupabaseConfigured()) {
    try {
      const { data: p } = await supabase.from('paket_wisata').select('*').eq('is_published', true);
      if (p && p.length > 0) paketList = p;

      const { data: prof } = await supabase.from('profil_desa').select('*').single();
      if (prof) profil = prof;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const container = document.createElement('div');
  container.innerHTML = `
    ${renderNavbar()}

    <!-- Header Banner -->
    <div style="background: var(--primary); color: #fff; padding: 120px 0 60px; text-align: center;">
      <div class="container">
        <span class="badge badge-gold" style="margin-bottom: 12px;">Curated Itineraries</span>
        <h1 style="color: #fff; font-size: 3rem; margin-bottom: 12px;">Paket Wisata Tampirkulon</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 1.15rem; max-width: 620px; margin: 0 auto;">Pilihan paket tour terjangkau dengan fasilitas lengkap untuk liburan keluarga & rombongan.</p>
      </div>
    </div>

    <!-- Packages Grid -->
    <div class="container section">
      <div class="section-header">
        <h2 class="section-title">Signature Travel Packages</h2>
        <p class="section-subtitle">Kombinasi sempurna petualangan outdoor, kuliner durian, dan edukasi budaya.</p>
      </div>

      <div class="packages-grid">
        ${paketList.map((paket, index) => `
          <div class="package-card ${index === 0 ? 'highlight' : ''}">
            ${index === 0 ? '<span class="badge badge-gold" style="position: absolute; top: 20px; right: 20px;">Paling Populer</span>' : ''}
            
            <h3 style="font-size: 1.6rem; margin-bottom: 8px;">${paket.nama}</h3>
            <p style="color: var(--on-surface-variant); font-size: 0.95rem; min-height: 48px;">${paket.deskripsi || ''}</p>
            
            <div class="package-price">
              ${formatRupiah(paket.harga)}
              <span style="font-size: 0.9rem; font-weight: normal; color: var(--on-surface-variant);">/ orang</span>
            </div>

            <div style="font-size: 0.9rem; color: var(--on-surface-variant); margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; background: var(--surface-container-low); padding: 14px; border-radius: var(--radius-md);">
              <span style="display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 18px; color: var(--primary);">schedule</span>
                <strong>Durasi:</strong> ${paket.durasi || '1 Hari'}
              </span>
              <span style="display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 18px; color: var(--primary);">groups</span>
                <strong>Kapasitas:</strong> ${paket.kapasitas_min || 1} - ${paket.kapasitas_max || '30'} orang
              </span>
            </div>

            <h4 style="font-size: 0.95rem; font-family: var(--font-label); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 12px;">Fasilitas Termasuk:</h4>
            <ul class="package-facilities">
              ${(paket.fasilitas || []).map(f => `
                <li>
                  <span class="material-symbols-outlined" style="color: var(--primary); font-size: 20px;">check_circle</span>
                  ${f}
                </li>
              `).join('')}
            </ul>

            <div style="margin-top: auto; padding-top: 28px;">
              <a href="#/kontak?paket_id=${paket.id}" class="btn ${index === 0 ? 'btn-primary' : 'btn-outline'}" style="width: 100%; padding: 14px; font-size: 1rem;">
                Reservasi Sekarang
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    ${renderFooter(profil)}
  `;

  setTimeout(() => initNavbarEvents(), 0);
  return container;
};
