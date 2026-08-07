// Reusable Data Table Component for Admin Dashboard

export const renderDataTable = ({ columns, data, searchPlaceholder = 'Cari data...' }) => {
  return `
    <div class="data-table-card">
      <div class="data-table-toolbar">
        <input type="text" class="search-input" id="table-search" placeholder="${searchPlaceholder}" />
        <div id="table-actions"></div>
      </div>

      <div class="table-wrapper">
        <table class="data-table" id="data-table-element">
          <thead>
            <tr>
              ${columns.map(col => `<th>${col.label}</th>`).join('')}
              <th style="text-align: right;">Aksi</th>
            </tr>
          </thead>
          <tbody id="table-body-element">
            ${data.length === 0 ? `
              <tr>
                <td colspan="${columns.length + 1}" style="text-align: center; color: var(--neutral-600); padding: 40px;">
                  Belum ada data tersedia.
                </td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="data-table-pagination flex items-center justify-between px-6 py-4 border-t border-slate-100 flex-wrap gap-4 text-xs font-medium text-slate-500">
        <div id="pag-info">
          Menampilkan <span id="pag-start" class="font-bold text-slate-800">1</span> - <span id="pag-end" class="font-bold text-slate-800">7</span> dari <span id="pag-total" class="font-bold text-slate-800">${data.length}</span> data
        </div>
        <div class="flex items-center gap-1.5" id="pag-controls">
          <button id="pag-prev-btn" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer">
            Prev
          </button>
          <div id="pag-pages" class="flex items-center gap-1"></div>
          <button id="pag-next-btn" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </div>
  `;
};

/**
 * Attaches real-time client-side search and pagination controller to the data table.
 * @param {HTMLElement} container - Page container element
 * @param {object} [options]
 * @param {number} [options.pageSize=7] - Number of items per page (default: 7)
 * @param {string} [options.searchInputId='table-search']
 * @param {string} [options.tableBodyId='table-body-element']
 */
export const initTablePagination = (container, options = {}) => {
  const {
    pageSize = 7,
    searchInputId = 'table-search',
    tableBodyId = 'table-body-element',
  } = options;

  const searchInput = container.querySelector(`#${searchInputId}`);
  const tbody = container.querySelector(`#${tableBodyId}`);
  const prevBtn = container.querySelector('#pag-prev-btn');
  const nextBtn = container.querySelector('#pag-next-btn');
  const pagesContainer = container.querySelector('#pag-pages');
  const pagStart = container.querySelector('#pag-start');
  const pagEnd = container.querySelector('#pag-end');
  const pagTotal = container.querySelector('#pag-total');
  const pagInfo = container.querySelector('#pag-info');

  if (!tbody) return;

  let currentPage = 1;
  let currentQuery = '';

  const table = tbody.closest('table');
  const headers = table ? Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim().toLowerCase()) : [];

  const excludedKeywords = [
    'status',
    'aksi',
    'action',
    'durasi',
    'tiket',
    'harga',
    'urutan',
    'jumlah',
    'paket / jenis',
    'paket/jenis'
  ];

  const excludedIndices = new Set();
  headers.forEach((h, idx) => {
    if (excludedKeywords.some(kw => h.includes(kw))) {
      excludedIndices.add(idx);
    }
  });

  const renderPagination = () => {
    const allRows = Array.from(tbody.querySelectorAll('tr:not(.no-search-results)'));
    
    // Filter matching rows based on query
    const matchingRows = allRows.filter(row => {
      if (!currentQuery) return true;
      const cells = Array.from(row.querySelectorAll('td'));
      const searchableCells = cells.filter((_, idx) => !excludedIndices.has(idx));
      const text = (searchableCells.length > 0 ? searchableCells.map(c => c.textContent).join(' ') : row.textContent).toLowerCase();
      return text.includes(currentQuery);
    });

    const totalMatching = matchingRows.length;
    const totalPages = Math.max(1, Math.ceil(totalMatching / pageSize));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalMatching);

    // Hide all rows first
    allRows.forEach(r => { r.style.display = 'none'; });

    // Show only active page matching rows
    matchingRows.slice(startIdx, endIdx).forEach(r => {
      r.style.display = '';
    });

    // Handle no matching search indicator
    let noResultRow = tbody.querySelector('.no-search-results');
    if (totalMatching === 0 && currentQuery !== '') {
      if (!noResultRow) {
        const colCount = headers.length || 5;
        noResultRow = document.createElement('tr');
        noResultRow.className = 'no-search-results';
        noResultRow.innerHTML = `
          <td colspan="${colCount}" style="text-align: center; color: var(--neutral-600); padding: 32px 16px;">
            Tidak ada data yang sesuai dengan pencarian "<strong>${currentQuery}</strong>"
          </td>
        `;
        tbody.appendChild(noResultRow);
      } else {
        noResultRow.style.display = '';
        noResultRow.querySelector('td').innerHTML = `Tidak ada data yang sesuai dengan pencarian "<strong>${currentQuery}</strong>"`;
      }
    } else if (noResultRow) {
      noResultRow.style.display = 'none';
    }

    // Update Pagination Info
    if (pagStart) pagStart.innerText = totalMatching === 0 ? 0 : startIdx + 1;
    if (pagEnd) pagEnd.innerText = endIdx;
    if (pagTotal) pagTotal.innerText = totalMatching;

    // Update Prev / Next Buttons
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    // Render Page Number Buttons
    if (pagesContainer) {
      pagesContainer.innerHTML = '';
      for (let p = 1; p <= totalPages; p++) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.innerText = p;
        pageBtn.className = `w-7 h-7 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
          p === currentPage
            ? 'bg-[#316342] text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`;
        pageBtn.addEventListener('click', () => {
          currentPage = p;
          renderPagination();
        });
        pagesContainer.appendChild(pageBtn);
      }
    }
  };

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderPagination();
    });
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPagination();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentPage++;
      renderPagination();
    });
  }

  // Initial render
  setTimeout(() => renderPagination(), 0);
};

export const initTableSearch = initTablePagination;
