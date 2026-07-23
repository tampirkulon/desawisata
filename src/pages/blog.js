import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderBlog = async (queryParams) => {
  const selectedArticleId = queryParams.get('id');

  let artikelList = mockData.artikel;
  let profil = mockData.profil_desa;

  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from('artikel').select('*').eq('status', 'published').order('published_at', { ascending: false });
      if (data && data.length > 0) artikelList = data;

      const { data: prof } = await supabase.from('profil_desa').select('*').single();
      if (prof) profil = prof;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  const container = document.createElement('div');

  if (selectedArticleId) {
    const article = artikelList.find(a => a.id === selectedArticleId) || artikelList[0];
    container.innerHTML = `
      ${renderNavbar()}

      <div style="background: var(--dark-navy); color: #fff; padding: 120px 0 40px;">
        <div class="container" style="max-width: 800px;">
          <a href="#/blog" style="color: var(--accent-gold); font-weight: 500; display: inline-block; margin-bottom: 16px;">← Kembali ke Artikel</a>
          <span class="badge badge-gold" style="display: block; width: fit-content; margin-bottom: 12px;">${article.kategori || 'Berita'}</span>
          <h1 style="color: #fff; font-size: 2.5rem; line-height: 1.3;">${article.judul}</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 12px;">Dipublikasikan: ${new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div class="container section" style="max-width: 800px;">
        ${article.gambar_url ? `<img src="${article.gambar_url}" alt="${article.judul}" style="width: 100%; max-height: 420px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 32px;" />` : ''}
        
        <div class="card" style="padding: 40px; line-height: 1.8; font-size: 1.05rem; color: var(--neutral-800);">
          ${(article.konten || '').split('\n\n').map(p => {
            if (p.startsWith('## ')) return `<h2 style="font-size: 1.6rem; margin: 24px 0 12px; color: var(--primary-500);">${p.replace('## ', '')}</h2>`;
            if (p.startsWith('### ')) return `<h3 style="font-size: 1.3rem; margin: 20px 0 10px; color: var(--neutral-900);">${p.replace('### ', '')}</h3>`;
            return `<p style="margin-bottom: 16px;">${p}</p>`;
          }).join('')}
        </div>
      </div>

      ${renderFooter(profil)}
    `;
  } else {
    const featured = artikelList[0];
    const others = artikelList.slice(1);

    container.innerHTML = `
      ${renderNavbar()}

      <div style="background: var(--dark-navy); color: #fff; padding: 120px 0 50px; text-align: center;">
        <div class="container">
          <h1 style="color: #fff; font-size: 2.5rem; margin-bottom: 12px;">Blog & Berita Desa Tampirkulon</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 1.1rem;">Kabar terbaru, cerita budaya, dan rekomendasi seputar wisata pedesaan.</p>
        </div>
      </div>

      <div class="container section">
        <!-- Featured Article -->
        ${featured ? `
          <div class="card" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; overflow: hidden; margin-bottom: 50px; padding: 0;" class="featured-article-card">
            <div style="height: 100%; min-height: 300px;">
              <img src="${featured.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'}" alt="${featured.judul}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="padding: 36px; display: flex; flex-direction: column; justify-content: center;">
              <span class="badge badge-primary" style="width: fit-content; margin-bottom: 12px;">${featured.kategori || 'Berita Utama'}</span>
              <h2 style="font-size: 1.8rem; margin-bottom: 12px;"><a href="#/blog?id=${featured.id}">${featured.judul}</a></h2>
              <p style="color: var(--neutral-600); margin-bottom: 20px; line-height: 1.6;">${featured.ringkasan || ''}</p>
              <div>
                <a href="#/blog?id=${featured.id}" class="btn btn-primary">Baca Selengkapnya →</a>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Other Articles Grid -->
        <h3 style="font-size: 1.5rem; margin-bottom: 24px;">Artikel Lainnya</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;">
          ${others.map(item => `
            <div class="card">
              <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}" alt="${item.judul}" style="width: 100%; height: 200px; object-fit: cover;" />
              <div style="padding: 24px;">
                <span class="badge badge-primary" style="margin-bottom: 8px;">${item.kategori || 'Artikel'}</span>
                <h3 style="font-size: 1.2rem; margin-bottom: 8px;"><a href="#/blog?id=${item.id}">${item.judul}</a></h3>
                <p style="color: var(--neutral-600); font-size: 0.9rem; margin-bottom: 16px;">${item.ringkasan || ''}</p>
                <a href="#/blog?id=${item.id}" class="btn btn-sm btn-outline">Baca →</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${renderFooter(profil)}
    `;
  }

  setTimeout(() => initNavbarEvents(), 0);
  return container;
};
