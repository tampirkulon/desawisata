# Spesifikasi Desain: Redesain Admin Panel Desa Wisata Tampirkulon (Donezo UI System)

## 1. Ringkasan & Tujuan
Dokumen ini mendefinisikan redesain antarmuka (UI/UX) untuk **seluruh Admin Panel Desa Wisata Tampirkulon** dengan mengadopsi estetika dan sistem tata letak modern ala **Donezo UI Dashboard**. 

Redesain ini bertujuan untuk menciptakan pusat kendali (*command center*) yang sangat estetis, intuitif, dan responsif bagi Pengelola Desa Wisata (Pokdarwis), dengan warna hijau khas desa (`#316342`), sudut kartu membulat (24px radius), tata letak grid widget yang kaya informasi, serta aksi cepat terintegrasi.

---

## 2. Sistem Desain (Design System & Theme)

### A. Palet Warna & Aksentuasi
* **Primary Brand Green**: `#316342` (Digunakan untuk Hero Card, tombol utama, indikator aktif, dan aksen penting)
* **Primary Container / Light Green**: `#4A7C59` & `#E1FFE5`
* **Accent Sage**: `#4ADE80` / `#86EFAC`
* **Background Body**: `#F4F6F5` (Off-white / light slate)
* **Surface Card**: `#FFFFFF` (Solid white dengan `border-radius: 24px` dan bayangan halus `box-shadow: 0 4px 20px rgba(0,0,0,0.03)`)
* **Border Line**: `#E5E7EB` / `#E2E8F0` (1px solid crisp border)
* **Text Colors**: Dark Slate `#1C1B1B` (Headings), Neutral `#475569` (Body), Muted `#94A3B8` (Labels/Subtitles)

### B. Tipografi & Ikon
* **Headings**: `Outfit`, sans-serif (Font Weight 700 / 800)
* **Body & Labels**: `Inter`, sans-serif
* **Iconography**: `Google Material Symbols Outlined` (clean 20px / 24px)

---

## 3. Komponen Utama Layout Admin (Global Layout)

```
+---------------------------------------------------------------------------------------------------------+
| [BRAND LOGO]   |  [🔍 Search bar... ⌘F]                     [🔔 2]  [✉️]  [ (A) Pengelola Desa ]     |
| Tampirkulon    |----------------------------------------------------------------------------------------|
+----------------|                                                                                        |
| MENU           |  Halaman Utama / Content Area                                                          |
| 📊 Overview    |                                                                                        |
| 🏞️ Destinasi   |                                                                                        |
| 📦 Paket       |                                                                                        |
| 📝 Artikel     |                                                                                        |
| 🖼️ Galeri      |                                                                                        |
| 📋 Reservasi   |                                                                                        |
|                |                                                                                        |
| PENGATURAN     |                                                                                        |
| ⚙️ Profil Desa  |                                                                                        |
| 🚪 Keluar      |                                                                                        |
|                |                                                                                        |
| [CTA CARD]     |                                                                                        |
| Website Utama  |                                                                                        |
+----------------+----------------------------------------------------------------------------------------+
```

### A. Sidebar Navigasi Left Navigation (260px)
* **Header Brand**: Logo Desa Wisata & Teks "Tampirkulon Admin".
* **Grouped Menu**:
  * **MENU**: Overview, Destinasi, Paket Wisata, Artikel Blog, Galeri Foto, Reservasi
  * **PENGATURAN**: Profil Desa, Keluar (Logout)
* **Indikator Aktif**: Garis/Pill vertikal hijau `#316342` pada menu aktif dengan background soft tint.
* **Bottom Floating CTA Card**: Floating card berlatar hijau gelap dengan pola abstrak wavy, teks *"Lihat Website Utama"*, dan tombol *"Buka Website ↗"*.

### B. Top Header (Topbar)
* **Search Bar Input**: Input pencarian cepat dengan shortcut pill `Search di admin... ⌘F`.
* **Notifikasi & Pesan**: Ikon Bel Notifikasi (dengan badge jumlah reservasi `BARU`) dan Ikon Mail.
* **User Profile**: Avatar bundar, Nama Pengelola ("Pengelola Desa"), dan Email ("admin@tampirkulon.id").
* **Top Action Buttons**: Tombol "+ Tambah Data" dan "Lihat Website".

---

## 4. Spesifikasi Halaman Overview (Donezo Grid Layout)

Halaman Overview ([src/admin/pages/overview.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/overview.js)) disusun dalam 2 Baris Utama:

### Baris 1: Hero Stat Cards (4 Cards)
1. **Hero Card 1 (Dark Green Highlight `#316342`)**:
   * Label: *Reservasi Perlu Konfirmasi*
   * Nilai: Count reservasi status `BARU`
   * Sub-label: Badge persentase & ikon panah melingkar top-right
2. **Card 2 (White Card)**: *Kunjungan Selesai* (Count & trend indicator)
3. **Card 3 (White Card)**: *Total Destinasi Wisata* (Count & icon landscape)
4. **Card 4 (White Card)**: *Total Paket Wisata* (Count & icon inventory)

### Baris 2: Grid 2 Kolom (Kiri: Analytics & Tabel, Kanan: Widgets)

#### Kolom Kiri / Utama (8/12 Grid Width):
1. **Widget Analytics Tren Kunjungan (Bar Chart Visual)**:
   * Visualisasi grafik bar berbentuk kapsul membulat (Pill bar chart khas Donezo) yang menampilkan tren kunjungan bulanan / mingguan.
2. **Widget Tabel Reservasi Terbaru (Interactive Table)**:
   * Header dengan judul & filter ringkas.
   * Tabel interaktif dengan Avatar Pemesan, Nama, Paket, Tanggal, Pill Badge Status (`BARU`, `DIKONFIRMASI`, `SELESAI`, `DIBATALKAN`).
   * Tombol Aksi Langsung: **Chat WA** (`wa.me/...`) dan **Konfirmasi Cepat**.

#### Kolom Kanan / Widget Sidebar (4/12 Grid Width):
1. **Widget Pengumuman & Jadwal Hari Ini**:
   * Card pengumuman kunjungan rombongan hari ini dengan tombol aksi hijau *"Lihat Detail Kunjungan"*.
2. **Widget Donut Gauge Progress Kunjungan**:
   * Donut chart melingkar yang menampilkan persentase reservasi yang telah selesai diselenggarakan (`75% Kunjungan Selesai`).
3. **Widget Destinasi & Paket Terpopuler**:
   * Daftar 3 destinasi / paket paling banyak diminati wisatawan dilengkapi thumbnail & badge rating.

---

## 5. Penyelarasan Pada Halaman Admin Lainnya
Desain Donezo UI juga diterapkan pada halaman admin manajemen data:
- [destinasi.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/destinasi.js)
- [kategori.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/kategori.js)
- [paket.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/paket.js)
- [artikel.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/artikel.js)
- [galeri.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/galeri.js)
- [profil.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/profil.js)
- [reservasi.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/reservasi.js)

Seluruh halaman di atas akan menggunakan **Sidebar**, **Top Header Bar**, dan **Card / Table Wrapper** standar Donezo UI dengan 24px border radius.

---

## 6. Rencana Verifikasi
* **Build Validation**: Menjalankan `npm run build` untuk memastikan seluruh modul ter-compile bersih.
* **Layout & Responsivitas**: Pengujian tampilan pada layar desktop (1440px), laptop (1024px), dan mobile.
