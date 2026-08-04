# Admin-Public Connection — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect public pages and admin pages bidirectionally with detail viewer modals, prefilled direct booking, live admin notification badges, visitor testimonial submission with admin moderation, and a floating admin toolbar.

**Architecture:** Modals for public detail viewing (`article-modal`, `destinasi-modal`, `testimoni-modal`), dynamic prefill logic in `kontak.js`, live unread count queries in `header.js` for admin notifications, active session check for floating `admin-bar.js` on public pages.

**Tech Stack:** Vanilla JS, Vite, HSL & Vanilla CSS, @supabase/supabase-js

## Global Constraints

- Database ref: `lmnaeavawmdqnxejosle`
- All public detail modals must load data cleanly without full page reloads
- Testimonial submission inserts `is_shown = false` by default
- Floating admin bar only appears when `auth.getSession()` returns a valid Supabase session
- Build must remain 100% error-free (`npm run build`)

---

### Task 1: Public Content Detail Viewers (Artikel & Destinasi Modals)

**Files:**
- Create: `src/components/article-modal.js`
- Create: `src/components/destinasi-modal.js`
- Modify: `src/pages/blog.js`
- Modify: `src/pages/destinasi.js`
- Modify: `src/pages/beranda.js`

**Interfaces:**
- `openArticleModal(article)`: Renders & opens a reader modal for full article
- `openDestinasiModal(destinasi)`: Renders & opens detail modal with photo gallery slider & direct booking CTA button

- [ ] **Step 1: Create `src/components/article-modal.js`**

