import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { showToast } from './toast.js';
import { mockData } from '../data/seed.js';
import { t, getLanguage } from '../utils/i18n.js';

export const openTestimoniModal = () => {
  const existing = document.getElementById('testimoni-modal');
  if (existing) existing.remove();

  const isEn = getLanguage() === 'en';
  const modal = document.createElement('div');
  modal.id = 'testimoni-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in';

  let selectedRating = 5;

  modal.innerHTML = `
    <div class="bg-surface rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-level-2 border border-outline-variant/30 flex flex-col relative animate-scale-up">
      <!-- Close Button -->
      <button id="close-testimoni-modal" class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all cursor-pointer" aria-label="${t('common.close')}">
        <span class="material-symbols-outlined text-lg">close</span>
      </button>

      <div class="mb-6">
        <h2 class="font-display-lg text-2xl font-bold text-primary mb-1">${t('testimoni_modal.modal_title')}</h2>
        <p class="font-body-sm text-xs text-on-surface-variant">${t('testimoni_modal.modal_subtitle')}</p>
      </div>

      <form id="testimoni-form" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant mb-1" for="test-nama">${t('testimoni_modal.label_name')} *</label>
            <input id="test-nama" type="text" class="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="${isEn ? 'John Doe' : 'Budi Santoso'}" required />
          </div>
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant mb-1" for="test-asal">${t('testimoni_modal.label_origin')} *</label>
            <input id="test-asal" type="text" class="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="${t('testimoni_modal.placeholder_origin')}" required />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-on-surface-variant mb-1">${t('testimoni_modal.label_rating')} *</label>
          <div class="flex items-center gap-2 cursor-pointer" id="star-rating-container">
            ${[1, 2, 3, 4, 5].map(star => `
              <span class="star-btn material-symbols-outlined text-2xl text-amber-500 hover:scale-110 transition-transform" data-star="${star}">star</span>
            `).join('')}
            <span id="star-label" class="text-xs font-bold text-slate-700 ml-2">${isEn ? '5 / 5 Excellent' : '5 / 5 Sangat Puas'}</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-on-surface-variant mb-1" for="test-pesan">${t('testimoni_modal.label_message')} *</label>
          <textarea id="test-pesan" rows="4" class="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="${t('testimoni_modal.placeholder_message')}" required></textarea>
        </div>

        <div class="pt-3 border-t border-outline-variant/30 flex justify-end gap-3">
          <button type="button" id="cancel-testimoni-btn" class="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">${t('common.cancel')}</button>
          <button type="submit" id="submit-testimoni-btn" class="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-level-1 transition-all flex items-center gap-1.5 cursor-pointer">
            <span>${t('testimoni_modal.btn_submit')}</span>
            <span class="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Star Rating Click Logic
  const stars = modal.querySelectorAll('.star-btn');
  const starLabel = modal.querySelector('#star-label');

  const updateStars = (rating) => {
    selectedRating = rating;
    stars.forEach(star => {
      const val = Number.parseInt(star.dataset.star, 10);
      if (val <= rating) {
        star.classList.add('text-amber-500');
        star.classList.remove('text-slate-300');
      } else {
        star.classList.remove('text-amber-500');
        star.classList.add('text-slate-300');
      }
    });

    const labelsId = { 1: '1 / 5 Sangat Kurang', 2: '2 / 5 Kurang', 3: '3 / 5 Cukup', 4: '4 / 5 Puas', 5: '5 / 5 Sangat Puas' };
    const labelsEn = { 1: '1 / 5 Very Poor', 2: '2 / 5 Poor', 3: '3 / 5 Fair', 4: '4 / 5 Good', 5: '5 / 5 Excellent' };
    const labels = isEn ? labelsEn : labelsId;
    starLabel.innerText = labels[rating] || `${rating} / 5`;
  };

  stars.forEach(star => {
    star.addEventListener('click', (e) => {
      const val = Number.parseInt(e.currentTarget.dataset.star, 10);
      updateStars(val);
    });
  });

  const form = modal.querySelector('#testimoni-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = modal.querySelector('#submit-testimoni-btn');
    submitBtn.disabled = true;
    submitBtn.innerText = isEn ? 'Submitting...' : 'Mengirim...';

    const nama = modal.querySelector('#test-nama').value.trim();
    const asal = modal.querySelector('#test-asal').value.trim();
    const pesan = modal.querySelector('#test-pesan').value.trim();

    const payload = {
      nama,
      asal,
      pesan,
      rating: selectedRating,
      is_shown: false
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('testimoni').insert([payload]);
        if (error) throw error;
        showToast(t('testimoni_modal.success_toast'), 'success');
      } catch (err) {
        showToast((isEn ? '❌ Failed to submit review: ' : '❌ Gagal mengirim ulasan: ') + err.message, 'error');
      }
    } else {
      mockData.testimoni.push({ id: 'test-' + Date.now(), ...payload });
      showToast(isEn ? '✅ Review submitted successfully (Demo Mode)!' : '✅ Ulasan berhasil dikirim (Mode Demo)!', 'success');
    }

    modal.remove();
  });

  modal.querySelector('#close-testimoni-modal').addEventListener('click', () => modal.remove());
  modal.querySelector('#cancel-testimoni-btn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};
