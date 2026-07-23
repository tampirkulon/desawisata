# Stitch UI Implementation Plan - Desa Wisata Tampirkulon

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun dan mengintegrasikan seluruh UI Halaman Publik dan Admin Dashboard Website Desa Wisata Tampirkulon berbasis Stitch MCP Design System ("Tampirkulon Heritage & Nature"), Vite, Vanilla JS, dan Vanilla CSS, serta melakukan commit pada setiap step dan push ke `git@github.com:tampirkulon/desawisata.git`.

**Architecture:** Single Page Application (SPA) berbasis Vite + Vanilla JS dengan Hash Router (`#/path`). Design tokens selaras dengan Stitch MCP (`#316342` Deep Forest Green, `#4A7C59` Primary Container, `#D4A84B` Harvest Gold, `#FCF9F8` Warm Off-White, Google Fonts `Outfit` & `Inter`). Data & Auth terhubung ke Supabase.

**Tech Stack:** Vite, Vanilla JavaScript (ES6+), Vanilla CSS, Google Fonts (`Outfit`, `Inter`), `@supabase/supabase-js`, Git.

## Global Constraints

- Warna Utama: Primary Green `#316342`, Primary Container `#4A7C59`, Accent Gold `#D4A84B`, Canvas Off-White `#FCF9F8`, Text Charcoal `#1C1B1B`.
- Typography: Headings `Outfit` + Body & Controls `Inter`.
- SPA Routing menggunakan Hash `#/path` (`#/`, `#/profil`, `#/destinasi`, `#/paket`, `#/galeri`, `#/blog`, `#/kontak`, `#/admin/login`, `#/admin/overview`, dll.).
- Commit git di setiap langkah dan push ke remote `git@github.com:tampirkulon/desawisata.git` pada branch `main`.

---

### Task 1: Git Remote Setup & Core Design System Tokens

**Files:**
- Modify: `src/styles/index.css`
- Modify: `src/styles/components.css`

**Interfaces:**
- Produces: Global CSS variables (`--color-primary`, `--color-accent`, `--color-background`, `--font-heading`, `--font-body`, `--shadow-level-1`, `--shadow-level-2`, `--radius-sm`, `--radius-lg`) dan styling komponen dasar (`.btn-primary`, `.btn-accent`, `.card-destinasi`, `.chip`, `.badge`).

- [ ] **Step 1: Inisialisasi Git Remote & Branch `main`**
```bash
git branch -M main
git remote add origin git@github.com:tampirkulon/desawisata.git || git remote set-url origin git@github.com:tampirkulon/desawisata.git
```

- [ ] **Step 2: Update Design System Variables & Imports di `src/styles/index.css`**
Injeksi import font Google `Outfit` dan `Inter`, serta definisikan variabel warna & elevasi Stitch.

- [ ] **Step 3: Refactor Komponen UI Reusable di `src/styles/components.css`**
Update gaya tombol (Primary `#316342`, Accent `#D4A84B`, Ghost), kartu destinasi & paket, badge kategori, form controls, modal, dan lightbox dialog.

- [ ] **Step 4: Build Verification**
Run: `npm run build`
Expected: `built in X.XXs` tanpa error bundling.

- [ ] **Step 5: Git Commit & Push**
```bash
git add src/styles/index.css src/styles/components.css
git commit -m "feat(design-system): implement Stitch design tokens, colors, typography and component styles"
git push -u origin main || git push origin main
```

---

### Task 2: Refactor Public Website Components & Pages

**Files:**
- Modify: `src/components/navbar.js`
- Modify: `src/components/footer.js`
- Modify: `src/pages/beranda.js`
- Modify: `src/pages/profil.js`
- Modify: `src/pages/destinasi.js`
- Modify: `src/pages/paket.js`
- Modify: `src/pages/galeri.js`
- Modify: `src/pages/blog.js`
- Modify: `src/pages/kontak.js`
- Modify: `src/styles/pages.css`

**Interfaces:**
- Consumes: Design system CSS variables & components.
- Produces: Halaman publik SPA yang responsif dan selaras 100% dengan desain Stitch.

- [ ] **Step 1: Refactor Header Navigation & Footer (`src/components/navbar.js`, `footer.js`)**
Tambahkan backdrop blur, active nav indicator, dan responsive drawer mobile navigation.

- [ ] **Step 2: Refactor Beranda & Profil Desa (`src/pages/beranda.js`, `profil.js`, `pages.css`)**
Render hero header dengan tipografi `Outfit`, quick stats strip, destinasi unggulan grid, eduwisata highlight, dan profil demografi/sejarah desa.

- [ ] **Step 3: Refactor Destinasi, Paket, Galeri, Blog, & Kontak (`src/pages/destinasi.js`, `paket.js`, `galeri.js`, `blog.js`, `kontak.js`)**
Implementasikan filter chips, edutourism package cards dengan list fasilitas, asymmetric masonry gallery (Stitch layout `8e518121745c416497785fecb792f781`), featured blog banner, dan interactive booking form.

- [ ] **Step 4: Build Verification**
Run: `npm run build`
Expected: Production build berhasil tanpa error JS / CSS.

- [ ] **Step 5: Git Commit & Push**
```bash
git add src/components/ src/pages/ src/styles/pages.css
git commit -m "feat(public-ui): refactor public pages to match Stitch UI high-fidelity layout"
git push origin main
```

---

### Task 3: Refactor Admin Dashboard Shell & Management Pages

**Files:**
- Modify: `src/styles/dashboard.css`
- Modify: `src/admin/pages/login.js`
- Modify: `src/admin/pages/overview.js`
- Modify: `src/admin/pages/destinasi.js`
- Modify: `src/admin/pages/kategori.js`
- Modify: `src/admin/pages/paket.js`
- Modify: `src/admin/pages/artikel.js`
- Modify: `src/admin/pages/profil.js`
- Modify: `src/admin/pages/galeri.js`
- Modify: `src/admin/pages/reservasi.js`

**Interfaces:**
- Consumes: Supabase client & Admin Auth.
- Produces: Tampilan Admin Dashboard modern dengan Sidebar, Metrik Cards, Data Tables, dan Form Modals.

- [ ] **Step 1: Refactor Styling Admin Dashboard di `src/styles/dashboard.css`**
Update gaya Sidebar admin, Topbar header, Stat Metric cards, Data Tables, dan Form Modals.

- [ ] **Step 2: Refactor Admin Login & Dashboard Overview (`src/admin/pages/login.js`, `overview.js`)**
Render visual login split card dan dashboard overview stats + recent activity table.

- [ ] **Step 3: Refactor Management CRUD Pages (`destinasi.js`, `kategori.js`, `paket.js`, `artikel.js`, `profil.js`, `galeri.js`, `reservasi.js`)**
Render interactive data tables dengan pencarian, filter, pagination, tombol aksi Edit & Delete, serta Modal Add/Edit Form Dialog.

- [ ] **Step 4: Build Verification**
Run: `npm run build`
Expected: Build sukses tanpa error syntax.

- [ ] **Step 5: Git Commit & Push**
```bash
git add src/styles/dashboard.css src/admin/
git commit -m "feat(admin-ui): align admin login, overview, and CRUD management UI with Stitch design"
git push origin main
```

---

### Task 4: Final Verification & Repository Sync

**Files:**
- Execute: Build command `npm run build`

- [ ] **Step 1: Full Production Build Verification**
Run: `npm run build`
Expected: Dist build dibuat bersih di `dist/`.

- [ ] **Step 2: Git Status & Final Push Check**
```bash
git status
git push origin main
```
Expected: Working tree clean, main branch up-to-date with `origin/main`.
