# Spesifikasi Desain: Panduan Pengelolaan & Operasional Website Resmi Desa Wisata Tampirkulon

**Tanggal**: 2026-09-03  
**Target Publikasi**: Medium  
**Berkas Luaran**: `PANDUAN_ADMIN.md` di direktori utama (root) repositori  
**Target Pembaca**: Pengelola BUMDes / Pokdarwis / Tim Pengelola Desa Wisata Tampirkulon yang sebelumnya mengelola kanal media sosial dan kini memegang tanggung jawab tata kelola CMS portal resmi desa.

---

## 1. Latar Belakang & Tujuan Dokumen

### 1.1 Masalah & Kebutuhan
Desa Wisata Tampirkulon memiliki sistem portal dan Content Management System (CMS) mandiri berbasis web SPA (Single Page Application) yang mengintegrasikan basis data Supabase untuk manajemen destinasi, paket wisata, artikel warta desa, galeri dokumentasi, layanan reservasi kunjungan, dan ulasan publik. 

Pengelola desa pada umumnya lebih akrab dengan alur kerja media sosial seperti mengunggah gambar, menulis takarir (*caption*), dan bertukar pesan instan. Namun, pengelolaan website resmi memiliki karakteristik yang jauh lebih menuntut dalam hal:
- **Keabsahan dan akurasi data**: Tiket, jam buka, dan fasilitas yang tercantum menjadi rujukan hukum dan kesepakatan publik.
- **Struktur informasi jangka panjang**: Data terindeks dalam katalog permanen, bukan linimasa sesaat (*ephemeral*).
- **Integritas data reservasi**: Alur penanganan data tamu, verifikasi tanggal kunjungan, dan nomor kontak wisatawan.

### 1.2 Tujuan Panduan
Menyediakan panduan komprehensif siap salin untuk dipublikasikan di Medium yang mengedepankan **Standar Operasional Prosedur (SOP) formal dan instruksional**, dengan catatan jembatan pemahaman cara kerja web tanpa mereduksi website menjadi sekadar alat media sosial.

---

## 2. Struktur Dokumen `PANDUAN_ADMIN.md`

Draf panduan di Medium akan disusun secara modular, runtut, dan mudah dipindai (*scannable*):

### Judul & Header
- **Judul Artikel**: *Panduan Lengkap Tata Kelola Website Resmi Desa Wisata Tampirkulon: Panduan Operasional untuk Pengelola Desa*
- **Subjudul**: *Pedoman standar operasional (SOP) pembaruan konten, katalog wisata, dan layanan reservasi digital secara profesional.*
- **Waktu Baca**: ~8–10 Menit.

### Bagian 1: Pengantar & Kedudukan Strategis Website Desa
- Peran website sebagai portal rujukan utama wisatawan, media transparansi, dan aset digital permanen desa.
- Perbedaan esensial antara website resmi vs akun media sosial:
  - Media sosial: Untuk jangkauan promosi cepat dan interaksi spontan.
  - Website resmi: Untuk rujukan resmi informasi valid (jam buka, harga resmi tiket, paket wisata), data terindeks mesin pencari Google (SEO), dan pencatatan reservasi yang terpusat.

### Bagian 2: Hak Akses & Keamanan Sistem
- Alur masuk (*login*) ke Dashboard Admin (`#/admin/login`).
- Penjelasan tata kelola akun dan kredensial pengelola.
- SOP pergantian sandi secara berkala dan larangan pembagian akses akun tanpa otorisasi.
- Navigasi antarmuka Dashboard (Sidebar Menu, Topbar, Status Sesi).

### Bagian 3: Tata Kelola Inti Layanan Wisata (Katalog Destinasi & Paket)
- **Modul Destinasi Wisata**:
  - Prosedur input data destinasi baru (Nama, Deskripsi, Kategori, Harga Tiket Masuk, Jam Operasional).
  - Ketentuan pemilihan foto utama (*landscape* jernih, resolusi memadai).
  - Prosedur sunting (*update*) data tiket jika ada penyesuaian tarif retribusi desa.
- **Modul Paket Wisata**:
  - Penyusunan paket kegiatan (Family gathering, edukasi petik buah/durian, tur budaya).
  - Rincian fasilitas tercakup, kapasitas minimal/maksimal, dan durasi kunjungan.
