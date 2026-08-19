// Modal pembaca artikel blog publik
import { t, getLanguage, getLocalizedField } from '../utils/i18n.js';

export const openArticleModal = (article) => {
  const existing = document.getElementById('article-detail-modal');
  if (existing) existing.remove();

  const isEn = getLanguage() === 'en';
  const modal = document.createElement('div');
  modal.id = 'article-detail-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in';

  const localizedJudul = getLocalizedField(article, 'judul');
  const localizedRingkasan = getLocalizedField(article, 'ringkasan');
  const localizedKonten = getLocalizedField(article, 'konten');
  const localizedKategori = getLocalizedField(article, 'kategori') || (isEn ? 'Village News' : 'Berita Desa');

  const formattedDate = article.created_at || article.published_at
    ? new Date(article.created_at || article.published_at).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : (isEn ? 'Village News' : 'Kabar Desa');

  modal.innerHTML = `
    <div class="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-level-2 border border-outline-variant/30 flex flex-col relative animate-scale-up">
      <!-- Close Button -->
      <button id="close-article-modal" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all cursor-pointer shadow-md" aria-label="${t('common.close')}">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>

      <!-- Article Header Image -->
      ${article.gambar_url ? `
        <div class="w-full h-64 md:h-80 overflow-hidden relative flex-shrink-0">
          <img src="${article.gambar_url}" alt="${localizedJudul}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
        </div>
      ` : ''}

      <!-- Article Body -->
      <div class="p-6 md:p-10 ${article.gambar_url ? '-mt-12 relative z-10' : ''}">
        <div class="flex items-center gap-3 mb-4 flex-wrap">
          <span class="bg-primary-fixed text-primary px-3 py-1 rounded-full font-label-caps text-xs font-bold uppercase">${localizedKategori}</span>
          <span class="text-on-surface-variant text-xs">${formattedDate}</span>
        </div>

        <h1 class="font-display-lg text-2xl md:text-4xl font-bold text-primary mb-6 leading-tight">${localizedJudul}</h1>

        ${localizedRingkasan ? `
          <p class="font-body-md text-base text-on-surface-variant italic border-l-4 border-primary pl-4 mb-6 leading-relaxed bg-surface-container-lowest py-3 pr-4 rounded-r-xl">${localizedRingkasan}</p>
        ` : ''}

        <div class="prose max-w-none text-on-surface font-body-md text-base leading-relaxed space-y-4">
          ${(localizedKonten || '').split('\n\n').map(p => {
            const clean = p.trim();
            if (!clean) return '';
            if (clean.startsWith('##')) return `<h2 class="text-xl font-bold text-primary mt-6 mb-2">${clean.replace(/^##\s+/, '')}</h2>`;
            if (clean.startsWith('###')) return `<h3 class="text-lg font-bold text-primary mt-4 mb-2">${clean.replace(/^###\s+/, '')}</h3>`;
            if (clean.startsWith('- ')) {
              const items = clean.split('\n').map(li => `<li>${li.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('');
              return `<ul class="list-disc pl-5 space-y-1 mb-4">${items}</ul>`;
            }
            return `<p class="m-0">${clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#close-article-modal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};
