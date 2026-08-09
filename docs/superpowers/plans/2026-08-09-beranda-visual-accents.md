# Beranda Visual Accents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan aksen visual bergaya Modern Glassmorphism & Micro-Interactions pada halaman Beranda Desa Wisata Tampirkulon agar tidak polos.

**Architecture:** Memperbarui komponen Beranda (`src/pages/beranda.js`) dan stylesheet (`src/styles/index.css`) dengan komponen frosted glass, ambient backdrop orbs, watermark icons, floating live status badge, dan kartu CTA modern bergradien.

**Tech Stack:** Vanilla JavaScript (ES Modules), Tailwind CSS v4, Material Symbols Outlined, Google Fonts (Outfit & Inter).

## Global Constraints
- Target Page: `src/pages/beranda.js`
- Color Palette: `#123524` (Deep Forest Green), `#3E7B27` (Primary Forest), `#85A947` (Olive Green), `#EFE3C2` (Warm Cream)
- Preserve all existing dynamic data binding (`profil_desa`, `destinasi`, `testimoni`) and modal triggers (`openDestinasiModal`, `openTestimoniModal`).

---

### Task 1: Add Custom CSS Utilities for Ambient Accents & Glass Effects

**Files:**
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: Tailwind v4 theme variables
- Produces: CSS utility classes `.glass-card-accent`, `.pulsing-dot`, `.ambient-glow-orb`, `.card-watermark`

- [ ] **Step 1: Add glassmorphism & accent helper classes to index.css**
Update `src/styles/index.css` with dedicated utility classes for glass cards, animated status dots, and watermarks:
```css
/* Ambient glow & glass accents */
.glass-card-accent {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.glass-card-dark {
  background: rgba(18, 53, 36, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(239, 227, 194, 0.25);
}

.pulse-dot {
  position: relative;
  display: inline-flex;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: #22c55e;
}

.pulse-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 9999px;
  background-color: rgba(34, 197, 94, 0.5);
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
```

- [ ] **Step 2: Verify CSS builds without errors**
Run: `npm run build` or check dev server logs
Expected: No CSS syntax errors

- [ ] **Step 3: Commit Task 1**
```bash
git add src/styles/index.css
git commit -m "style: add glassmorphic and ambient accent utilities in index.css"
```

---

### Task 2: Enhance Hero Section in `src/pages/beranda.js`

**Files:**
- Modify: `src/pages/beranda.js:34-58`

**Interfaces:**
- Consumes: `profil` data object
- Produces: Enhanced Hero markup with live operational pill, glass badges, and smooth gradient transition

- [ ] **Step 1: Update Hero Section markup**
Replace header markup with:
1. Live status floating badge (`🟢 Buka Setiap Hari • 08:00 - 17:00 WIB` with `.pulse-dot` and frosted glass pill).
2. Badge "Welcome to Tampirkulon" with shimmering border.
3. Enhanced typography with drop shadow and sub-headline contrast.
4. Button micro-interactions with glow shadow (`shadow-level-1 hover:shadow-lg hover:shadow-secondary/25`).
5. Bottom gradient curve connector to seamlessly blend into highlights.

- [ ] **Step 2: Verify hero rendering**
Check that hero renders cleanly and responsive across mobile and desktop.

- [ ] **Step 3: Commit Task 2**
```bash
git add src/pages/beranda.js
git commit -m "feat(beranda): add live status badge and glass accents to hero section"
```

---

### Task 3: Enhance Highlights / Feature Section in `src/pages/beranda.js`

**Files:**
- Modify: `src/pages/beranda.js:59-96`

**Interfaces:**
- Consumes: Static highlights items (Wisata Alam, Budaya Lokal, Kuliner Khas, Homestay Nyaman)
- Produces: Modern glassmorphic cards with ambient background orbs and dual-layered icon containers

- [ ] **Step 1: Update Highlights Section markup**
1. Add decorative ambient blur orbs (`bg-primary/10` and `bg-secondary/15` with `blur-3xl rounded-full`) behind the grid.
2. Replace highlight card containers with `.glass-card-accent` styling, `hover:border-secondary/60`, and `hover:-translate-y-2 hover:shadow-xl`.
3. Add dual-layered gradient badge for each icon (`bg-gradient-to-br from-[#3E7B27]/15 to-[#85A947]/20` with rounded-2xl).
4. Add small decorative corner accent tag or subtle number index (`01`, `02`, `03`, `04`).

- [ ] **Step 2: Verify cards visual appearance and hover interactions**
Check highlight grid alignment, spacing, and hover smoothness.

