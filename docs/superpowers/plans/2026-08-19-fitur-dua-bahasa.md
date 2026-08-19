# Fitur Dua Bahasa (Bilingual Indonesian & English) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan dukungan dua bahasa (Bahasa Indonesia & Bahasa Inggris) pada Website Desa Wisata Tampirkulon mencakup seluruh elemen UI website publik, komponen navigasi & footer, formulir, modal, konten dinamis (destinasi, paket wisata, artikel, profil desa) dengan mekanisme fallback cerdas serta antarmuka input dwibahasa di Admin Dashboard.

**Architecture:** Client-Side Reactive i18n Engine berbasis JavaScript murni (`src/utils/i18n.js`) yang mengelola kamus bahasa modular (`src/locales/id.js` & `src/locales/en.js`), persistensi `localStorage`, event-driven re-rendering pada router saat bahasa beralih, helper `getLocalizedField` untuk data dinamis, dan widget switch bahasa pada Navbar, Mobile Drawer, dan Footer.

**Tech Stack:** Vanilla JavaScript (ES Modules), Tailwind CSS v4, Vite, Supabase JS Client.

## Global Constraints
- Bahasa default aplikasi adalah Bahasa Indonesia (`id`).
- Bahasa Inggris (`en`) didukung secara penuh untuk UI dan konten dinamis.
- Jika konten dinamis bahasa Inggris belum diisi, sistem wajib fallback ke Bahasa Indonesia tanpa menampilkan teks kosong.
- URL hash tetap bersih dan tidak merusak navigasi yang sudah ada (`#/`, `#/destinasi`, `#/paket`, dll).
- Tidak menggunakan library i18n pihak ketiga yang berat; gunakan engine i18n murni yang ringan dan cepat.

---

### Task 1: Core i18n Engine & Locale Dictionaries

**Files:**
- Create: `src/utils/i18n.js`
- Create: `src/locales/id.js`
- Create: `src/locales/en.js`
- Test: `scripts/test-i18n.js`

**Interfaces:**
- Produces:
  - `getLanguage(): string` (returns `'id'` or `'en'`)
  - `setLanguage(lang: string): void`
  - `t(key: string, params?: Record<string, string>): string`
  - `getLocalizedField(item: object, fieldName: string): any`
  - Event `app:language-change` dispatched on `window`

- [ ] **Step 1: Write the failing test for i18n engine and translation parity**

```javascript
// scripts/test-i18n.js
import assert from 'node:assert';
import { getLanguage, setLanguage, t, getLocalizedField } from '../src/utils/i18n.js';
import idLocale from '../src/locales/id.js';
import enLocale from '../src/locales/en.js';

console.log('🧪 Running i18n Engine & Locale Parity Tests...');

// 1. Key Parity Check
function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return [...res, prefix + el];
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
}

const idKeys = getKeys(idLocale).sort();
const enKeys = getKeys(enLocale).sort();

assert.deepStrictEqual(idKeys, enKeys, 'ID and EN locale dictionary keys must match exactly!');
console.log(`✅ Dictionary keys parity verified (${idKeys.length} keys).`);

// 2. Translation & Fallback Test
setLanguage('id');
assert.strictEqual(getLanguage(), 'id');
assert.strictEqual(t('nav.beranda'), idLocale.nav.beranda);

setLanguage('en');
assert.strictEqual(getLanguage(), 'en');
assert.strictEqual(t('nav.beranda'), enLocale.nav.beranda);

// 3. Dynamic Field Fallback Test
const mockItem = {
  nama: 'Kebun Durian',
  nama_en: 'Durian Orchard',
  deskripsi: 'Deskripsi lokal',
  deskripsi_en: ''
};

setLanguage('en');
assert.strictEqual(getLocalizedField(mockItem, 'nama'), 'Durian Orchard');
assert.strictEqual(getLocalizedField(mockItem, 'deskripsi'), 'Deskripsi lokal', 'Fallback to id when en is empty');

setLanguage('id');
assert.strictEqual(getLocalizedField(mockItem, 'nama'), 'Kebun Durian');

console.log('🎉 All i18n unit tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-i18n.js`
Expected: FAIL (Cannot find module '../src/utils/i18n.js')

- [ ] **Step 3: Implement Locale Dictionaries (`id.js` & `en.js`) and `src/utils/i18n.js`**

