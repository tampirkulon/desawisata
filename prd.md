# Product Requirements Document (PRD)
## Website Desa Wisata Tampirkulon

| Field             | Detail                                      |
|-------------------|---------------------------------------------|
| **Nama Produk**   | Website Desa Wisata Tampirkulon             |
| **Versi Dokumen** | 1.0                                         |
| **Tanggal**       | 22 Juli 2026                                |
| **Status**        | Draft — Menunggu Persetujuan                |
| **Penulis**       | Tim Pengembang                              |

---

## 1. Ringkasan Eksekutif

Website Desa Wisata Tampirkulon adalah platform digital resmi untuk Desa Wisata Tampirkulon yang berlokasi di Kecamatan Candimulyo, Kabupaten Magelang, Jawa Tengah. Platform ini terdiri dari dua bagian utama:

1. **Website Publik** — Menampilkan informasi destinasi wisata, paket wisata, galeri, artikel, profil desa, dan formulir reservasi untuk wisatawan.
2. **Admin Dashboard** — Panel administrasi untuk pengelola desa wisata dalam mengelola seluruh konten website, data wisata, dan reservasi yang masuk.

---

## 2. Latar Belakang & Permasalahan

### 2.1 Latar Belakang

Desa Tampirkulon memiliki potensi wisata yang beragam meliputi wisata alam, budaya, kuliner, dan berbagai aktivitas outdoor. Namun, informasi mengenai desa wisata ini masih tersebar dan belum terkonsolidasi dalam satu platform digital yang representatif.

### 2.2 Permasalahan

| No | Permasalahan                                                                 |
|----|------------------------------------------------------------------------------|
| 1  | Belum ada platform digital resmi yang menampilkan potensi wisata desa        |
| 2  | Informasi wisata tersebar di berbagai media dan sulit diakses wisatawan      |
| 3  | Proses reservasi masih dilakukan secara manual (telepon/chat)                |
| 4  | Pengelola kesulitan memperbarui informasi wisata secara real-time            |
| 5  | Belum ada media galeri terpusat untuk menampilkan keindahan desa             |

### 2.3 Solusi

Membangun website modern dan responsif yang menjadi pusat informasi dan pemesanan wisata desa, dilengkapi dengan dashboard admin yang mudah digunakan untuk mengelola seluruh konten secara mandiri.

---

## 3. Tujuan Produk

### 3.1 Tujuan Bisnis

| ID    | Tujuan                                                                       |
|-------|------------------------------------------------------------------------------|
| BG-01 | Meningkatkan visibilitas dan jangkauan promosi Desa Wisata Tampirkulon       |
| BG-02 | Menyediakan kanal reservasi online yang mempermudah wisatawan                |
| BG-03 | Memberdayakan pengelola desa untuk mengelola konten secara mandiri           |
| BG-04 | Meningkatkan jumlah kunjungan wisatawan ke desa                              |

### 3.2 Tujuan Produk

| ID    | Tujuan                                                                       |
|-------|------------------------------------------------------------------------------|
| PG-01 | Menyajikan informasi lengkap destinasi wisata, paket, dan aktivitas          |
| PG-02 | Menyediakan galeri visual yang menarik untuk memamerkan keindahan desa       |
| PG-03 | Menyediakan formulir reservasi online dengan konfirmasi status               |
| PG-04 | Memberikan dashboard yang intuitif untuk manajemen konten tanpa keahlian IT  |
| PG-05 | Memberikan pengalaman pengguna yang premium, modern, dan responsif           |

---

## 4. Target Pengguna

### 4.1 Persona Pengguna

#### Persona 1: Wisatawan (Pengunjung Website Publik)

| Atribut        | Detail                                                            |
|----------------|-------------------------------------------------------------------|
| **Profil**     | Wisatawan domestik, keluarga, komunitas, pecinta alam             |
| **Usia**       | 20–55 tahun                                                       |
| **Kebutuhan**  | Mencari informasi destinasi wisata, melihat galeri, memesan paket |
| **Perangkat**  | Smartphone (utama), laptop/desktop                                |
| **Tech-savvy** | Menengah — terbiasa browsing dan mengisi formulir online           |

#### Persona 2: Admin Desa (Pengguna Dashboard)

| Atribut        | Detail                                                            |
|----------------|-------------------------------------------------------------------|
| **Profil**     | Pengelola desa wisata, perangkat desa, pemuda desa                |
| **Usia**       | 25–50 tahun                                                       |
| **Kebutuhan**  | Mengelola informasi wisata, memproses reservasi, update konten    |
| **Perangkat**  | Laptop/desktop (utama), tablet                                    |
| **Tech-savvy** | Rendah–menengah — perlu antarmuka yang sangat intuitif             |

---

## 5. Fitur Produk

### 5.1 Website Publik

