# Pagination Galeri dan Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan sistem navigasi pagination angka modern dengan info data pada halaman Galeri (`src/pages/galeri.js`, 12 item/halaman) dan Blog (`src/pages/blog.js`, 9 item/halaman).

**Architecture:** Membuat modul helper pagination yang bersih (`src/components/pagination.js`) untuk merender UI tombol pagination dan event handling secara reusable, lalu mengintegrasikannya ke state management di `src/pages/galeri.js` dan `src/pages/blog.js`.

**Tech Stack:** Vanilla JavaScript (ES Modules), Tailwind CSS utility classes, Material Symbols icons.

## Global Constraints
- Items per page: 12 foto di Galeri, 9 artikel di Blog.
- Brand colors: Primary `#123524`, Secondary `#3E7B27`, Accent `#85A947`, Sand `#EFE3C2`.
- ActiveFilter reset: Saat kategori galeri berganti, currentPage kembali ke 1.
- Lightbox integration: Navigasi gambar di modal lightbox tetap bekerja sesuai data terfilter.

---

### Task 1: Buat Komponen Reusable Pagination Helper (`src/components/pagination.js`)

**Files:**
- Create: `src/components/pagination.js`

**Interfaces:**
- Produces: `renderPagination({ totalItems, itemsPerPage, currentPage, labelItem })` -> returns string HTML.
- Produces: `initPaginationEvents(container, { onPageChange })` -> attaches click listeners on `.pagination-btn`.

- [ ] **Step 1: Implementasi `src/components/pagination.js`**

```javascript
export const renderPagination = ({ totalItems, itemsPerPage, currentPage, labelItem = 'Item' }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return '';

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with window logic if pages > 5
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return `
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-t border-outline-variant/30 mt-12 w-full">
      <div class="text-xs text-on-surface-variant font-medium">
        Menampilkan <span class="font-bold text-primary">${start}-${end}</span> dari <span class="font-bold text-primary">${totalItems}</span> ${labelItem}
      </div>
      <div class="flex items-center gap-1.5 flex-wrap justify-center">
        <!-- Prev Button -->
        <button 
          class="pagination-btn px-3.5 py-2 rounded-xl text-xs font-bold border border-outline-variant/40 flex items-center gap-1 transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed pointer-events-none text-on-surface-variant' : 'text-primary bg-white hover:bg-primary/10 cursor-pointer shadow-2xs'}" 
          data-page="${currentPage - 1}"
          ${currentPage === 1 ? 'disabled' : ''}>
          <span class="material-symbols-outlined text-sm">chevron_left</span>
          <span class="hidden sm:inline">Sebelumnya</span>
        </button>

        <!-- Page Numbers -->
        ${pages.map(p => `
          <button 
            class="pagination-btn w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${p === currentPage ? 'bg-primary text-white shadow-sm' : 'bg-white text-primary border border-outline-variant/40 hover:bg-primary/10'}" 
            data-page="${p}">
            ${p}
          </button>
        `).join('')}

        <!-- Next Button -->
        <button 
          class="pagination-btn px-3.5 py-2 rounded-xl text-xs font-bold border border-outline-variant/40 flex items-center gap-1 transition-all ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed pointer-events-none text-on-surface-variant' : 'text-primary bg-white hover:bg-primary/10 cursor-pointer shadow-2xs'}" 
          data-page="${currentPage + 1}"
          ${currentPage === totalPages ? 'disabled' : ''}>
          <span class="hidden sm:inline">Berikutnya</span>
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  `;
};

export const initPaginationEvents = (container, { onPageChange }) => {
  container.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = Number.parseInt(e.currentTarget.dataset('data-page'), 10);
      if (!Number.isNaN(page) && onPageChange) {
        onPageChange(page);
      }
    });
  });
};
```

- [ ] **Step 2: Commit Task 1**
```bash
git add src/components/pagination.js
git commit -m "feat: add reusable pagination component helper"
```

---

### Task 2: Integrasikan Pagination pada Halaman Galeri (`src/pages/galeri.js`)

**Files:**
- Modify: `src/pages/galeri.js`

**Interfaces:**
- Consumes: `renderPagination`, `initPaginationEvents` from `src/components/pagination.js`

- [ ] **Step 1: Modifikasi `src/pages/galeri.js`**
  - Tambahkan state `currentPage = 1`, `itemsPerPage = 12`.
  - Filter kategori mereset `currentPage = 1`.
  - Slice foto `paginatedGaleri = filteredGaleri.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)`.
  - Lightbox menerima global index dari `filteredGaleri`.
  - Render kontrol pagination di bawah grid.
  - Event listener `initPaginationEvents` yang memperbarui `currentPage`, merender ulang konten, dan scroll halus ke atas galeri (`#galeri-header`).

- [ ] **Step 2: Commit Task 2**
```bash
git add src/pages/galeri.js
git commit -m "feat(galeri): implement category-aware pagination"
```

---

### Task 3: Integrasikan Pagination pada Halaman Blog (`src/pages/blog.js`)

**Files:**
- Modify: `src/pages/blog.js`

**Interfaces:**
- Consumes: `renderPagination`, `initPaginationEvents` from `src/components/pagination.js`

- [ ] **Step 1: Modifikasi `src/pages/blog.js`**
  - Ubah `renderBlog` agar menggunakan state `currentPage = 1`, `itemsPerPage = 9`.
  - Pisahkan `featuredArticle = artikelList[0]` (hanya tampil jika `currentPage === 1`).
  - `allRecent = artikelList.slice(1)`.
  - Slice artikel `paginatedArticles = allRecent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)`.
  - Render kontrol pagination di bawah grid artikel terbaru.
  - Event listener `initPaginationEvents` memperbarui `currentPage`, merender ulang konten, dan scroll halus ke `#recent-articles`.
  - Pastikan event modal artikel (`openArticleModal`) tetap berjalan normal.

- [ ] **Step 2: Commit Task 3**
```bash
git add src/pages/blog.js
git commit -m "feat(blog): implement 9-item pagination for recent articles"
```

---

### Task 4: Verifikasi & Testing

- [ ] **Step 1: Test build**
```bash
npm run build
```
- [ ] **Step 2: Verifikasi fungsional**
  - Cek navigasi pagination Galeri pada filter 'Semua' dan kategori lain.
  - Cek pembukaan modal Lightbox di Galeri.
  - Cek pagination Blog dan pembukaan modal detail artikel.
