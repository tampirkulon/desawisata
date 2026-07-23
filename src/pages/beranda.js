import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderBeranda = async () => {
  let profil = mockData.profil_desa;
  let kategori = mockData.kategori_wisata;
  let destinasi = mockData.destinasi;
  let testimoni = mockData.testimoni;

  if (isSupabaseConfigured()) {
    try {
      const { data: profilData } = await supabase.from('profil_desa').select('*').single();
      if (profilData) profil = profilData;

      const { data: katData } = await supabase.from('kategori_wisata').select('*').order('urutan', { ascending: true });
      if (katData && katData.length > 0) kategori = katData;

      const { data: destData } = await supabase.from('destinasi').select('*').eq('is_published', true).eq('is_unggulan', true).limit(3);
      if (destData && destData.length > 0) destinasi = destData;

      const { data: testData } = await supabase.from('testimoni').select('*').eq('is_shown', true);
      if (testData && testData.length > 0) testimoni = testData;
    } catch (e) {
      console.warn('Falling back to seed data:', e);
    }
  }

  const container = document.createElement('div');
  container.innerHTML = `
    ${renderNavbar()}

    <!-- Hero Section (Stitch UI Inspired) -->
    <section class="hero-section" style="background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80');">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="badge badge-gold" style="margin-bottom: 20px; padding: 6px 16px; font-size: 0.85rem;">Discover the Soul of Java</span>
        <h1 class="hero-title">${profil.nama_desa || 'Desa Wisata Tampirkulon'}</h1>
        <p class="hero-subtitle">${profil.tagline || 'Keindahan Alam & Pesona Budaya Candimulyo, Magelang'}</p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
          <a href="#/destinasi" class="btn btn-primary btn-lg">Jelajahi Wisata</a>
          <a href="#/kontak" class="glass-panel text-on-primary font-label-md btn-lg" style="color: #fff; border-radius: var(--radius-full); padding: 14px 28px; display: inline-flex; align-items: center; gap: 8px;">
            <span class="material-symbols-outlined">calendar_month</span>
            Reservasi Online
          </a>
        </div>
      </div>
      <div class="hero-scroll-indicator" onclick="document.getElementById('section-experiences').scrollIntoView({behavior: 'smooth'})" style="position: absolute; bottom: 30px; font-size: 2rem; opacity: 0.8; cursor: pointer;">
        ↓
      </div>
    </section>

    <!-- Curated Experiences (Bento Grid Layout - Stitch Design) -->
    <section class="section container" id="section-experiences">
      <div class="section-header">
        <span class="badge badge-primary" style="margin-bottom: 8px;">Immerse Yourself</span>
        <h2 class="section-title">Pengalaman Wisata Terpilih</h2>
        <p class="section-subtitle">Dari petualangan jelajah alam hingga perjalanan kuliner durian Candimulyo, temukan cara terbaik menikmati Tampirkulon.</p>
      </div>

      <div class="bento-grid">
        <!-- Large Bento Card (Nature Trails) -->
        <div class="bento-card-large" onclick="window.location.hash='#/destinasi'">
          <img class="bento-card-img" src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" alt="Wisata Alam & Terasering Sawah" />
          <div class="bento-overlay">
            <span class="badge badge-gold" style="width: fit-content; margin-bottom: 12px;">🌱 Wisata Alam</span>
            <h3 style="font-size: 1.75rem; color: #fff; margin-bottom: 8px;">Terasering Sawah & Perbukitan Asri</h3>
            <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; margin-bottom: 16px;">Nikmati pemandangan sawah terasering berlatar Gunung Merbabu dan sungai jernih.</p>
            <span style="font-weight: 600; color: var(--accent-gold); display: inline-flex; align-items: center; gap: 6px;">Eksplor Sekarang →</span>
          </div>
        </div>

        <!-- Small Bento Card Top (Kuliner Durian) -->
        <div class="bento-card-small" onclick="window.location.hash='#/paket'">
          <img class="bento-card-img" src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" alt="Wisata Kuliner Durian" />
          <div class="bento-overlay" style="padding: 20px;">
            <span class="badge badge-primary" style="width: fit-content; margin-bottom: 6px;">🍲 Kuliner Durian</span>
            <h4 style="font-size: 1.2rem; color: #fff;">Kebun Durian Candimulyo</h4>
          </div>
        </div>

        <!-- Small Bento Card Bottom (Budaya) -->
        <div class="bento-card-small" onclick="window.location.hash='#/profil'">
          <img class="bento-card-img" src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" alt="Kesenian Budaya" />
          <div class="bento-overlay" style="padding: 20px;">
            <span class="badge badge-gold" style="width: fit-content; margin-bottom: 6px;">🎭 Seni & Budaya</span>
            <h4 style="font-size: 1.2rem; color: #fff;">Tarian Tradisional Dayakan</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- Destinasi Unggulan Section -->
    <section class="section" style="background-color: var(--surface-container-low);">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-gold">Destinasi Populer</span>
          <h2 class="section-title">Destinasi Unggulan Desa</h2>
          <p class="section-subtitle">Tempat terseru dan fotogenik yang paling disukai para wisatawan.</p>
        </div>

        <div class="destination-grid">
          ${destinasi.map(item => `
            <div class="card destination-card">
              <div class="destination-card-img">
                <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${item.nama}" loading="lazy" />
                <span class="badge badge-primary" style="position: absolute; top: 16px; left: 16px;">Unggulan</span>
              </div>
              <div class="destination-card-body">
                <h3 class="destination-card-title">${item.nama}</h3>
                <p class="destination-card-desc">${item.deskripsi ? item.deskripsi.substring(0, 105) + '...' : ''}</p>
                <div class="destination-card-footer">
                  <span style="font-weight: 700; color: var(--primary); font-size: 1.05rem;">${item.harga_tiket || 'Gratis'}</span>
                  <a href="#/destinasi?id=${item.id}" class="btn btn-sm btn-outline">Lihat Detail →</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 48px;">
          <a href="#/destinasi" class="btn btn-primary btn-lg">Lihat Seluruh Destinasi Wisata</a>
        </div>
      </div>
    </section>

    <!-- Village Amenities Bento Section (Stitch Modern Feature) -->
    <section class="container section">
      <div class="amenities-bento">
        <div class="amenities-card">
          <span class="badge badge-primary" style="margin-bottom: 12px;">Fasilitas Desa</span>
          <h2 style="font-size: 2rem; margin-bottom: 8px;">Kenyamanan Modern di Alam Pedesaan</h2>
          <p style="color: var(--on-surface-variant); font-size: 1rem;">Desa Tampirkulon dilengkapi berbagai fasilitas pendukung untuk memastikan kunjungan Anda nyaman dan berkesan.</p>

          <div class="amenities-icons-grid">
            <div class="amenity-icon-box">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 2rem;">wifi</span>
              <span style="font-size: 0.85rem; font-weight: 600;">High-Speed Wi-Fi</span>
            </div>
            <div class="amenity-icon-box">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 2rem;">local_cafe</span>
              <span style="font-size: 0.85rem; font-weight: 600;">Kedai Kopi Desa</span>
            </div>
            <div class="amenity-icon-box">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 2rem;">storefront</span>
              <span style="font-size: 0.85rem; font-weight: 600;">Pasar UMKM</span>
            </div>
            <div class="amenity-icon-box">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 2rem;">local_parking</span>
              <span style="font-size: 0.85rem; font-weight: 600;">Area Parkir Luas</span>
            </div>
          </div>
        </div>

        <!-- Group Booking Card -->
        <div style="background: var(--primary); color: #fff; border-radius: var(--radius-2xl); padding: 40px; display: flex; flex-direction: column; justify-content: center; text-align: center; position: relative; overflow: hidden;">
          <span class="material-symbols-outlined" style="font-size: 3rem; color: var(--primary-fixed); margin-bottom: 16px;">groups</span>
          <h3 style="color: #fff; font-size: 1.75rem; margin-bottom: 12px;">Rombongan & Komunitas?</h3>
          <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; margin-bottom: 24px;">Dapatkan paket penawaran khusus untuk rombongan sekolah, kantor, atau keluarga besar.</p>
          <a href="#/kontak" class="btn btn-accent btn-lg" style="width: 100%;">Hubungi Pengelola</a>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section" style="background-color: var(--surface-container-low);">
      <div class="container">
        <div class="section-header">
          <span class="badge badge-primary">Testimoni Pengunjung</span>
          <h2 class="section-title">Apa Kata Mereka</h2>
          <p class="section-subtitle">Pengalaman nyata para wisatawan yang telah menikmati pesona Desa Tampirkulon.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
          ${testimoni.map(item => `
            <div class="card" style="padding: 32px;">
              <div style="color: var(--accent-gold); font-size: 1.25rem; margin-bottom: 12px;">
                ${'★'.repeat(item.rating || 5)}
              </div>
              <p style="font-style: italic; color: var(--on-surface-variant); margin-bottom: 20px; line-height: 1.7;">"${item.pesan}"</p>
              <div>
                <h4 style="font-size: 1.1rem; color: var(--on-surface);">${item.nama}</h4>
                <span style="font-size: 0.85rem; color: var(--on-surface-variant);">${item.asal || 'Wisatawan'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA Banner Section -->
    <section class="container" style="margin-top: 60px; margin-bottom: 60px;">
      <div style="background: linear-gradient(135deg, var(--dark-navy) 0%, var(--primary) 100%); color: #fff; padding: 60px 40px; border-radius: var(--radius-2xl); text-align: center;">
        <h2 style="color: #fff; font-size: 2.5rem; margin-bottom: 16px;">Siap Merencanakan Liburan Seru?</h2>
        <p style="font-size: 1.1rem; color: rgba(255,255,255,0.85); max-width: 620px; margin: 0 auto 32px;">
          Pesan paket wisata durian dan jelajah alam pedesaan Tampirkulon secara online sekarang.
        </p>
        <a href="#/kontak" class="btn btn-accent btn-lg" style="padding: 16px 36px; font-size: 1.1rem;">Formulir Reservasi Online</a>
      </div>
    </section>

    ${renderFooter(profil)}
  `;

  setTimeout(() => initNavbarEvents(), 0);
  return container;
};
