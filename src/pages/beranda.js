import { openDestinasiModal } from '../components/destinasi-modal.js';
import { openTestimoniModal } from '../components/testimoni-modal.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';
import { getProfilDesa } from '../utils/profile-store.js';
import { t, getLanguage, getLocalizedField } from '../utils/i18n.js';

export const renderBeranda = async () => {
  let profil = await getProfilDesa();
  let destinasi = mockData.destinasi;
  let testimoniList = mockData.testimoni;

  if (isSupabaseConfigured()) {
    try {
      const { data: destData } = await supabase.from('destinasi').select('*').eq('is_published', true).eq('is_unggulan', true).limit(3);
      if (destData && destData.length > 0) destinasi = destData;

      const { data: testData } = await supabase
        .from('testimoni')
        .select('*')
        .eq('is_shown', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (testData && testData.length > 0) {
        if (testData.length >= 3) {
          testimoniList = testData;
        } else {
          // Combine approved online testimonials with seed fallback to guarantee a smooth slider experience
          const existingIds = new Set(testData.map(t => t.id));
          const supplementary = mockData.testimoni.filter(m => !existingIds.has(m.id));
          testimoniList = [...testData, ...supplementary].slice(0, 6);
        }
      }
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col';

  const heroBg = profil.banner_url || '/images/hero-tampirkulon.webp';
  const isEn = getLanguage() === 'en';

  container.innerHTML = `
      ${renderNavbar()}

      <!-- Header / Hero Section (Stitch Exact Design + Glassmorphic Accents) -->
      <header class="relative min-h-screen flex items-center justify-center text-center text-white pt-16 pb-20 md:pb-28 overflow-hidden" id="home">
        <div class="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-1000" style="background-image: url('${heroBg}');"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50 z-0"></div>

      <div class="relative z-10 max-w-4xl px-6 -mt-12 md:-mt-20 flex flex-col items-center text-white">

        <span class="bg-secondary/90 backdrop-blur-md text-white border border-white/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          ${t('beranda.hero_badge')}
        </span>
        <h1 class="font-display-lg text-4xl md:text-6xl font-bold mb-3 md:mb-4 leading-tight drop-shadow-lg text-white">
          ${profil.nama_desa || t('beranda.hero_title')}
        </h1>
        <p class="font-body-md text-base md:text-lg text-white/95 mb-7 max-w-2xl leading-normal md:leading-relaxed drop-shadow-sm">
          ${getLocalizedField(profil, 'tagline') || t('beranda.hero_tagline')}
        </p>
        <div class="flex flex-wrap gap-3.5 justify-center">
          <a href="#/destinasi" class="bg-secondary text-white font-bold px-7 py-3 rounded-full hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/30 transition-all transform hover:-translate-y-1 shadow-level-1 inline-flex items-center gap-2">
            <span>${t('beranda.hero_btn_explore')}</span>
            <span class="material-symbols-outlined text-lg">explore</span>
          </a>
          <a href="#/kontak" class="bg-white/15 backdrop-blur-md border border-white/40 text-white font-bold px-7 py-3 rounded-full hover:bg-white/25 transition-all transform hover:-translate-y-1 shadow-sm inline-flex items-center gap-2">
            <span>${t('beranda.hero_btn_contact')}</span>
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
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">${t('beranda.pilar_1_title')}</h3>
            <p class="font-body-sm text-sm text-on-surface-variant leading-relaxed">${t('beranda.pilar_1_desc')}</p>
          </div>

          <div class="group relative bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/80 shadow-level-1 hover:shadow-xl hover:-translate-y-2 hover:border-secondary/60 transition-all duration-300 flex flex-col items-center">
            <span class="absolute top-4 right-4 text-xs font-bold text-primary/30 font-mono">02</span>
            <div class="w-16 h-16 bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/20 text-primary rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span class="material-symbols-outlined text-3xl">festival</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">${t('beranda.pilar_2_title')}</h3>
            <p class="font-body-sm text-sm text-on-surface-variant leading-relaxed">${t('beranda.pilar_2_desc')}</p>
          </div>

          <div class="group relative bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/80 shadow-level-1 hover:shadow-xl hover:-translate-y-2 hover:border-secondary/60 transition-all duration-300 flex flex-col items-center">
            <span class="absolute top-4 right-4 text-xs font-bold text-primary/30 font-mono">03</span>
            <div class="w-16 h-16 bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/20 text-primary rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span class="material-symbols-outlined text-3xl">restaurant</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">${t('beranda.pilar_3_title')}</h3>
            <p class="font-body-sm text-sm text-on-surface-variant leading-relaxed">${t('beranda.pilar_3_desc')}</p>
          </div>

          <div class="group relative bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/80 shadow-level-1 hover:shadow-xl hover:-translate-y-2 hover:border-secondary/60 transition-all duration-300 flex flex-col items-center">
            <span class="absolute top-4 right-4 text-xs font-bold text-primary/30 font-mono">04</span>
            <div class="w-16 h-16 bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/20 text-primary rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span class="material-symbols-outlined text-3xl">home_work</span>
            </div>
            <h3 class="font-display-lg text-xl font-bold text-on-surface mb-2">${t('beranda.pilar_4_title')}</h3>
            <p class="font-body-sm text-sm text-on-surface-variant leading-relaxed">${t('beranda.pilar_4_desc')}</p>
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
            <span>${t('beranda.dest_badge')}</span>
          </span>
          <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-3">${t('beranda.dest_title')}</h2>
          <p class="font-body-md text-base text-on-surface-variant">${t('beranda.dest_subtitle')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${destinasi.map(item => {
            const localizedNama = getLocalizedField(item, 'nama');
            const localizedDesc = getLocalizedField(item, 'deskripsi');
            const localizedLokasi = getLocalizedField(item, 'lokasi');
            let displayTicket = item.harga_tiket || t('common.free');
            if (displayTicket.toLowerCase() === 'gratis' && isEn) {
              displayTicket = t('common.free');
            }

            return `
            <div class="group bg-white/90 backdrop-blur-md rounded-2xl border border-outline-variant/40 overflow-hidden shadow-level-1 hover:shadow-xl hover:-translate-y-1.5 hover:border-secondary/60 transition-all duration-300 flex flex-col cursor-pointer beranda-destinasi-card" data-id="${item.id}">
              <div class="relative h-56 overflow-hidden bg-surface-container-low">
                <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${localizedNama}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                <span class="absolute top-4 right-4 bg-[#123524]/85 backdrop-blur-md text-[#EFE3C2] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-white/20 shadow-md">
                  ${displayTicket}
                </span>
              </div>
              <div class="p-6 flex flex-col flex-grow">
                <h3 class="font-display-lg text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">${localizedNama}</h3>
                <p class="font-body-sm text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed line-clamp-3">
                  ${localizedDesc || t('destinasi.hero_subtitle')}
                </p>
                <div class="mt-auto flex justify-between items-center pt-4 border-t border-outline-variant/10">
                  <span class="text-xs text-on-surface-variant flex items-center gap-1 font-semibold">
                    <span class="material-symbols-outlined text-sm text-primary">location_on</span>
                    ${localizedLokasi || 'Tampirkulon'}
                  </span>
                  <button class="detail-btn w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary hover:bg-secondary hover:text-on-secondary transition-colors duration-300 pointer-events-none" data-id="${item.id}" aria-label="${t('common.view_detail')}">
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          `;
          }).join('')}
        </div>

        <div class="text-center mt-12">
          <a href="#/destinasi" class="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-primary-container hover:shadow-lg hover:shadow-primary/25 transition-all shadow-level-1">
            <span>${t('beranda.dest_btn_all')}</span>
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
              <span>${t('beranda.about_badge')}</span>
            </span>
            <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-4">${t('beranda.about_title')}</h2>
            
            <div class="p-5 rounded-2xl bg-surface-container-low/80 border-l-4 border-primary mb-4">
              <p class="font-body-md text-base text-on-surface font-medium leading-relaxed m-0">
                ${t('beranda.about_quote')}
              </p>
            </div>

            <p class="font-body-md text-base text-on-surface-variant mb-6 leading-relaxed">
              ${t('beranda.about_desc')}
            </p>
            <a href="#/profil" class="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-container hover:shadow-md transition-all shadow-level-1">
              <span>${t('beranda.about_btn')}</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <!-- Stat 1 -->
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-outline-variant/40 border-l-4 border-l-primary p-6 rounded-2xl text-left shadow-level-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span class="material-symbols-outlined text-6xl text-primary/10 absolute -bottom-2 -right-2 select-none pointer-events-none">aspect_ratio</span>
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1 relative z-10">${profil.luas_wilayah || '3.45'}</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider relative z-10">${t('beranda.stat_area')}</div>
            </div>

            <!-- Stat 2 -->
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-outline-variant/40 border-l-4 border-l-secondary p-6 rounded-2xl text-left shadow-level-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span class="material-symbols-outlined text-6xl text-secondary/15 absolute -bottom-2 -right-2 select-none pointer-events-none">diversity_3</span>
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1 relative z-10">${profil.populasi || '2.8k'}</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider relative z-10">${t('beranda.stat_population')}</div>
            </div>

            <!-- Stat 3 -->
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-outline-variant/40 border-l-4 border-l-primary p-6 rounded-2xl text-left shadow-level-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span class="material-symbols-outlined text-6xl text-primary/10 absolute -bottom-2 -right-2 select-none pointer-events-none">category</span>
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1 relative z-10">4+</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider relative z-10">${t('beranda.stat_categories')}</div>
            </div>

            <!-- Stat 4 -->
            <div class="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-outline-variant/40 border-l-4 border-l-secondary p-6 rounded-2xl text-left shadow-level-1 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span class="material-symbols-outlined text-6xl text-secondary/15 absolute -bottom-2 -right-2 select-none pointer-events-none">verified</span>
              <div class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-1 relative z-10">100%</div>
              <div class="font-body-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider relative z-10">${t('beranda.stat_wisdom')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section with Interactive Carousel Slider -->
    <section class="py-16 md:py-24 bg-surface-container-low relative overflow-hidden" id="testimonials">
      <div class="max-w-container-max mx-auto px-4 md:px-12 relative z-10">
        <!-- Section Header with Actions & Slider Controls -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div class="text-center md:text-left">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <span class="material-symbols-outlined text-sm">chat_bubble</span>
              <span>${t('beranda.testi_badge')}</span>
            </span>
            <h2 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-2">${t('beranda.testi_title')}</h2>
            <p class="font-body-md text-base text-on-surface-variant m-0">${t('beranda.testi_subtitle')}</p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Navigation Arrows for Slider -->
            <div class="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-outline-variant/30 shadow-2xs">
              <button id="testimonial-prev-btn" class="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-secondary-container transition-all cursor-pointer" title="${t('common.prev')}">
                <span class="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button id="testimonial-next-btn" class="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-secondary-container transition-all cursor-pointer" title="${t('common.next')}">
                <span class="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>

            <!-- Write Review Button -->
            <button id="write-testimonial-btn" class="px-5 py-3 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-level-1 hover:shadow-md transition-all flex items-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-sm">rate_review</span>
              <span class="hidden sm:inline">${t('beranda.testi_btn_write')}</span>
              <span class="sm:hidden">${t('beranda.testi_btn_write_short')}</span>
            </button>
          </div>
        </div>

        <!-- Carousel Track Container -->
        <div 
          id="testimonial-slider-track"
          class="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 -mx-4 px-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          ${testimoniList.map((tItem, idx) => {
            const localizedPesan = getLocalizedField(tItem, 'pesan');
            const localizedAsal = getLocalizedField(tItem, 'asal') || (isEn ? 'Visitor' : 'Pengunjung');

            return `
            <div 
              class="testimonial-slide-card w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 snap-start relative overflow-hidden bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-outline-variant/30 shadow-level-1 hover:shadow-xl hover:-translate-y-1.5 hover:border-secondary/50 transition-all duration-300 flex flex-col justify-between group select-none"
              data-index="${idx}"
            >
              <!-- Watermark Quote Icon -->
              <span class="material-symbols-outlined text-6xl text-primary/10 absolute top-4 right-4 pointer-events-none select-none">format_quote</span>

              <div class="relative z-10">
                <div class="flex text-amber-500 mb-4 text-base tracking-wide drop-shadow-xs">${'★'.repeat(tItem.rating || 5)}${'☆'.repeat(5 - (tItem.rating || 5))}</div>
                <p class="font-body-md italic text-on-surface-variant text-sm mb-6 leading-relaxed line-clamp-4" title="${localizedPesan}">
                  "${localizedPesan}"
                </p>
              </div>
              <div class="flex items-center gap-3 relative z-10 pt-4 border-t border-outline-variant/20">
                <div class="w-11 h-11 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold shadow-xs shrink-0">
                  ${(tItem.nama || 'A').charAt(0).toUpperCase()}
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="font-bold text-sm text-on-surface truncate">${tItem.nama}</h4>
                  <span class="text-xs text-on-surface-variant truncate block">${localizedAsal}</span>
                </div>
              </div>
            </div>
          `;
          }).join('')}
        </div>

        <!-- Dots Indicator -->
        <div id="testimonial-dots-container" class="flex items-center justify-center gap-2 mt-6">
          ${testimoniList.map((_, idx) => `
            <button 
              class="testimonial-dot h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === 0 ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/60 hover:bg-primary/50'}"
              data-index="${idx}"
              title="Slide ${idx + 1}"
            ></button>
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
              <span>${t('beranda.cta_badge')}</span>
            </span>

            <h2 class="font-display-lg text-3xl md:text-5xl font-bold text-white mb-5 drop-shadow-md leading-tight">
              ${t('beranda.cta_title')}
            </h2>
            <p class="font-body-md text-base md:text-lg text-white/90 mb-10 max-w-2xl leading-relaxed">
              ${t('beranda.cta_desc')}
            </p>

            <div class="flex flex-wrap gap-4 justify-center">
              <a href="#/kontak" class="inline-flex items-center gap-2.5 bg-[#EFE3C2] text-[#123524] font-bold px-9 py-4 rounded-full hover:bg-white hover:scale-105 hover:shadow-xl transition-all shadow-md">
                <span class="material-symbols-outlined text-xl">calendar_month</span>
                <span>${t('beranda.cta_btn_contact')}</span>
              </a>
              <a href="#/paket" class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/25 transition-all shadow-xs">
                <span class="material-symbols-outlined text-xl">package_2</span>
                <span>${t('beranda.cta_btn_package')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${renderFooter(profil)}
  `;

  const handleDestinasiClick = (e) => {
    const id = e.currentTarget.dataset.id;
    const item = destinasi.find(d => String(d.id) === String(id));

    if (item) {
      openDestinasiModal(item);
    }
  };

  const bindDestinasiCards = () => {
    container.querySelectorAll('.beranda-destinasi-card').forEach(card => {
      card.addEventListener('click', handleDestinasiClick);
    });
  };

  setTimeout(() => {
    initNavbarEvents();

    // Testimonial Modal
    container.querySelector('#write-testimonial-btn')?.addEventListener('click', () => {
      openTestimoniModal();
    });

    bindDestinasiCards();

    // Testimonial Slider Carousel Logic
    const track = container.querySelector('#testimonial-slider-track');
    const prevBtn = container.querySelector('#testimonial-prev-btn');
    const nextBtn = container.querySelector('#testimonial-next-btn');
    const dotsContainer = container.querySelector('#testimonial-dots-container');

    if (track && prevBtn && nextBtn) {
      const getCardStep = () => {
        const firstCard = track.querySelector('.testimonial-slide-card');
        return firstCard ? firstCard.offsetWidth + 24 : 360;
      };

      const scrollNext = () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 16) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: getCardStep(), behavior: 'smooth' });
        }
      };

      const scrollPrev = () => {
        if (track.scrollLeft <= 16) {
          track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
        }
      };

      nextBtn.addEventListener('click', scrollNext);
      prevBtn.addEventListener('click', scrollPrev);

      // Dot click navigation
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.testimonial-dot').forEach(dot => {
          dot.addEventListener('click', (e) => {
            const idx = Number.parseInt(e.currentTarget.dataset.index, 10) || 0;
            const targetCard = track.querySelector(`.testimonial-slide-card[data-index="${idx}"]`);
            if (targetCard) {
              targetCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            }
          });
        });
      }

      // Auto Slide timer
      let autoSlideTimer = null;
      const startAutoSlide = () => {
        if (testimoniList.length > 1) {
          stopAutoSlide();
          autoSlideTimer = setInterval(() => {
            scrollNext();
          }, 5000);
        }
      };

      const stopAutoSlide = () => {
        if (autoSlideTimer) {
          clearInterval(autoSlideTimer);
          autoSlideTimer = null;
        }
      };

      track.addEventListener('mouseenter', stopAutoSlide);
      track.addEventListener('mouseleave', startAutoSlide);
      track.addEventListener('touchstart', stopAutoSlide, { passive: true });
      track.addEventListener('touchend', startAutoSlide, { passive: true });

      // Sync active state on scroll
      const updateSliderUI = () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const hasOverflow = maxScroll > 10;

        if (!hasOverflow) {
          prevBtn.classList.add('opacity-40', 'cursor-not-allowed');
          nextBtn.classList.add('opacity-40', 'cursor-not-allowed');
        } else {
          prevBtn.classList.remove('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
          nextBtn.classList.remove('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
        }

        if (dotsContainer) {
          const step = getCardStep() || 1;
          const activeIndex = Math.min(
            testimoniList.length - 1,
            Math.max(0, Math.round(track.scrollLeft / step))
          );

          dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, idx) => {
            const isActive = idx === activeIndex;
            dot.className = `testimonial-dot h-2 rounded-full transition-all duration-300 cursor-pointer ${
              isActive ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/60 hover:bg-primary/50'
            }`;
          });
        }
      };

      track.addEventListener('scroll', updateSliderUI, { passive: true });
      window.addEventListener('resize', updateSliderUI, { passive: true });

      // Execute initial measurement safely across render frames
      requestAnimationFrame(updateSliderUI);
      setTimeout(updateSliderUI, 100);
      setTimeout(updateSliderUI, 500);
      startAutoSlide();
    }
  }, 0);

  return container;
};
