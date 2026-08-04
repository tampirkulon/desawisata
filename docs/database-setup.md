# Panduan Pengelolaan & Eksekusi Database Supabase

Dokumen ini menjelaskan tata cara mengelola, memeriksa, dan mengeksekusi database Supabase untuk proyek **Desa Wisata Tampirkulon**.

---

## 1. Status Database Live
- **Project URL**: `https://lmnaeavawmdqnxejosle.supabase.co`
- **Project Ref**: `lmnaeavawmdqnxejosle`
- **Tabel Publik yang Aktif**:
  1. `kategori_wisata`
  2. `destinasi`
  3. `paket_wisata`
  4. `artikel`
  5. `galeri`
  6. `profil_desa`
  7. `reservasi`
  8. `testimoni`

---

## 2. Pemeriksaan Database via Terminal (Utility Script)

Untuk memverifikasi koneksi dan data tabel secara cepat tanpa perlu membuka browser, jalankan perintah berikut di root proyek:

```bash
node scripts/db-query.js
```

Script ini akan secara otomatis membaca kredensial dari file `.env` dan menampilkan jumlah baris data serta status dari setiap tabel.

---

## 3. Eksekusi SQL & Seed Data (Supabase SQL Editor)
Jika ingin menginputkan data awal (seed data) atau mengubah struktur tabel:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) proyek `lmnaeavawmdqnxejosle`.
2. Masuk ke **SQL Editor**.
3. Untuk menginput data sampel awal, salin isi file `supabase/seed.sql`, tempel di editor, lalu klik **Run**.

---

## 4. Konfigurasi MCP Server Token (Optional)
Token Supabase Personal Access Token (`sbp_...`) digunakan untuk mengizinkan MCP Server mengeksekusi perintah manajemen proyek dari environment luar. Kredensial aktif proyek ini terikat dengan `lmnaeavawmdqnxejosle`.

---

## 5. Solusi Upload Gambar / Supabase Storage RLS
Jika muncul notifikasi error RLS saat upload gambar (`new row violates row-level security policy`), salin dan jalankan skrip berikut di **SQL Editor Supabase**:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Read Images Storage" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin Upload Images Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Admin Update Images Storage" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Admin Delete Images Storage" ON storage.objects FOR DELETE USING (bucket_id = 'images');
```

