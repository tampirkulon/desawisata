/**
 * Reusable Pagination Component for Public Pages
 */

export const renderPagination = ({ totalItems, itemsPerPage, currentPage, labelItem = 'item' }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return '';

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array (with ellipsis if totalPages > 7)
  // Generate page numbers array (with ellipsis if totalPages > 7)
  let pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 4) {
    pages = [1, 2, 3, 4, 5, '...', totalPages];
  } else if (currentPage >= totalPages - 3) {
    pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }

  return `
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-t border-outline-variant/30 mt-12 w-full">
      <div class="text-xs text-on-surface-variant font-medium">
        Menampilkan <span class="font-bold text-primary">${start}-${end}</span> dari <span class="font-bold text-primary">${totalItems}</span> ${labelItem}
      </div>
      <div class="flex items-center gap-1.5 flex-wrap justify-center">
        <!-- Prev Button -->
        <button 
          type="button"
          class="pagination-btn px-3.5 py-2 rounded-xl text-xs font-bold border border-outline-variant/40 flex items-center gap-1 transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed pointer-events-none text-on-surface-variant bg-surface-container-low' : 'text-primary bg-white hover:bg-primary/10 cursor-pointer shadow-2xs'}" 
          data-page="${currentPage - 1}"
          ${currentPage === 1 ? 'disabled' : ''}>
          <span class="material-symbols-outlined text-sm">chevron_left</span>
          <span class="hidden sm:inline">Sebelumnya</span>
        </button>

        <!-- Page Numbers -->
        ${pages.map(p => {
          if (p === '...') {
            return `<span class="w-8 text-center text-xs text-on-surface-variant font-bold select-none">...</span>`;
          }
          const isCurrent = p === currentPage;
          return `
            <button 
              type="button"
              class="pagination-btn w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${isCurrent ? 'bg-primary text-white shadow-sm' : 'bg-white text-primary border border-outline-variant/40 hover:bg-primary/10'}" 
              data-page="${p}">
              ${p}
            </button>
          `;
        }).join('')}

        <!-- Next Button -->
        <button 
          type="button"
          class="pagination-btn px-3.5 py-2 rounded-xl text-xs font-bold border border-outline-variant/40 flex items-center gap-1 transition-all ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed pointer-events-none text-on-surface-variant bg-surface-container-low' : 'text-primary bg-white hover:bg-primary/10 cursor-pointer shadow-2xs'}" 
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
