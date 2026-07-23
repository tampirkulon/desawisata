# Stitch UI Design & Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun dan mengintegrasikan seluruh UI Halaman Publik dan Admin Dashboard Website Desa Wisata Tampirkulon berbasis Stitch MCP Design System ("Verdant Heritage"), Vite, Vanilla JS, dan Vanilla CSS.

**Architecture:** Single Page Application (SPA) berbasis Vite + Vanilla JS dengan Hash Router (`#/path`). Design System diselaraskan dengan Material Design & Stitch MCP Tokens (`#1b3022` Deep Forest Green, `#8ba888` Soft Sage, `#f9f7f2` Warm Cream, `Libre Caslon Text` & `Hanken Grotesk`). Data & Auth terhubung ke Supabase.

**Tech Stack:** Vite, Vanilla JavaScript (ES6+), Vanilla CSS, Google Fonts, @supabase/supabase-js, Stitch MCP.

## Global Constraints

- Warna Utama: Primary Forest `#1b3022`, Accent Sage `#8ba888`, Canvas Cream `#f9f7f2`, Text Charcoal `#1b1c1c`.
- Typography: Serif `Libre Caslon Text` (Headings) + Sans-serif `Hanken Grotesk` (Body & Controls).
- SPA Routing menggunakan Hash `#/path` (Contoh: `#/`, `#/profil`, `#/destinasi`, `#/admin/login`, `#/admin/overview`).

---

### Task 1: Generate Missing UI Screens via Stitch MCP

**Files:**
- Stitch Project: `projects/10025430612284537543`

- [ ] **Step 1: Generate Admin Login UI Screen**
Panggil `generate_screen_from_text` pada Stitch MCP untuk membuat layar Login Admin:
`projectId: "10025430612284537543"`, `prompt: "Admin Login Screen for Desa Wisata Tampirkulon dashboard with email, password fields, branding background, and secure submit button"`

- [ ] **Step 2: Generate Admin Dashboard Overview UI Screen**
Panggil `generate_screen_from_text` pada Stitch MCP:
`projectId: "10025430612284537543"`, `prompt: "Admin Dashboard Overview with Sidebar navigation, Quick stats cards for Destinations, Packages, Articles, Reservations, and recent activity table"`

- [ ] **Step 3: Generate Public Contact & Reservation Form Screen**
Panggil `generate_screen_from_text` pada Stitch MCP:
`projectId: "10025430612284537543"`, `prompt: "Contact and Reservation page for Desa Wisata Tampirkulon with Google Maps placeholder, contact information, and interactive tour booking form"`

---

### Task 2: Core Design System Tokens & Component Styling

**Files:**
- Modify: `src/styles/index.css`
- Modify: `src/styles/components.css`
- Modify: `src/styles/pages.css`
- Modify: `src/styles/dashboard.css`
- Modify: `src/components/toast.js`
- Modify: `src/components/lightbox.js`

- [ ] **Step 1: Inisialisasi Design Tokens Stitch di `src/styles/index.css`**
Tuliskan variabel CSS untuk warna, font Google (`Libre Caslon Text`, `Hanken Grotesk`), spacing 8px, dan shadow ambient.

- [ ] **Step 2: Polishing Komponen UI Publik & Form Control di `src/styles/components.css`**
Implementasikan style re-usable untuk Tombol (Primary, Secondary), Card (Destinasi & Paket), Badge Kategori, Lightbox Modal, dan Toast Alert.

- [ ] **Step 3: Polishing CSS Dashboard & Data Tables di `src/styles/dashboard.css`**
Implementasikan style Sidebar Admin, Metric Cards, Form Modal Add/Edit, dan Table Controls.

---

### Task 3: Public Website Pages & Router Wiring

**Files:**
- Modify: `src/main.js`
- Modify: `src/utils/router.js`
- Modify: `src/components/navbar.js`
- Modify: `src/components/footer.js`
- Modify: `src/pages/beranda.js`
- Modify: `src/pages/profil.js`
- Modify: `src/pages/destinasi.js`
- Modify: `src/pages/paket.js`
- Modify: `src/pages/galeri.js`
- Modify: `src/pages/blog.js`
- Modify: `src/pages/kontak.js`

- [ ] **Step 1: Update Navbar & Footer Komponen**
Pastikan Navbar memiliki backdrop blur, active state link, serta hamburger drawer responsif pada mobile.

- [ ] **Step 2: Implementasi Halaman Publik (Beranda, Profil, Destinasi, Paket, Galeri, Blog, Kontak)**
Setiap file halaman merender struktur HTML modern lengkap dengan mock data fallback dari `src/data/seed.js` jika Supabase belum terhubung.

- [ ] **Step 3: Hubungkan Hash Router di `src/main.js` & `src/utils/router.js`**
Navigasikan secara dinamis ketika hash URL berubah.

---

### Task 4: Admin Dashboard Shell & CRUD Modules

**Files:**
- Modify: `src/admin/components/sidebar.js`
- Modify: `src/admin/components/header.js`
- Modify: `src/admin/pages/login.js`
- Modify: `src/admin/pages/overview.js`
- Modify: `src/admin/pages/destinasi.js`
- Modify: `src/admin/pages/kategori.js`
- Modify: `src/admin/pages/paket.js`
- Modify: `src/admin/pages/artikel.js`
- Modify: `src/admin/pages/profil.js`
- Modify: `src/admin/pages/galeri.js`
- Modify: `src/admin/pages/reservasi.js`

- [ ] **Step 1: Implementasi Form Login Admin (`src/admin/pages/login.js`)**
Tampilan login yang dipadu dengan validasi form & auth helper.

- [ ] **Step 2: Implementasi Dashboard Overview (`src/admin/pages/overview.js`)**
Merender kartu statistik metrik utama dan tabel aktivitas reservasi terkini.

- [ ] **Step 3: Implementasi Modul CRUD Management (Destinasi, Kategori, Paket, Artikel, Profil, Galeri, Reservasi)**
Merender tabel interaktif, tombol pencarian, serta modal dialog edit/tambah data.

---

### Task 5: Build Verification & Testing

**Files:**
- Execute: Build command `npm run build`

- [ ] **Step 1: Jalankan `npm run build` untuk menguji sintaks JS & CSS**
Run: `npm run build`
Expected: Output `dist/` berhasil dibuat tanpa error bundling.

- [ ] **Step 2: Verifikasi Halaman Publik & Admin**
Pastikan tidak ada kesalahan `ReferenceError` atau `SyntaxError` di seluruh modul halaman.