Implement complete translations in `src/locales/id.js` and `src/locales/en.js` for all sections (`common`, `nav`, `footer`, `beranda`, `profil`, `destinasi`, `paket`, `galeri`, `blog`, `kontak`), and create `src/utils/i18n.js` with `getLanguage()`, `setLanguage()`, `t()`, and `getLocalizedField()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-i18n.js`
Expected: PASS with "🎉 All i18n unit tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/utils/i18n.js src/locales/id.js src/locales/en.js scripts/test-i18n.js
git commit -m "feat(i18n): implement core i18n engine and locale dictionaries"
```

---

### Task 2: Dynamic Content Fallback & Seed Data Enrichment

**Files:**
- Modify: `src/data/seed.js`
- Modify: `src/utils/profile-store.js`
- Test: `scripts/test-i18n.js`

**Interfaces:**
- Consumes: `getLanguage`, `getLocalizedField` from `src/utils/i18n.js`
- Produces: Bilingual seed entities for `profil_desa`, `kategori_wisata`, `destinasi`, `paket_wisata`, `artikel`, `galeri`, `testimoni`.

- [ ] **Step 1: Add seed data bilingual verification in `scripts/test-i18n.js`**

```javascript
// Append to scripts/test-i18n.js
import { mockData } from '../src/data/seed.js';

assert.ok(mockData.profil_desa.tagline_en, 'profil_desa should have tagline_en');
assert.ok(mockData.destinasi[0].nama_en, 'destinasi should have nama_en');
assert.ok(mockData.paket_wisata[0].nama_en, 'paket_wisata should have nama_en');
assert.ok(Array.isArray(mockData.paket_wisata[0].fasilitas_en), 'paket_wisata should have fasilitas_en array');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-i18n.js`
Expected: FAIL (AssertionError: profil_desa should have tagline_en)

- [ ] **Step 3: Enrich `src/data/seed.js` and update `src/utils/profile-store.js`**

Add English fields (`nama_en`, `deskripsi_en`, `tagline_en`, `sejarah_en`, `visi_en`, `misi_en`, `fasilitas_en`, `judul_en`, `ringkasan_en`, `konten_en`) to `mockData` in `src/data/seed.js` and support these fields in `src/utils/profile-store.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-i18n.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/seed.js src/utils/profile-store.js scripts/test-i18n.js
git commit -m "feat(data): enrich seed data with bilingual fields and fallback support"
```

---

### Task 3: Navbar, Mobile Drawer, Footer Language Switcher & Router Integration

**Files:**
- Modify: `src/components/navbar.js`
- Modify: `src/components/footer.js`
- Modify: `src/utils/router.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `t`, `getLanguage`, `setLanguage` from `src/utils/i18n.js`
- Produces: Reactive language toggle widget in Navbar and Mobile Drawer, and auto-rerender listener on language change.

- [ ] **Step 1: Update router & main.js to listen to `app:language-change` event**

In `src/utils/router.js` or `src/main.js`, add event listener:
```javascript
window.addEventListener('app:language-change', () => {
  router.handleRoute();
});
```

- [ ] **Step 2: Update `src/components/navbar.js`**

Add language switch buttons (Desktop & Mobile Drawer) with active states and bind click events calling `setLanguage('id')` or `setLanguage('en')`. Translate navigation labels using `t('nav....')`.

- [ ] **Step 3: Update `src/components/footer.js`**

Translate footer sections, quick links, contact labels, and copyright string using `t('footer....')` and `t('nav....')`.

- [ ] **Step 4: Verify build and language switch DOM structure**

Run: `npm run build`
Expected: PASS without build errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/navbar.js src/components/footer.js src/utils/router.js src/main.js
git commit -m "feat(ui): add interactive language switchers in navbar, mobile drawer, and footer"
```

---

### Task 4: Public Pages Translation & Dynamic Content Integration (Part 1: Beranda & Profil)

**Files:**
- Modify: `src/pages/beranda.js`
- Modify: `src/pages/profil.js`

**Interfaces:**
- Consumes: `t`, `getLocalizedField` from `src/utils/i18n.js`

- [ ] **Step 1: Translate `src/pages/beranda.js`**

Replace static strings with `t('beranda...')`, localize 4 pillars section, featured destinations, about section stats & highlights, and testimonials carousel using `getLocalizedField(item, 'deskripsi')`, `getLocalizedField(item, 'nama')`, and CTA banner.

- [ ] **Step 2: Translate `src/pages/profil.js`**

Replace static strings with `t('profil...')`, localize profile hero, history narration, vision & mission items, geographic cards, and contact information table.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/pages/beranda.js src/pages/profil.js
git commit -m "feat(pages): localize Beranda and Profil pages with dynamic fallback"
```

