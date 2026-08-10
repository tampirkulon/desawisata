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

  // Helper 1: Text Extraction (Complexity: 2)
const getRowText = (row, excludedIndices) => {
  const cells = Array.from(row.querySelectorAll('td'));
  const searchable = cells.filter((_, idx) => !excludedIndices.has(idx));
  const source = searchable.length > 0 ? searchable : [row];
  return source.map(c => c.textContent).join(' ').toLowerCase();
};

// Helper 2: Filter Rows (Complexity: 2)
const filterRows = (rows, query, excludedIndices) => {
  if (!query) return rows;
  return rows.filter(row => getRowText(row, excludedIndices).includes(query));
};

// Helper 3: No-Results Empty State Row (Complexity: 3)
const updateNoResultsRow = (tbody, totalMatching, query, headers) => {
  let noResultRow = tbody.querySelector('.no-search-results');
  const showEmptyState = totalMatching === 0 && query !== '';

  if (!showEmptyState) {
    if (noResultRow) noResultRow.style.display = 'none';
    return;
  }

  const message = `Tidak ada data yang sesuai dengan pencarian "<strong>${query}</strong>"`;
  if (!noResultRow) {
    const colCount = headers.length || 5;
    noResultRow = document.createElement('tr');
    noResultRow.className = 'no-search-results';
    noResultRow.innerHTML = `<td colspan="${colCount}" style="text-align: center; color: var(--neutral-600); padding: 32px 16px;">${message}</td>`;
    tbody.appendChild(noResultRow);
  } else {
    noResultRow.style.display = '';
    noResultRow.querySelector('td').innerHTML = message;
  }
};

// Helper 4: Page Button Generator (Complexity: 2)
const renderPageButtons = (container, totalPages) => {
  if (!container) return;
  container.innerHTML = '';

  for (let p = 1; p <= totalPages; p++) {
    const pageBtn = document.createElement('button');
    pageBtn.type = 'button';
    pageBtn.innerText = p;
    const activeClass = 'bg-[#316342] text-white shadow-xs';
    const inactiveClass = 'text-slate-600 hover:bg-slate-100 border border-slate-200';
    pageBtn.className = `w-7 h-7 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
      p === currentPage ? activeClass : inactiveClass
    }`;

    pageBtn.addEventListener('click', () => {
      currentPage = p;
      renderPagination();
    });
    container.appendChild(pageBtn);
  }
};

// Helper 5: Pagination Controls & Labels (Complexity: 4)
const updatePaginationUI = (totalMatching, totalPages, startIdx, endIdx) => {
  if (pagStart) pagStart.innerText = totalMatching === 0 ? 0 : startIdx + 1;
  if (pagEnd) pagEnd.innerText = endIdx;
  if (pagTotal) pagTotal.innerText = totalMatching;

  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  renderPageButtons(pagesContainer, totalPages);
};

// Main Function (Cognitive Complexity: 3)
const renderPagination = () => {
  const allRows = Array.from(tbody.querySelectorAll('tr:not(.no-search-results)'));
  const matchingRows = filterRows(allRows, currentQuery, excludedIndices);

  const totalMatching = matchingRows.length;
  const totalPages = Math.max(1, Math.ceil(totalMatching / pageSize));

  // Clamps currentPage safely in 1 line
  currentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalMatching);

  // Toggle visible rows
  allRows.forEach(r => { r.style.display = 'none'; });
  matchingRows.slice(startIdx, endIdx).forEach(r => { r.style.display = ''; });

  // Update auxiliary UI components
  updateNoResultsRow(tbody, totalMatching, currentQuery, headers);
  updatePaginationUI(totalMatching, totalPages, startIdx, endIdx);
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
  setTimeout(() => {
    renderPagination();
    initTableDragAndDrop(container);
  }, 0);
};

export const initTableSearch = initTablePagination;

/**
 * Enables interactive Drag & Drop row reordering for table rows.
 * @param {HTMLElement} container - Page container element
 * @param {Function} [onReorder] - Callback called with reordered row elements / IDs
 */
export const initTableDragAndDrop = (container, onReorder) => {
  const tbody = container.querySelector('#table-body-element');
  if (!tbody) return;

  let draggedRow = null;

  const rows = Array.from(tbody.querySelectorAll('tr:not(.no-search-results)'));
  rows.forEach(row => {
    row.draggable = true;
    row.style.cursor = 'grab';

    row.addEventListener('dragstart', (e) => {
      draggedRow = row;
      row.classList.add('opacity-40', 'bg-emerald-50/50');
      e.dataTransfer.effectAllowed = 'move';
    });

    row.addEventListener('dragend', () => {
      draggedRow = null;
      rows.forEach(r => {
        r.classList.remove('opacity-40', 'bg-emerald-50/50', 'border-t-2', 'border-emerald-600');
        r.style.cursor = 'grab';
      });
      if (onReorder) {
        const newOrder = Array.from(tbody.querySelectorAll('tr:not(.no-search-results)'));
        onReorder(newOrder);
      }
    });

    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedRow && row !== draggedRow) {
        const bounding = row.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;
        if (e.clientY - offset > 0) {
          row.after(draggedRow);
        } else {
          row.before(draggedRow);
        }
      }
    });
  });
};
