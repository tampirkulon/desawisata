# Stitch UI Design & Implementation Spec - Desa Wisata Tampirkulon

## Overview
Spesifikasi ini menjelaskan perancangan dan implementasi seluruh antarmuka pengguna (UI) untuk aplikasi **Desa Wisata Tampirkulon** berbasis **Stitch MCP** dengan Design System "Tampirkulon Heritage & Nature" (`#316342` Deep Forest Green, `#4A7C59` Primary Container, `#D4A84B` Harvest Gold, `#FCF9F8` Warm Off-White). Spesifikasi ini mencakup Halaman Publik dan Admin Dashboard.

---

## 1. Visual Foundation & Design Tokens

- **Color Palette**:
  - Primary (`#316342`): Deep Forest Green untuk branding utama, navbar dark background, tombol utama, dan header section.
  - Primary Container (`#4A7C59`): Forest Green sedang untuk card header & highlight container.
  - Accent (`#D4A84B`): Harvest Gold untuk CTA button, highlight badge, dan rating star.
  - Background (`#FCF9F8`): Warm Off-White (bebas glare digital) untuk kanvas utama.
  - Surface Container (`#F0EDED`): Light grey warm untuk latar belakang card & form control.
  - Text Charcoal (`#1C1B1B`): Kontras tinggi untuk keterbacaan paragraf & judul.
  - Text Muted (`#5A5A5A`): Digunakan untuk sekunder/sub-teks.
- **Typography**:
  - Headings & Display: `Outfit` (Sans-serif geometris modern & ramah).
  - Body & UI Controls: `Inter` (Sans-serif bersih untuk keterbacaan tinggi dengan line-height 1.6).
- **Elevation & Corner Radius**:
  - Level 1 Shadow: `0 4px 20px rgba(49, 99, 66, 0.08)`.
  - Level 2 Shadow: `0 12px 32px rgba(49, 99, 66, 0.12)`.
  - Corner Radius: `8px` (`0.5rem`) untuk tombol & input, `16px` (`1rem`) untuk card & image wrapper.

---

## 2. Screen & Page Specifications

### Public Pages (`src/pages/`)
1. **Beranda (`beranda.js`)**:
   - Hero Section: Display header besar, sub-headline, CTA utama, dan image banner.
   - Quick Stats Strip: Card statistik desa (Luas, Populasi, Destinasi, Paket Wisata).
   - Destinasi Unggulan: Grid kartu destinasi dengan image hover zoom dan badge kategori.
   - Paket Eduwisata Highlight: Highlight paket favorit beserta harga & tombol booking.
   - Latest Articles / Blog: Grid 3 artikel wisata terbaru.
   - Reservation CTA Banner: Banner ajakan reservasi dengan tombol pendaftaran.

2. **Profil Desa (`profil.js`)**:
   - Hero Header: Banner profil desa.
   - Demografi & Geografi: Informasi wilayah dan batas desa.
   - Sejarah & Budaya: Storytelling dengan photo cards.
   - Visi & Misi: Layout card dengan icon indikator.
   - Pengelola / Pokdarwis: Grid anggota tim pengelola desa wisata.

3. **Destinasi Wisata (`destinasi.js`)**:
   - Filter Chips: Pill button (Semua, Alam, Budaya, Kuliner, Edukasi).
   - Destinasi Card Grid: Layout 3 kolom responsif dengan tag harga, rating, dan lokasi.
   - Lightbox / Detail View: Modal informasi detail destinasi.

4. **Paket Wisata (`paket.js`)**:
   - Paket Cards: Top image wrapper (`16px` radius), daftar fasilitas (bullet icon daun), harga per pax, durasi.
   - CTA Action: Tombol "Pesan Paket" yang membuka form reservasi terisi otomatis.

5. **Galeri Foto & Video (`galeri.js`)**:
   - Asymmetric Masonry Grid: Sesuai layar Stitch (`8e518121745c416497785fecb792f781`).
   - Lightbox Integration: Klik gambar/video untuk pembesaran layar penuh dengan captions.

6. **Artikel Blog (`blog.js`)**:
   - Featured Article Banner: Headline artikel utama.
   - Search & Category Filter: Input pencarian artikel dan filter topik.
   - Article Grid: Kartu artikel berita desa & tips wisata.

7. **Kontak & Reservasi (`kontak.js`)**:
   - Booking Form: Form interaktif (Nama, Whatsapp/Email, Paket/Destinasi, Tanggal, Pax, Catatan).
   - Contact Cards: Info alamat, email, telepon, jam operasional.
   - Google Maps Embed placeholder.

### Admin Dashboard Pages (`src/admin/pages/`)
1. **Login (`login.js`)**:
   - Centered split layout, form login email & password, pesan error, dan autentikasi Supabase.
2. **Overview (`overview.js`)**:
   - Sidebar navigasi sticky, Topbar profil, Kartu Metrik (Total Destinasi, Paket, Artikel, Reservasi), dan Tabel Aktivitas Reservasi Terbaru dengan status badge (*Pending*, *Confirmed*, *Completed*).
3. **Management Modules (`destinasi.js`, `kategori.js`, `paket.js`, `artikel.js`, `profil.js`, `galeri.js`, `reservasi.js`)**:
   - Re-usable Data Table (Search, Filter, Actions Edit & Delete, Pagination).
   - Modal Form Dialog untuk Tambah/Edit Data.

---

## 3. Implementation & Verification Plan

- **Design System CSS Alignment**: Memperbarui `src/styles/index.css`, `components.css`, `pages.css`, dan `dashboard.css`.
- **Public & Admin Page Refactoring**: Memastikan seluruh tampilan publik dan admin di-render secara bersih dan responsif.
- **Git Commit & Push Policy**: Setiap langkah pekerjaan di-commit dan di-push ke remote repository `git@github.com:tampirkulon/desawisata.git`.
- **Build Verification**: `npm run build` dijalankan tanpa error.
