# Panduan Pengelolaan Website Desa Wisata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyusun dokumen panduan operasional komprehensif dan formal (`PANDUAN_ADMIN.md`) di root proyek yang siap disalin langsung ke platform Medium untuk pengelola Desa Wisata Tampirkulon.

**Architecture:** Dokumen disusun dalam format Markdown ramah Medium, memadukan Standar Operasional Prosedur (SOP) resmi desa dengan jembatan konsep praktis bagi pengelola yang terbiasa menggunakan media sosial, serta placeholder tangkapan layar antarmuka CMS admin yang terstruktur.

**Tech Stack:** Markdown (GitHub Flavored & Medium-compatible), SPA Vanilla JS CMS (`src/admin/*`).

## Global Constraints
- Bahasa: Formal Instruksional (SOP resmi pengelola desa), santun, informatif, dan tidak berlebihan dalam analogi media sosial.
- Format Media: Terdapat placeholder tangkapan layar berlabel `> 📷 [Tangkapan Layar: ...]` dengan deskripsi objek yang presisi.
- Callout: Menggunakan penanda `💡 Catatan Operasional` dan `⚠️ Standar Validasi Data`.
- Lokasi Target Berkas: `PANDUAN_ADMIN.md` di direktori utama repositori.

---

### Task 1: Penyusunan Dokumen Panduan Admin Lengkap (`PANDUAN_ADMIN.md`)

**Files:**
- Create: `PANDUAN_ADMIN.md`

**Interfaces:**
- Menghubungkan seluruh fungsi CMS yang ada di `src/admin/pages/` (`overview.js`, `destinasi.js`, `kategori.js`, `paket.js`, `artikel.js`, `galeri.js`, `reservasi.js`, `ulasan.js`, `profil.js`).

- [ ] **Step 1: Tulis berkas `PANDUAN_ADMIN.md` secara lengkap dan mendalam**
Menuliskan seluruh bab panduan mulai dari Pengantar & Filosofi Portal Resmi Desa, Hak Akses & Keamanan Akun, Katalog Destinasi & Paket, Publikasi Berita & Galeri, Layanan Reservasi & Moderasi Ulasan, Pengaturan Identitas Desa, Standar Mutu Visual & Teks, hingga Lembar Checklist Rutin Pengelola.

- [ ] **Step 2: Verifikasi kelengkapan isi panduan terhadap modul di `src/admin/`**
Periksa bahwa seluruh 8 menu navigasi utama dan 1 menu pengaturan di sidebar admin (`src/admin/components/sidebar.js`) telah terwakili dan dijelaskan secara operasional.

- [ ] **Step 3: Commit dokumen `PANDUAN_ADMIN.md`**
```bash
git add PANDUAN_ADMIN.md
git commit -m "docs: buat panduan pengelolaan website desa wisata format Medium (PANDUAN_ADMIN.md)"
```

---

### Task 2: Verifikasi Keterbacaan dan Format Kompatibilitas Medium

**Files:**
- Inspect: `PANDUAN_ADMIN.md`

- [ ] **Step 1: Audit placeholder visual dan blok kutipan (Callout)**
Pastikan setiap placeholder gambar memiliki deskripsi framing tangkapan layar yang jelas, dan penanda callout konsisten.

- [ ] **Step 2: Pastikan ketiadaan analogi berlebihan yang mereduksi website**
Periksa narasi untuk memastikan nada formal instruksional terjaga sesuai arahan pengguna ("jangan terlalu disamakan dengan medsos").

- [ ] **Step 3: Commit verifikasi akhir jika ada penyesuaian**
```bash
git add PANDUAN_ADMIN.md
git commit -m "docs: rapikan tipografi dan format Medium panduan admin"
```
