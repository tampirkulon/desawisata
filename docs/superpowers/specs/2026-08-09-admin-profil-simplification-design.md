# Design Spec: Penyederhanaan Halaman Pengaturan Profil Desa

## 1. Ringkasan & Tujuan
Menyederhanakan antarmuka dan alur interaksi pada halaman Pengaturan Profil Desa di Dashboard Admin ([src/admin/pages/profil.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/profil.js)) agar jauh lebih simpel, intuitif, dan semudah mungkin digunakan oleh pengelola desa tanpa kebingungan teknis.

---

## 2. Keputusan Desain Utama

### A. Tata Letak (Layout)
- **Single Page All-in-One (Tanpa Tab Terpisah):** Menghilangkan navigasi tab yang mengharuskan klik bolak-balik. Seluruh formulir tersusun dalam satu halaman dengan section card yang terkelompok secara rapi dan logis.
- **Section Grouping:**
  1. **Identitas & Info Desa:** Nama Desa, Luas Wilayah, Populasi, Jam Operasional.
  2. **Sejarah, Visi & Misi:** Teks sejarah desa, visi desa, dan misi desa (1 poin per baris).
  3. **Media Visual:** Logo Desa & Banner Foto Utama dengan uploader WebP drag-and-drop / klik.
  4. **Kontak, Medsos & Peta:** Alamat kantor, Nomor WhatsApp, Telepon, Email, Instagram, YouTube, dan Peta Google Maps.

### B. Smart Input Helpers & Pengalaman Pengguna
- **Fleksibilitas Google Maps:** Mendukung input URL Google Maps langsung (link lokasi) maupun kode `<iframe>` embed. Sistem akan otomatis memproses dan menampilkan live preview peta.
- **Format Otomatis WhatsApp:** Membantu memvalidasi dan memformat input nomor WhatsApp (misal input `0812...` otomatis disesuaikan).
- **Sticky Save Bar:** Bar penyimpanan melayang (sticky) di bagian bawah yang selalu terlihat saat halaman di-scroll dengan indikator status dan notifikasi toast sukses, **tanpa tombol "Lihat Halaman Publik"** sesuai preferensi pengguna.

---

## 3. Data Flow & Sinkronisasi
- **Admin Input (`src/admin/pages/profil.js`):** Menggunakan `getProfilDesa()` untuk memuat data awal dan `saveProfilDesa(payload)` untuk menyimpan.
- **Penyimpanan:** Data disimpan ke in-memory cache, `localStorage` (`desa_wisata_profil`), dan Supabase (`profil_desa` table).
- **Target Tampilan Publik:** Hanya berdampak langsung pada halaman profil publik [src/pages/profil.js](file:///home/aniiporangbaik/development/projects/desawisata/src/pages/profil.js) (Sejarah, Visi Misi, Sidebar Info, Jam Operasional, Kontak, WhatsApp, dan Maps).

---

## 4. Rencana Verifikasi
1. Membuka dan menguji form pengaturan profil desa di dashboard admin: seluruh section terlihat jelas tanpa tab.
2. Mengisi/memperbarui setiap field (nama desa, sejarah, visi misi, foto, kontak, peta).
3. Mengklik tombol sticky "Simpan Seluruh Perubahan".
4. Memverifikasi bahwa data tersimpan persisten dan langsung ter-update di halaman `#/profil`.
5. Menjalankan `npm run build` untuk memastikan tidak ada lint/build issue.
