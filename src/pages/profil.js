import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { getProfilDesa } from '../utils/profile-store.js';

export const renderProfil = async () => {
  const profil = await getProfilDesa();

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background';

  const heroBg = profil.banner_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80&fm=webp';
  const namaDesa = profil.nama_desa || 'Desa Wisata Tampirkulon';
  const tagline = profil.tagline || 'Mengenal lebih dekat warisan budaya, keindahan alam, dan visi pembangunan berkelanjutan di jantung Jawa Tengah.';
  const sejarahParagraphs = (profil.sejarah || 'Desa Tampirkulon memiliki sejarah panjang yang terjalin erat dengan perkembangan peradaban agraris di lereng pegunungan.').split('\n').filter(p => p.trim());
  const misiItems = (profil.misi || 'Melestarikan nilai-nilai budaya lokal.\nMenjaga keseimbangan ekosistem dan kebersihan lingkungan.\nMeningkatkan kesejahteraan ekonomi masyarakat.').split('\n').filter(m => m.trim());
  const cleanWhatsapp = profil.whatsapp ? profil.whatsapp.replace(/[^0-9]/g, '') : '';

  container.innerHTML = `
    ${renderNavbar(false, profil)}

    <!-- Header Page Section -->
    <section class="w-full bg-primary relative flex items-center justify-center overflow-hidden text-center text-white px-6 pt-20" style="min-height: 400px; background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${heroBg}'); background-size: cover; background-position: center;">
      <div class="max-w-container-max mx-auto text-center relative z-10 py-12">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30 text-tertiary-fixed">
          <span class="material-symbols-outlined text-sm">nature_people</span>
          <span>Profil Resmi</span>
        </div>
        <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-white mb-4">Profil ${namaDesa}</h1>
        <p class="text-primary-fixed-dim max-w-2xl mx-auto font-body-md text-base md:text-lg text-white/90 leading-relaxed">${tagline}</p>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="max-w-container-max mx-auto px-4 sm:px-6 md:px-12 py-16 flex-grow w-full">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Left Column (60%): Sejarah, Visi, Misi -->
        <div class="lg:w-[60%] flex flex-col gap-10">
          <article class="bg-surface rounded-2xl p-8 border border-outline-variant/30 shadow-level-1">
            <div class="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-6">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-2xl">auto_stories</span>
              </div>
              <div>
                <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary m-0">Sejarah & Latar Belakang</h2>
                <span class="text-xs text-on-surface-variant">Asal usul dan perkembangan desa wisata</span>
              </div>
            </div>
            <div class="font-body-md text-on-surface-variant leading-relaxed flex flex-col gap-4 text-base">
              ${sejarahParagraphs.map(p => `<p class="m-0">${p}</p>`).join('')}
            </div>
          </article>

          <article>
            <div class="bg-surface-container rounded-2xl p-8 border border-outline-variant/30 shadow-level-1">
              <div class="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-6">
                <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-2xl">flag</span>
                </div>
                <div>
                  <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary m-0">Visi & Misi</h2>
                  <span class="text-xs text-on-surface-variant">Arah pembangunan dan pelestarian desa wisata</span>
                </div>
              </div>

              <div class="mb-8 bg-surface p-6 rounded-xl border border-outline-variant/20">
                <h3 class="font-display-lg text-lg font-bold text-primary mb-2 flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-xl">visibility</span>
                  Visi Desa Wisata
                </h3>
                <p class="text-on-surface-variant italic text-base leading-relaxed m-0">"${profil.visi || 'Menjadi Desa Wisata Mandiri Berbasis Kearifan Lokal dan Kelestarian Alam Bertaraf Internasional.'}"</p>
              </div>
              
              <div class="bg-surface p-6 rounded-xl border border-outline-variant/20">
                <h3 class="font-display-lg text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-xl">task_alt</span>
                  Misi Desa Wisata
                </h3>
                <ul class="list-none flex flex-col gap-3.5 p-0 m-0">
                  ${misiItems.map(item => `
                    <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                      <span class="material-symbols-outlined text-primary text-xl mt-0.5 shrink-0">check_circle</span>
                      <span class="leading-relaxed">${item.replace(/^[0-9]+[.)]\s*/, '')}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </article>
        </div>

        <!-- Right Column (40%): Sidebar Informasi, Kontak, & Peta -->
        <aside class="lg:w-[40%] flex flex-col gap-8">
          <!-- Card Identitas & Statistik Desa -->
          <div class="bg-surface rounded-2xl p-8 border border-outline-variant/50 shadow-level-1 relative overflow-hidden">
            <h3 class="font-display-lg text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">info</span>
              Informasi Desa
            </h3>
            
            <!-- Hero Photo Banner inside Card -->
            <div class="w-full h-48 bg-surface-variant rounded-xl mb-6 flex items-center justify-center overflow-hidden relative border border-outline-variant/30 group">
              <img src="${heroBg}" alt="Foto Profil Desa" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-4 text-white">
                ${profil.logo_url ? `
                  <img src="${profil.logo_url}" alt="Logo ${namaDesa}" class="h-12 w-12 object-contain rounded-lg bg-white/90 p-1 mb-2 shadow-md" />
                ` : `
                  <span class="material-symbols-outlined text-3xl mb-1 text-tertiary-fixed">location_on</span>
                `}
                <span class="font-bold text-xs bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">${namaDesa}</span>
              </div>
            </div>

            <!-- Detail List -->
            <ul class="flex flex-col gap-4 list-none p-0 m-0">
              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-primary-fixed text-primary p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">aspect_ratio</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold m-0 mb-0.5">Luas Wilayah</p>
                  <p class="font-display-lg text-base font-bold text-primary m-0">${profil.luas_wilayah || '3.45 km²'}</p>
                </div>
              </li>

              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-secondary-container text-secondary p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">diversity_3</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold m-0 mb-0.5">Populasi Penduduk</p>
                  <p class="font-display-lg text-base font-bold text-primary m-0">${profil.populasi || '2.850+ Jiwa'}</p>
                </div>
              </li>

              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-tertiary-fixed text-primary p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">schedule</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold m-0 mb-0.5">Jam Operasional</p>
                  <p class="font-body-md text-sm font-semibold text-primary m-0">${profil.jam_operasional || 'Senin - Minggu: 08:00 - 17:00 WIB'}</p>
                </div>
              </li>

              <li class="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-primary text-white p-2.5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span class="material-symbols-outlined text-xl">home_pin</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold m-0 mb-1">Alamat Lengkap</p>
                  <p class="font-body-sm text-sm text-primary leading-relaxed m-0">${profil.alamat || 'Jl. Raya Candimulyo No. 12, Tampirkulon, Magelang, Jawa Tengah 56191'}</p>
                </div>
              </li>
            </ul>

            <!-- Direct Contact & Social Row -->
            <div class="mt-6 pt-6 border-t border-outline-variant/30 flex flex-col gap-3">
              ${cleanWhatsapp ? `
                <a href="https://wa.me/${cleanWhatsapp}?text=Halo%20Pengelola%20${encodeURIComponent(namaDesa)},%20saya%20ingin%20bertanya%20mengenai%20kunjungan%20wisata." target="_blank" rel="noopener noreferrer" class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-base">chat</span>
                  Chat WhatsApp Pengelola (${profil.whatsapp})
                </a>
              ` : ''}

              <div class="flex items-center gap-2 pt-2">
                ${profil.instagram ? `
                  <a href="${profil.instagram.startsWith('http') ? profil.instagram : 'https://instagram.com/' + profil.instagram}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs transition-all border border-pink-200 flex items-center justify-center gap-1.5">
                    <span class="material-symbols-outlined text-base">photo_camera</span>
                    Instagram
                  </a>
                ` : ''}
                ${profil.youtube ? `
                  <a href="${profil.youtube.startsWith('http') ? profil.youtube : 'https://youtube.com/' + profil.youtube}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-all border border-red-200 flex items-center justify-center gap-1.5">
                    <span class="material-symbols-outlined text-base">smart_display</span>
                    YouTube
                  </a>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Card Peta Lokasi Google Maps -->
          <div class="bg-surface rounded-2xl p-6 border border-outline-variant/50 shadow-level-1">
            <h4 class="font-display-lg text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">map</span>
              Peta Lokasi Google Maps
            </h4>
            <div class="w-full h-64 rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container flex items-center justify-center text-xs text-slate-400">
              ${profil.google_maps_embed 
                ? (profil.google_maps_embed.includes('<iframe') 
                    ? profil.google_maps_embed.replace('<iframe', '<iframe class="w-full h-full border-0"') 
                    : `<iframe class="w-full h-full border-0" src="${profil.google_maps_embed}" loading="lazy"></iframe>`)
                : `<iframe class="w-full h-full border-0" src="https://maps.google.com/maps?q=-7.4728,110.2642&z=14&output=embed" allowfullscreen="" loading="lazy"></iframe>`
              }
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
