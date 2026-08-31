import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';
import { getProfilDesa } from '../utils/profile-store.js';
import { t, getLanguage, getLocalizedField } from '../utils/i18n.js';
import { showToast } from '../components/toast.js';

export const renderBlogDetail = async (params) => {
  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background pt-20';

  const isEn = getLanguage() === 'en';
  let profil = await getProfilDesa();
  let artikelList = mockData.artikel;

  // Retrieve all published articles
  if (isSupabaseConfigured()) {
    try {
      const { data: art } = await supabase
        .from('artikel')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (art && art.length > 0) {
        artikelList = art;
      }
    } catch (e) {
      console.warn('Fallback to mock artikel:', e);
    }
  }

  // Find requested article by ID from queryParams
  const articleId = params instanceof URLSearchParams ? params.get('id') : (typeof params === 'object' && params !== null ? params.id : null);
  const article = artikelList.find(a => String(a.id) === String(articleId));

  // 404 Not Found View
  if (!article) {
    container.innerHTML = `
      ${renderNavbar(true)}
      <main class="flex-grow max-w-4xl mx-auto px-4 py-20 w-full text-center flex flex-col items-center justify-center">
        <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
          <span class="material-symbols-outlined text-4xl">article</span>
        </div>
        <h1 class="font-display-lg text-3xl md:text-4xl font-bold text-primary mb-3">
          ${t('blog.not_found_title')}
        </h1>
        <p class="font-body-md text-base text-on-surface-variant max-w-md mb-8">
          ${t('blog.not_found_desc')}
        </p>
        <a href="#/blog" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          ${t('blog.back_to_blog')}
        </a>
      </main>
      ${renderFooter(profil)}
    `;

    setTimeout(() => initNavbarEvents(true), 0);
    return container;
  }

  // Localized fields
  const localizedJudul = getLocalizedField(article, 'judul');
  const localizedRingkasan = getLocalizedField(article, 'ringkasan');
  const localizedKonten = getLocalizedField(article, 'konten') || '';
  const localizedKategori = getLocalizedField(article, 'kategori') || (isEn ? 'Village News' : 'Berita Desa');

  // Format date
  const formattedDate = article.created_at || article.published_at
    ? new Date(article.created_at || article.published_at).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : (isEn ? 'Recent Post' : 'Kabar Terkini');

  // Estimate reading time (approx 180 words per minute)
  const wordCount = (localizedKonten + ' ' + (localizedRingkasan || '')).split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 180));
  const readTimeString = t('blog.read_time', { min: readTimeMin });

  // Related articles (excluding current one)
  const relatedArticles = artikelList.filter(a => String(a.id) !== String(article.id)).slice(0, 3);

  // Markdown Editorial Content Renderer
  const renderMarkdownContent = (rawText) => {
    if (!rawText) return '';

    // Step 1: Pre-process Gallery Blocks (::gallery ... ::)
    let processedText = rawText.replace(/::(?:gallery|grid)\s*([\s\S]*?)\s*::/g, (_match, galleryContent) => {
      const imgMatches = [...galleryContent.matchAll(/!\[(.*?)\]\((.*?)\)/g)];
      if (imgMatches.length > 0) {
        const figuresHtml = imgMatches.map(m => {
          const cap = m[1].trim();
          const url = m[2].trim();
          return `
            <figure class="rounded-2xl overflow-hidden shadow-level-1 border border-outline-variant/30 bg-surface-container-lowest flex flex-col my-0">
              <img src="${url}" alt="${cap}" class="w-full h-48 md:h-60 object-cover" loading="lazy" />
              ${cap ? `<figcaption class="text-center text-xs italic text-on-surface-variant py-2.5 px-3 bg-surface-container-lowest">${cap}</figcaption>` : ''}
            </figure>
          `;
        }).join('');
        return `\n\n__GALLERY_BLOCK__<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">${figuresHtml}</div>__GALLERY_BLOCK__\n\n`;
      }
      return '';
    });

    const paragraphs = processedText.split('\n\n');
    let hasDropCapApplied = false;

    return paragraphs
      .map(paragraph => {
        const clean = paragraph.trim();
        if (!clean) return '';

        // Preserved gallery block
        if (clean.includes('__GALLERY_BLOCK__')) {
          return clean.replaceAll('__GALLERY_BLOCK__', '');
        }

        // Subheading Level 3 (### )
        if (clean.startsWith('### ')) {
          return `<h3 class="font-display-lg text-xl md:text-2xl font-bold text-primary mt-8 mb-3 tracking-tight">${clean.replace(/^###\s+/, '')}</h3>`;
        }

        // Subheading Level 2 (## )
        if (clean.startsWith('## ')) {
          return `<h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary mt-10 mb-4 tracking-tight">${clean.replace(/^##\s+/, '')}</h2>`;
        }

        // Single Image with Caption (![Caption](url))
        const singleImgMatch = clean.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (singleImgMatch) {
          const caption = singleImgMatch[1].trim();
          const imgUrl = singleImgMatch[2].trim();
          return `
            <figure class="my-8 rounded-2xl overflow-hidden shadow-level-1 border border-outline-variant/30 bg-surface-container-lowest not-prose">
              <img src="${imgUrl}" alt="${caption}" class="w-full h-auto max-h-[520px] object-cover" loading="lazy" />
              ${caption ? `<figcaption class="text-center text-xs md:text-sm italic text-on-surface-variant py-3 px-4 bg-surface-container-lowest/90 border-t border-outline-variant/10">${caption}</figcaption>` : ''}
            </figure>
          `;
        }

        // Pull Quote Box / Kutipan Tokoh (> "Kutipan..." \n > — Author)
        if (clean.startsWith('> ')) {
          const quoteLines = clean.split('\n').map(l => l.replace(/^>\s*/, '').trim());
          let author = '';
          const bodyLines = [];

          quoteLines.forEach(l => {
            if (l.startsWith('—') || l.startsWith('--') || l.startsWith('- ')) {
              author = l.replace(/^[-—]+\s*/, '');
            } else {
              bodyLines.push(l);
            }
          });

          const quoteBody = bodyLines.join(' ').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

          return `
            <div class="my-8 p-6 md:p-8 rounded-2xl bg-[#fdfbf7] dark:bg-[#1a221d] border-l-4 border-primary shadow-xs relative not-prose border border-[#e8dfd1]/80 dark:border-outline-variant/30">
              <div class="text-base md:text-lg italic font-serif text-[#334155] dark:text-on-surface leading-relaxed mb-3">
                ${quoteBody.startsWith('"') ? quoteBody : `"${quoteBody}"`}
              </div>
              ${author ? `<div class="text-xs md:text-sm font-bold text-primary tracking-wide font-sans">— ${author}</div>` : ''}
            </div>
          `;
        }

        // Bullet Lists (- Item)
        if (clean.startsWith('- ')) {
          const listItems = clean
            .split('\n')
            .map(li => `<li>${li.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</li>`)
            .join('');
          return `<ul class="list-disc pl-6 space-y-2.5 my-6 leading-relaxed text-on-surface text-base md:text-lg">${listItems}</ul>`;
        }

        // Regular Paragraph with Drop Cap on the first paragraph
        const formattedText = clean
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline hover:text-primary-container">$1</a>');

        if (!hasDropCapApplied && formattedText.length > 30) {
          hasDropCapApplied = true;
          // Extract first letter (excluding any HTML tags)
          const firstLetter = formattedText.charAt(0);
          const restOfText = formattedText.slice(1);

          return `
            <p class="leading-relaxed mb-6 text-on-surface text-base md:text-lg clear-both">
              <span class="float-left text-4xl md:text-5xl font-bold font-display text-primary leading-none mr-3 mt-1 select-none">${firstLetter}</span>${restOfText}
            </p>
          `;
        }

        return `<p class="leading-relaxed mb-6 text-on-surface text-base md:text-lg">${formattedText}</p>`;
      })
      .join('');
  };

  container.innerHTML = `
    ${renderNavbar(true)}

    <main class="flex-grow max-w-container-max mx-auto px-4 md:px-16 w-full mb-20">
      <!-- Breadcrumbs & Navigation -->
      <nav class="py-6 flex items-center justify-between flex-wrap gap-4 text-sm text-on-surface-variant" aria-label="Breadcrumb">
        <ol class="flex items-center gap-2 flex-wrap">
          <li>
            <a href="#/" class="hover:text-primary transition-colors flex items-center gap-1 font-medium">
              <span class="material-symbols-outlined text-base">home</span>
              ${t('nav.beranda')}
            </a>
          </li>
          <li class="flex items-center text-outline">/</li>
          <li>
            <a href="#/blog" class="hover:text-primary transition-colors font-medium">
              ${t('blog.breadcrumb_blog')}
            </a>
          </li>
          <li class="flex items-center text-outline">/</li>
          <li class="text-primary font-bold line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md">
            ${localizedJudul}
          </li>
        </ol>

        <a href="#/blog" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all shadow-xs">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          ${t('blog.back_to_blog')}
        </a>
      </nav>

      <!-- Article Main Card -->
      <article class="max-w-4xl mx-auto bg-surface-container-lowest rounded-3xl shadow-level-1 border border-outline-variant/30 overflow-hidden mb-16">
        <!-- Header Metadata & Title -->
        <header class="p-6 md:p-12 pb-6 md:pb-8 bg-surface">
          <div class="flex items-center gap-3 mb-4 flex-wrap">
            <span class="bg-primary-fixed text-primary px-3.5 py-1 rounded-full font-label-caps text-xs font-bold uppercase tracking-wider">
              ${localizedKategori}
            </span>
            <span class="inline-flex items-center gap-1 text-on-surface-variant text-xs font-body-sm">
              <span class="material-symbols-outlined text-sm">calendar_today</span>
              ${formattedDate}
            </span>
            <span class="inline-flex items-center gap-1 text-on-surface-variant text-xs font-body-sm">
              <span class="material-symbols-outlined text-sm">schedule</span>
              ${readTimeString}
            </span>
          </div>

          <h1 class="font-display-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
            ${localizedJudul}
          </h1>

          ${localizedRingkasan ? `
            <div class="font-body-md text-base md:text-lg text-on-surface-variant italic border-l-4 border-primary pl-4 py-3 bg-surface-container-lowest rounded-r-xl leading-relaxed">
              ${localizedRingkasan}
            </div>
          ` : ''}
        </header>

        <!-- Featured Banner Image (If Available) -->
        ${article.gambar_url ? `
          <div class="w-full max-h-[480px] overflow-hidden relative">
            <img src="${article.gambar_url}" alt="${localizedJudul}" class="w-full h-full object-cover" />
          </div>
        ` : ''}

        <!-- Editorial Article Body Content -->
        <div class="p-6 md:p-12 max-w-none text-on-surface font-body-md leading-relaxed">
          ${renderMarkdownContent(localizedKonten)}
        </div>

        <!-- Editorial Footer: Tags Pills & Share / Bookmark Action Bar -->
        <footer class="p-6 md:p-12 pt-6 border-t border-outline-variant/30 bg-surface flex flex-col sm:flex-row items-center justify-between gap-6 flex-wrap">
          <!-- Tags / Topics Badges -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full bg-[#1b3826] text-[#86efac] text-xs font-bold font-label-caps uppercase tracking-wider">
              ${t('blog.tags_nature')}
            </span>
            <span class="px-3 py-1 rounded-full bg-[#1b3826] text-[#86efac] text-xs font-bold font-label-caps uppercase tracking-wider">
              ${t('blog.tags_hiddengem')}
            </span>
            <span class="px-3 py-1 rounded-full bg-[#1b3826] text-[#86efac] text-xs font-bold font-label-caps uppercase tracking-wider">
              ${localizedKategori}
            </span>
          </div>

          <!-- Actions: Share WhatsApp, Copy Link, Bookmark -->
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">${t('blog.share_article')}:</span>
            
            <a id="share-wa-btn" href="#" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-[#25D366] text-white hover:bg-[#1ebc59] flex items-center justify-center transition-transform hover:scale-105 shadow-xs" title="${t('blog.share_whatsapp')}" aria-label="${t('blog.share_whatsapp')}">
              <span class="material-symbols-outlined text-lg">chat</span>
            </a>

            <button id="copy-article-link-btn" class="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border border-outline-variant/40 shadow-xs" title="${t('blog.copy_link')}" aria-label="${t('blog.copy_link')}">
              <span class="material-symbols-outlined text-lg">link</span>
            </button>

            <button id="bookmark-article-btn" class="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border border-outline-variant/40 shadow-xs" title="${t('blog.bookmark_article')}" aria-label="${t('blog.bookmark_article')}">
              <span class="material-symbols-outlined text-lg" id="bookmark-icon">bookmark_border</span>
            </button>
          </div>
        </footer>
      </article>

      <!-- Related Articles Section -->
      ${relatedArticles.length > 0 ? `
        <section class="max-w-4xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary">${t('blog.related_articles')}</h2>
            <a href="#/blog" class="text-primary font-bold text-xs hover:underline flex items-center gap-1">
              ${t('blog.btn_read_more')}
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${relatedArticles.map(rel => {
              const relJudul = getLocalizedField(rel, 'judul');
              const relKategori = getLocalizedField(rel, 'kategori') || (isEn ? 'News' : 'Berita');
              const relDate = rel.created_at || rel.published_at
                ? new Date(rel.created_at || rel.published_at).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
                : (isEn ? 'Recent' : 'Terkini');

              return `
                <a href="#/blog-detail?id=${rel.id}" class="bg-surface-container-lowest rounded-2xl shadow-level-1 overflow-hidden hover:shadow-level-2 transition-all duration-300 group flex flex-col border border-outline-variant/30 no-underline text-inherit">
                  <div class="h-40 overflow-hidden">
                    <img src="${rel.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${relJudul}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div class="p-5 flex flex-col flex-grow bg-surface">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-label-caps text-[9px] font-bold uppercase">${relKategori}</span>
                      <span class="text-on-surface-variant text-[11px]">${relDate}</span>
                    </div>
                    <h3 class="font-display-lg text-sm font-bold text-primary line-clamp-2 mb-2 group-hover:text-primary-container transition-colors">${relJudul}</h3>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        </section>
      ` : ''}
    </main>

    ${renderFooter(profil)}
  `;

  // Bind interactive events
  const bindEvents = () => {
    initNavbarEvents(true);

    const shareUrl = window.location.href;
    const shareText = encodeURIComponent(`${localizedJudul} - Desa Wisata Tampirkulon\n${shareUrl}`);

    const waBtn = container.querySelector('#share-wa-btn');
    if (waBtn) {
      waBtn.href = `https://api.whatsapp.com/send?text=${shareText}`;
    }

    const copyBtn = container.querySelector('#copy-article-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(shareUrl);
          } else {
            const input = document.createElement('input');
            input.value = shareUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            input.remove();
          }
          showToast(t('blog.copied_toast'), 'success');
        } catch (err) {
          showToast(t('blog.copied_toast'), 'success');
        }
      });
    }

    // Bookmark Toggle Logic
    const bookmarkBtn = container.querySelector('#bookmark-article-btn');
    const bookmarkIcon = container.querySelector('#bookmark-icon');
    if (bookmarkBtn && bookmarkIcon) {
      const storageKey = 'bookmarked_articles';
      const getBookmarks = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
      let bookmarks = getBookmarks();
      const isSaved = bookmarks.includes(String(article.id));

      if (isSaved) {
        bookmarkIcon.innerText = 'bookmark';
        bookmarkIcon.classList.add('text-primary');
      }

      bookmarkBtn.addEventListener('click', () => {
        bookmarks = getBookmarks();
        const index = bookmarks.indexOf(String(article.id));
        if (index === -1) {
          bookmarks.push(String(article.id));
          localStorage.setItem(storageKey, JSON.stringify(bookmarks));
          bookmarkIcon.innerText = 'bookmark';
          bookmarkIcon.classList.add('text-primary');
          showToast(t('blog.bookmarked_toast'), 'success');
        } else {
          bookmarks.splice(index, 1);
          localStorage.setItem(storageKey, JSON.stringify(bookmarks));
          bookmarkIcon.innerText = 'bookmark_border';
          bookmarkIcon.classList.remove('text-primary');
          showToast(t('blog.unbookmarked_toast'), 'info');
        }
      });
    }
  };

  setTimeout(() => bindEvents(), 0);
  return container;
};
