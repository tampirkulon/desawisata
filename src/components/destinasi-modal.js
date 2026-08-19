// Modal detail destinasi wisata dengan slider foto & tombol pesan langsung
import { t, getLanguage, getLocalizedField } from '../utils/i18n.js';

export const openDestinasiModal = (destinasi) => {
  const existing = document.getElementById('destinasi-detail-modal');
  if (existing) existing.remove();

  const isEn = getLanguage() === 'en';
  const modal = document.createElement('div');
  modal.id = 'destinasi-detail-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in';

  const images = (destinasi.gambar_urls && destinasi.gambar_urls.length > 0)
    ? destinasi.gambar_urls
    : [destinasi.gambar_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'];

  const localizedNama = getLocalizedField(destinasi, 'nama');
  const localizedDesc = getLocalizedField(destinasi, 'deskripsi');
  const localizedLokasi = getLocalizedField(destinasi, 'lokasi');

  let displayTicket = destinasi.harga_tiket || t('common.free');
  if (displayTicket.toLowerCase() === 'gratis' && isEn) {
    displayTicket = t('common.free');
  }

  modal.innerHTML = `
    <div class="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-level-2 border border-outline-variant/30 flex flex-col relative animate-scale-up">
      <!-- Close Button -->
      <button id="close-destinasi-modal" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-md" aria-label="${t('common.close')}">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>

      <!-- Main Image Display -->
      <div class="w-full h-72 md:h-96 relative overflow-hidden bg-black flex-shrink-0">
        <img id="modal-main-img" src="${images[0]}" alt="${localizedNama}" class="w-full h-full object-cover" />
      </div>

      <!-- Thumbnail Strip if > 1 image -->
      ${images.length > 1 ? `
        <div class="flex gap-2 p-3 bg-surface-container-low overflow-x-auto border-b border-outline-variant/20">
          ${images.map((img, idx) => `
            <img src="${img}" class="w-16 h-12 object-cover rounded-lg border-2 border-transparent hover:border-primary cursor-pointer modal-thumb transition-all ${idx === 0 ? 'border-primary' : ''}" data-src="${img}" alt="${localizedNama} thumbnail ${idx + 1}" />
          `).join('')}
        </div>
      ` : ''}

      <!-- Destinasi Info & Meta -->
      <div class="p-6 md:p-8 space-y-6">
        <div>
          <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary mb-3">${localizedNama}</h2>
          <div class="flex items-center gap-4 text-xs text-on-surface-variant flex-wrap">
            <span class="flex items-center gap-1 font-semibold"><span class="material-symbols-outlined text-sm text-primary">location_on</span> ${localizedLokasi || 'Tampirkulon'}</span>
            <span class="flex items-center gap-1 font-semibold"><span class="material-symbols-outlined text-sm text-primary">schedule</span> ${destinasi.jam_buka || '08:00 - 17:00 WIB'}</span>
            <span class="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full"><span class="material-symbols-outlined text-sm">confirmation_number</span> ${displayTicket}</span>
          </div>
        </div>

        <div class="border-t border-outline-variant/20 pt-4">
          <h3 class="font-display-lg text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">${isEn ? 'About Destination' : 'Tentang Destinasi'}</h3>
          <p class="font-body-md text-sm text-on-surface-variant leading-relaxed">${localizedDesc || t('destinasi.hero_subtitle')}</p>
        </div>

        <!-- CTA Action -->
        <div class="pt-4 border-t border-outline-variant/30 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span class="text-xs text-on-surface-variant block font-medium">${isEn ? 'Interested in visiting?' : 'Tertarik berkunjung ke sini?'}</span>
            <span class="font-bold text-sm text-primary">${isEn ? 'Plan your trip today' : 'Rencanakan kunjungan Anda sekarang'}</span>
          </div>
          <a href="#/kontak?destinasi_id=${destinasi.id}" id="book-destinasi-btn" class="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-bold text-xs shadow-level-1 hover:shadow-level-2 transition-all flex items-center gap-2">
            <span>${t('destinasi.modal_btn_book')}</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Bind Thumbnail Clicks
  modal.querySelectorAll('.modal-thumb').forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      const src = e.currentTarget.dataset.src;
      modal.querySelector('#modal-main-img').src = src;
      modal.querySelectorAll('.modal-thumb').forEach(tElem => tElem.classList.remove('border-primary'));
      e.currentTarget.classList.add('border-primary');
    });
  });

  modal.querySelector('#close-destinasi-modal').addEventListener('click', () => modal.remove());
  modal.querySelector('#book-destinasi-btn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};
