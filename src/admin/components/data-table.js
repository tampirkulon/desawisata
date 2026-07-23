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
