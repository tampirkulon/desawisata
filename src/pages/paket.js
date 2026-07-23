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
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background pt-20';

  container.innerHTML = `
    ${renderNavbar()}

    <main class="flex-grow w-full max-w-container-max mx-auto px-5 md:px-lg py-xl flex flex-col items-center">
      <!-- Header Section -->
      <header class="text-center max-w-2xl mb-xl mt-6">
        <h1 class="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-sm">
          Pilih Paket Liburan Anda
        </h1>
        <p class="font-body-md text-body-md text-on-surface-variant">
          Temukan pengalaman wisata desa yang otentik. Dari eksplorasi alam hingga lokakarya budaya, kami memiliki paket yang dirancang khusus untuk menciptakan memori tak terlupakan.
        </p>
      </header>

      <!-- Pricing Cards Container -->
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        ${paketList.map((paket, index) => `
          <article class="bg-surface rounded-xl shadow-level-1 border ${index === 1 ? 'border-2 border-tertiary-fixed shadow-level-2 transform md:-translate-y-2' : 'border-surface-variant'} p-6 flex flex-col relative">
            
            ${index === 1 ? `
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary-fixed text-primary px-3 py-1 rounded-full font-label-caps text-xs flex items-center gap-1 shadow-sm font-bold">
                <span class="material-symbols-outlined text-[14px]">star</span>
                POPULER
              </div>
            ` : ''}

            <div class="-mx-6 -mt-6 mb-6 h-48 overflow-hidden rounded-t-xl">
              <img src="${paket.gambar_url || (index === 0 ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' : index === 1 ? 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80')}" alt="${paket.nama}" class="w-full h-full object-cover" />
            </div>

            <div class="mb-4">
              <h2 class="font-display-lg text-xl font-bold text-primary mb-2">${paket.nama}</h2>
              <div class="flex items-baseline gap-1">
                <span class="font-display-lg text-2xl md:text-3xl font-bold text-primary">${formatRupiah(paket.harga)}</span>
                <span class="font-body-sm text-xs text-on-surface-variant">/ pax</span>
              </div>
            </div>

            <div class="flex gap-4 mb-6 border-y border-outline-variant/20 py-3 text-xs text-on-surface-variant">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-primary">schedule</span>
                <span>${paket.durasi || '1 Hari'}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-primary">group</span>
                <span>Min. ${paket.kapasitas_min || 2} Orang</span>
              </div>
            </div>

            <ul class="flex flex-col gap-3 mb-8 flex-grow list-none p-0">
              ${(paket.fasilitas || []).map(f => `
                <li class="flex items-start gap-2 text-sm text-on-background">
                  <span class="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>

            <a href="#/kontak?paket_id=${paket.id}" class="w-full text-center ${index === 1 ? 'bg-tertiary-fixed text-primary font-bold hover:bg-tertiary-fixed-dim' : 'bg-primary text-on-primary font-semibold hover:bg-primary-container'} py-3 rounded-lg transition-colors mt-auto shadow-level-1">
              Pesan Sekarang
            </a>
          </article>
        `).join('')}
      </div>
    </main>

    ${renderFooter(profil)}
  `;

  setTimeout(() => initNavbarEvents(), 0);
  return container;
};
