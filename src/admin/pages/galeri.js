import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { openAdminModal, openConfirmModal } from '../components/modal.js';
import { renderImageUploader, initImageUploaderEvents } from '../components/image-upload.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminGaleri = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let galeriList = mockData.galeri;

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('galeri').select('*').order('created_at', { ascending: false });
        if (data) galeriList = data;
      } catch (e) {
        console.warn('Fallback:', e);
      }
    }
  };

  await loadData();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  const renderPage = () => {
    container.innerHTML = `
      ${renderAdminSidebar('#/admin/galeri')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Kelola Galeri Foto & Video')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 class="font-display-lg text-2xl font-bold text-slate-800 m-0">Galeri Foto & Video</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola album dokumentasi & promosi visual desa wisata.</p>
            </div>
            <button class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2" id="upload-galeri-btn">
              <span class="material-symbols-outlined text-sm">add</span>
              Upload Media Baru
            </button>
          </div>

          <!-- Search & Filter Toolbar -->
          <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
            <input type="text" class="search-input w-full max-w-md px-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#316342] shadow-2xs" id="galeri-search" placeholder="Cari media galeri..." />
          </div>

          <!-- Grid Thumbnail View -->
          <div id="galeri-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
            ${galeriList.length === 0 ? `
              <p style="grid-column: 1/-1; text-align: center; color: var(--neutral-600); padding: 40px;">Belum ada media di galeri.</p>
            ` : galeriList.map(item => `
              <div class="card galeri-card-item" style="padding: 0; overflow: hidden; position: relative;">
                <img src="${item.url}" style="width: 100%; height: 160px; object-fit: cover;" />
                <div style="padding: 12px;">
                  <strong style="font-size: 0.95rem; display: block;">${item.judul || 'Foto'}</strong>
                  <span class="badge badge-primary" style="margin-top: 4px;">${item.kategori || 'Umum'}</span>
                </div>
                <div style="padding: 8px 12px; border-top: 1px solid var(--neutral-200); display: flex; justify-content: flex-end; gap: 8px;">
                  <button class="btn btn-sm btn-secondary action-edit-gal" data-id="${item.id}">Edit</button>
                  <button class="btn btn-sm btn-outline action-del-gal" data-id="${item.id}" style="color: var(--status-error); border-color: var(--status-error);">Hapus</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Pagination Footer -->
          <div class="data-table-pagination flex items-center justify-between px-6 py-4 mt-6 bg-white rounded-2xl border border-slate-200/80 flex-wrap gap-4 text-xs font-medium text-slate-500 shadow-2xs">
            <div>
              Menampilkan <span id="gal-start" class="font-bold text-slate-800">1</span> - <span id="gal-end" class="font-bold text-slate-800">7</span> dari <span id="gal-total" class="font-bold text-slate-800">${galeriList.length}</span> media
            </div>
            <div class="flex items-center gap-1.5">
              <button id="gal-prev-btn" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors cursor-pointer">Prev</button>
              <div id="gal-pages" class="flex items-center gap-1"></div>
              <button id="gal-next-btn" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      </main>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    initAdminSidebarEvents();

    const pageSize = 7;
    let currentPage = 1;
    let currentQuery = '';

    const renderGaleriPagination = () => {
      const items = Array.from(container.querySelectorAll('.galeri-card-item'));
      const matching = items.filter(card => {
        if (!currentQuery) return true;
        return card.textContent.toLowerCase().includes(currentQuery);
      });

      const totalMatching = matching.length;
      const totalPages = Math.max(1, Math.ceil(totalMatching / pageSize));

      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      const startIdx = (currentPage - 1) * pageSize;
      const endIdx = Math.min(startIdx + pageSize, totalMatching);

      items.forEach(c => c.style.display = 'none');
      matching.slice(startIdx, endIdx).forEach(c => c.style.display = '');

      const galStart = container.querySelector('#gal-start');
      const galEnd = container.querySelector('#gal-end');
      const galTotal = container.querySelector('#gal-total');
      const prevBtn = container.querySelector('#gal-prev-btn');
      const nextBtn = container.querySelector('#gal-next-btn');
      const pagesContainer = container.querySelector('#gal-pages');

      if (galStart) galStart.innerText = totalMatching === 0 ? 0 : startIdx + 1;
      if (galEnd) galEnd.innerText = endIdx;
      if (galTotal) galTotal.innerText = totalMatching;

      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

      if (pagesContainer) {
        pagesContainer.innerHTML = '';
        for (let p = 1; p <= totalPages; p++) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.innerText = p;
          btn.className = `w-7 h-7 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
            p === currentPage
              ? 'bg-[#316342] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`;
          btn.addEventListener('click', () => {
            currentPage = p;
            renderGaleriPagination();
          });
          pagesContainer.appendChild(btn);
        }
      }
    };

    const searchInput = container.querySelector('#galeri-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentQuery = e.target.value.trim().toLowerCase();
        currentPage = 1;
        renderGaleriPagination();
      });
    }

    container.querySelector('#gal-prev-btn')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderGaleriPagination();
      }
    });

    // Drag & Drop reordering for galeri card items
    // Drag & Drop reordering for galeri card items
    const grid = container.querySelector('#galeri-grid');

    if (grid) {
      let draggedCard = null;

      const resetCardStyles = () => {
        grid.querySelectorAll('.galeri-card-item').forEach(c => {
          c.classList.remove('opacity-40');
          c.style.cursor = 'grab';
        });
      };

      const handleDragStart = (e, card) => {
        draggedCard = card;
        card.classList.add('opacity-40');
        e.dataTransfer.effectAllowed = 'move';
      };

      const handleDragEnd = () => {
        draggedCard = null;
        resetCardStyles();
      };

      const handleDragOver = (e, card) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedCard && card !== draggedCard) {
          // Reorder logic here...
        }
      };

      grid.querySelectorAll('.galeri-card-item').forEach(card => {
        card.draggable = true;
        card.style.cursor = 'grab';

        card.addEventListener('dragstart', (e) => handleDragStart(e, card));
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dragover', (e) => handleDragOver(e, card));
      });
    }

    container.querySelector('#upload-galeri-btn')?.addEventListener('click', () => openUploadModal());

    container.querySelectorAll('.action-edit-gal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset('data-id');
        const item = galeriList.find(g => g.id === id);
        if (item) openUploadModal(item);
      });
    });

    container.querySelectorAll('.action-del-gal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset('data-id');
        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus media ini dari galeri?',
          onConfirm: async () => {
            if (isSupabaseConfigured() && supabase) {
              const { error } = await supabase.from('galeri').delete().eq('id', id);
              if (error) {
                showToast('Gagal menghapus media: ' + error.message, 'error');
                return;
              }
            }
            showToast('Media berhasil dihapus.', 'success');
            await loadData();
            renderPage();
          }
        });
      });
    });
  };

  const openUploadModal = (galeri = null) => {
    const isEdit = !!galeri;
    const bodyHtml = `
      <form id="galeri-form">
        <div class="form-group">
          <label class="form-label">Judul / Caption *</label>
          <input type="text" id="gal-judul" class="form-control" value="${galeri?.judul || ''}" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Kategori Galeri</label>
            <input type="text" id="gal-kategori" class="form-control" placeholder="Alam / Kuliner / Budaya" value="${galeri?.kategori || 'Alam'}" />
          </div>
          <div class="form-group">
            <label class="form-label">Tipe Media</label>
            <select id="gal-tipe" class="form-control">
              <option value="foto" ${galeri?.tipe === 'foto' ? 'selected' : ''}>Foto</option>
              <option value="video" ${galeri?.tipe === 'video' ? 'selected' : ''}>Video</option>
            </select>
          </div>
        </div>

        ${renderImageUploader('gal-url', galeri?.url || '')}
      </form>
    `;

    openAdminModal({
      title: isEdit ? 'Edit Caption Media' : 'Upload Media Galeri',
      bodyHtml,
      saveText: isEdit ? 'Perbarui' : 'Upload & Simpan',
      onSave: async () => {
        const payload = {
          judul: document.getElementById('gal-judul').value.trim(),
          kategori: document.getElementById('gal-kategori').value.trim(),
          tipe: document.getElementById('gal-tipe').value,
          url: document.getElementById('gal-url').value,
        };

        if (!payload.judul || !payload.url) {
          showToast('Judul dan URL media wajib diisi', 'error');
          return false;
        }

        if (isSupabaseConfigured() && supabase) {
          try {
            if (isEdit) {
              const { error } = await supabase.from('galeri').update(payload).eq('id', galeri.id);
              if (error) throw error;
            } else {
              const { error } = await supabase.from('galeri').insert([payload]).select();
              if (error) throw error;
            }
          } catch (err) {
            showToast('Gagal menyimpan media: ' + err.message, 'error');
            return false;
          }
        } else {
          if (isEdit) {
            Object.assign(galeri, payload);
          } else {
            galeriList.unshift({ id: 'gal-' + Date.now(), ...payload });
          }
        }

        showToast(isEdit ? 'Media diperbarui!' : 'Media ditambahkan ke galeri!', 'success');
        await loadData();
        renderPage();
        return true;
      }
    });

    setTimeout(() => initImageUploaderEvents('gal-url', 'galeri'), 100);
  };

  renderPage();
  return container;
};
