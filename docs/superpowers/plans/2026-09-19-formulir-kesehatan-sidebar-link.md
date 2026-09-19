# Formulir Kesehatan Sidebar Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan tombol navigasi eksternal "Formulir Kesehatan" pada sidebar panel admin yang membuka `https://near.tl/wisatatampirkulon` di tab baru.

**Architecture:** Memperluas array konfigurasi `mainMenuItems` dan fungsi rendering `renderAdminSidebar` pada `src/admin/components/sidebar.js` agar mendukung item bertipe eksternal dengan ikon `medical_services` dan indikator `open_in_new`, serta memverifikasi perilakunya melalui tes otomatis berbasis Node.js di `scripts/test-sidebar.js`.

**Tech Stack:** JavaScript (ES Modules), Tailwind CSS, Material Symbols Outlined, Node.js assertions.

## Global Constraints

- URL tujuan: `https://near.tl/wisatatampirkulon`
- Label item: `Formulir Kesehatan`
- Target link: `_blank` dengan `rel="noopener noreferrer"`
- Ikon utama: `medical_services`
- Ikon indikator: `open_in_new`
- Item harus memiliki class `donezo-sidebar-item` agar konsisten dengan styling dan otomatis menutup sidebar drawer pada viewport mobile

---

### Task 1: Buat Unit Test Otomatis untuk Sidebar Item Eksternal

**Files:**
- Create: `scripts/test-sidebar.js`

**Interfaces:**
- Consumes: `renderAdminSidebar(activeRoute)` from `src/admin/components/sidebar.js`
- Produces: Test runner CLI `node scripts/test-sidebar.js`

- [ ] **Step 1: Write failing test script**

```javascript
// scripts/test-sidebar.js
import assert from 'node:assert';
import { renderAdminSidebar } from '../src/admin/components/sidebar.js';

console.log('🧪 Testing Admin Sidebar External Link...');

const html = renderAdminSidebar('overview');

// 1. Must contain the Near.tl URL
assert(
  html.includes('href="https://near.tl/wisatatampirkulon"'),
  'Sidebar should contain link to https://near.tl/wisatatampirkulon'
);

// 2. Must contain the label "Formulir Kesehatan"
assert(
  html.includes('Formulir Kesehatan'),
  'Sidebar should display label "Formulir Kesehatan"'
);

// 3. Must open in new tab with security attributes
assert(
  html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'),
  'External link must have target="_blank" and rel="noopener noreferrer"'
);

// 4. Must render medical_services icon and open_in_new indicator
assert(
  html.includes('medical_services'),
  'External link should use medical_services icon'
);
assert(
  html.includes('open_in_new'),
  'External link should display open_in_new icon'
);

// 5. External link must NOT be marked active
assert(
  !html.includes('active" href="https://near.tl/wisatatampirkulon"'),
  'External link should never have active class'
);

console.log('✅ All sidebar external link assertions passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-sidebar.js`  
Expected: FAIL with `AssertionError: Sidebar should contain link to https://near.tl/wisatatampirkulon`

- [ ] **Step 3: Commit test script**

```bash
git add scripts/test-sidebar.js
git commit -m "test: add unit test for admin sidebar external link"
```

---

### Task 2: Implementasi Formulir Kesehatan di Admin Sidebar

**Files:**
- Modify: `src/admin/components/sidebar.js`

**Interfaces:**
- Consumes: None
- Produces: Updated `renderAdminSidebar` generating external link markup

- [ ] **Step 1: Update mainMenuItems and template in sidebar.js**

Di `src/admin/components/sidebar.js`:
1. Tambahkan item baru ke `mainMenuItems`:
```javascript
    {
      key: 'formulir-kesehatan',
      href: 'https://near.tl/wisatatampirkulon',
      label: 'Formulir Kesehatan',
      icon: 'medical_services',
      external: true,
    },
```
2. Modifikasi mapping item menu untuk menangani item eksternal:
```javascript
            ${mainMenuItems.map(item => {
              if (item.external) {
                return `
                  <a class="donezo-sidebar-item flex items-center justify-between" href="${item.href}" target="_blank" rel="noopener noreferrer">
                    <div class="flex items-center gap-3">
                      <span class="material-symbols-outlined text-xl text-slate-400">${item.icon}</span>
                      <span>${item.label}</span>
                    </div>
                    <span class="material-symbols-outlined text-xs text-slate-400">open_in_new</span>
                  </a>
                `;
              }
              const isActive = normalizedRoute === item.key || activeRoute === item.key || activeRoute === item.hash;
              return `
                <a class="donezo-sidebar-item ${isActive ? 'active' : ''}" href="${item.hash}">
                  <span class="material-symbols-outlined text-xl ${isActive ? 'text-[#316342]' : 'text-slate-400'}">${item.icon}</span>
                  <span>${item.label}</span>
                </a>
              `;
            }).join('')}
```

- [ ] **Step 2: Run test-sidebar.js to verify it passes**

Run: `node scripts/test-sidebar.js`  
Expected: PASS with `All sidebar external link assertions passed!`

- [ ] **Step 3: Commit implementation**

```bash
git add src/admin/components/sidebar.js
git commit -m "feat(admin): add Formulir Kesehatan external link to sidebar"
```

---

### Task 3: Verifikasi Komprehensif dan Build

**Files:**
- Verify: `package.json`, project test suite

- [ ] **Step 1: Jalankan seluruh test suite proyek**

Run: `npm test && node scripts/test-sidebar.js`  
Expected: All tests pass.

- [ ] **Step 2: Jalankan build Vite untuk verifikasi bundling**

Run: `npm run build`  
Expected: Build succeeds with exit code 0.
