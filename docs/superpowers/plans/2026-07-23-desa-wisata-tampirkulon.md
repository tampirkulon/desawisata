# Website Desa Wisata Tampirkulon Implementation Plan (Approved)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun platform digital resmi Website Desa Wisata Tampirkulon yang terdiri dari Website Publik responsif dan Admin Dashboard manajemen konten berbasis Vite, Vanilla JS, Vanilla CSS, Stitch MCP UI Design, dan Supabase.

**Architecture:** Single Page Application (SPA) menggunakan Vite + Vanilla JS dengan Hash Router (`#/path`). Design system terintegrasi dari visual Stitch MCP. State & API terhubung ke Supabase (PostgreSQL, Auth, Storage).

**Tech Stack:** Vite, Vanilla JavaScript (ES6+), Vanilla CSS, Google Fonts (Outfit & Inter), @supabase/supabase-js, Supabase PostgreSQL & Storage, Stitch MCP.

## Global Constraints

- Rencana ini disesuaikan untuk akun/proyek Supabase baru milik pengguna.
- Akun Admin akan dibuat secara manual oleh pengguna melalui Supabase Auth Dashboard.
- UI Design System diselaraskan menggunakan Stitch MCP.
- File SQL DDL schema (`supabase/schema.sql`) dan seed data (`supabase/seed.sql`) harus disediakan lengkap.

---

### Task 1: Stitch MCP UI Design & Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `.env.example`
- Create: `supabase/schema.sql`
- Create: `supabase/seed.sql`

- [ ] **Step 1: Panggil Stitch MCP `create_project` untuk membuat proyek 'Desa Wisata Tampirkulon'**
- [ ] **Step 2: Generate UI mockups via Stitch `generate_screen_from_text` untuk Beranda & Admin Dashboard**
- [ ] **Step 3: Inisialisasi `package.json`, `vite.config.js`, dan `.env.example`**
- [ ] **Step 4: Buat `supabase/schema.sql` (8 tabel, RLS policies, update triggers)**
- [ ] **Step 5: Buat `supabase/seed.sql` (Initial seed data profil, destinasi, paket, dll)**
- [ ] **Step 6: Install NPM dependencies (`@supabase/supabase-js`, `vite`)**

---

### Task 2: Core Design System & Utilities Setup

**Files:**
- Create: `src/styles/index.css`
- Create: `src/styles/components.css`
- Create: `src/styles/pages.css`
- Create: `src/styles/dashboard.css`
- Create: `src/lib/supabase.js`
- Create: `src/utils/router.js`
- Create: `src/utils/auth.js`
- Create: `src/components/toast.js`

- [ ] **Step 1: Implementasi Design System Tokens di `src/styles/index.css` (Deep Forest Green, Sage, Dark Navy)**
- [ ] **Step 2: Implementasi styling komponen umum di `src/styles/components.css`**
- [ ] **Step 3: Setup Supabase Client di `src/lib/supabase.js`**
- [ ] **Step 4: Implementasi Hash Router di `src/utils/router.js`**
- [ ] **Step 5: Implementasi Auth Helpers di `src/utils/auth.js`**
- [ ] **Step 6: Implementasi Toast Notification Manager di `src/components/toast.js`**

---

### Task 3: Public Website Components & Pages

**Files:**
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/components/navbar.js`
- Create: `src/components/footer.js`
- Create: `src/components/lightbox.js`
- Create: `src/pages/beranda.js`
- Create: `src/pages/profil.js`
- Create: `src/pages/destinasi.js`
- Create: `src/pages/paket.js`
- Create: `src/pages/galeri.js`
- Create: `src/pages/blog.js`
- Create: `src/pages/kontak.js`

- [ ] **Step 1: Buat `index.html` entry point**
- [ ] **Step 2: Implementasi `navbar.js` (scroll behavior & responsive drawer)**
- [ ] **Step 3: Implementasi `footer.js`**
- [ ] **Step 4: Implementasi `lightbox.js`**
- [ ] **Step 5: Implementasi Halaman Beranda (`beranda.js`)**
- [ ] **Step 6: Implementasi Halaman Profil Desa (`profil.js`)**
- [ ] **Step 7: Implementasi Halaman Destinasi Wisata (`destinasi.js`)**
- [ ] **Step 8: Implementasi Halaman Paket Wisata (`paket.js`)**
- [ ] **Step 9: Implementasi Halaman Galeri (`galeri.js`)**
- [ ] **Step 10: Implementasi Halaman Blog/Artikel (`blog.js`)**
- [ ] **Step 11: Implementasi Halaman Kontak & Reservasi (`kontak.js`)**
- [ ] **Step 12: Wire-up `src/main.js` dengan SPA Router**

---

### Task 4: Admin Dashboard - Auth & Shell

**Files:**
- Create: `src/admin/pages/login.js`
- Create: `src/admin/components/sidebar.js`
- Create: `src/admin/components/header.js`

- [ ] **Step 1: Implementasi Halaman Login Admin (`src/admin/pages/login.js`)**
- [ ] **Step 2: Implementasi Sidebar Component (`src/admin/components/sidebar.js`)**
- [ ] **Step 3: Implementasi Header Component (`src/admin/components/header.js`)**

---

### Task 5: Admin Dashboard - Management Modules

**Files:**
- Create: `src/admin/components/data-table.js`
- Create: `src/admin/components/modal.js`
- Create: `src/admin/components/image-upload.js`
- Create: `src/admin/pages/overview.js`
- Create: `src/admin/pages/destinasi.js`
- Create: `src/admin/pages/kategori.js`
- Create: `src/admin/pages/paket.js`
- Create: `src/admin/pages/artikel.js`
- Create: `src/admin/pages/profil.js`
- Create: `src/admin/pages/galeri.js`
- Create: `src/admin/pages/reservasi.js`

- [ ] **Step 1: Implementasi `data-table.js`, `modal.js`, dan `image-upload.js`**
- [ ] **Step 2: Implementasi Admin Overview (`overview.js`)**
- [ ] **Step 3: Implementasi CRUD Destinasi (`destinasi.js`)**
- [ ] **Step 4: Implementasi CRUD Kategori Wisata (`kategori.js`)**
- [ ] **Step 5: Implementasi CRUD Paket Wisata (`paket.js`)**
- [ ] **Step 6: Implementasi CRUD Artikel (`artikel.js`)**
- [ ] **Step 7: Implementasi Edit Profil Desa (`profil.js`)**
- [ ] **Step 8: Implementasi Kelola Galeri (`galeri.js`)**
- [ ] **Step 9: Implementasi Kelola Reservasi (`reservasi.js`)**

---

### Task 6: Mock Seed Fallback & Verification

**Files:**
- Create: `src/data/seed.js`

- [ ] **Step 1: Buat fallback seed data di `src/data/seed.js`**
- [ ] **Step 2: Uji build bundler dengan `npm run build`**
- [ ] **Step 3: Verifikasi seluruh fitur dan navigasi aplikasi**
