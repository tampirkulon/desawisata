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

      const { data: destData } = await supabase.from('destinasi').select('*').eq('is_published', true).eq('is_unggulan', true).limit(3);
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

    <!-- Header / Hero Section (Stitch Exact Design + Glassmorphic Accents) -->
    <header class="relative min-h-screen flex items-center justify-center text-center text-white pt-20 overflow-hidden" id="home">
      <div class="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-1000" style="background-image: url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80');"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-primary/85 z-0"></div>
      
      <!-- Ambient hero glow -->
      <div class="absolute top-1/3 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div class="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div class="relative z-10 max-w-4xl px-6 py-20 flex flex-col items-center text-white">

        <span class="bg-secondary/90 backdrop-blur-md text-white border border-white/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          Welcome to Tampirkulon
        </span>
        <h1 class="font-display-lg text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg text-white">
          ${profil.nama_desa || 'Jelajahi Warisan Alam Tampirkulon'}
        </h1>
        <p class="font-body-md text-lg md:text-xl text-white/95 mb-10 max-w-2xl leading-relaxed drop-shadow-sm">
          ${profil.tagline || 'Temukan keindahan tersembunyi, rasakan kehangatan budaya, dan ciptakan kenangan tak terlupakan di desa wisata kami.'}
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a href="#/destinasi" class="bg-secondary text-white font-bold px-8 py-3.5 rounded-full hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/30 transition-all transform hover:-translate-y-1 shadow-level-1 inline-flex items-center gap-2">
            <span>Mulai Petualangan</span>
            <span class="material-symbols-outlined text-lg">explore</span>
          </a>
          <a href="#/kontak" class="bg-white/15 backdrop-blur-md border border-white/40 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/25 transition-all transform hover:-translate-y-1 shadow-sm inline-flex items-center gap-2">
            <span>Kontak & Reservasi</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Highlights Grid Section with Ambient Accents -->
    <section class="py-16 md:py-24 bg-surface relative overflow-hidden border-t-2 border-primary/20" id="highlights">
      <!-- Ambient Glow Orbs -->
      <div class="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="max-w-container-max mx-auto px-4 md:px-12 relative z-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div class="group relative bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/80 shadow-level-1 hover:shadow-xl hover:-translate-y-2 hover:border-secondary/60 transition-all duration-300 flex flex-col items-center">
            <span class="absolute top-4 right-4 text-xs font-bold text-primary/30 font-mono">01</span>
            <div class="w-16 h-16 bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/20 text-primary rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span class="material-symbols-outlined text-3xl">park</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">Wisata Alam</h3>
            <p class="font-body-sm text-sm text-on-surface-variant leading-relaxed">Eksplorasi bentang alam yang asri dan menenangkan.</p>
          </div>

          <div class="group relative bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/80 shadow-level-1 hover:shadow-xl hover:-translate-y-2 hover:border-secondary/60 transition-all duration-300 flex flex-col items-center">
            <span class="absolute top-4 right-4 text-xs font-bold text-primary/30 font-mono">02</span>
            <div class="w-16 h-16 bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/20 text-primary rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span class="material-symbols-outlined text-3xl">festival</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">Budaya Lokal</h3>
            <p class="font-body-sm text-sm text-on-surface-variant leading-relaxed">Saksikan tradisi dan kesenian yang masih terjaga.</p>
          </div>

          <div class="group relative bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/80 shadow-level-1 hover:shadow-xl hover:-translate-y-2 hover:border-secondary/60 transition-all duration-300 flex flex-col items-center">
            <span class="absolute top-4 right-4 text-xs font-bold text-primary/30 font-mono">03</span>
            <div class="w-16 h-16 bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/20 text-primary rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span class="material-symbols-outlined text-3xl">restaurant</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">Kuliner Khas</h3>
            <p class="font-body-sm text-sm text-on-surface-variant leading-relaxed">Nikmati hidangan otentik dengan resep turun temurun.</p>
          </div>

          <div class="group relative bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/80 shadow-level-1 hover:shadow-xl hover:-translate-y-2 hover:border-secondary/60 transition-all duration-300 flex flex-col items-center">
            <span class="absolute top-4 right-4 text-xs font-bold text-primary/30 font-mono">04</span>
            <div class="w-16 h-16 bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/20 text-primary rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span class="material-symbols-outlined text-3xl">home_work</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">Homestay Nyaman</h3>
            <p class="font-body-sm text-sm text-on-surface-variant leading-relaxed">Menginap bersama warga untuk pengalaman otentik.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Destinations Section with Glass Badges -->
    <section class="py-16 md:py-24 bg-surface-container-low relative overflow-hidden" id="destinations">
      <div class="max-w-container-max mx-auto px-4 md:px-12 relative z-10">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <span class="material-symbols-outlined text-sm">stars</span>
            <span>Destinasi Favorit</span>
          </span>
          <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-3">Destinasi Unggulan</h2>
          <p class="font-body-md text-base text-on-surface-variant">Tempat-tempat terbaik yang wajib Anda kunjungi di Tampirkulon.</p>
        </div>

       

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${destinasi.map(item => `
            <div class="group bg-white/90 backdrop-blur-md rounded-2xl border border-outline-variant/40 overflow-hidden shadow-level-1 hover:shadow-xl hover:-translate-y-1.5 hover:border-secondary/60 transition-all duration-300 flex flex-col cursor-pointer beranda-destinasi-card" data-id="${item.id}">
              <div class="relative h-56 overflow-hidden bg-surface-container-low">
                <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${item.nama}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                <span class="absolute top-4 right-4 bg-[#123524]/85 backdrop-blur-md text-[#EFE3C2] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-white/20 shadow-md">
                  ${item.harga_tiket || 'Gratis'}
                </span>
              </div>
              <div class="p-6 flex flex-col flex-grow">
                <h3 class="font-display-lg text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">${item.nama}</h3>
                <p class="font-body-sm text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed line-clamp-3">
                  ${item.deskripsi || 'Nikmati keindahan dan suasana unik di destinasi favorit Desa Wisata Tampirkulon.'}
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

        <div class="text-center mt-12">
          <a href="#/destinasi" class="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-primary-container hover:shadow-lg hover:shadow-primary/25 transition-all shadow-level-1">
            <span>Lihat Semua Destinasi</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>

    <!-- About Section with Watermark Stat Cards -->
    <section class="py-16 md:py-24 bg-surface border-t border-outline-variant/30 relative overflow-hidden" id="about">
      <!-- Subtle ambient circle -->
      <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-container-max mx-auto px-4 md:px-12 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <span class="material-symbols-outlined text-sm">eco</span>
              <span>Mengenal Desa Kami</span>
            </span>
            <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-4">Mengenal Tampirkulon</h2>
            
            <div class="p-5 rounded-2xl bg-surface-container-low/80 border-l-4 border-primary mb-4">
              <p class="font-body-md text-base text-on-surface font-medium leading-relaxed m-0">
                Desa Wisata Tampirkulon menawarkan perpaduan harmonis antara keindahan alam yang asri dan kekayaan budaya lokal yang terus dilestarikan.
              </p>
            </div>

            <p class="font-body-md text-base text-on-surface-variant mb-6 leading-relaxed">
              Dengan keramahan penduduk lokal dan fasilitas yang terus dikembangkan, kami mengundang Anda untuk sejenak melepas penat dan menemukan kedamaian di desa kami.
            </p>
            <a href="#/profil" class="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-container hover:shadow-md transition-all shadow-level-1">
              <span>Baca Selengkapnya</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <!-- Stat 1 -->
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-outline-variant/40 border-l-4 border-l-primary p-6 rounded-2xl text-left shadow-level-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span class="material-symbols-outlined text-6xl text-primary/10 absolute -bottom-2 -right-2 select-none pointer-events-none">aspect_ratio</span>
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1 relative z-10">3.45</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider relative z-10">Km² Luas Wilayah</div>
            </div>

            <!-- Stat 2 -->
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-outline-variant/40 border-l-4 border-l-secondary p-6 rounded-2xl text-left shadow-level-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span class="material-symbols-outlined text-6xl text-secondary/15 absolute -bottom-2 -right-2 select-none pointer-events-none">diversity_3</span>
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1 relative z-10">2.8k</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider relative z-10">Populasi Penduduk</div>
            </div>

            <!-- Stat 3 -->
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-outline-variant/40 border-l-4 border-l-primary p-6 rounded-2xl text-left shadow-level-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span class="material-symbols-outlined text-6xl text-primary/10 absolute -bottom-2 -right-2 select-none pointer-events-none">category</span>
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1 relative z-10">4+</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider relative z-10">Kategori Wisata</div>
            </div>

            <!-- Stat 4 -->
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-outline-variant/40 border-l-4 border-l-secondary p-6 rounded-2xl text-left shadow-level-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span class="material-symbols-outlined text-6xl text-secondary/15 absolute -bottom-2 -right-2 select-none pointer-events-none">verified</span>
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1 relative z-10">100%</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider relative z-10">Kearifan Lokal</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section with Quote Watermarks -->
    <section class="py-16 md:py-24 bg-surface-container-low relative overflow-hidden" id="testimonials">
      <div class="max-w-container-max mx-auto px-4 md:px-12 relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div class="text-center md:text-left">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <span class="material-symbols-outlined text-sm">chat_bubble</span>
              <span>Ulasan & Kesan</span>
            </span>
            <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-2">Kata Mereka</h2>
            <p class="font-body-md text-base text-on-surface-variant m-0">Pengalaman tak terlupakan dari pengunjung kami.</p>
          </div>
          <button id="write-testimonial-btn" class="px-6 py-3.5 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-level-1 hover:shadow-md transition-all flex items-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-sm">rate_review</span>
            <span>Tulis Ulasan & Kesan</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${testimoniList.map(t => `
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-outline-variant/30 shadow-level-1 hover:shadow-xl hover:-translate-y-1.5 hover:border-secondary/50 transition-all duration-300 flex flex-col justify-between group">
              <!-- Watermark Quote Icon -->
              <span class="material-symbols-outlined text-6xl text-primary/10 absolute top-4 right-4 pointer-events-none select-none">format_quote</span>

              <div class="relative z-10">
                <div class="flex text-amber-500 mb-4 text-base tracking-wide drop-shadow-xs">${'★'.repeat(t.rating || 5)}${'☆'.repeat(5 - (t.rating || 5))}</div>
                <p class="font-body-md italic text-on-surface-variant text-sm mb-6 leading-relaxed">
                  "${t.pesan}"
                </p>
              </div>
              <div class="flex items-center gap-3 relative z-10 pt-4 border-t border-outline-variant/20">
                <div class="w-11 h-11 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold shadow-xs">
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

    <!-- Modern Elevated Gradient Glass CTA Banner -->
    <section class="py-16 md:py-20 bg-surface relative overflow-hidden" id="cta-banner">
      <div class="max-w-container-max mx-auto px-4 md:px-12">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123524] via-[#1A452D] to-[#3E7B27] text-white p-10 md:p-16 shadow-2xl border border-white/15 text-center">
          
          <!-- Ambient glowing orbs inside CTA -->
          <div class="w-80 h-80 bg-white/10 rounded-full blur-3xl absolute -top-20 -right-20 pointer-events-none"></div>
          <div class="w-64 h-64 bg-[#85A947]/25 rounded-full blur-2xl absolute -bottom-16 -left-16 pointer-events-none"></div>

          <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#EFE3C2] text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <span class="material-symbols-outlined text-sm">explore</span>
              <span>Petualangan Menanti</span>
            </span>

            <h2 class="font-display-lg text-3xl md:text-5xl font-bold text-white mb-5 drop-shadow-md leading-tight">
              Siap Menjelajahi Keindahan Tampirkulon?
            </h2>
            <p class="font-body-md text-base md:text-lg text-white/90 mb-10 max-w-2xl leading-relaxed">
              Temukan kedamaian, udara segar pegunungan, dan keramahan autentik masyarakat kami. Jadwalkan liburan berkesan Anda sekarang!
            </p>

            <div class="flex flex-wrap gap-4 justify-center">
              <a href="#/kontak" class="inline-flex items-center gap-2.5 bg-[#EFE3C2] text-[#123524] font-bold px-9 py-4 rounded-full hover:bg-white hover:scale-105 hover:shadow-xl transition-all shadow-md">
                <span class="material-symbols-outlined text-xl">calendar_month</span>
                <span>Kontak & Reservasi</span>
              </a>
              <a href="#/paket" class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/25 transition-all shadow-xs">
                <span class="material-symbols-outlined text-xl">package_2</span>
                <span>Lihat Paket Wisata</span>
              </a>
            </div>
          </div>
        </div>
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
