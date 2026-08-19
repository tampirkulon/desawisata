import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { getProfilDesa, formatGoogleMapsEmbed } from '../utils/profile-store.js';
import { IconInstagram, IconYouTube, IconWhatsApp } from '../components/icons.js';
import { t, getLanguage, getLocalizedField } from '../utils/i18n.js';

export const renderProfil = async () => {
  const profil = await getProfilDesa();
  const isEn = getLanguage() === 'en';

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background';

  const defaultHeroBg = profil.banner_url || '/images/hero-tampirkulon.webp';
  const formatInstagramUrl = (handleOrUrl) => {
    if (!handleOrUrl) return '';
    if (handleOrUrl.startsWith('http')) return handleOrUrl;
    return `https://instagram.com/${handleOrUrl.replace(/^@/, '')}`;
  };

  const formatYoutubeUrl = (handleOrUrl) => {
    if (!handleOrUrl) return '';
    if (handleOrUrl.startsWith('http')) return handleOrUrl;
    return `https://youtube.com/${handleOrUrl}`;
  };

  const rawSejarah = getLocalizedField(profil, 'sejarah') || t('profil.hero_subtitle');
  const rawVisi = getLocalizedField(profil, 'visi') || '';
  const rawMisi = getLocalizedField(profil, 'misi') || '';

  const sejarahParagraphs = rawSejarah.split('\n').filter(p => p.trim());
  const misiItems = rawMisi.split('\n').filter(m => m.trim());
  const cleanWhatsapp = profil.whatsapp ? profil.whatsapp.replace(/\D/g, '') : '';
  const namaDesa = profil.nama_desa || 'Desa Wisata Tampirkulon';

  const instagramUrl = formatInstagramUrl(profil.instagram);
  const youtubeUrl = formatYoutubeUrl(profil.youtube);

  const waGreeting = isEn
    ? `Hello ${encodeURIComponent(namaDesa)}, I would like to ask about travel information.`
    : `Halo Pengelola ${encodeURIComponent(namaDesa)}, saya ingin bertanya mengenai kunjungan wisata.`;

  container.innerHTML = `
    ${renderNavbar()}

    <!-- Header Page Section (Static as Original) -->
    <section class="w-full bg-[#123524] relative flex items-center justify-center overflow-hidden text-center text-white px-6 pt-20" style="min-height: 391px; background-image: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${defaultHeroBg}'); background-size: cover; background-position: center;">
      <div class="max-w-container-max mx-auto text-center relative z-10 py-8">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#EFE3C2] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          ${t('profil.hero_badge')}
        </span>
        <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-white mb-4">${t('profil.hero_title')}</h1>
        <p class="text-[#EFE3C2] max-w-2xl mx-auto font-body-md text-base md:text-lg text-white/90">${t('profil.hero_subtitle')}</p>
      </div>
    </section>

    <!-- Main Content Section (Dynamic from Admin Settings) -->
    <section class="max-w-container-max mx-auto px-4 sm:px-6 md:px-12 py-16 flex-grow w-full">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Left Column (60%): Sejarah, Visi, Misi -->
        <div class="lg:w-[60%] flex flex-col gap-10">
          <article class="bg-surface rounded-2xl p-8 border border-outline-variant/40 shadow-level-1">
            <div class="flex items-center gap-3 border-b border-outline-variant/40 pb-4 mb-6">
              <div class="w-10 h-10 rounded-xl bg-[#EFE3C2] text-[#123524] flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-2xl">auto_stories</span>
              </div>
              <div>
                <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-[#123524] m-0">${t('profil.sejarah_title')}</h2>
                <span class="text-xs text-on-surface-variant">${t('profil.sejarah_badge')}</span>
              </div>
            </div>
            <div class="font-body-md text-on-surface-variant leading-relaxed flex flex-col gap-4 text-base">
              ${sejarahParagraphs.map(p => `<p class="m-0">${p}</p>`).join('')}
            </div>
          </article>

          <article>
            <div class="bg-surface-container rounded-2xl p-8 border border-outline-variant/40 shadow-level-1">
              <div class="flex items-center gap-3 border-b border-outline-variant/40 pb-4 mb-6">
                <div class="w-10 h-10 rounded-xl bg-[#85A947]/20 text-[#3E7B27] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-2xl">flag</span>
                </div>
                <div>
                  <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-[#123524] m-0">${t('profil.visi_title')} & ${t('profil.misi_title')}</h2>
                  <span class="text-xs text-on-surface-variant">${t('profil.hero_title')}</span>
                </div>
              </div>

              <div class="mb-8 bg-surface p-6 rounded-xl border border-outline-variant/30">
                <h3 class="font-display-lg text-lg font-bold text-[#123524] mb-2 flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#3E7B27] text-xl">visibility</span>
                  ${t('profil.visi_title')}
                </h3>
                <p class="text-on-surface-variant italic text-base leading-relaxed m-0">"${rawVisi || 'Mewujudkan Desa Wisata Tampirkulon sebagai destinasi berdaya saing tinggi, berkelanjutan, dan berorientasi pada pelestarian alam serta kearifan lokal.'}"</p>
              </div>
              
              <div class="bg-surface p-6 rounded-xl border border-outline-variant/30">
                <h3 class="font-display-lg text-lg font-bold text-[#123524] mb-4 flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#3E7B27] text-xl">task_alt</span>
                  ${t('profil.misi_title')}
                </h3>
                <ul class="list-none flex flex-col gap-3.5 p-0 m-0">
                  ${misiItems.map(item => `
                    <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                      <span class="material-symbols-outlined text-[#3E7B27] text-xl mt-0.5 shrink-0">check_circle</span>
                      <span class="leading-relaxed">${item.replace(/^\d+\.\s*/, '')}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </article>
        </div>

        <!-- Right Column (40%): Sidebar Informasi Desa -->
        <aside class="lg:w-[40%] flex flex-col gap-8">
          <div class="bg-surface rounded-2xl p-8 border border-outline-variant/40 shadow-level-1 relative overflow-hidden">
            <h3 class="font-display-lg text-2xl font-bold text-[#123524] mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#3E7B27]">info</span>
              ${t('profil.geo_title')}
            </h3>
            
            <!-- Google Maps directly at the top of the card -->
            <div class="w-full h-56 rounded-xl mb-6 overflow-hidden border border-outline-variant/30 bg-surface-container flex items-center justify-center text-xs text-slate-400 shadow-2xs">
              ${profil.google_maps_embed 
                ? formatGoogleMapsEmbed(profil.google_maps_embed)
                : `<iframe class="w-full h-full border-0 rounded-xl" src="https://maps.google.com/maps?q=-7.4728,110.2642&z=14&output=embed" allowfullscreen="" loading="lazy"></iframe>`
              }
            </div>

            <!-- Detail List -->
            <ul class="flex flex-col gap-4 list-none p-0 m-0">
              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-[#EFE3C2] text-[#123524] p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">aspect_ratio</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold m-0 mb-0.5">${t('profil.geo_luas')}</p>
                  <p class="font-display-lg text-base font-bold text-[#123524] m-0">${profil.luas_wilayah || '3.45 km²'}</p>
                </div>
              </li>

              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-[#85A947]/20 text-[#3E7B27] p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">diversity_3</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold m-0 mb-0.5">${t('profil.geo_populasi')}</p>
                  <p class="font-display-lg text-base font-bold text-[#123524] m-0">${profil.populasi || '2.850+ Jiwa'}</p>
                </div>
              </li>

              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-[#3E7B27]/15 text-[#123524] p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">schedule</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold m-0 mb-0.5">${t('footer.jam_operasional')}</p>
                  <p class="font-body-md text-sm font-semibold text-[#123524] m-0">${profil.jam_operasional || t('footer.operasional_text')}</p>
                </div>
              </li>

              <li class="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-[#123524] text-white p-2.5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span class="material-symbols-outlined text-xl">home_pin</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold m-0 mb-1">${t('kontak.address_label')}</p>
                  <p class="font-body-sm text-sm text-[#123524] leading-relaxed m-0">${profil.alamat || 'Jl. Raya Candimulyo No. 12, Tampirkulon, Magelang, Jawa Tengah 56191'}</p>
                </div>
              </li>
            </ul>

            <!-- Direct Contact & Solid Color Buttons -->
            <div class="mt-6 pt-6 border-t border-outline-variant/30 flex flex-col gap-3">
              ${cleanWhatsapp ? `
                <a href="https://wa.me/${cleanWhatsapp}?text=${waGreeting}" target="_blank" rel="noopener noreferrer" class="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2.5">
                  ${IconWhatsApp('w-4 h-4 fill-white shrink-0')}
                  <span>${isEn ? `WhatsApp Admin (${profil.whatsapp})` : `Chat WhatsApp Pengelola (${profil.whatsapp})`}</span>
                </a>
              ` : ''}

              <div class="flex items-center gap-3 pt-1">
                ${profil.instagram ? `
                  <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-3 rounded-xl bg-[#E1306C] hover:bg-[#C13584] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2">
                    ${IconInstagram('w-4 h-4 fill-white shrink-0')}
                    <span>Instagram</span>
                  </a>
                ` : ''}
                ${profil.youtube ? `
                  <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-3 rounded-xl bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2">
                    ${IconYouTube('w-4 h-4 fill-white shrink-0')}
                    <span>YouTube</span>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>

    ${renderFooter(profil)}
  `;

  setTimeout(() => initNavbarEvents(), 0);
  return container;
};
