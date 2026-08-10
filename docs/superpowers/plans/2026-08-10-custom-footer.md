# Custom Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan sistem kustomisasi footer lengkap (narasi footer, teks copyright kustom, toggle sosial media, dan pilihan tautan cepat) pada halaman profil desa dan komponen footer publik.

**Architecture:** Memperluas payload profil desa dengan field `footer_deskripsi`, `footer_copyright`, `footer_show_social`, dan `footer_quick_links`, menambahkan form Section 4 di `src/admin/pages/profil.js`, serta mengintegrasikan renderer dinamis di `src/components/footer.js`.

**Tech Stack:** Vanilla JavaScript (ES Modules), Tailwind CSS utility classes, Material Symbols & SVG Social Icons.

## Global Constraints
- Fallback default: Jika field kustom kosong, tampilkan konten standar desa tanpa merusak layout.
- Responsive: Footer tetap proporsional dan rapi pada tampilan mobile, tablet, dan desktop.
- Theme tokens: Warna `#123524` (primary), `#3E7B27` (secondary), `#EFE3C2` (tertiary/accent).

---

### Task 1: Update Footer Component (`src/components/footer.js`)

**Files:**
- Modify: `src/components/footer.js`
- Modify: `src/data/seed.js`

- [ ] **Step 1: Implementasi Renderer Kustom di `src/components/footer.js`**
  - Menerima `profilData` dengan field kustom.
  - Render social icons jika `footer_show_social !== false`.
  - Render dynamically filtered quick links sesuai `footer_quick_links`.
  - Render kustom copyright (dengan parsing `{year}` jika ada).

- [ ] **Step 2: Tambahkan default di `src/data/seed.js`**

- [ ] **Step 3: Commit Task 1**
```bash
git add src/components/footer.js src/data/seed.js
git commit -m "feat(footer): support customizable about text, copyright, social icons, and quick links"
```

---

### Task 2: Tambahkan Section 4 Pengaturan Footer di Admin Profil (`src/admin/pages/profil.js`)

**Files:**
- Modify: `src/admin/pages/profil.js`
- Modify: `src/utils/profile-store.js`

- [ ] **Step 1: Modifikasi `src/admin/pages/profil.js`**
  - Tambahkan Section 4: "4. Pengaturan Footer Website".
  - Textarea `footer_deskripsi`.
  - Input `footer_copyright`.
  - Checkbox toggle `footer_show_social`.
  - Checkbox group `footer_quick_links` (beranda, destinasi, paket, profil, galeri, blog).
  - Sambungkan ke event submit form.

- [ ] **Step 2: Pastikan `src/utils/profile-store.js` menyimpan field baru dengan aman**

- [ ] **Step 3: Commit Task 2**
```bash
git add src/admin/pages/profil.js src/utils/profile-store.js
git commit -m "feat(admin): add custom footer settings section in profil page"
```

---

### Task 3: Verifikasi & Test Suite

- [ ] **Step 1: Update `scripts/test-audit.js` dengan pengujian render footer kustom**
- [ ] **Step 2: Jalankan `npm test` dan `npm run build`**
- [ ] **Step 3: Commit Task 3**
```bash
git add scripts/test-audit.js
git commit -m "test: add custom footer component unit tests"
```