- [ ] **Step 3: Commit Task 3**
```bash
git add src/pages/beranda.js
git commit -m "feat(beranda): add glassmorphic cards and ambient orbs to highlights section"
```

---

### Task 4: Enhance Destinations & About (Stats) Sections in `src/pages/beranda.js`

**Files:**
- Modify: `src/pages/beranda.js:98-178`

**Interfaces:**
- Consumes: `destinasi` list, `profil` statistics
- Produces: Destination cards with glass price pills and Stat cards with subtle watermark icons and colored left borders

- [ ] **Step 1: Update Destinations Section**
1. Add section header badge pill (`<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-xs font-bold uppercase tracking-wider mb-3">✨ Destinasi Favorit</span>`).
2. Make destination card price tags frosted glass (`bg-[#123524]/85 backdrop-blur-md text-white border border-white/20 px-3.5 py-1.5 rounded-full shadow-sm`).
3. Add image zoom-in on hover and clean tag row.

- [ ] **Step 2: Update About & Stats Section**
1. Add section header pill (`🍃 Cerita & Filosofi`).
2. Transform the 4 stat boxes into modern accent cards:
   - Left border accent (`border-l-4 border-primary` and `border-l-4 border-secondary`).
   - Large watermark icon positioned in the bottom-right corner (`material-symbols-outlined absolute -bottom-2 -right-2 text-6xl text-primary/10 select-none pointer-events-none`).
   - Subtle background tint `bg-white/90 backdrop-blur-sm border border-outline-variant/30`.

- [ ] **Step 3: Verify modal clicks on destination cards remain functional**
Click on a destination card and ensure `openDestinasiModal(item)` triggers properly.

- [ ] **Step 4: Commit Task 4**
```bash
git add src/pages/beranda.js
git commit -m "feat(beranda): enhance destination tags and add watermark icons to stat cards"
```

---

### Task 5: Enhance Testimonials & CTA Banner in `src/pages/beranda.js`

**Files:**
- Modify: `src/pages/beranda.js:180-233`

**Interfaces:**
- Consumes: `testimoniList`, `profil`
- Produces: Testimonial cards with quote watermark and high-impact gradient glass CTA card

- [ ] **Step 1: Update Testimonials Section**
1. Add section pill (`💬 Pengalaman Wisatawan`).
2. Add watermark quote icon (`material-symbols-outlined text-5xl text-primary/10 absolute top-4 right-4 pointer-events-none`) on testimonial cards.
3. Enhance testimonial card with frosted glass styling and gold rating glow.

- [ ] **Step 2: Update CTA Banner**
1. Redesign CTA banner into an elevated floating gradient glass container:
   - Outer container: `max-w-container-max mx-auto px-4 md:px-12 py-16`
   - Inner banner: `relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123524] via-[#1A452D] to-[#3E7B27] text-white p-10 md:p-16 shadow-2xl border border-white/15 text-center`
   - Ambient decorative glowing light circles in background (`w-80 h-80 bg-white/10 rounded-full blur-3xl absolute -top-20 -right-20 pointer-events-none` and `w-64 h-64 bg-[#85A947]/20 rounded-full blur-2xl absolute -bottom-16 -left-16 pointer-events-none`).
   - CTA button: `bg-[#EFE3C2] text-[#123524] font-bold px-9 py-4 rounded-full hover:bg-white hover:shadow-lg hover:scale-105 transition-all shadow-md`.

- [ ] **Step 3: Verify write testimonial modal button functionality**
Click "Tulis Ulasan & Kesan" button to verify `openTestimoniModal` opens correctly.

- [ ] **Step 4: Commit Task 5**
```bash
git add src/pages/beranda.js
git commit -m "feat(beranda): add quote watermarks and modernize CTA banner card"
```

---

### Task 6: Full Integration Testing & Visual Verification

**Files:**
- Test: Manual browser check on running dev server `http://localhost:5173/`

- [ ] **Step 1: Verify all sections visual coherence**
Check:
1. Hero section with live status badge and smooth transitions.
2. Highlights grid with glass cards and ambient background orbs.
3. Destinations section with frosted glass badges and modal interactivity.
4. About section with stat cards and watermark icons.
5. Testimonials with quote watermarks and "Tulis Ulasan" modal.
6. Modern glowing CTA banner with responsive layout.

- [ ] **Step 2: Commit final verification adjustments (if any)**
```bash
git add .
git commit -m "chore(beranda): finalize visual accents and layout adjustments"
```
