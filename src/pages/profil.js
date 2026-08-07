import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderProfil = async () => {
  let profil = mockData.profil_desa;

  if (isSupabaseConfigured()) {
    try {
      const { data: prof } = await supabase.from('profil_desa').select('*').single();
      if (prof) profil = prof;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background';

  const heroBg = profil.banner_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80&fm=webp';
  const namaDesa = profil.nama_desa || 'Desa Wisata Tampirkulon';
  const tagline = profil.tagline || 'Mengenal lebih dekat warisan budaya, keindahan alam, dan visi pembangunan berkelanjutan di jantung Jawa Tengah.';
  const sejarahParagraphs = (profil.sejarah || 'Desa Tampirkulon memiliki sejarah panjang yang terjalin erat dengan perkembangan peradaban agraris di lereng pegunungan.').split('\n').filter(p => p.trim());
  const misiItems = (profil.misi || 'Melestarikan nilai-nilai budaya lokal.\nMenjaga keseimbangan ekosistem dan kebersihan lingkungan.\nMeningkatkan kesejahteraan ekonomi masyarakat.').split('\n').filter(m => m.trim());

  container.innerHTML = `
    ${renderNavbar()}

    <!-- Header Page Section -->
    <section class="w-full bg-primary relative flex items-center justify-center overflow-hidden text-center text-white px-6 pt-20" style="min-height: 391px; background-image: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('${heroBg}'); background-size: cover; background-position: center;">
      <div class="max-w-container-max mx-auto text-center relative z-10 py-8">
        <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-white mb-4">Profil ${namaDesa}</h1>
        <p class="text-primary-fixed-dim max-w-2xl mx-auto font-body-md text-base md:text-lg text-white/90">${tagline}</p>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="max-w-container-max mx-auto px-4 sm:px-6 md:px-12 py-16 flex-grow w-full">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Left Column (60%) -->
        <div class="lg:w-[60%] flex flex-col gap-10">
          <article>
            <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary mb-4 border-b border-outline-variant/30 pb-3">Sejarah Desa</h2>
            <div class="font-body-md text-on-surface-variant leading-relaxed flex flex-col gap-4 text-base">
              ${sejarahParagraphs.map(p => `<p>${p}</p>`).join('')}
            </div>
          </article>

          <article>
            <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary mb-4 border-b border-outline-variant/30 pb-3">Visi & Misi</h2>
            <div class="bg-surface-container rounded-2xl p-8 border border-outline-variant/30">
              <h3 class="font-display-lg text-xl font-bold text-primary mb-2">Visi</h3>
              <p class="text-on-surface-variant mb-6 italic text-base leading-relaxed">"${profil.visi || 'Menjadi Desa Wisata Mandiri Berbasis Kearifan Lokal dan Kelestarian Alam Bertaraf Internasional.'}"</p>
              
              <h3 class="font-display-lg text-xl font-bold text-primary mb-4">Misi</h3>
              <ul class="list-none flex flex-col gap-3 p-0">
                ${misiItems.map(item => `
                  <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                    <span class="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                    <span>${item.replace(/^[0-9]+[.)]\s*/, '')}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </article>
        </div>

        <!-- Right Column (40%) -->
        <aside class="lg:w-[40%]">
          <div class="bg-surface rounded-2xl p-8 border border-outline-variant/50 shadow-level-1 relative overflow-hidden">
            <h3 class="font-display-lg text-2xl font-bold text-primary mb-6">Informasi Desa</h3>
            
            <div class="w-full h-48 bg-surface-variant rounded-xl mb-6 flex items-center justify-center overflow-hidden relative border border-outline-variant/30">
              <img src="${heroBg}" alt="Foto Profil Desa" class="w-full h-full object-cover opacity-80" />
              <div class="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex flex-col items-center justify-center text-white">
                <span class="material-symbols-outlined text-4xl mb-1 text-tertiary-fixed">location_on</span>
                <span class="font-bold text-xs bg-black/50 px-3 py-1 rounded-full">${namaDesa}</span>
              </div>
            </div>

            <ul class="flex flex-col gap-4 list-none p-0">
              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-primary-fixed text-primary p-2.5 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">aspect_ratio</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold">Luas Wilayah</p>
                  <p class="font-display-lg text-lg font-bold text-primary">${profil.luas_wilayah || '3.45 km²'}</p>
                </div>
              </li>
              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-secondary-container text-secondary p-2.5 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">diversity_3</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold">Populasi</p>
                  <p class="font-display-lg text-lg font-bold text-primary">${profil.populasi || '2.850+ Jiwa'}</p>
                </div>
              </li>
              <li class="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-tertiary-fixed text-primary p-2.5 rounded-full flex items-center justify-center mt-1">
                  <span class="material-symbols-outlined text-xl">home_pin</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold mb-1">Alamat Lengkap</p>
                  <p class="font-body-sm text-sm text-primary leading-relaxed">${profil.alamat || 'Desa Tampirkulon, Kecamatan Candimulyo, Kabupaten Magelang, Jawa Tengah 56191'}</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>

    ${renderFooter(profil)}
  `;

  setTimeout(() => initNavbarEvents(), 0);
  return container;
};