---

### Task 5: Public Pages Translation & Dynamic Content Integration (Part 2: Destinasi, Paket, Galeri, Blog, Kontak & Modals)

**Files:**
- Modify: `src/pages/destinasi.js`
- Modify: `src/components/destinasi-modal.js`
- Modify: `src/pages/paket.js`
- Modify: `src/pages/galeri.js`
- Modify: `src/components/lightbox.js`
- Modify: `src/pages/blog.js`
- Modify: `src/components/article-modal.js`
- Modify: `src/pages/kontak.js`
- Modify: `src/components/testimoni-modal.js`
- Modify: `src/components/toast.js`

**Interfaces:**
- Consumes: `t`, `getLocalizedField`, `getLanguage` from `src/utils/i18n.js`

- [ ] **Step 1: Localize Destinasi page & modal**

Translate filter categories, search bar, ticket prices, and destination modal details.

- [ ] **Step 2: Localize Paket Wisata page**

Translate pricing cards, facility list with `getLocalizedField(pkg, 'fasilitas')`, duration, capacity labels, and booking CTA.

- [ ] **Step 3: Localize Galeri page & Lightbox**

Translate category filters (All, Photo, Video, Nature, Culinary, Culture) and lightbox navigation controls.

- [ ] **Step 4: Localize Blog page & Article modal**

Translate search input, category filters, read time estimations, formatted dates based on active locale, and full article reader modal.

- [ ] **Step 5: Localize Kontak & Reservasi page, Testimoni modal, and Toast**

Translate reservation form fields, placeholders, input validation messages, submit confirmation, testimonial submission modal, and toast alerts.

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/pages/destinasi.js src/components/destinasi-modal.js src/pages/paket.js src/pages/galeri.js src/components/lightbox.js src/pages/blog.js src/components/article-modal.js src/pages/kontak.js src/components/testimoni-modal.js src/components/toast.js
git commit -m "feat(pages): localize Destinasi, Paket, Galeri, Blog, Kontak pages and modals"
```

---

### Task 6: Admin Dashboard Bilingual CRUD Support

**Files:**
- Modify: `src/admin/pages/destinasi.js`
- Modify: `src/admin/pages/paket.js`
- Modify: `src/admin/pages/artikel.js`
- Modify: `src/admin/pages/profil.js`

**Interfaces:**
- Produces: Bilingual tabbed inputs `[ 🇮🇩 Bahasa Indonesia | 🇬🇧 English ]` in admin CRUD modals for managing both ID and EN versions of dynamic content.

- [ ] **Step 1: Update Destinasi Admin Modal with Bilingual Tabs**

Add tab selector `[ ID | EN ]` to the destination form for `nama_en`, `deskripsi_en`, `lokasi_en`.

- [ ] **Step 2: Update Paket Wisata Admin Modal with Bilingual Tabs**

Add tab selector for `nama_en`, `deskripsi_en`, `fasilitas_en`.

- [ ] **Step 3: Update Artikel Admin Modal with Bilingual Tabs**

Add tab selector for `judul_en`, `ringkasan_en`, `konten_en`.

- [ ] **Step 4: Update Profil Desa Admin Form with Bilingual Tabs**

Add English fields for `tagline_en`, `sejarah_en`, `visi_en`, `misi_en`, `footer_deskripsi_en`.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/admin/pages/destinasi.js src/admin/pages/paket.js src/admin/pages/artikel.js src/admin/pages/profil.js
git commit -m "feat(admin): add bilingual CRUD inputs in admin dashboard modals"
```

---

### Task 7: Full Test Suite & Quality Verification

**Files:**
- Modify: `package.json`
- Test: `scripts/test-i18n.js`
- Test: `scripts/test-audit.js`

- [ ] **Step 1: Add test script to `package.json`**

Update `package.json` scripts: `"test": "node scripts/test-i18n.js && node scripts/test-audit.js"`.

- [ ] **Step 2: Run all automated tests**

Run: `npm test`
Expected: All tests pass with zero errors.

- [ ] **Step 3: Run production build check**

Run: `npm run build`
Expected: Build succeeds without warnings or bundle errors.

- [ ] **Step 4: Final commit**

```bash
git add package.json
git commit -m "test: integrate i18n test suite and verify full build"
```
