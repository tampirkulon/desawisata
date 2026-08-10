# Design Spec: Custom Footer Website (Opsi B - Lengkap & Modular)

## Ringkasan
Menambahkan sistem kustomisasi footer website secara lengkap dan modular yang dapat dikelola langsung oleh admin desa melalui halaman **Pengaturan Profil Desa** (`src/admin/pages/profil.js`).

---

## 1. Field Pengaturan Footer pada Profil Desa

### A. Deskripsi / Narasi Singkat Footer
- **Field**: `footer_deskripsi` (Textarea, 2-3 baris).
- **Fallback**: Jika kosong, menggunakan narasi default desa: *"Desa Wisata Tampirkulon adalah destinasi yang memadukan keindahan alam pegunungan dengan kearifan lokal yang kental. Kami berkomitmen untuk melestarikan warisan budaya dan alam demi masa depan yang berkelanjutan."*

### B. Teks Hak Cipta Kustom (*Custom Copyright*)
- **Field**: `footer_copyright` (Input text).
- **Format Otomatis**: Mendukung placeholder tahun otomatis `{year}` atau teks kustom.
- **Fallback**: Jika kosong, otomatis merender: `© {currentYear} {nama_desa}. Hak Cipta Dilindungi.`

### C. Tautan & Ikon Sosial Media di Footer
- **Field**: `footer_show_social` (Boolean, default: `true`).
- **Tampilan**: Menampilkan deretan ikon interaktif (*Instagram, YouTube, WhatsApp*) di bawah deskripsi footer dengan link aktif dari data profil desa (`instagram`, `youtube`, `whatsapp`).

### D. Kustomisasi Menu Tautan Cepat (*Quick Links*)
- **Field**: `footer_quick_links` (Array of strings / keys, default: `['beranda', 'destinasi', 'paket', 'profil', 'galeri', 'blog']`).
- **UI Admin**: Checkbox toggle interaktif untuk masing-masing menu:
  - ☑️ Beranda (`#/`)
  - ☑️ Destinasi Wisata (`#/destinasi`)
  - ☑️ Paket Wisata (`#/paket`)
  - ☑️ Profil Desa (`#/profil`)
  - ☑️ Galeri Foto (`#/galeri`)
  - ☑️ Blog Artikel (`#/blog`)

---

## 2. Komponen Footer Publik (`src/components/footer.js`)

### Struktur Tata Letak:
1. **Kolom 1 - Identitas & Narasi**:
   - Judul: `nama_desa`
   - Paragraf: `footer_deskripsi` (atau default)
   - Ikon Sosial Media: Ikon Instagram, YouTube, dan WhatsApp dengan efek hover modern jika `footer_show_social` aktif.
2. **Kolom 2 - Tautan Cepat**:
   - Judul: *"Tautan Cepat"*
   - Menampilkan hanya menu yang diaktifkan di `footer_quick_links`.
3. **Kolom 3 - Kontak Resmi**:
   - Alamat, WhatsApp/Telepon, Email resmi desa.
4. **Baris Bawah (Bottom Bar)**:
   - Copyright: `footer_copyright`
   - Tautan Portal Pengelola Desa (`#/admin/login`).

---

## 3. Data Store & Fallback (`src/utils/profile-store.js` & `src/data/seed.js`)
- Memastikan field-field baru tersimpan ke Supabase `profil_desa` (atau JSON storage lokal) dan memiliki default yang aman pada `mockData.profil_desa`.

---

## 4. Rencana Verifikasi
- Jalankan `npm test` untuk memverifikasi logika render footer dengan custom payload.
- Jalankan `npm run build` untuk memverifikasi tidak ada error sintaks.
- Buka browser dan ubah teks footer di admin profil desa, lalu cek hasilnya langsung pada halaman publik.