```javascript
// Modal overlay and container for full article reader
export const openArticleModal = (article) => {
  const existing = document.getElementById('article-detail-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'article-detail-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in';

  const formattedDate = article.created_at || article.published_at
    ? new Date(article.created_at || article.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Kabar Desa';

  modal.innerHTML = `
    <div class="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-level-2 border border-outline-variant/30 flex flex-col relative animate-scale-up">
      <!-- Close Button -->
      <button id="close-article-modal" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all cursor-pointer">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>

      <!-- Article Header Image -->
      ${article.gambar_url ? `
        <div class="w-full h-64 md:h-80 overflow-hidden relative">
          <img src="${article.gambar_url}" alt="${article.judul}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
        </div>
      ` : ''}

      <!-- Article Body -->
      <div class="p-6 md:p-10 ${article.gambar_url ? '-mt-12 relative z-10' : ''}">
        <div class="flex items-center gap-3 mb-4 flex-wrap">
          <span class="bg-primary-fixed text-primary px-3 py-1 rounded-full font-label-caps text-xs font-bold uppercase">${article.kategori || 'Berita Desa'}</span>
          <span class="text-on-surface-variant text-xs">${formattedDate}</span>
        </div>

        <h1 class="font-display-lg text-2xl md:text-4xl font-bold text-primary mb-6 leading-tight">${article.judul}</h1>

        ${article.ringkasan ? `
          <p class="font-body-md text-base text-on-surface-variant italic border-l-4 border-primary pl-4 mb-6 leading-relaxed bg-surface-container-lowest py-3 pr-4 rounded-r-xl">${article.ringkasan}</p>
        ` : ''}

        <div class="prose max-w-none text-on-surface font-body-md text-base leading-relaxed space-y-4">
          ${(article.konten || '').split('\n\n').map(p => `<p class="m-0">${p.replace(/^##\s+/, '<h2 class="text-xl font-bold text-primary mt-6 mb-2">').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`).join('')}
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
```

- [ ] **Step 2: Create `src/components/destinasi-modal.js`**

```javascript
// Modal for Destinasi detail view with image slider & booking button
export const openDestinasiModal = (destinasi) => {
  const existing = document.getElementById('destinasi-detail-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'destinasi-detail-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in';

  const images = (destinasi.gambar_urls && destinasi.gambar_urls.length > 0)
    ? destinasi.gambar_urls
    : [destinasi.gambar_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'];

  modal.innerHTML = `
    <div class="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-level-2 border border-outline-variant/30 flex flex-col relative animate-scale-up">
      <!-- Close Button -->
      <button id="close-destinasi-modal" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>

      <!-- Main Image Display -->
      <div class="w-full h-72 md:h-96 relative overflow-hidden bg-black">
        <img id="modal-main-img" src="${images[0]}" alt="${destinasi.nama}" class="w-full h-full object-cover" />
      </div>

      <!-- Thumbnail Strip if > 1 image -->
      ${images.length > 1 ? `
        <div class="flex gap-2 p-3 bg-surface-container-low overflow-x-auto">
          ${images.map((img, idx) => `
            <img src="${img}" class="w-16 h-12 object-cover rounded-lg border-2 border-transparent hover:border-primary cursor-pointer modal-thumb ${idx === 0 ? 'border-primary' : ''}" data-src="${img}" />
          `).join('')}
        </div>
      ` : ''}

      <!-- Destinasi Info & Meta -->
      <div class="p-6 md:p-8 space-y-6">
        <div>
          <h2 class="font-display-lg text-2xl md:text-3xl font-bold text-primary mb-2">${destinasi.nama}</h2>
          <div class="flex items-center gap-4 text-xs text-on-surface-variant flex-wrap">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-primary">location_on</span> ${destinasi.lokasi || 'Tampirkulon'}</span>
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-primary">schedule</span> ${destinasi.jam_buka || '08:00 - 17:00 WIB'}</span>
            <span class="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full"><span class="material-symbols-outlined text-sm">confirmation_number</span> ${destinasi.harga_tiket || 'Gratis'}</span>
          </div>
        </div>

        <p class="font-body-md text-sm text-on-surface-variant leading-relaxed">${destinasi.deskripsi || ''}</p>

        <!-- CTA Action -->
        <div class="pt-4 border-t border-outline-variant/30 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span class="text-xs text-on-surface-variant block">Tertarik berkunjung ke sini?</span>
            <span class="font-bold text-sm text-primary">Rencanakan kunjungan Anda sekarang</span>
          </div>
          <a href="#/kontak?destinasi_id=${destinasi.id}" id="book-destinasi-btn" class="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-bold text-xs shadow-level-1 transition-all flex items-center gap-2">
            <span>Pesan Kunjungan Ini</span>
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
      const src = e.currentTarget.getAttribute('data-src');
      modal.querySelector('#modal-main-img').src = src;
      modal.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('border-primary'));
      e.currentTarget.classList.add('border-primary');
    });
  });

  modal.querySelector('#close-destinasi-modal').addEventListener('click', () => modal.remove());
  modal.querySelector('#book-destinasi-btn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};
```

- [ ] **Step 3: Connect modals in `src/pages/blog.js`, `src/pages/destinasi.js`, and `src/pages/beranda.js`**

Bind click listeners on article and destinasi cards so clicking them calls `openArticleModal` and `openDestinasiModal`.

- [ ] **Step 4: Run build to verify**

Run: `npm run build` — Expected: clean build.

---

### Task 2: Enhanced Direct Booking Flow & Live Admin Header Notification

**Files:**
- Modify: `src/pages/kontak.js`
- Modify: `src/admin/components/header.js`

**Interfaces:**
- `kontak.js`: Parse both `paket_id` AND `destinasi_id` from URL. Prefill target item in notes field or dropdown.
- `renderAdminHeader()`: Async check of `reservasi` with `status = 'baru'` to update the notification bell badge with exact unread count.

- [ ] **Step 1: Update `src/pages/kontak.js` query param parsing**

Read `destinasi_id` alongside `paket_id`. If `destinasi_id` exists, fetch destination details from Supabase and auto-fill `#catatan` with `"Rencana kunjungan ke destinasi: [Nama Destinasi]"`.

- [ ] **Step 2: Update `src/admin/components/header.js` live notification badge**

Fetch `reservasi` with `status = 'baru'` when header mounts, updating the red badge count on the mail/notification bell icon:

```javascript
if (isSupabaseConfigured() && supabase) {
  try {
    const { count } = await supabase.from('reservasi').select('*', { count: 'exact', head: true }).eq('status', 'baru');
    if (count && count > 0) {
      const badge = container.querySelector('#admin-notif-badge');
      if (badge) {
        badge.innerText = count > 9 ? '9+' : count;
        badge.classList.remove('hidden');
      }
    }
  } catch (e) { /* fallback silent */ }
}
```

- [ ] **Step 3: Run build to verify**

Run: `npm run build` — Expected: clean build.

---

### Task 3: Visitor Testimonial Submission & Admin Moderation

**Files:**
- Create: `src/components/testimoni-modal.js`
- Modify: `src/pages/beranda.js`
- Modify: `src/admin/pages/overview.js`

**Interfaces:**
- `openTestimoniModal()`: Opens a public submission form modal (Name, Origin, Rating 1-5, Message) that inserts row to `testimoni` with `is_shown = false`.
- Admin `overview.js`: Add a "Persetujuan Ulasan Pengunjung" card section with Approve (`is_shown = true`) and Reject (`delete()`) buttons. Approved ulasan immediately show on public beranda.

- [ ] **Step 1: Create `src/components/testimoni-modal.js`**

Form modal with 5-star selector, Name, Origin City, and Message. Saves to `testimoni` with `is_shown = false`. Shows Toast on success: `"Ulasan Anda telah dikirim dan menunggu verifikasi pengelola. Terima kasih!"`.

- [ ] **Step 2: Add "Tulis Ulasan & Kesan" button on `src/pages/beranda.js`**

In the Testimonial section of homepage, add a button that invokes `openTestimoniModal()`.

- [ ] **Step 3: Add Moderation Card to `src/admin/pages/overview.js`**

Add a widget listing pending testimonials (`is_shown = false`). Provide a 1-click `"Setujui & Tampilkan"` button which updates `is_shown = true`.

- [ ] **Step 4: Run build to verify**

Run: `npm run build` — Expected: clean build.

---

### Task 4: Bidirectional Navigation & Floating Admin Bar

**Files:**
- Create: `src/components/admin-bar.js`
- Modify: `src/components/navbar.js`
- Modify: `src/components/footer.js`
- Modify: `src/admin/components/header.js`

**Interfaces:**
- `renderAdminBar()`: Renders a floating bottom bar on public site if admin session exists.
- `renderFooter()`: Include "Portal Pengelola" link.
- `renderAdminHeader()`: Include "Lihat Website Utama ↗" action button.

- [ ] **Step 1: Create `src/components/admin-bar.js`**

```javascript
import { auth } from '../utils/auth.js';

export const initFloatingAdminBar = async () => {
  const session = await auth.getSession();
  if (!session) return;

  const existing = document.getElementById('floating-admin-bar');
  if (existing) return;

  const bar = document.createElement('div');
  bar.id = 'floating-admin-bar';
  bar.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white backdrop-blur-md px-5 py-2.5 rounded-full shadow-level-3 border border-slate-700/80 flex items-center gap-4 text-xs animate-slide-up';

  bar.innerHTML = `
    <div class="flex items-center gap-2 font-bold text-emerald-400">
      <span class="material-symbols-outlined text-sm">admin_panel_settings</span>
      <span>Mode Pengelola</span>
    </div>
    <span class="w-px h-4 bg-slate-700"></span>
    <a href="#/admin/overview" class="hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
      <span>Dashboard Admin</span>
      <span class="material-symbols-outlined text-xs">dashboard</span>
    </a>
  `;

  document.body.appendChild(bar);
};
```

- [ ] **Step 2: Call `initFloatingAdminBar()` in `src/components/navbar.js`**

When navbar initializes on public pages, call `initFloatingAdminBar()`.

- [ ] **Step 3: Add "Lihat Website Utama ↗" button in `renderAdminHeader()`**

Add action button in top right of header: `<a href="#/" target="_blank" class="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"><span>Situs Utama</span><span class="material-symbols-outlined text-xs">open_in_new</span></a>`.

- [ ] **Step 4: Add "Portal Pengelola" in `src/components/footer.js`**

Add text link in footer pointing to `#/admin/login`.

- [ ] **Step 5: Run build to verify**

Run: `npm run build` — Expected: clean build.

---

### Task 5: End-to-End Build & Integration Verification

- [ ] **Step 1: Execute `npm run build`**

Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 2: Commit all changes**

Commit changes task-by-task or in logical groups.