| ID    | Fitur                      | Prioritas | Deskripsi                                                                                      |
|-------|----------------------------|-----------|------------------------------------------------------------------------------------------------|
| PF-01 | Halaman Beranda            | P0        | Hero section, highlight kategori wisata, destinasi unggulan, statistik desa, testimonial, CTA  |
| PF-02 | Halaman Profil Desa        | P0        | Sejarah, visi misi, peta lokasi (Google Maps), info geografis & administratif                  |
| PF-03 | Halaman Destinasi Wisata   | P0        | Grid card destinasi, filter kategori, detail per destinasi (gambar, deskripsi, lokasi, tiket)   |
| PF-04 | Halaman Paket Wisata       | P0        | Pricing cards, detail fasilitas, durasi, kapasitas, CTA reservasi                              |
| PF-05 | Halaman Galeri             | P1        | Masonry grid foto/video, lightbox, filter kategori                                             |
| PF-06 | Halaman Blog/Artikel       | P1        | Daftar artikel, featured article, detail per artikel                                           |
| PF-07 | Halaman Kontak & Reservasi | P0        | Formulir reservasi, info kontak, embed Google Maps, jam operasional                            |
| PF-08 | Navigasi & Footer          | P0        | Navbar responsif (transparent → solid on scroll), footer dengan info & links                   |
| PF-09 | Animasi & Interaksi        | P1        | Scroll reveal, parallax hero, hover effects, micro-animations                                  |
| PF-10 | Responsive Design          | P0        | Mobile-first, mendukung smartphone, tablet, dan desktop                                        |

> [!NOTE]
> **Prioritas:** P0 = Must have (MVP), P1 = Should have, P2 = Nice to have

### 5.2 Admin Dashboard

| ID    | Fitur                      | Prioritas | Deskripsi                                                                                      |
|-------|----------------------------|-----------|------------------------------------------------------------------------------------------------|
| AF-01 | Login Admin                | P0        | Autentikasi email & password, single role admin                                                |
| AF-02 | Dashboard Overview         | P0        | Statistik ringkas (jumlah destinasi, paket, artikel, reservasi baru), quick actions             |
| AF-03 | Kelola Destinasi Wisata    | P0        | CRUD destinasi (nama, deskripsi, gambar, kategori, lokasi, jam buka, harga, status publish)     |
| AF-04 | Kelola Kategori Wisata     | P0        | CRUD kategori/jenis wisata, proteksi hapus jika masih ada destinasi terkait                    |
| AF-05 | Kelola Paket Wisata        | P0        | CRUD paket (nama, harga, durasi, fasilitas, destinasi terkait, kapasitas, status publish)      |
| AF-06 | Kelola Artikel Blog        | P1        | CRUD artikel (judul, konten, ringkasan, gambar, status draft/published)                        |
| AF-07 | Edit Profil Desa           | P0        | Edit semua informasi desa (sejarah, kontak, sosmed, jam operasional, dll)                      |
| AF-08 | Kelola Galeri              | P1        | Upload/hapus foto dan video, kategorisasi, edit caption                                        |
| AF-09 | Kelola Reservasi           | P0        | Lihat daftar reservasi, filter status, update status (baru → dikonfirmasi → selesai/batal)     |
| AF-10 | Upload Gambar              | P0        | Drag & drop upload, preview, progress bar, simpan ke cloud storage                             |

---

## 6. User Stories

### 6.1 Wisatawan

| ID    | User Story                                                                                                     | Acceptance Criteria                                                         |
|-------|----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| US-01 | Sebagai wisatawan, saya ingin melihat halaman beranda yang menarik agar tertarik menjelajahi desa wisata ini   | Hero image tampil, highlight kategori, destinasi unggulan, testimonial      |
| US-02 | Sebagai wisatawan, saya ingin melihat daftar destinasi wisata dan detailnya agar bisa merencanakan kunjungan   | Grid card, filter kategori, detail page dengan gambar/deskripsi/lokasi      |
| US-03 | Sebagai wisatawan, saya ingin melihat paket wisata dan harganya agar bisa memilih sesuai budget                | Pricing cards, detail fasilitas, durasi, kapasitas, tombol pesan            |
| US-04 | Sebagai wisatawan, saya ingin melihat galeri foto agar bisa membayangkan suasana desa                          | Masonry grid, lightbox, filter kategori                                     |
| US-05 | Sebagai wisatawan, saya ingin mengisi formulir reservasi online agar tidak perlu menghubungi via telepon        | Form lengkap, validasi input, konfirmasi submit, data masuk ke database     |
| US-06 | Sebagai wisatawan, saya ingin membaca artikel tentang desa agar mendapat informasi lebih mendalam               | Daftar artikel, detail article page, gambar, tanggal                        |
| US-07 | Sebagai wisatawan, saya ingin mengakses website dari smartphone dengan tampilan yang baik                       | Layout responsif, tombol mudah diklik, gambar optimal                       |

### 6.2 Admin Desa

