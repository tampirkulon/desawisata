import { openArticleModal } from '../components/article-modal.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { renderPagination, initPaginationEvents } from '../components/pagination.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderBlog = async () => {
  let artikelList = mockData.artikel;
  let profil = mockData.profil_desa;

  if (isSupabaseConfigured()) {
    try {
      const { data: art } = await supabase.from('artikel').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (art && art.length > 0) artikelList = art;

      const { data: prof } = await supabase.from('profil_desa').select('*').single();
      if (prof) profil = prof;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  let currentPage = 1;
  const itemsPerPage = 9;

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background pt-20';

  const renderContent = () => {
    const featuredArticle = artikelList[0] || {};
    const recentArticles = artikelList.slice(1);
    const totalRecent = recentArticles.length;
    const totalPages = Math.max(1, Math.ceil(totalRecent / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedArticles = recentArticles.slice(startIndex, startIndex + itemsPerPage);

    return `
      ${renderNavbar(true)}

      <main class="flex-grow max-w-container-max mx-auto px-4 md:px-16 w-full mb-16">
        <!-- Header Title Section -->
        <section class="py-12 text-center max-w-3xl mx-auto">
          <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-4">
            Kisah dari Tampirkulon
          </h1>
          <p class="font-body-md text-base text-on-surface-variant leading-relaxed">
            Temukan cerita, tradisi, dan keindahan alam desa kami melalui catatan perjalanan dan berita terbaru.
          </p>
        </section>

        <!-- Featured Article Hero Banner (Page 1 Only) -->
        ${(featuredArticle.judul && currentPage === 1) ? `
          <section class="mb-16">
            <div class="bg-surface-container-lowest rounded-2xl shadow-level-1 overflow-hidden flex flex-col lg:flex-row group transition-all duration-300 hover:shadow-level-2 border border-outline-variant/30 cursor-pointer read-article-btn" data-id="${featuredArticle.id}">
              <div class="w-full lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                <img src="${featuredArticle.gambar_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'}" alt="${featuredArticle.judul}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out" />
              </div>
              <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-surface">
                <div class="flex items-center gap-3 mb-4">
                  <span class="bg-primary-fixed text-primary px-3 py-1 rounded-full font-label-caps text-xs font-bold uppercase">${featuredArticle.kategori || 'Budaya'}</span>
                  <span class="text-on-surface-variant text-xs font-body-sm">${featuredArticle.created_at ? new Date(featuredArticle.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '15 Oktober 2024'}</span>
                </div>
                <h2 class="font-display-lg text-2xl lg:text-3xl font-bold text-primary mb-4 leading-tight">${featuredArticle.judul}</h2>
                <p class="font-body-md text-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
                  ${featuredArticle.ringkasan || (featuredArticle.konten ? featuredArticle.konten.substring(0, 180) + '...' : '')}
                </p>
                <button class="text-primary font-bold text-sm flex items-center gap-2 hover:text-primary-container transition-colors w-fit bg-transparent border-0 cursor-pointer p-0">
                  Baca Selengkapnya
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>
        ` : ''}

        <!-- Recent Blog Grid Section -->
        <section id="recent-articles">
          <div class="flex justify-between items-end mb-8">
            <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary">Artikel Terbaru</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${paginatedArticles.length === 0 ? `
              <div class="col-span-full text-center py-16 text-on-surface-variant">
                <span class="material-symbols-outlined text-5xl mb-2 text-outline">article</span>
                <p class="font-body-md text-base">Tidak ada artikel tambahan untuk ditampilkan.</p>
              </div>
            ` : paginatedArticles.map(article => `
              <article class="bg-surface-container-lowest rounded-xl shadow-level-1 overflow-hidden hover:shadow-level-2 transition-all duration-300 group flex flex-col h-full border border-outline-variant/30 cursor-pointer read-article-btn" data-id="${article.id}">
                <div class="h-48 overflow-hidden">
                  <img src="${article.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${article.judul}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                </div>
                <div class="p-6 flex flex-col flex-grow bg-surface">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold uppercase">${article.kategori || 'Berita'}</span>
                    <span class="text-on-surface-variant text-xs">${article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '12 Okt 2024'}</span>
                  </div>
                  <h3 class="font-display-lg text-lg font-bold text-primary mb-2 line-clamp-2">${article.judul}</h3>
                  <p class="font-body-sm text-sm text-on-surface-variant line-clamp-3 mb-4 flex-grow leading-relaxed">
                    ${article.ringkasan || (article.konten ? article.konten.substring(0, 110) + '...' : '')}
                  </p>
                </div>
              </article>
            `).join('')}
          </div>

          <!-- Pagination Section -->
          ${renderPagination({
            totalItems: totalRecent,
            itemsPerPage,
            currentPage,
            labelItem: 'Artikel'
          })}
        </section>
      </main>

      ${renderFooter(profil)}
    `;
  };

  container.innerHTML = renderContent();

  const bindEvents = () => {
    initNavbarEvents(true);

    container.querySelectorAll('.read-article-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset('data-id');
        const art = artikelList.find(a => a.id === id);
        if (art) openArticleModal(art);
      });
    });

    initPaginationEvents(container, {
      onPageChange: (newPage) => {
        currentPage = newPage;
        container.innerHTML = renderContent();
        bindEvents();
        const section = container.querySelector('#recent-articles');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  };

  setTimeout(() => bindEvents(), 0);
  return container;
};
