# Design Spec: Fitur Dua Bahasa (Indonesian & English Bilingual Support)

## 1. Ringkasan Eksekutif
Fitur Dua Bahasa (Bilingual / i18n) pada Website Desa Wisata Tampirkulon dirancang untuk memperluas jangkauan promosi wisata ke wisatawan mancanegara tanpa mengorbankan kemudahan pengelolaan bagi pengurus desa. Sistem ini menerapkan arsitektur *Reactive Client-Side i18n Engine* yang ringan, cepat, dan terintegrasi penuh antara elemen UI statis (7 halaman publik, komponen navbar, footer, modals) serta konten dinamis dari database Supabase dan mock data.

---

## 2. Arsitektur & Core i18n Engine

### 2.1 Lokasi & Struktur Modul
* `src/utils/i18n.js`: Engine utama state management bahasa, translator helper (`t`), fallback handler, dan custom event dispatcher.
* `src/locales/id.js`: Kamus terjemahan Bahasa Indonesia (Bahasa default).
* `src/locales/en.js`: Kamus terjemahan Bahasa Inggris.

### 2.2 Mekanisme State & Reaktivitas
1. **Penyimpanan State**: Preferensi bahasa disimpan di `localStorage` dengan kunci `app_language`.
2. **Inisialisasi**: Saat aplikasi dimuat, sistem memeriksa `localStorage`. Jika kosong, sistem membaca preferensi browser via `navigator.language` (jika berawalan `en`, aktifkan `en`; selain itu default ke `id`).
3. **Pergantian Bahasa (`setLanguage`)**:
   * Memperbarui state memori dan `localStorage`.
   * Memperbarui atribut `<html lang="id">` atau `<html lang="en">`.
   * Menembakkan custom DOM event `app:language-change`.
   * Komponen router / halaman aktif menangkap event tersebut dan me-render ulang tampilan seketika tanpa me-refresh browser.

### 2.3 Format Kamus Terjemahan & Key Parity
Kamus disusun secara modular berbasis domain:
```javascript
export default {
  common: { /* Tombol umum, status, loading, pagination */ },
  nav: { /* Menu navigasi, label switch, CTA */ },
  footer: { /* Kontak desa, navigasi cepat, jam kerja, copyright */ },
  beranda: { /* Hero, 4 pilar wisata, destinasi unggulan, statistik, testimoni slider, CTA banner */ },
  profil: { /* Sejarah, visi, misi, data demografi & geografis, peta */ },
  destinasi: { /* Header, filter kategori, search input, status tiket, modal detail */ },
  paket: { /* Banner promo, durasi, kapasitas, daftar fasilitas, tombol reservasi */ },
  galeri: { /* Filter media, label tipe video/foto, lightbox controls */ },
  blog: { /* Search artikel, filter kategori, meta rilis, read time, modal baca */ },
  kontak: { /* Info kontak, form reservasi, field labels, placeholder, validasi, toast */ }
};
```

---

## 3. Desain UI & Pengalaman Pengguna (UX)

### 3.1 Language Switcher Widget
* **Tampilan**: Pill-shaped toggle switch dengan styling Glassmorphic & Modern Active Indicator:
  * State `ID`: `[ ID | en ]` (Background highlight warna primer pada ID).
  * State `EN`: `[ id | EN ]` (Background highlight warna primer pada EN).
* **Penempatan**:
  1. **Navbar Desktop**: Bersebelahan dengan tombol *"Kontak & Reservasi"*.
  2. **Mobile Drawer**: Ditempatkan di bagian atas menu drawer mobile dengan ukuran sentuh yang nyaman (touch-friendly).
  3. **Footer**: Quick switch indikator bahasa di dekat copyright.

### 3.2 Adaptasi 7 Halaman Publik & Komponen
* **Halaman Beranda (`src/pages/beranda.js`)**:
  * Hero Section: Welcome badge, judul utama, tagline, tombol jelajah & kontak.
  * 4 Pilar Wisata: Wisata Alam, Budaya Lokal, Kuliner Khas, Homestay Nyaman beserta deskripsi singkatnya.
  * Destinasi Unggulan: Label badge, judul, tombol *"Lihat Semua Destinasi"*.
  * Mengenal Tampirkulon: Narasi pengantar, 4 kartu statistik (Luas Wilayah, Populasi, Kategori Wisata, Kearifan Lokal).
  * Testimoni Pengunjung: Section title, subtitle, navigasi carousel slider, tombol *"Tulis Ulasan"*.
  * CTA Banner Petualangan: Judul banner, deskripsi ajakan, tombol aksi ganda.