| ID    | User Story                                                                                                     | Acceptance Criteria                                                         |
|-------|----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| US-08 | Sebagai admin, saya ingin login ke dashboard dengan aman agar data terlindungi                                 | Login email/password, redirect ke dashboard, session persist                |
| US-09 | Sebagai admin, saya ingin melihat overview statistik agar tahu kondisi terkini                                 | Stat cards, reservasi terbaru, quick actions                                |
| US-10 | Sebagai admin, saya ingin menambah/edit/hapus destinasi wisata agar informasi selalu up-to-date                 | Form CRUD, upload gambar, pilih kategori, toggle publish                    |
| US-11 | Sebagai admin, saya ingin mengelola kategori wisata agar destinasi terorganisir                                 | CRUD kategori, proteksi hapus jika ada destinasi terkait                    |
| US-12 | Sebagai admin, saya ingin mengelola paket wisata agar wisatawan bisa melihat penawaran terbaru                 | Form CRUD, multi-select destinasi, array fasilitas, pricing                 |
| US-13 | Sebagai admin, saya ingin menulis dan mempublikasikan artikel agar website tetap aktif                         | Create/edit artikel, basic formatting, status draft/publish                 |
| US-14 | Sebagai admin, saya ingin mengupdate profil desa agar informasi kontak dan deskripsi selalu akurat             | Form edit profil, semua field editable, save button                         |
| US-15 | Sebagai admin, saya ingin mengupload foto ke galeri agar wisatawan bisa melihat keindahan desa                 | Upload drag & drop, preview, kategorisasi, hapus                            |
| US-16 | Sebagai admin, saya ingin melihat dan mengelola reservasi yang masuk agar bisa memproses pesanan               | Tabel reservasi, filter status, update status, detail view                  |

---

## 7. Non-Functional Requirements (Ringkasan)

| Aspek            | Requirement                                                         |
|------------------|---------------------------------------------------------------------|
| **Performa**     | Halaman utama load < 3 detik pada koneksi 3G                       |
| **Responsif**    | Optimal di mobile (≥ 375px), tablet (≥ 768px), desktop (≥ 1024px)  |
| **Keamanan**     | Auth via Supabase, RLS pada database, HTTPS                        |
| **Ketersediaan** | Mengikuti uptime Supabase (99.9%)                                  |
| **Browser**      | Chrome, Firefox, Safari, Edge (2 versi terakhir)                   |
| **Bahasa**       | Bahasa Indonesia                                                    |
| **Aksesibilitas**| Semantic HTML, alt text pada gambar, keyboard navigable             |

> [!TIP]
> Detail teknis lebih lengkap tersedia di dokumen SRS (Software Requirements Specification).

---

## 8. Batasan & Asumsi

### 8.1 Batasan

| No | Batasan                                                                          |
|----|----------------------------------------------------------------------------------|
| 1  | Website bersifat informasional dan reservasi, bukan e-commerce / pembayaran online|
| 2  | Reservasi hanya mengirimkan data, konfirmasi & pembayaran dilakukan di luar sistem|
| 3  | Storage gambar terbatas 1GB (Supabase free tier)                                  |
| 4  | Tidak ada fitur multi-bahasa (hanya Bahasa Indonesia)                             |
| 5  | Single admin role, tidak ada pembagian hak akses                                  |

### 8.2 Asumsi

| No | Asumsi                                                                           |
|----|----------------------------------------------------------------------------------|
| 1  | Pengelola desa memiliki akses internet dan perangkat (laptop/smartphone)          |
| 2  | Pengelola desa bersedia mengikuti pelatihan singkat untuk menggunakan dashboard   |
| 3  | Konten awal (foto, deskripsi destinasi) akan disediakan oleh pengelola desa       |
| 4  | Supabase free tier mencukupi untuk kebutuhan awal                                 |

---

## 9. Metrik Keberhasilan

| Metrik                              | Target                    | Cara Ukur                           |
|--------------------------------------|---------------------------|--------------------------------------|
| Jumlah pengunjung website per bulan  | ≥ 500 dalam 3 bulan       | Google Analytics / Supabase logs     |
| Jumlah reservasi online per bulan    | ≥ 20 dalam 3 bulan        | Data tabel reservasi                 |
| Waktu update konten oleh admin       | < 5 menit per konten      | Observasi pengguna                   |
| Kepuasan pengguna dashboard          | ≥ 4/5 rating              | Survey pengelola desa                |

---

## 10. Roadmap

| Fase    | Scope                                              | Estimasi       |
|---------|-----------------------------------------------------|----------------|
| Fase 1  | Website publik (7 halaman) + setup Supabase         | Minggu 1–2     |
| Fase 2  | Admin dashboard (login, overview, CRUD konten)       | Minggu 2–3     |
| Fase 3  | Integrasi, testing, dan polish                       | Minggu 3–4     |
| Fase 4  | Deploy, pelatihan admin, go-live                     | Minggu 4       |

---

## 11. Risiko

| Risiko                                         | Dampak  | Mitigasi                                              |
|------------------------------------------------|---------|-------------------------------------------------------|
| Admin kesulitan menggunakan dashboard          | Tinggi  | UI intuitif, pelatihan, tooltip/guide                 |
| Konten foto/deskripsi belum tersedia           | Sedang  | Sediakan placeholder, panduan pengisian               |
| Supabase free tier mencapai limit              | Rendah  | Monitoring usage, optimisasi gambar sebelum upload     |
| Website lambat di koneksi rendah               | Sedang  | Lazy loading, optimisasi gambar, minimal JS            |
