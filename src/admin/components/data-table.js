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
    </div>
  `;
};

/**
 * Attaches real-time client-side search filtering to the data table.
 * @param {HTMLElement} container - Page container element
 * @param {object} [options]
 * @param {string} [options.searchInputId='table-search']
 * @param {string} [options.tableBodyId='table-body-element']
 */
export const initTableSearch = (container, options = {}) => {
  const {
    searchInputId = 'table-search',
    tableBodyId = 'table-body-element',
  } = options;

  const searchInput = container.querySelector(`#${searchInputId}`);
  const tbody = container.querySelector(`#${tableBodyId}`);

  if (!searchInput || !tbody) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const rows = Array.from(tbody.querySelectorAll('tr:not(.no-search-results)'));

    // Find table header titles to exclude "Status" and "Aksi" columns
    const table = tbody.closest('table');
    const headers = table ? Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim().toLowerCase()) : [];

    const excludedIndices = new Set();
    headers.forEach((h, idx) => {
      if (h === 'status' || h === 'aksi' || h === 'action' || h === 'durasi' || h.includes('durasi')) {
        excludedIndices.add(idx);
      }
    });

    let visibleCount = 0;

    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      const searchableCells = cells.filter((_, idx) => !excludedIndices.has(idx));

      const text = (searchableCells.length > 0 ? searchableCells.map(c => c.textContent).join(' ') : row.textContent).toLowerCase();
      const match = text.includes(query);
      row.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    // Handle no matching rows indicator
    let noResultRow = tbody.querySelector('.no-search-results');
    if (visibleCount === 0 && query !== '') {
      if (!noResultRow) {
        const colCount = container.querySelectorAll('#data-table-element th').length || 5;
        noResultRow = document.createElement('tr');
        noResultRow.className = 'no-search-results';
        noResultRow.innerHTML = `
          <td colspan="${colCount}" style="text-align: center; color: var(--neutral-600); padding: 32px 16px;">
            Tidak ada data yang sesuai dengan pencarian "<strong>${e.target.value}</strong>"
          </td>
        `;
        tbody.appendChild(noResultRow);
      } else {
        noResultRow.style.display = '';
        noResultRow.querySelector('td').innerHTML = `Tidak ada data yang sesuai dengan pencarian "<strong>${e.target.value}</strong>"`;
      }
    } else if (noResultRow) {
      noResultRow.style.display = 'none';
    }
  });
};