* **Halaman Profil (`src/pages/profil.js`)**:
  * Hero banner profil, narasi sejarah desa, visi & misi, statistik wilayah, tabel detail desa, dan iframe peta Google Maps.
* **Halaman Destinasi (`src/pages/destinasi.js`) & Modal (`src/components/destinasi-modal.js`)**:
  * Bar pencarian, filter kategori tombol dinamis, badge harga (*"Gratis"* / *"Free"* atau nominal), detail modal (lokasi, jam buka, tiket, deskripsi lengkap, tombol pesan).
* **Halaman Paket Wisata (`src/pages/paket.js`)**:
  * Pricing cards, label durasi (*"1 Hari Full"* / *"Full Day"*), kapasitas minimal/maksimal, daftar checklist fasilitas, tombol reservasi otomatis membawa nama paket ke halaman kontak.
* **Halaman Galeri (`src/pages/galeri.js`) & Lightbox (`src/components/lightbox.js`)**:
  * Tab filter (Semua, Foto, Video, Alam, Kuliner, Budaya), caption gambar, kontrol lightbox.
* **Halaman Blog (`src/pages/blog.js`) & Modal Artikel (`src/components/article-modal.js`)**:
  * Input pencarian artikel, filter kategori berita, estimasi waktu baca, tanggal rilis terlokalisasi, tombol baca selengkapnya, modal pembaca artikel.
* **Halaman Kontak & Reservasi (`src/pages/kontak.js`)**:
  * Kartu info alamat, jam buka, WhatsApp, formulir reservasi online, placeholder form, pesan error validasi, dan feedback modal/toast setelah submit.
* **Navbar & Footer (`src/components/navbar.js`, `src/components/footer.js`)**:
  * Nav menu link, copyright string, deskripsi footer.

---

## 4. Strategi Konten Dinamis & Admin Dashboard

### 4.1 Logika Fallback Cerdas Konten Dinamis
Helper function `getLocalizedField(item, fieldName)` mengecek ketersediaan konten bahasa target:
```javascript
export function getLocalizedField(item, fieldName) {
  if (!item) return '';
  const lang = getLanguage();
  if (lang === 'en') {
    const enVal = item[`${fieldName}_en`];
    if (Array.isArray(enVal) && enVal.length > 0) return enVal;
    if (typeof enVal === 'string' && enVal.trim() !== '') return enVal;
  }
  return item[fieldName] || (Array.isArray(item[fieldName]) ? [] : '');
}
```

### 4.2 Data & Schema Extension
Menambahkan field dwibahasa pada seed data (`src/data/seed.js`) dan skema tabel database Supabase:
* `destinasi`: `nama_en`, `deskripsi_en`, `lokasi_en`
* `kategori_wisata`: `nama_en`, `deskripsi_en`
* `paket_wisata`: `nama_en`, `deskripsi_en`, `fasilitas_en` (array)
* `artikel`: `judul_en`, `ringkasan_en`, `konten_en`
* `profil_desa`: `tagline_en`, `sejarah_en`, `visi_en`, `misi_en`, `footer_deskripsi_en`

### 4.3 Peningkatan Form Admin Dashboard
* Pada form modal manajemen konten di Dashboard Admin (`destinasi.js`, `paket.js`, `artikel.js`, `profil.js`):
  * Disediakan tab selector ringkas `[ 🇮🇩 Bahasa Indonesia | 🇬🇧 English ]`.
  * Field bahasa Inggris bersifat **opsional**. Jika admin tidak mengisi field EN, sistem publik otomatis menggunakan data bahasa Indonesia.

---

## 5. Rencana Verifikasi & Pengujian Mutu (QA)

1. **Automated Translation Parity Test (`scripts/test-i18n.js`)**:
   * Memastikan struktur key pada `src/locales/id.js` dan `src/locales/en.js` 100% simetris (tidak ada missing key).
   * Memverifikasi fungsi `t()` menghasilkan output yang sesuai dan fallback bekerja saat key tidak ada.
   * Memverifikasi `getLocalizedField()` menangani string kosong, null, array fasilitas, dan fallback dengan benar.
2. **Build & Syntax Verification**:
   * Menjalankan `npm run build` untuk memastikan tidak ada error kompilasi Vite/Tailwind.
3. **Manual Interactive Verification**:
   * Pengujian pergantian bahasa di semua 7 rute publik.
   * Pengujian responsivitas toggle bahasa pada tampilan Desktop dan Mobile Drawer.
   * Pengujian persistensi preferensi bahasa pada `localStorage` saat berpindah halaman atau me-reload halaman.
   * Pengujian pengisian konten bilingual di admin panel dan penampilannya di website publik.