- **Modul Kategori**:
  - Penataan klasifikasi wisata (Agrowisata, Wisata Alam, Wisata Budaya, Wisata Kuliner).

### Bagian 4: Pengelolaan Publikasi & Arsip Dokumentasi Kegiatan
- **Modul Artikel & Warta Desa**:
  - Peran artikel untuk publikasi kegiatan resmi, agenda festival tahunan, dan edukasi potensi lokal.
  - Alur penerbitan: Judul baku informatif, pemilihan gambar sampul (*cover*), pemilihan kategori, penulisan isi, dan pengaturan status (*draft* vs *publish*).
- **Modul Galeri Foto Dokumentasi**:
  - Kurasi arsip visual desa.
  - Prosedur pengunggahan foto, pemberian judul/deskripsi konteks acara, dan penentuan kategori dokumentasi.

### Bagian 5: Layanan Tamu & Manajemen Umpan Balik Pengunjung
- **Modul Reservasi Kunjungan**:
  - Membaca dan meninjau daftar pesanan masuk dari form reservasi publik.
  - Memahami status reservasi (`Menunggu Konfirmasi`, `Dikonfirmasi`, `Selesai`, `Dibatalkan`).
  - SOP tindak lanjut kontak ke wisatawan via WhatsApp resmi pengelola desa.
- **Modul Ulasan & Testimoni**:
  - Prinsip keterbukaan informasi dan penanganan komplain wisatawan.
  - SOP moderasi ulasan (visibilitas ulasan publik dan evaluasi internal BUMDes/Pokdarwis).

### Bagian 6: Pemeliharaan Identitas Resmi & Kontak Desa
- **Modul Profil Desa**:
  - Pembaruan deskripsi sejarah desa, visi & misi, serta struktur kelembagaan.
  - Pemutakhiran kontak resmi: Nomor WhatsApp layanan informasi, alamat email, dan tautan kanal resmi media sosial.
  - Pengaturan koordinat peta lokasi Google Maps.

### Bagian 7: Pedoman Mutu Konten & Visual
- Spesifikasi teknis aset gambar (Rasio aspek, pencahayaan alami, kompresi file agar website tetap cepat diakses).
- Kaidah penulisan teks informasi resmi: Penggunaan Bahasa Indonesia baku, kesantunan bertutur, kejelasan detail harga, dan penulisan nomor kontak.

### Bagian 8: Lembar Checklist Operasional Rutin Admin
- Tabel tugas harian (Cek reservasi, periksa pesan masuk).
- Tabel tugas mingguan (Kurasi foto galeri, publikasi warta/kegiatan baru).
- Tabel tugas bulanan (Audit harga tiket, pemutakhiran jam operasional, backup/evaluasi statistik pengunjung).

---

## 3. Elemen Visual & Tipografi Khusus Medium

Untuk mengoptimalkan keterbacaan di platform Medium:
- **Blok Placeholder Tangkapan Layar**:
  Format: `> 📷 [Tangkapan Layar: Formulir Input Destinasi Baru dengan kolom Nama, Kategori, Harga Tiket, dan Jam Buka]`
- **Kotak Catatan Pengelola**:
  Format blockquote dengan penanda khusus:
  - `💡 Catatan Operasional`: Petunjuk teknis untuk mempercepat tugas admin.
  - `⚠️ Standar Validasi Data`: Ketentuan mutlak terkait keakuratan harga, jam operasional, dan keamanan sistem.
- **Tabel Ringkas**: Untuk pemetaan tugas rutin dan checklist pengelola.

---

## 4. Rencana Verifikasi Dokumen
- Memastikan seluruh modul admin di codebase (`src/admin/pages/`: `overview`, `destinasi`, `kategori`, `paket`, `artikel`, `galeri`, `reservasi`, `ulasan`, `profil`) terdokumentasikan dengan tepat tanpa ada menu yang terlewat.
- Memastikan tidak ada istilah gaul atau analogi medsos berlebihan yang merusak marwah dokumen resmi desa.
- Memastikan format Markdown kompatibel langsung saat disalin dan ditempel ke editor Medium.
