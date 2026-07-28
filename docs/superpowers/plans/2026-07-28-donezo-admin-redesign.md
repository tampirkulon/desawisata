# Donezo Admin Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesain seluruh Admin Panel Desa Wisata Tampirkulon menggunakan sistem desain Donezo UI (card membulat 24px, warna hijau #316342, topbar search & profil, sidebar terkelompok dengan CTA card, serta widget overview lengkap).

**Architecture:** Menerapkan sistem desain CSS terpusat pada `index.css` & `dashboard.css`, memperbarui komponen bersama (`sidebar.js` & `header.js`), meredesain halaman `overview.js` dengan widget Donezo UI (Hero Cards, Pill Bar Chart, Actionable Table, Schedule Card, Donut Progress Gauge), dan menyelaraskan 7 halaman admin lainnya.

**Tech Stack:** Vanilla JavaScript (ES Modules), Vite, CSS Variables, Tailwind CSS utilities, Google Material Symbols.

## Global Constraints

- Warna brand utama: `#316342` (Primary Green)
- Latar belakang halaman: `#F4F6F5` (Off-white)
- Card Radius: `24px` (`rounded-[24px]` / `--radius-donezo: 24px`)
- Font Family: `Outfit` (Headings) & `Inter` (Body)

---

### Task 1: Donezo Design System Tokens & Base Styles

**Files:**
- Modify: `src/styles/index.css`
- Modify: `src/styles/dashboard.css`

**Interfaces:**
- Consumes: CSS Variables & Tailwind utilities
- Produces: Class `.donezo-card`, `.donezo-hero-card`, `.donezo-pill-bar`, `.donezo-cta-card`, `.donezo-sidebar`, `.donezo-topbar`

- [ ] **Step 1: Update index.css with Donezo design tokens**
Add Donezo UI variables (`--bg-donezo: #F4F6F5`, `--radius-donezo: 24px`, `--shadow-donezo: 0 4px 20px rgba(0,0,0,0.03)`) in `index.css`.

- [ ] **Step 2: Update dashboard.css with Donezo UI component classes**
Define `.donezo-card`, `.donezo-hero-card`, `.donezo-cta-card`, `.donezo-pill-bar`, `.donezo-donut-gauge`, and layout wrappers.

- [ ] **Step 3: Verify build**
Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**
Run: `git add src/styles/ && git commit -m "style: add Donezo UI design system tokens and component styles"`

---

### Task 2: Donezo Grouped Sidebar & Bottom Floating CTA Card

**Files:**
- Modify: `src/admin/components/sidebar.js:1-48`

**Interfaces:**
- Consumes: `auth` utility
- Produces: `renderAdminSidebar(activeRoute)`, `initAdminSidebarEvents()`

- [ ] **Step 1: Update sidebar.js with grouped navigation and CTA Card**
Implement MENU (Overview, Destinasi, Paket, Artikel, Galeri, Reservasi) and PENGATURAN (Profil Desa, Keluar) grouping, active indicator highlight, and bottom floating CTA card ("Website Utama Desa").

- [ ] **Step 2: Verify build**
Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**
Run: `git add src/admin/components/sidebar.js && git commit -m "feat: implement Donezo UI grouped sidebar and floating CTA card"`

---

### Task 3: Donezo Top Header Bar Component

**Files:**
- Modify: `src/admin/components/header.js:1-25`

**Interfaces:**
- Consumes: Material Symbols icons
- Produces: `renderAdminHeader(pageTitle)`

- [ ] **Step 1: Update header.js with search bar, notification icons, and profile info**
Render search bar (`Search di admin... ⌘F`), notification bell with pending badge, mail icon, user profile badge, and action buttons ("+ Tambah Data", "Lihat Website").

- [ ] **Step 2: Verify build**
Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**
Run: `git add src/admin/components/header.js && git commit -m "feat: implement Donezo UI top header bar with search and profile info"`

---

### Task 4: Donezo Overview Command Center Page

**Files:**
- Modify: `src/admin/pages/overview.js:1-250`

**Interfaces:**
- Consumes: `renderAdminSidebar`, `renderAdminHeader`, `supabase`, `mockData`, `showToast`
- Produces: `renderAdminOverview()`

- [ ] **Step 1: Implement Donezo Hero Stat Cards**
Render Hero Card 1 in `#316342` green with top-right arrow badge + 3 white stat cards.

- [ ] **Step 2: Implement Pill Bar Chart Analytics & Actionable Recent Reservations Table**
Render visual monthly visitor trend chart with pill bars and interactive recent reservations table (Chat WA & Quick Confirm).

- [ ] **Step 3: Implement Right Column Widgets (Schedule Card, Donut Progress Gauge, Top Destinations)**
Render "Kunjungan Rombongan Hari Ini" schedule card with action button, donut progress gauge (75% Kunjungan Selesai), and top popular destinations list.

- [ ] **Step 4: Verify build**
Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git add src/admin/pages/overview.js && git commit -m "feat: implement Donezo UI Overview Command Center with widgets and analytics"`

---

### Task 5: Align All Other Admin Pages with Donezo Card & Table Wrappers

**Files:**
- Modify: `src/admin/pages/destinasi.js`
- Modify: `src/admin/pages/kategori.js`
- Modify: `src/admin/pages/paket.js`
- Modify: `src/admin/pages/artikel.js`
- Modify: `src/admin/pages/galeri.js`
- Modify: `src/admin/pages/profil.js`
- Modify: `src/admin/pages/reservasi.js`

- [ ] **Step 1: Update card containers and table wrappers across all admin pages**
Ensure all admin pages use the 24px Donezo card style and clean topbar/sidebar wrapper.

- [ ] **Step 2: Verify build**
Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**
Run: `git add src/admin/pages/ && git commit -m "feat: align all admin pages with Donezo UI card and layout containers"`

---

### Task 6: Final Verification & Walkthrough

- [ ] **Step 1: Run production build**
Run: `npm run build`
Expected: PASS

- [ ] **Step 2: Create Walkthrough artifact**
Document completed Donezo UI redesign in `walkthrough.md`.
