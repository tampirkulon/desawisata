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
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background pt-20';

  container.innerHTML = `
    ${renderNavbar()}

    <!-- Header Page Section -->
    <section class="w-full bg-primary py-16 md:py-24 px-6 relative overflow-hidden text-center text-white" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80'); background-size: cover; background-position: center;">
      <div class="max-w-container-max mx-auto text-center relative z-10">
        <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-white mb-4">Profil Desa Wisata Tampirkulon</h1>
        <p class="text-primary-fixed-dim max-w-2xl mx-auto font-body-md text-base md:text-lg text-white/90">Mengenal lebih dekat warisan budaya, keindahan alam, dan visi pembangunan berkelanjutan di jantung Jawa Tengah.</p>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="max-w-container-max mx-auto px-4 md:px-16 py-16 flex-grow w-full">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Left Column (60%) -->
        <div class="lg:w-[60%] flex flex-col gap-10">
          <article>
            <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary mb-4 border-b border-outline-variant/30 pb-3">Sejarah Desa</h2>
            <div class="font-body-md text-on-surface-variant leading-relaxed flex flex-col gap-4 text-base">
              <p>
                Desa Tampirkulon memiliki sejarah panjang yang terjalin erat dengan perkembangan peradaban agraris di lereng pegunungan. Berawal dari pemukiman kecil yang mengandalkan sumber air alami dan kesuburan tanah vulkanik, desa ini perlahan berkembang menjadi pusat komunitas yang memegang teguh tradisi leluhur.
              </p>
              <p>
                Nama 'Tampirkulon' sendiri diyakini berasal dari alat tradisional penampi beras (tampah/tampir) yang melambangkan kemakmuran dan 'kulon' yang menunjukkan posisi geografis di sebelah barat. Warisan budaya ini dijaga turun-temurun, tercermin dalam arsitektur rumah tua, upacara adat panen, dan semangat gotong royong yang masih kental terasa di setiap sudut desa.
              </p>
              <p>
                Transformasi menjadi Desa Wisata dimulai pada awal dekade 2000-an, didorong oleh inisiatif pemuda lokal yang menyadari potensi alam dan budaya mereka. Dengan pendekatan eko-pariwisata, Tampirkulon kini tidak hanya melestarikan warisannya tetapi juga membagikan keindahannya dengan dunia.
              </p>
            </div>
          </article>

          <article>
            <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary mb-4 border-b border-outline-variant/30 pb-3">Visi & Misi</h2>
            <div class="bg-surface-container rounded-2xl p-8 border border-outline-variant/30">
              <h3 class="font-display-lg text-xl font-bold text-primary mb-2">Visi</h3>
              <p class="text-on-surface-variant mb-6 italic text-base leading-relaxed">"${profil.visi || 'Menjadi Desa Wisata Mandiri Berbasis Kearifan Lokal dan Kelestarian Alam Bertaraf Internasional.'}"</p>
              
              <h3 class="font-display-lg text-xl font-bold text-primary mb-4">Misi</h3>
              <ul class="list-none flex flex-col gap-3 p-0">
                <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                  <span class="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>Melestarikan nilai-nilai budaya dan tradisi lokal sebagai daya tarik utama wisata edukasi.</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                  <span class="material-symbols-outlined text-primary text-xl mt-0.5">eco</span>
                  <span>Menjaga keseimbangan ekosistem dan kebersihan lingkungan melalui pengelolaan tata ruang yang ramah alam.</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                  <span class="material-symbols-outlined text-primary text-xl mt-0.5">group</span>
                  <span>Meningkatkan kesejahteraan ekonomi masyarakat melalui pemberdayaan UMKM lokal dan pengelolaan pariwisata terpadu.</span>
                </li>
              </ul>
            </div>
          </article>
        </div>

        <!-- Right Column (40%) -->
        <aside class="lg:w-[40%]">
          <div class="bg-surface rounded-2xl p-8 border border-outline-variant/50 shadow-level-1 relative overflow-hidden">
            <h3 class="font-display-lg text-2xl font-bold text-primary mb-6">Informasi Desa</h3>
            
            <div class="w-full h-48 bg-surface-variant rounded-xl mb-6 flex items-center justify-center overflow-hidden relative border border-outline-variant/30">
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" alt="Peta Lokasi" class="w-full h-full object-cover opacity-80" />
              <div class="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex flex-col items-center justify-center text-white">
                <span class="material-symbols-outlined text-4xl mb-1 text-tertiary-fixed">location_on</span>
                <span class="font-bold text-xs bg-black/50 px-3 py-1 rounded-full">Tampirkulon, Magelang</span>
              </div>
            </div>

            <ul class="flex flex-col gap-4 list-none p-0">
              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-primary-fixed text-primary p-2.5 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">aspect_ratio</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold">Luas Wilayah</p>
                  <p class="font-display-lg text-lg font-bold text-primary">150+ Hektar</p>
                </div>
              </li>
              <li class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div class="bg-secondary-container text-secondary p-2.5 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">diversity_3</span>
                </div>
                <div>
                  <p class="font-label-caps text-xs text-on-surface-variant uppercase font-bold">Populasi</p>
                  <p class="font-display-lg text-lg font-bold text-primary">2.500+ Jiwa</p>
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
