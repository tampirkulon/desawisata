# Design Spec: Homepage Visual Accents (Modern Glassmorphism & Micro-Interactions)

- **Date:** 2026-08-09
- **Status:** Approved
- **Target Page:** Beranda (`src/pages/beranda.js`, `src/styles/index.css`)
- **Theme Palette:** `#123524` (Deep Forest Green), `#3E7B27` (Primary Forest), `#85A947` (Light Olive Accent), `#EFE3C2` (Warm Cream).

---

## 1. Objectives & Overview
Menghilangkan kesan visual yang datar/polos pada halaman Beranda Desa Wisata Tampirkulon dengan menerapkan aksen visual bergaya **Modern Glassmorphism & Micro-Interactions**. Perubahan berfokus pada penambahan elemen dekoratif, kartu bertekstur kaca (*frosted glass*), titik animasi status langsung (*live pulsing indicator*), watermark ikon pada statistik/testimoni, dan latar belakang *ambient glowing orbs*.

---

## 2. Detailed Visual Enhancements

### 2.1. Hero Section
- **Floating Live Status Pill**: Menambahkan badge status operasional di atas heading dengan titik animasi radar hijau berkedip (`animate-ping` / `animate-pulse`):
  - Teks: `🟢 Buka Setiap Hari • 08:00 - 17:00 WIB`
  - Style: `bg-black/35 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-xs text-white/95 shadow-sm`
- **Hero Title & Tagline Accents**: Penekanan tipografi yang lebih kaya dengan drop shadow halus dan tata letak elegan.
- **Hero CTA Buttons**: Efek hover interaktif dengan border highlight dan bayangan lembut bernuansa emerald/krem.

### 2.2. Highlights / Fitur Utama Section
- **Ambient Glowing Backdrops**: Menambahkan elemen dekoratif bulat di balik grid (`blur-3xl bg-primary/10` dan `bg-secondary/15`) untuk memecah latar belakang putih polos.
- **Glassmorphic Feature Cards**:
  - Background: `bg-surface-container-lowest/80 backdrop-blur-md`
  - Border: `border border-outline-variant/40 hover:border-secondary/60`
  - Hover Interaction: `hover:-translate-y-1.5 hover:shadow-level-2 transition-all duration-300`
  - Icon Badges: Wadah ikon bergradien halus (`bg-gradient-to-br from-primary/15 to-secondary/20 text-primary`) dengan bayangan dalam yang lembut.

### 2.3. Destinasi Unggulan Section
- **Decorative Section Pill**: Mini badge di atas judul seksi (`✨ Destinasi Favorit`).
- **Glass Price Tag**: Badge harga tiket yang menempel di atas foto destinasi dibuat semi-transparan berkaca (`bg-primary/90 backdrop-blur-md text-white border border-white/20`).
- **Card Interactive Hover**: Efek zoom halus pada gambar thumbnail saat kartu disentuh (`scale-105 transition-transform duration-500`) dan tombol callout beraksen jelas.

### 2.4. Mengenal Tampirkulon (About) & Stats Counter Cards
- **Modern Stat Cards with Watermark**:
  - Masing-masing dari 4 kotak angka (Luas Wilayah, Populasi, Kategori Wisata, Kearifan Lokal) dilengkapi watermark ikon SVG/Material Symbols berukuran besar di sudut kanan bawah dengan transparansi lembut (`opacity-10 pointer-events-none`).
  - Garis aksen kiri bergradien (`border-l-4 border-primary` atau `border-l-4 border-secondary`).
- **Left Column Highlight Box**: Box kutipan filosofi desa dengan background berkaca hangat.

### 2.5. Testimoni ("Kata Mereka")
- **Watermark Quote Symbol**: Watermark tanda kutip dekoratif (`format_quote`) di latar belakang setiap kartu testimoni.
- **Star Rating Glow**: Efek warna bintang emas hangat dengan bayangan halus.

### 2.6. Call-to-Action (CTA) Banner
- **Rich Gradient Glass Card**:
  - Mengubah CTA dari sekadar baris datar menjadi kartu besar bergradien modern (`bg-gradient-to-br from-[#123524] via-[#1E4D30] to-[#3E7B27] text-white rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-xl`).
  - Dilengkapi 2 ornamen lingkaran cahaya di sudut banner (`w-72 h-72 bg-white/10 rounded-full blur-2xl absolute -top-16 -right-16`).
  - Tombol CTA warna krem (`bg-[#EFE3C2] text-[#123524] hover:bg-white`) dengan ikon kalender.

---

## 3. Architecture & File Impacts
- **[MODIFY] `src/pages/beranda.js`**: Update markup HTML dan styling utility classes Tailwind untuk semua seksi (Hero, Highlights, Destinasi, Profil Stats, Testimoni, CTA Banner).
- **[MODIFY] `src/styles/index.css`**: (Jika diperlukan) Tambahan utility animation class / glowing backdrop helper jika belum tercakup oleh Tailwind.

---

## 4. Verification & Testing
- **Visual Inspection**: Buka web app pada dev server (`http://localhost:5173`) untuk memastikan semua aksen visual tampil rapi, responsif di mobile/desktop, dan tidak ada overflow / glitch.
- **Modal & Routing Verification**: Pastikan klik kartu destinasi (membuka modal destinasi) dan tombol "Tulis Ulasan & Kesan" (membuka modal testimoni) tetap bekerja normal 100%.
