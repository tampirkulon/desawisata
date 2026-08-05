import { openDestinasiModal } from '../components/destinasi-modal.js';
import { openTestimoniModal } from '../components/testimoni-modal.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderBeranda = async () => {
  let profil = mockData.profil_desa;
  let destinasi = mockData.destinasi;
  let testimoniList = mockData.testimoni;

  if (isSupabaseConfigured()) {
    try {
      const { data: profilData } = await supabase.from('profil_desa').select('*').single();
      if (profilData) profil = profilData;

      const { data: destData } = await supabase.from('destinasi').select('*').eq('is_published', true).limit(3);
      if (destData && destData.length > 0) destinasi = destData;

      const { data: testData } = await supabase.from('testimoni').select('*').eq('is_shown', true).limit(6);
      if (testData && testData.length > 0) testimoniList = testData;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col';

  container.innerHTML = `
    ${renderNavbar()}

    <!-- Header / Hero Section (Stitch Exact Design) -->
    <header class="relative min-h-screen flex items-center justify-center text-center text-white pt-20" id="home">
      <div class="absolute inset-0 bg-cover bg-center z-0" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1N3qfr45yGM4LIKsP1pNq68gNszE9t16hkBpSAprxngOlDrcG0fnvmNffH5_U3RwX7YxGgeOlCWIt60mzvtTAkHXSRU3RMPrM0PZPWZXRHy5uFNjikWcHVqhFhPFTHABTjT_6dRAAH5Te068QCo6Ow_7L92HcK4GXHyW-4fyN1UC0iCWWT5nWRx-gAnC6fVi8Ou7tiA-JBVZcPPWNXLY54akzStvnMQtGuydK-46gAGSErezw4ASK');"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-primary/80 z-0"></div>
      <div class="relative z-10 max-w-4xl px-6 py-20 flex flex-col items-center text-white">
        <span class="bg-secondary/80 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm" style="color: #ffffff;">
          Welcome to Tampirkulon
        </span>
        <h1 class="font-display-lg text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-md text-white" style="color: #ffffff;">
          ${profil.nama_desa || 'Jelajahi Warisan Alam Tampirkulon'}
        </h1>
        <p class="font-body-md text-lg md:text-xl text-white mb-10 max-w-2xl leading-relaxed" style="color: #ffffff;">
          ${profil.tagline || 'Temukan keindahan tersembunyi, rasakan kehangatan budaya, dan ciptakan kenangan tak terlupakan di desa wisata kami.'}
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a href="#/destinasi" class="bg-secondary text-white font-bold px-8 py-3.5 rounded-full hover:bg-secondary/90 transition-all transform hover:-translate-y-1 shadow-level-1" style="color: #ffffff;">
            Mulai Petualangan
          </a>
          <a href="#/kontak" class="bg-white/20 backdrop-blur-md border border-white/40 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/30 transition-all" style="color: #ffffff;">
            Kontak & Reservasi
          </a>
        </div>
      </div>
    </header>

    <!-- Highlights Grid Section -->
    <section class="py-16 md:py-24 bg-surface border-t-4 border-primary" id="highlights">
      <div class="max-w-container-max mx-auto px-4 md:px-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-level-1 hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300">
            <div class="w-16 h-16 bg-surface-container text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-3xl">park</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">Wisata Alam</h3>
            <p class="font-body-sm text-sm text-on-surface-variant">Eksplorasi bentang alam yang asri dan menenangkan.</p>
          </div>

          <div class="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-level-1 hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300">
            <div class="w-16 h-16 bg-surface-container text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-3xl">festival</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">Budaya Lokal</h3>
            <p class="font-body-sm text-sm text-on-surface-variant">Saksikan tradisi dan kesenian yang masih terjaga.</p>
          </div>

          <div class="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-level-1 hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300">
            <div class="w-16 h-16 bg-surface-container text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-3xl">restaurant</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">Kuliner Khas</h3>
            <p class="font-body-sm text-sm text-on-surface-variant">Nikmati hidangan otentik dengan resep turun temurun.</p>
          </div>

          <div class="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-level-1 hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300">
            <div class="w-16 h-16 bg-surface-container text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-3xl">home_work</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">Homestay Nyaman</h3>
            <p class="font-body-sm text-sm text-on-surface-variant">Menginap bersama warga untuk pengalaman otentik.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Destinations Section -->
    <section class="py-16 md:py-24 bg-surface-container-low" id="destinations">
      <div class="max-w-container-max mx-auto px-4 md:px-16">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-3">Destinasi Unggulan</h2>
          <p class="font-body-md text-base text-on-surface-variant">Tempat-tempat terbaik yang wajib Anda kunjungi di Tampirkulon.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${destinasi.map(item => `
            <div class="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-level-1 hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer beranda-destinasi-card" data-id="${item.id}">
              <div class="relative h-56 overflow-hidden">
                <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${item.nama}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                <span class="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  ${item.harga_tiket || 'Gratis'}
                </span>
              </div>
              <div class="p-6 flex flex-col flex-grow">
                <h3 class="font-display-lg text-xl font-bold text-primary mb-2">${item.nama}</h3>
                <p class="font-body-sm text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                  ${item.deskripsi ? item.deskripsi.substring(0, 110) + '...' : ''}
                </p>
                <div class="pt-4 border-t border-outline-variant/20 flex justify-between items-center mt-auto">
                  <span class="font-bold text-primary text-base">${item.lokasi || 'Tampirkulon'}</span>
                  <button class="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-container transition-colors pointer-events-none">Lihat Detail</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="text-center mt-12">
          <a href="#/destinasi" class="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-primary-container transition-all">
            Lihat Semua Destinasi
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-16 md:py-24 bg-surface border-t border-outline-variant/30" id="about">
      <div class="max-w-container-max mx-auto px-4 md:px-16">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-4">Mengenal Tampirkulon</h2>
            <p class="font-body-md text-base text-on-surface-variant mb-4 leading-relaxed">
              Desa Wisata Tampirkulon menawarkan perpaduan harmonis antara keindahan alam yang masih perawan dan kekayaan budaya lokal yang terus dilestarikan. Kami berkomitmen untuk menyajikan pengalaman ekowisata yang tidak hanya memanjakan mata, tetapi juga memberikan dampak positif bagi komunitas dan lingkungan.
            </p>
            <p class="font-body-md text-base text-on-surface-variant mb-6 leading-relaxed">
              Dengan keramahan penduduk lokal dan fasilitas yang terus dikembangkan, kami mengundang Anda untuk sejenak melepas penat dan menemukan kedamaian di desa kami.
            </p>
            <a href="#/profil" class="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-container transition-all">
              Baca Selengkapnya
            </a>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="bg-surface-container-low p-6 rounded-2xl text-center shadow-level-1">
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1">3.45</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">Km² Luas Wilayah</div>
            </div>
            <div class="bg-surface-container-low p-6 rounded-2xl text-center shadow-level-1">
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1">2.8k</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">Populasi Penduduk</div>
            </div>
            <div class="bg-surface-container-low p-6 rounded-2xl text-center shadow-level-1">
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1">4+</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">Kategori Wisata</div>
            </div>
            <div class="bg-surface-container-low p-6 rounded-2xl text-center shadow-level-1">
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1">100%</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">Kearifan Lokal</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 md:py-24 bg-surface-container-low" id="testimonials">
      <div class="max-w-container-max mx-auto px-4 md:px-16">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div class="text-center md:text-left">
            <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-2">Kata Mereka</h2>
            <p class="font-body-md text-base text-on-surface-variant m-0">Pengalaman tak terlupakan dari pengunjung kami.</p>
          </div>
          <button id="write-testimonial-btn" class="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-level-1 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">rate_review</span>
            <span>Tulis Ulasan & Kesan</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${testimoniList.map(t => `
            <div class="bg-surface-container-lowest p-8 rounded-2xl shadow-level-1 flex flex-col justify-between">
              <div>
                <div class="flex text-amber-500 mb-4">${'★'.repeat(t.rating || 5)}${'☆'.repeat(5 - (t.rating || 5))}</div>
                <p class="font-body-md italic text-on-surface-variant text-sm mb-6 leading-relaxed">
                  "${t.pesan}"
                </p>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  ${(t.nama || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 class="font-bold text-sm text-on-surface">${t.nama}</h4>
                  <span class="text-xs text-on-surface-variant">${t.asal || 'Pengunjung'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Call to Action Banner -->
    <section class="py-16 bg-primary-fixed/30 text-center">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-4">Siap Menjelajahi Tampirkulon?</h2>
        <p class="font-body-md text-base text-on-surface-variant mb-8">
          Temukan kedamaian dan keindahan yang autentik di Desa Wisata Tampirkulon. Kami siap menyambut kedatangan Anda dengan keramahan khas desa kami.
        </p>
        <a href="#/kontak" class="inline-flex items-center gap-2 bg-secondary text-white font-bold px-8 py-3.5 rounded-full hover:bg-secondary/90 transition-all shadow-level-1">
          <span class="material-symbols-outlined text-xl">calendar_month</span>
          Kontak & Reservasi
        </a>
      </div>
    </section>

    ${renderFooter(profil)}
  `;

  setTimeout(() => {
    initNavbarEvents();

    container.querySelector('#write-testimonial-btn')?.addEventListener('click', () => {
      openTestimoniModal();
    });

    container.querySelectorAll('.beranda-destinasi-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = destinasi.find(d => d.id === id);
        if (item) openDestinasiModal(item);
      });
    });
  }, 0);

  return container;
};
