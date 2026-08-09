# 🌿 Desa Wisata Tampirkulon

Website resmi dan sistem manajemen konten (CMS) untuk **Desa Wisata Tampirkulon**, Kecamatan Candimulyo, Kabupaten Magelang, Jawa Tengah. Platform ini menyajikan informasi ekowisata alam, agrowisata kebun durian, kekayaan seni budaya lokal, pemesanan paket wisata, serta media publikasi desa.

---

## ✨ Fitur Utama

### 🌐 Halaman Publik
- **Beranda**: Hero section imersif dengan *ambient glass accents*, ringkasan kategori unggulan, destinasi terpopuler, ulasan pengunjung, dan banner ajakan interaktif.
- **Profil Desa**: Informasi sejarah, visi & misi, demografi wilayah, struktur kelembagaan, serta peta lokasi Google Maps interaktif.
- **Destinasi Wisata**: Katalog destinasi lengkap dengan filter kategori, detail harga tiket, jam operasional, dan modal deskripsi interaktif.
- **Paket Wisata**: Pilihan paket liburan keluarga, edukasi, dan gathering dengan rincian fasilitas serta estimasi biaya.
- **Galeri Foto**: Dokumentasi visual keindahan alam dan kegiatan desa dilengkapi **filter kategori**, **lightbox viewer**, dan **sistem pagination dinamis**.
- **Kisah & Berita (Blog)**: Catatan perjalanan, pengumuman festival tahunan, dan artikel kebudayaan dengan **featured hero** dan **pagination**.
- **Kontak & Reservasi**: Formulir pemesanan kunjungan langsung, integrasi chat WhatsApp, serta tautan media sosial resmi.

### 🛡️ Dashboard Admin (CMS)
- **Autentikasi Aman**: Login berbasis Supabase Auth untuk pengelola desa.
- **Dashboard Overview**: Ringkasan metrik statistik kunjungan, status reservasi masuk, serta shortcut aksi cepat.
- **Manajemen Konten Lengkap**:
  - Profil Desa & Kontak
  - Destinasi Wisata & Kategori
  - Paket Wisata
  - Galeri Dokumentasi
  - Artikel & Berita
  - Reservasi Kunjungan & Testimoni Pengunjung

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Keterangan |
|---|---|
| **Vanilla JavaScript (ES Modules)** | Logika aplikasi modular & routing SPA tanpa overhead framework berat |
| **Vite** | Build tool generasi baru yang sangat cepat dan ringan |
| **Tailwind CSS v4** | Sistem utilitas CSS modern untuk desain antarmuka kustom |
| **Supabase** | Backend-as-a-Service (PostgreSQL database, Authentication, & Storage) |
| **Material Symbols** | Ikonografi modern dari Google Fonts |

---

## 🚀 Memulai (Quick Start)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- [npm](https://www.npmjs.com/) atau [pnpm](https://pnpm.io/)

### 2. Kloning Repository
```bash
git clone https://github.com/tampirkulon/desawisata.git
cd desawisata
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Lingkungan (.env)
Salin file `.env.example` menjadi `.env` dan sesuaikan kredensial Supabase Anda:
```bash
cp .env.example .env
```

Isi variabel di dalam `.env`:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
> **Catatan**: Jika kredensial Supabase tidak diisi, aplikasi akan otomatis beralih ke mode *Offline/Demo* menggunakan data bawaan (*fallback seed data*).

### 5. Menjalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui peramban di `http://localhost:5000` (atau port yang tertera pada terminal).

### 6. Build untuk Produksi
```bash
npm run build
```
Hasil build siap *deploy* akan tersedia di folder `dist/`.

---

## 📁 Struktur Direktori

```text
desawisata/
├── docs/                 # Dokumentasi spesifikasi, implementasi, dan referensi
├── public/               # Asset statis publik
├── scripts/              # Skrip database & utility node
├── src/
│   ├── admin/            # Halaman & komponen panel pengelola (CMS)
│   │   ├── components/   # Sidebar, topbar, modal admin, data-table
│   │   └── pages/        # Overview, destinasi, artikel, galeri, dll.
│   ├── components/       # Komponen publik (navbar, footer, modal, lightbox, pagination)
│   ├── data/             # Seed data & konfigurasi offline fallback
│   ├── lib/              # Inisialisasi library (Supabase client)
│   ├── pages/            # Halaman publik (beranda, profil, destinasi, galeri, blog, kontak)
│   ├── styles/           # CSS utama & styling dashboard
│   ├── utils/            # Helper utilitas (image converter, formatter, dll.)
│   └── main.js           # Entry point aplikasi & router SPA
├── index.html            # Template HTML utama
├── package.json          # Konfigurasi dependensi & npm scripts
├── vite.config.js        # Konfigurasi Vite & Tailwind CSS
└── README.md             # Dokumentasi proyek
```

---

## 📜 Skrip yang Tersedia

- `npm run dev`: Menjalankan Vite development server lokal.
- `npm run build`: Membangun bundle produksi yang telah dioptimasi ke direktori `dist/`.
- `npm run preview`: Menjalankan server lokal untuk menguji bundle hasil build `dist/`.
- `npm run db:check`: Memeriksa konektivitas dan struktur tabel database Supabase.
- `npm run db:seed`: Menginisialisasi data awal (*seeding*) ke database Supabase.

---

## 🤝 Kontribusi

Kontribusi, saran perbaikan, dan laporan kendala selalu diterima!
1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/nama-fitur`)
3. Commit perubahan Anda (`git commit -m "feat: tambah fitur baru"`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Ajukan *Pull Request*

---

## 📄 Lisensi

Proyek ini dikembangkan untuk komunitas **Desa Wisata Tampirkulon**. Hak Cipta dilindungi undang-undang.
