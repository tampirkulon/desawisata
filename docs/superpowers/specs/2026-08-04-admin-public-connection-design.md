# Design Spec — Menyambungkan Halaman Publik dengan Halaman Admin (Opsi A)

## Goal

Menghubungkan Halaman Publik dan Halaman Admin Desa Wisata Tampirkulon secara dua arah (bidirectional), sehingga data, navigasi, reservasi, dan moderasi konten terintegrasi secara penuh dan real-time.

---

## Architecture & Subsystems

### 1. Public Content Detail Viewers
- **Detail Artikel Blog**:
  - Pengunjung mengeklik kartu artikel di `#/blog` atau `#/` ➔ membuka modal pembaca artikel penuh (`src/components/article-modal.js`).
  - Menampilkan judul, kategori, tanggal rilis, gambar utama, dan isi konten lengkap.
- **Detail Destinasi Wisata**:
  - Pengunjung mengeklik kartu destinasi di `#/destinasi` atau `#/` ➔ membuka modal detail destinasi (`src/components/destinasi-modal.js`).
  - Menampilkan gambar utama, galeri foto (`gambar_urls`), lokasi, jam buka, harga tiket, deskripsi lengkap, dan tombol CTA `"Pesan Kunjungan Ini"`.

### 2. Enhanced Direct Booking & Notifikasi Admin
- **Prefill Parameter Booking (`#/kontak`)**:
  - `#/kontak` mendukung query params `paket_id` DAN `destinasi_id`.
  - Jika `destinasi_id` di-pass, formulir secara otomatis mengisi catatan/pilihan destinasi sasaran.
- **Notifikasi Reservasi Baru di Admin Header**:
  - `renderAdminHeader` melakukan kueri count reservasi dengan `status = 'baru'`.
  - Menampilkan badge jumlah notifikasi merah pada ikon lonceng di header admin.

### 3. Form Testimoni Publik & Moderasi Admin
- **Submit Testimoni Publik (`#/`)**:
  - Menambahkan tombol `"Tulis Ulasan / Kesan"` pada seksi Testimoni Beranda.
  - Membuka modal input: Nama, Asal Kota, Pesan/Ulasan, dan Rating (1-5 Bintang).
  - Menyimpan ke Supabase `testimoni` dengan `is_shown = false` (default pendam/unmoderated).
- **Moderasi Admin**:
  - Pada `#/admin/overview` (atau modal pengelola), Admin dapat melihat daftar ulasan masuk dan memilih `"Setujui & Tampilkan"` (`is_shown = true`) atau `"Hapus"`.
  - Ulasan yang disetujui langsung muncul di carousel testimoni Halaman Utama.

### 4. Navigasi Dua Arah & Floating Admin Bar
- **Tombol "Lihat Website Utama" di Header Admin**:
  - Menambahkan tombol aksi di `renderAdminHeader` untuk membuka `#/` di tab baru/navigasi cepat.
- **Link Portal Pengelola di Footer Publik**:
  - Menambahkan link `"Portal Pengelola Desa"` pada `renderFooter`.
- **Floating Admin Bar (`src/components/admin-bar.js`)**:
  - Jika admin sedang mempunyai sesi aktif (login Supabase), bar melayang (glassmorphism) akan muncul di bagian bawah halaman publik:
    `"🛡️ Mode Pengelola Aktif | [Edit Halaman Ini di Admin] | [Dashboard Admin]"`

---

## File Changes & Structural Design

| Component / File | Scope | Responsibilities |
|------------------|-------|------------------|
| `src/components/article-modal.js` | NEW | Modal pembaca artikel blog publik |
| `src/components/destinasi-modal.js` | NEW | Modal detail destinasi & galeri foto |
| `src/components/testimoni-modal.js` | NEW | Modal submit ulasan pengunjung publik |
| `src/components/admin-bar.js` | NEW | Floating toolbar admin pada halaman publik |
| `src/components/navbar.js` | MODIFY | Integrasi `admin-bar` saat admin terautentikasi |
| `src/components/footer.js` | MODIFY | Tambahkan link Portal Pengelola Desa |
| `src/pages/beranda.js` | MODIFY | Integrasi modal detail artikel, detail destinasi, & submit testimoni |
| `src/pages/destinasi.js` | MODIFY | Integrasi modal detail destinasi & galeri foto |
| `src/pages/blog.js` | MODIFY | Integrasi modal pembaca artikel blog |
| `src/pages/kontak.js` | MODIFY | Support parameter `destinasi_id` pada form reservasi |
| `src/admin/components/header.js` | MODIFY | Tambahkan tombol "Lihat Situs Publik" & badge notifikasi reservasi live |
| `src/admin/pages/overview.js` | MODIFY | Tambahkan kartu moderasi testimoni & statistik reservasi baru |

---

## Testing & Verification Plan

1. **Detail Viewer Check**: Klik kartu artikel di `#/blog` ➔ modal artikel muncul. Klik kartu destinasi di `#/destinasi` ➔ modal destinasi muncul.
2. **Booking Flow Check**: Klik "Pesan" dari modal destinasi ➔ terarah ke `#/kontak?destinasi_id=...` dengan data ter-prefill ➔ submit ➔ badge notifikasi di Admin Header bertambah.
3. **Testimoni Moderation Check**: Submit testimoni dari `#/` ➔ tidak langsung muncul ➔ login admin `#/admin/overview` ➔ klik "Setujui" ➔ refresh `#/` ➔ testimoni baru muncul.
4. **Admin Bar Check**: Login Admin ➔ buka `#/` ➔ floating admin bar muncul di bawah ➔ klik "Dashboard" ➔ kembali ke Admin.
5. **Build Verification**: `npm run build` sukses 0 error.
