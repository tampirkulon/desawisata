import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderProfil = async () => {
  let profil = mockData.profil_desa;

  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('profil_desa').select('*').single();
      if (data) profil = data;
    } catch (e) {
      console.warn('Fallback to seed:', e);
    }
  }

  const container = document.createElement('div');
  container.innerHTML = `
    ${renderNavbar()}

    <!-- Header Banner -->
    <div style="background: var(--dark-navy); color: #fff; padding: 120px 0 60px; text-align: center;">
      <div class="container">
        <span class="badge badge-gold" style="margin-bottom: 12px;">Profil Resmi</span>
        <h1 style="color: #fff; font-size: 2.75rem; margin-bottom: 12px;">Profil Desa Wisata Tampirkulon</h1>
        <p style="color: rgba(255,255,255,0.85); font-size: 1.1rem; max-width: 600px; margin: 0 auto;">
          Kecamatan Candimulyo, Kabupaten Magelang, Jawa Tengah
        </p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="container section">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;" class="profil-grid-layout">
        <div>
          <!-- Sejarah -->
          <div class="card" style="padding: 36px; margin-bottom: 32px;">
            <h2 style="font-size: 1.75rem; margin-bottom: 20px; border-bottom: 2px solid var(--primary-500); padding-bottom: 10px;">📖 Sejarah & Gambaran Umum</h2>
            <div style="font-size: 1.05rem; line-height: 1.8; color: var(--neutral-700);">
              ${(profil.sejarah || '').split('\n').map(p => `<p style="margin-bottom: 16px;">${p}</p>`).join('')}
            </div>
          </div>

          <!-- Visi & Misi -->
          <div class="card" style="padding: 36px;">
            <h2 style="font-size: 1.75rem; margin-bottom: 20px; border-bottom: 2px solid var(--primary-500); padding-bottom: 10px;">🎯 Visi & Misi Desa</h2>
            
            <div style="margin-bottom: 24px;">
              <h3 style="color: var(--primary-500); margin-bottom: 8px;">Visi:</h3>
              <p style="font-weight: 500; font-size: 1.1rem; color: var(--neutral-800); bg: var(--primary-50); padding: 16px; border-radius: 8px; background: var(--primary-50);">
                "${profil.visi}"
              </p>
            </div>

            <div>
              <h3 style="color: var(--primary-500); margin-bottom: 12px;">Misi:</h3>
              <div style="line-height: 1.8; font-size: 1rem; color: var(--neutral-700);">
                ${(profil.misi || '').split('\n').map(m => `<p style="margin-bottom: 8px;">${m}</p>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Info Geografis -->
        <div>
          <div class="card" style="padding: 28px; position: sticky; top: 90px;">
            <h3 style="font-size: 1.3rem; margin-bottom: 20px; border-bottom: 1px solid var(--neutral-200); padding-bottom: 10px;">📍 Informasi Geografis</h3>
            
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 16px;">
              <li>
                <span style="display: block; font-size: 0.85rem; color: var(--neutral-600);">Kecamatan & Kabupaten</span>
                <span style="font-weight: 600;">Candimulyo, Magelang</span>
              </li>
              <li>
                <span style="display: block; font-size: 0.85rem; color: var(--neutral-600);">Luas Wilayah</span>
                <span style="font-weight: 600;">${profil.luas_wilayah || '3.45 km²'}</span>
              </li>
              <li>
                <span style="display: block; font-size: 0.85rem; color: var(--neutral-600);">Jumlah Penduduk</span>
                <span style="font-weight: 600;">${profil.populasi || '2.850 Jiwa'}</span>
              </li>
              <li>
                <span style="display: block; font-size: 0.85rem; color: var(--neutral-600);">Jam Operasional Wisata</span>
                <span style="font-weight: 600;">${profil.jam_operasional || '08:00 - 17:00 WIB'}</span>
              </li>
            </ul>

            <div style="margin-top: 24px; border-top: 1px solid var(--neutral-200); padding-top: 20px;">
              <h4 style="margin-bottom: 12px; font-size: 1rem;">Lokasi di Google Maps</h4>
              <div style="border-radius: var(--radius-md); overflow: hidden; height: 220px;">
                ${profil.google_maps_embed || '<div style="background:#eee; height:100%; display:flex; align-items:center; justify-content:center;">Peta Google Maps</div>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${renderFooter(profil)}
  `;

  setTimeout(() => initNavbarEvents(), 0);
  return container;
};
