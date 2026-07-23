# Stitch UI Design & Implementation Spec - Desa Wisata Tampirkulon

## Overview
Spesifikasi ini menjelaskan perancangan dan pembuatan seluruh antarmuka pengguna (UI) untuk aplikasi **Desa Wisata Tampirkulon** menggunakan **Stitch MCP** dengan Design System "Verdant Heritage" (#1b3022 Deep Forest Green, #8ba888 Soft Sage, #f9f7f2 Warm Cream). Spesifikasi ini mencakup Halaman Publik dan Halaman Admin Dashboard.

---

## 1. Design System & Visual Foundation

- **Color Palette**:
  - Primary (`#1b3022`): Deep Forest Green untuk branding utama, navbar dark background, tombol utama, dan header section.
  - Secondary (`#8ba888`): Soft Sage untuk badge, icon accent, border halus, dan card highlights.
  - Surface (`#f9f7f2`): Warm Cream/Off-White untuk background halaman utama yang memberikan impresi elegan dan alami.
  - Neutral/Dark (`#1b1c1c`): Charcoal untuk teks paragraf dan judul kontras.
- **Typography**:
  - Headlines: `Libre Caslon Text` (Serif elegan untuk nuansa heritage & budaya).
  - Body & UI Controls: `Hanken Grotesk` (Sans-serif bersih untuk keterbacaan tinggi).
- **Layout & Spacing**:
  - Container Max-Width: `1280px` dengan padding responsif (desktop 64px, mobile 20px).
  - Spacing rhythm berbasis 8px (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).
  - Card Radius: `8px` (`0.5rem`) dengan soft ambient shadow (`box-shadow: 0 10px 30px rgba(27, 48, 34, 0.05)`).

---

## 2. Stitch MCP Screen Generation Strategy

Layar UI akan digenerate pada proyek Stitch `projects/10025430612284537543` ("Desa Wisata Tampirkulon") menggunakan tool `generate_screen_from_text`:

1. **Admin Login Page**:
   - Split layout/card terpusat dengan background lanskap desa, form email & password, tombol login dengan indikator loading, serta pesan error alert.
2. **Admin Dashboard Overview**:
   - Sidebar navigasi (Overview, Destinasi, Kategori, Paket, Artikel, Profil, Galeri, Reservasi, Logout).
   - Topbar dengan profile badge & quick stats cards (Total Destinasi, Paket Wisata, Artikel Published, Reservasi Baru).
   - Quick Action buttons & Recent Activity Table (Tabel reservasi terbaru dengan badge status).
3. **Admin Management Data Tables & Modals**:
   - Komponen re-usable `data-table` (Search input, filter dropdown, action buttons Edit & Delete, pagination).
   - Modal Form editor untuk Add/Edit Destinasi, Paket, Artikel, & Upload Media/Galeri.
4. **Public Kontak & Reservasi Page**:
   - Interactive Reservation Form (Nama, Email, Whatsapp, Pilih Paket/Destinasi, Tanggal Kunjungan, Jumlah Pax, Catatan).
   - Google Maps Embed placeholder & Contact Info card (Alamat, Phone, Email, Jam Operasional).

---

## 3. UI Component Integration Architecture

Aplikasi akan menyusun UI Stitch ke dalam SPA Vite Vanilla JS & CSS:

- **`src/styles/`**:
  - `index.css`: CSS Variables, reset, font imports (`Libre Caslon Text`, `Hanken Grotesk`), utilitas utility.
  - `components.css`: Buttons, Cards, Badges, Modals, Forms, Toast notifications, Lightbox gallery.
  - `pages.css`: Hero section, Section layouts, Grid Destinasi & Paket, Article reader view.
  - `dashboard.css`: Sidebar layout, Metric cards, Data Tables, Admin Form controls.

- **`src/pages/` (Public Views)**:
  - `beranda.js`: Hero banner, statistik singkat, destinasi unggulan, paket eduwisata, berita terbaru, & CTA reservasi.
  - `profil.js`: Sejarah Tampirkulon, potensi lokal, struktur pengelola, visi & misi.
  - `destinasi.js`: Katalog destinasi dengan filter kategori (Alam, Budaya, Kuliner, Kerajinan).
  - `paket.js`: Kartu paket wisata lengkap dengan harga, durasi, fasilitas, dan aksi "Pesan Sekarang".
  - `galeri.js`: Masonry grid foto & video desa dengan Lightbox zoom.
  - `blog.js`: List artikel berita & petunjuk wisata dengan pencarian.
  - `kontak.js`: Form reservasi terintegrasi Supabase & kontak pengelola.

- **`src/admin/pages/` (Admin Dashboard Views)**:
  - `login.js`: Form autentikasi admin Supabase.
  - `overview.js`: Panel kontrol ringkasan statistik & aktivitas reservasi.
  - `destinasi.js`, `kategori.js`, `paket.js`, `artikel.js`, `galeri.js`, `reservasi.js`: CRUD Manager lengkap dengan modal dialog & pengelola media.

---

## 4. Verification & Testing Plan

1. **Stitch Generation Verification**: Memastikan `generate_screen_from_text` berhasil menambahkan screen baru ke proyek Stitch `projects/10025430612284537543`.
2. **Build Verification**: Menjalankan `npm run build` untuk memastikan bundling Vite tidak ada syntax error atau broken imports.
3. **Visual & Responsive Testing**: Memastikan tampilan publik dan admin responsif di layar Desktop dan Mobile.
